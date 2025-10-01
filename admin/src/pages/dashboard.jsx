import { useEffect, useState, useMemo, useCallback } from "react";
import PropTypes from 'prop-types';
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../config";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const Dashboard = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [range, setRange] = useState('monthly'); // daily | weekly | monthly | yearly

  // Simple inline SVG Line Chart
  const SimpleLineChart = ({ data = [], height = 300 }) => {
    if (!data || data.length === 0) return <p className="text-gray-500 text-center">No data for chart</p>;
    const padding = 30;
    const w = 800; // Base width for viewBox
    const h = height;
    const maxOrders = Math.max(...data.map(d => d.orders || 0), 1);

    const x = (i) => padding + (i * (w - padding * 2)) / (data.length - 1 || 1);
    const yForOrders = (val) => h - padding - (val / maxOrders) * (h - padding * 2);
    const pathOrders = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${yForOrders(d.orders)}`).join(' ');

    return (
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" className="w-full h-auto">
        <rect x="0" y="0" width="100%" height="100%" fill="transparent" />
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, idx) => (
          <line key={idx} x1={padding} x2={w - padding} y1={padding + t * (h - padding * 2)} y2={padding + t * (h - padding * 2)} stroke="#eee" />
        ))}
        {/* Orders path */}
        <path d={pathOrders} fill="none" stroke="#6b46c1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {/* Points */}
        {data.map((d, i) => (
          <circle key={i} cx={x(i)} cy={yForOrders(d.orders)} r={4} fill="#6b46c1" />
        ))}
        {/* X labels */}
        {data.map((d, i) => (
          <text key={i} x={x(i)} y={h - padding + 14} fontSize={data.length > 10 ? "8" : "10"} textAnchor="middle" fill="#666">{d.date}</text>
        ))}
      </svg>
    );
  };

  // Simple inline SVG Bar Chart
  const SimpleBarChart = ({ data = [], height = 300 }) => {
    if (!data || data.length === 0) return <p className="text-gray-500 text-center">No data for chart</p>;
    const padding = 20;
    const w = 800;
    const h = height;
    const max = Math.max(...data.map(d => d.qty || 0), 1);
    const barWidth = (w - padding * 2) / data.length;
    return (
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" className="w-full h-auto">
        {data.map((d, i) => {
          const barH = ((d.qty || 0) / max) * (h - padding * 2);
          const x = padding + i * barWidth + 4;
          const y = h - padding - barH;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barWidth - 8} height={barH} fill="#6b46c1" rx="3" />
              <text x={x + (barWidth - 8) / 2} y={h - padding + 12} fontSize={data.length > 8 ? "8" : "10"} textAnchor="middle" fill="#444">{d.name?.slice(0, 10)}</text>
            </g>
          );
        })}
      </svg>
    );
  };

  const fetchStats = useCallback(async () => {
    try {
      const productRes = await axios.get(`${backendUrl}/api/product/list`);
      const orderRes = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (productRes.data.success && orderRes.data.success) {
        setProducts(productRes.data.products || []);
        setOrders(orderRes.data.orders || []);
      } else {
        toast.error("Failed to fetch dashboard data");
      }
    } catch (error) {
      toast.error("Error loading dashboard data");
      console.error(error);
    }
  }, [token]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const completedOrders = orders.filter((o) => o.status === "Delivered").length;
  const pendingOrders = orders.filter((o) => o.status !== "Delivered").length;

  const chartData = useMemo(() => {
    const map = new Map();
    const getKey = (date) => {
      const d = new Date(date);
      if (range === 'daily') return d.toLocaleDateString();
      if (range === 'weekly') {
        const start = new Date(d);
        start.setDate(d.getDate() - d.getDay());
        return start.toLocaleDateString();
      }
      if (range === 'monthly') return `${d.getMonth() + 1}/${d.getFullYear()}`;
      return `${d.getFullYear()}`;
    };

    orders.forEach((o) => {
      const key = getKey(o.date);
      const entry = map.get(key) || { date: key, orders: 0, revenue: 0 };
      entry.orders += 1;
      entry.revenue += Number(o.totalAmount ?? o.total ?? 0);
      map.set(key, entry);
    });

    return Array.from(map.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [orders, range]);

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const productSheet = XLSX.utils.json_to_sheet(products);
    const orderSheet = XLSX.utils.json_to_sheet(orders);
    XLSX.utils.book_append_sheet(wb, productSheet, 'Products');
    XLSX.utils.book_append_sheet(wb, orderSheet, 'Orders');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `hf-dashboard-export-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-gray-50 to-purple-50 p-4 sm:p-6 md:p-8 lg:p-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center gap-2 sm:gap-3 mb-4 sm:mb-0">
          <span className="text-indigo-600 transform hover:scale-110 transition-transform duration-300">📊</span>
          Admin Dashboard
        </h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="px-3 py-2 border rounded w-full sm:w-auto text-sm sm:text-base"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-indigo-600 text-white rounded text-sm sm:text-base w-full sm:w-auto"
          >
            Refresh
          </button>
          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-green-600 text-white rounded text-sm sm:text-base w-full sm:w-auto"
          >
            Export Excel
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white border-l-4 border-blue-500 p-4 sm:p-6 rounded-xl shadow-lg">
          <p className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
            <span className="text-blue-500">🛍️</span> Total Products
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-blue-700 mt-2">{products.length}</h3>
        </div>
        <div className="bg-white border-l-4 border-purple-500 p-4 sm:p-6 rounded-xl shadow-lg">
          <p className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
            <span className="text-purple-500">🧾</span> Total Orders
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-purple-700 mt-2">{orders.length}</h3>
        </div>
        <div className="bg-white border-l-4 border-yellow-500 p-4 sm:p-6 rounded-xl shadow-lg">
          <p className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
            <span className="text-yellow-500">⏳</span> Pending Orders
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-yellow-700 mt-2">{pendingOrders}</h3>
        </div>
        <div className="bg-white border-l-4 border-indigo-500 p-4 sm:p-6 rounded-xl shadow-lg">
          <p className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
            <span className="text-indigo-500">✅</span> Delivered Orders
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-indigo-700 mt-2">{completedOrders}</h3>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Orders ({range})</h2>
          {chartData.length === 0 ? (
            <p className="text-gray-500 text-center">No orders to display</p>
          ) : (
            <div className="overflow-x-auto">
              <SimpleLineChart data={chartData} height={250} />
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Product Stock</h2>
          <div className="overflow-x-auto">
            <SimpleBarChart
              data={products.slice(0, 10).map(p => ({ name: p.name, qty: p.quantity ?? 0 }))}
              height={250}
            />
          </div>
        </div>
      </div>

      {/* Recent Orders & Product Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Recent Orders</h2>
          {orders.slice(0, 8).map((order, index) => (
            <div
              key={index}
              className="border-b py-2 sm:py-3 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 rounded-lg px-2 sm:px-3 transition-all duration-200"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium truncate max-w-[150px] sm:max-w-[200px]">
                  {order.address?.firstName} {order.address?.lastName}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    order.status === "Delivered" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(order.date).toLocaleDateString()} | {order.address?.city}
              </p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Product Overview</h2>
          {products.slice(0, 8).map((product, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 sm:py-3 border-b text-xs sm:text-sm text-gray-700 hover:bg-gray-50 rounded-lg px-2 sm:px-3 transition-all duration-200"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <img
                  src={product.image && product.image[0] ? product.image[0] : "https://via.placeholder.com/40?text=No+Image"}
                  className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg border border-gray-200"
                  alt={product.name}
                />
                <div>
                  <p className="font-medium truncate max-w-[150px] sm:max-w-[200px]">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.category}</p>
                </div>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  product.quantity < 5 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                }`}
              >
                {product.quantity ?? "Out of Stock"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

Dashboard.propTypes = {
  token: PropTypes.string,
};