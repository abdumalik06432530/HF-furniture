import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox';

const locations = [
  {
    title: 'Hamad Furniture Factory',
    address: 'Bole Sub City, Zone 5, Addis Ababa, Ethiopia',
    phone: '(+251) 11 123 4567',
    email: 'factory@hamad.com',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.523188349578!2d38.79412141469094!3d9.01320219351355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x16470b46d6ca7781%3A0xba0aec0d0bdec930!2sAbubaker%20Furnitures!5e1!3m2!1sam!2set!4v1698259200000!5m2!1sam!2set',
    mapLink: 'https://www.google.com/maps/place/Abubaker+Furnitures/@11.1170218,39.6322329,21z/data=!4m6!3m5!1s0x16470b46d6ca7781:0xba0aec0d0bdec930!8m2!3d11.1170214!4d39.6323999!16s%2Fg%2F11s69v88wl?hl=am&entry=ttu&g_ep=EgoyMDI1MDUyOC4wIKXMDSoASAFQAw%3D%3D',
  },
  {
    title: 'Hamad Shop 1',
    address: 'Friendship Building, Ground Floor, Addis Ababa, Ethiopia',
    phone: '(+251) 11 234 5678',
    email: 'shop1@hamad.com',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.523188349578!2d38.79412141469094!3d9.01320219351355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x16470b46d6ca7781%3A0xba0aec0d0bdec930!2sAbubaker%20Furnitures!5e1!3m2!1sam!2set!4v1698259200000!5m2!1sam!2set',
    mapLink: 'https://www.google.com/maps/place/Abubaker+Furnitures/@11.1170218,39.6322329,21z/data=!4m6!3m5!1s0x16470b46d6ca7781:0xba0aec0d0bdec930!8m2!3d11.1170214!4d39.6323999!16s%2Fg%2F11s69v88wl?hl=am&entry=ttu&g_ep=EgoyMDI1MDUyOC4wIKXMDSoASAFQAw%3D%3D',
  },
  {
    title: 'Hamad Shop 2',
    address: 'Edna Mall, 2nd Floor, Addis Ababa, Ethiopia',
    phone: '(+251) 11 345 6789',
    email: 'shop2@hamad.com',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.523188349578!2d38.79412141469094!3d9.01320219351355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x16470b46d6ca7781%3A0xba0aec0d0bdec930!2sAbubaker%20Furnitures!5e1!3m2!1sam!2set!4v1698259200000!5m2!1sam!2set',
    mapLink: 'https://www.google.com/maps/place/Abubaker+Furnitures/@11.1170218,39.6322329,21z/data=!4m6!3m5!1s0x16470b46d6ca7781:0xba0aec0d0bdec930!8m2!3d11.1170214!4d39.6323999!16s%2Fg%2F11s69v88wl?hl=am&entry=ttu&g_ep=EgoyMDI1MDUyOC4wIKXMDSoASAFQAw%3D%3D',
  },
];

const Contact = () => {
  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-28 py-16  from-indigo-50 via-white to-purple-50 min-h-screen">
      <div className="text-center pt-10 border-t border-gray-200">
        <Title text1="CONTACT" text2="US" />
      </div>

      <div className="my-12 flex flex-col md:flex-row items-center gap-8 sm:gap-10 animate-fade-in">
        <img
          className="w-full max-w-[400px] sm:max-w-[450px] md:max-w-[500px] rounded-xl shadow-lg object-cover"
          src={assets.contact_img}
          alt="Contact"
        />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-bold text-2xl text-gray-800">Get in Touch</p>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            We'd love to hear from you. Whether you're looking to visit our factory or shop at one of our retail locations,
            find the details below.
          </p>
          <button className="border-2 border-indigo-600 px-8 py-3 text-sm font-semibold text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg">
            Explore Careers
          </button>
        </div>
      </div>

      <div className="space-y-12">
        {locations.map((loc, index) => (
          <div key={index} className="pt-10 border-t border-gray-200 animate-slide-in">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">{loc.title}</h3>
              <p className="text-gray-600 mb-1 text-sm sm:text-base">{loc.address}</p>
              <p className="text-gray-600 mb-1 text-sm sm:text-base">Tel: {loc.phone}</p>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">Email: {loc.email}</p>
              <iframe
                src={loc.mapSrc}
                className="w-full h-64 sm:h-80 md:h-96 rounded-lg shadow-md border border-gray-200"
                allowFullScreen=""
                loading="lazy"
                title={loc.title}
              ></iframe>
              <a
                href={loc.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-sm font-medium text-white bg-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <NewsletterBox />
      </div>
    </div>
  );
};

// Custom Tailwind animations
const styles = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slide-in {
    from { opacity: 0; transform: translateX(-15px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .animate-fade-in {
    animation: fade-in 0.6s ease-out;
  }

  .animate-slide-in {
    animation: slide-in 0.6s ease-out;
  }
`;

export default Contact;