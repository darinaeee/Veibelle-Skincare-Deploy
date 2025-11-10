// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#ffffff] text-[#000000] py-4 shadow-inner rounded-t-xl">
      <div className="container mx-auto text-center">
        <h2 className="text-xl font-[March] text-[#000000] tracking-widest">
          VeiBelle
        </h2>
        <p className="text-[#555] text-sm font-[Poppins] mt-1">
          Your Glow Up Starts Here 
        </p>
        <p className="text-gray-400 text-xs font-[Poppins] mt-2">
          © 2025 VeiBelle. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
