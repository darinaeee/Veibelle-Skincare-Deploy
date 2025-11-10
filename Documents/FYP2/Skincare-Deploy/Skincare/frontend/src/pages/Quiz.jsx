// src/pages/Quiz.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const QUIZ_OPTIONS = {
  skinTypes: [
    { label: "Normal Skin", desc: "Lucky you! Your skin is generally in good shape, with only a few minor issues every now and then. You’d like to start a routine — because prevention is the best medicine." },
    { label: "Dry Skin", desc: "Your skin feels dull and seems to have an unquenchable thirst for hydration. Flaky patches and tightness have you reaching for every cream you can find." },
    { label: "Oily Skin", desc: "Your skin has a constant shine and tends to feel greasy throughout the day. Enlarged pores and frequent breakouts are your main challenges." },
    { label: "Combination Skin", desc: "Your T-zone (forehead, nose, and chin) can get oily while your cheeks may feel dry or normal. You experience both shine and dryness depending on the area." },
    { label: "Sensitive Skin", desc: "Your skin reacts easily to new products, fragrance, or weather changes. Redness, irritation, and burning sensations are common triggers you want to avoid." },
  ],
  concerns: [
    "Acne / Blackheads",
    "Wrinkles / Fine Lines",
    "Dryness / Dehydration",
    "Uneven Texture / Enlarged Pores",
    "Redness / Irritation",
    "Pigmentation / Dark Spots",
    "Impaired Skin Barrier",
    "Loss of Elasticity",
    "Dullness / Lack of Radiance",
    "Dark Circles / Eye Bags",
    "UV Protection",
    "Pregnancy-Safe",
  ],
  productTypes: ["Moisturizer", "Cleanser", "Treatment / Serum", "Face Mask", "Eye Cream", "Sun Protection"],
  allergens: ["Fragrance", "Alcohol", "Parabens", "Sulfates", "Essential Oils", "Silicones"],
  eyeConcerns: ["Dark Circles", "Fine Lines / Wrinkles", "Puffiness", "No Eye Concern"],
  pregnancy: ["Yes", "No"],
};

const INITIAL_QUIZ_STATE = {
  skinType: "",
  concerns: [],
  productType: "",
  allergens: [],
  eyeConcerns: [],
  pregnancy: "",
};

