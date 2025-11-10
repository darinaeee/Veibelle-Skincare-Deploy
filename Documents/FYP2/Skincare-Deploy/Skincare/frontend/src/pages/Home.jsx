import React from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/quiz-hero.png"; // your hero image
import { FaLeaf, FaStar, FaSmile } from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen">
      {/* Left Image */}
      <div className="hidden md:block md:w-1/2 h-screen">
        <img
          src={heroImage}
          alt="Hero"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Content */}
      <div className="flex flex-col justify-center md:w-1/2 p-8 bg-gradient-to-b from-pink-50 to-white">
        <h1 className="font-prata text-4xl md:text-5xl mb-4 text-pink-700">
          Glow with Confidence – Backed by Smart Recommendations
        </h1>
        <p className="font-arimo text-base md:text-lg mb-6 text-gray-700">
          Just take this quick and easy quiz to find the products that will work magic on your skin.
        </p>
        <button
          onClick={() => navigate("/quiz")}
          className="bg-[#352812] text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-all"
        >
          START THE QUIZ
        </button>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-lg hover:shadow-2xl transition">
            <FaLeaf className="text-green-500 text-3xl mb-2" />
            <h3 className="font-semibold">Natural Ingredients</h3>
            <p className="text-gray-500 text-sm mt-1">Curated products safe for all skin types.</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-lg hover:shadow-2xl transition">
            <FaStar className="text-yellow-400 text-3xl mb-2" />
            <h3 className="font-semibold">Top Rated</h3>
            <p className="text-gray-500 text-sm mt-1">Products recommended by skincare experts.</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-lg hover:shadow-2xl transition">
            <FaSmile className="text-pink-400 text-3xl mb-2" />
            <h3 className="font-semibold">Personalized</h3>
            <p className="text-gray-500 text-sm mt-1">Your skin type, your perfect match.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
