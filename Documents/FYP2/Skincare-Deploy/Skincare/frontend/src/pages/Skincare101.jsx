// src/pages/Skincare101.jsx
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fontsource/lato";

const Skincare101 = () => {
  const [activeSection, setActiveSection] = useState("essentials");

  return (
    <div className="pt-15 pb-16 font-['Roboto_Slab'] text-gray-800">
      <h1 className="text-4xl font-bold text-center text-pink-600 mb-8">
        {activeSection === "essentials"
          ? "Let’s Talk Skin: The Essentials"
          : activeSection === "personality"
          ? "What’s Your Skin Personality?"
          : "Myth or Magic? Let’s Find Out!"}
      </h1>

      {/* Section Switch Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveSection("essentials")}
          className={`px-4 py-2 rounded-lg ${
            activeSection === "essentials"
              ? "bg-pink-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Essentials
        </button>
        <button
          onClick={() => setActiveSection("personality")}
          className={`px-4 py-2 rounded-lg ${
            activeSection === "personality"
              ? "bg-pink-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Skin Types
        </button>
        <button
          onClick={() => setActiveSection("myths")}
          className={`px-4 py-2 rounded-lg ${
            activeSection === "myths"
              ? "bg-pink-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Myths
        </button>
      </div>

      {/* Section 1: Let’s Talk Skin */}
      {activeSection === "essentials" && (
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Cleanser 🧼",
              desc: "Removes dirt, makeup, and impurities from your skin.",
              benefit:
                "Helps prevent clogged pores and breakouts, leaving your skin fresh.",
            },
            {
              title: "Moisturizer 💧",
              desc: "Locks in hydration and strengthens your skin barrier.",
              benefit:
                "Prevents dryness, dullness, and premature aging by keeping skin supple.",
            },
            {
              title: "Treatment / Serum 🧪",
              desc: "Concentrated formulas that target specific skin concerns.",
              benefit:
                "Addresses issues like acne, pigmentation, fine lines, or uneven texture.",
            },
            {
              title: "Face Mask 🎭",
              desc: "Boosts your skin’s glow with active ingredients.",
              benefit:
                "Detoxifies, hydrates, and refreshes your skin for instant radiance.",
            },
            {
              title: "Sun Protection ☀️",
              desc: "Shields your skin from harmful UV rays.",
              benefit:
                "Prevents sunburn, aging, and reduces risk of skin cancer.",
            },
            {
              title: "Eye Cream 👁️",
              desc: "Formulated for the delicate under-eye area.",
              benefit:
                "Reduces puffiness, dark circles, and fine lines.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-semibold text-pink-600 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-700 mb-2">{item.desc}</p>
              <p className="text-sm text-gray-500 italic">
                💡 {item.benefit}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Section 2: Skin Personality */}
      {activeSection === "personality" && (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              type: "Normal Skin 😊",
              desc: "Well-balanced, soft, and even-toned.",
              benefit:
                "Low maintenance — just keep it clean, hydrated, and protected.",
            },
            {
              type: "Dry Skin 🧴",
              desc: "Feels tight, flaky, or rough with visible fine lines.",
              benefit:
                "Use creamy cleansers, hydrating serums, and thick moisturizers.",
            },
            {
              type: "Oily Skin 💦",
              desc: "Shiny and prone to breakouts with larger pores.",
              benefit:
                "Gel cleansers and oil-free products help control sebum and prevent acne.",
            },
            {
              type: "Combination Skin 🌤️",
              desc: "Oily T-zone but dry cheeks.",
              benefit:
                "Balance with gentle exfoliation and lightweight hydration.",
            },
            {
              type: "Sensitive Skin 🌸",
              desc: "Easily irritated by products or weather.",
              benefit:
                "Stick to fragrance-free, calming ingredients like aloe and ceramides.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-semibold text-pink-600 mb-2">
                {item.type}
              </h3>
              <p className="text-gray-700 mb-2">{item.desc}</p>
              <p className="text-sm text-gray-500 italic">
                💡 {item.benefit}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Section 3: Myths (Bootstrap Accordion) */}
      {activeSection === "myths" && (
        <div className="max-w-4xl mx-auto">
          <div className="accordion" id="mythAccordion">
            {[
              {
                title: "Myth #1 – Natural Ingredients Are Always Better",
                content:
                  "Natural doesn’t always mean safe. Some natural ingredients can cause irritation or allergic reactions. Focus on proven ingredients, whether natural or synthetic.",
              },
              {
                title: "Myth #2 – Sunscreen Is Only Needed on Sunny Days",
                content:
                  "UV rays penetrate clouds, so sunscreen is essential every day to prevent damage and premature aging.",
              },
              {
                title: "Myth #3 – Oily Skin Doesn’t Need Moisturizer",
                content:
                  "Skipping moisturizer can make your skin produce more oil. Use lightweight, non-comedogenic formulas.",
              },
              {
                title: "Myth #4 – You Can Shrink Pores Permanently",
                content:
                  "Pore size is genetic. You can minimize their appearance but not permanently shrink them.",
              },
              {
                title: "Myth #5 – Skincare Is Only for Women",
                content:
                  "Healthy skin is for everyone — men’s skin also benefits from care and protection.",
              },
            ].map((myth, i) => (
              <div className="accordion-item mb-3" key={i}>
                <h2 className="accordion-header" id={`heading${i}`}>
                  <button
                    className="accordion-button collapsed text-pink-600 font-semibold"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${i}`}
                    aria-expanded="false"
                    aria-controls={`collapse${i}`}
                  >
                    {myth.title}
                  </button>
                </h2>
                <div
                  id={`collapse${i}`}
                  className="accordion-collapse collapse"
                  aria-labelledby={`heading${i}`}
                  data-bs-parent="#mythAccordion"
                >
                  <div className="accordion-body text-gray-700">
                    {myth.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Skincare101;
