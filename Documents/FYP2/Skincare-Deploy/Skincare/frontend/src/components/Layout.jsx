// src/components/Layout.jsx
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* add padding top so content not hidden behind fixed header */}
      <main className="flex-grow container mx-auto px-6 py-10 pt-24 bg-[#f1eaea]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
