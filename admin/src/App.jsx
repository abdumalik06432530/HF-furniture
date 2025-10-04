import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Dashboard from "./pages/dashboard";
import Orders from "./pages/Orders";
import AdminProfile from "./pages/AdminProfile";
import Users from "./pages/Users";
import Login from "./components/Login";
import AdminRegister from "./components/AdminRegister";
// import SuperAdminDashboard from "./pages/superAdmin/superadmin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );

  // Removed getRoleFromToken as superadmin logic is no longer needed

  useEffect(() => {
    localStorage.setItem("token", token);
    console.log("Token set to: ", token);
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {token === "" ? (
        <Routes>
          <Route path="/register" element={<AdminRegister setToken={setToken} />} />
          <Route path="/*" element={<Login setToken={setToken} />} />
        </Routes>
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
                <Route path="/profile" element={<AdminProfile token={token} />} />
                <Route
                  path="/dashboard"
                  element={<Dashboard token={token} />}
                />
                <Route path="/users" element={<Users token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
