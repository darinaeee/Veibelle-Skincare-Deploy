import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import "@fontsource/roboto-slab";

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    // Load CSV
    Papa.parse("/ingredients_cleaned_preprocessed.csv", {
      header: true,
      download: true,
      complete: (results) => {
        // Only pick the columns we need
        const filtered = results.data.map((item) => ({
          name: item.name,
          what_is_it: item.what_is_it,
        }));
        setIngredients(filtered);
      },
    });
  }, []);

  return (
    <div className="p-15">
      <h1
        className="text-4xl font-bold mb-6 text-center text-pink-600"
        style={{ fontFamily: "'Roboto Slab', serif" }}
      >
        Ingredients Info
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-semibold text-pink-500 mb-2">
              {ingredient.name}
            </h2>
            <p className="text-gray-500 text-sm italic">
              {ingredient.what_is_it}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ingredients;
