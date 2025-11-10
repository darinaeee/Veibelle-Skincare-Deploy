// src/components/Header.jsx
import { Link, NavLink, useLocation } from "react-router-dom";
import userIcon from "../assets/user.png";
import { useEffect, useState } from "react";

const Header = () => {
  const location = useLocation();
  const [progress, setProgress] = useState(0);

  // Show progress bar only on /quiz page
  useEffect(() => {
    if (location.pathname === "/quiz") {
      // Read from local storage or set manually
      const savedStep = parseInt(localStorage.getItem("quizStep") || "1", 10);
      setProgress(Math.round((savedStep / 6) * 100));
    } else {
      setProgress(0);
    }
  }, [location.pathname]);

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-[#e9d4d4] text-black shadow-md z-50 rounded-b-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Left Navigation */}
          <nav className="flex gap-6 font-[Poppins] text-[18px]">
            <NavLink
              to="/ingredients"
              className={({ isActive }) =>
                `no-underline ${
                  isActive
                    ? "text-black pb-1 border-b-2 border-black transition-all"
                    : "text-black hover:text-gray-800 pb-1 transition-all"
                }`
              }
            >
              Ingredients
            </NavLink>

            <NavLink
              to="/skincare101"
              className={({ isActive }) =>
                `no-underline ${
                  isActive
                    ? "text-black pb-1 border-b-2 border-black transition-all"
                    : "text-black hover:text-gray-800 pb-1 transition-all"
                }`
              }
            >
              Skincare 101
            </NavLink>
          </nav>

          {/* Center Brand */}
          <Link
            to="/"
            className="font-[March] text-[40px] font-bold text-black tracking-wide no-underline hover:text-gray-900 transition-all"
          >
            VeiBelle
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <Link
              to="/quiz"
              className="bg-black text-white px-4 py-2 rounded-lg font-[Poppins] hover:bg-[#333] transition-all no-underline"
            >
              Take the Quiz
            </Link>

            <Link to="/dashboard" className="no-underline">
              <img
                src={userIcon}
                alt="Dashboard"
                className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
              />
            </Link>
          </div>
        </div>
      </header>

      {/* ✅ Fixed progress bar under header */}
      {location.pathname === "/quiz" && (
        <div className="fixed top-[90px] left-0 w-full bg-gray-200 h-2 z-40">
          <div
            className="bg-black h-2 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </>
  );
};

export default Header;