export default function Quiz() {
  const [step, setStep] = useState(1);
  const [quiz, setQuiz] = useState(INITIAL_QUIZ_STATE);
  const [customAllergen, setCustomAllergen] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setQuiz((prev) => {
      const currentArray = prev[name];
      return {
        ...prev,
        [name]: checked
          ? [...currentArray, value]
          : currentArray.filter((v) => v !== value),
      };
    });
  };

  const handleAddCustomAllergen = () => {
    const newAllergen = customAllergen.trim();
    if (newAllergen && !quiz.allergens.includes(newAllergen)) {
      setQuiz((prev) => ({
        ...prev,
        allergens: [...prev.allergens, newAllergen],
      }));
    }
    setCustomAllergen("");
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      localStorage.setItem("quizData", JSON.stringify(quiz));
      await new Promise((resolve) => setTimeout(resolve, 500));
      navigate("/dashboard");
    } catch {
      setError("Failed to save your quiz. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      // Step 1 — Skin Type
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold border-b pb-2">1. Your Skin Type</h3>
            <p className="text-gray-600">Select your skin type to personalize your results.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {QUIZ_OPTIONS.skinTypes.map(({ label, desc }) => (
                <button
                  key={label}
                  onClick={() => setQuiz((p) => ({ ...p, skinType: label }))}
                  className={`p-4 rounded border text-left transition ${quiz.skinType === label ? "bg-black text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                >
                  <span className="block font-semibold">{label}</span>
                  <p className="text-sm text-gray-500 mt-1">{desc}</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!quiz.skinType}
              className="w-full mt-6 bg-black text-white py-3 rounded font-bold hover:bg-gray-800 disabled:opacity-50"
            >
              Next: Concerns →
            </button>
          </div>
        );

      // Step 2 — Concerns
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold border-b pb-2">2. Main Skin Concerns</h3>
            <p className="text-gray-600">Which issues are you looking to address?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {QUIZ_OPTIONS.concerns.map((concern) => (
                <label key={concern} className="flex items-center space-x-2 bg-white p-3 rounded border hover:border-black cursor-pointer">
                  <input
                    type="checkbox"
                    name="concerns"
                    value={concern}
                    checked={quiz.concerns.includes(concern)}
                    onChange={handleCheckboxChange}
                    className="text-black border-gray-300 rounded focus:ring-black"
                  />
                  <span className="text-sm font-medium text-gray-700">{concern}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(1)} className="text-gray-600 hover:text-black font-medium">← Back</button>
              <button
                onClick={() => setStep(3)}
                disabled={quiz.concerns.length === 0}
                className="bg-black text-white py-3 px-6 rounded font-bold hover:bg-gray-800 disabled:opacity-50"
              >
                Next: Product Type →
              </button>
            </div>
          </div>
        );

      // Step 3 — Product Type
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold border-b pb-2">3. Product Type</h3>
            <p className="text-gray-600">Select the category of product you’re looking for.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {QUIZ_OPTIONS.productTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setQuiz((p) => ({ ...p, productType: type }))}
                  className={`py-3 px-4 rounded border font-medium transition ${quiz.productType === type ? "bg-black text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(2)} className="text-gray-600 hover:text-black font-medium">← Back</button>
              <button onClick={() => setStep(4)} disabled={!quiz.productType} className="bg-black text-white py-3 px-6 rounded font-bold hover:bg-gray-800 disabled:opacity-50">
                Next: Allergens →
              </button>
            </div>
          </div>
        );

      // Step 4 — Allergens
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold border-b pb-2">4. Allergies or Ingredients to Avoid</h3>
            <p className="text-gray-600">We’ll exclude products containing these ingredients.</p>
            <div className="grid grid-cols-2 gap-3">
              {QUIZ_OPTIONS.allergens.map((allergen) => (
                <label key={allergen} className="flex items-center space-x-2 bg-white p-3 rounded border hover:border-black cursor-pointer">
                  <input
                    type="checkbox"
                    name="allergens"
                    value={allergen}
                    checked={quiz.allergens.includes(allergen)}
                    onChange={handleCheckboxChange}
                    className="text-black border-gray-300 rounded focus:ring-black"
                  />
                  <span className="text-sm font-medium text-gray-700">{allergen}</span>
                </label>
              ))}
            </div>

            {/* Custom Allergen Input */}
            <div className="mt-4">
              <label className="block font-semibold text-gray-700 mb-2">Add your own allergen or ingredient:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customAllergen}
                  onChange={(e) => setCustomAllergen(e.target.value)}
                  placeholder="e.g., coconut oil, lanolin, retinol..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black"
                />
                <button onClick={handleAddCustomAllergen} className="bg-black text-white px-4 py-2 rounded font-bold hover:bg-gray-800">
                  Add
                </button>
              </div>
              {quiz.allergens.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {quiz.allergens.map((a) => (
                    <span key={a} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">{a}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(3)} className="text-gray-600 hover:text-black font-medium">← Back</button>
              <button onClick={() => setStep(5)} className="bg-black text-white py-3 px-6 rounded font-bold hover:bg-gray-800">
                Next: Eye Area →
              </button>
            </div>
          </div>
        );

      // Step 5 — Eye Concerns
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold border-b pb-2">5. Eye Area Concerns</h3>
            <p className="text-gray-600">Select any that apply.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {QUIZ_OPTIONS.eyeConcerns.map((opt) => (
                <label key={opt} className="flex items-center space-x-2 bg-white p-3 rounded border hover:border-black cursor-pointer">
                  <input
                    type="checkbox"
                    name="eyeConcerns"
                    value={opt}
                    checked={quiz.eyeConcerns.includes(opt)}
                    onChange={handleCheckboxChange}
                    className="text-black border-gray-300 rounded focus:ring-black"
                  />
                  <span className="text-sm font-medium text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(4)} className="text-gray-600 hover:text-black font-medium">← Back</button>
              <button onClick={() => setStep(6)} className="bg-black text-white py-3 px-6 rounded font-bold hover:bg-gray-800">
                Next: Pregnancy →
              </button>
            </div>
          </div>
        );

      // Step 6 — Pregnancy
      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold border-b pb-2">6. Pregnancy & Nursing</h3>
            <p className="text-gray-600">Are you pregnant, breastfeeding, or trying to conceive?</p>
            <div className="grid grid-cols-2 gap-4">
              {QUIZ_OPTIONS.pregnancy.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setQuiz((p) => ({ ...p, pregnancy: opt }))}
                  className={`p-3 rounded border font-medium transition ${quiz.pregnancy === opt ? "bg-black text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(5)} className="text-gray-600 hover:text-black font-medium">← Back</button>
              <button onClick={handleSave} disabled={isSaving} className="bg-black text-white py-3 px-6 rounded font-bold hover:bg-gray-800 disabled:opacity-50">
                {isSaving ? "Saving..." : "Finish"}
              </button>
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        );

      default:
        return <div>Error loading step.</div>;
    }
  };

  // ✅ Adjust progress bar (now only 6 steps)
  const progress = Math.round((step / 6) * 100);

  return (
    <div className="max-w-6xl mx-auto p-8 rounded-2xl ">
      <h2 className="text-3xl font-extrabold text-center mb-6">Personalized Skincare Quiz</h2>
      
      <div className="relative pt-1 mb-8">
        <div className="overflow-hidden h-2 mb-2 flex rounded bg-gray-200">
          <div
            style={{ width: `${progress}%` }}
            className="h-10 bg-black transition-all duration-1500 rounded"
          ></div>
        </div>
        <p className="text-sm text-center text-gray-500 font-medium">
          Step {step} of 6
        </p>
      </div>
      {renderStep()}
    </div>
  );
}
