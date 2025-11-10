const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://veibelle-skincare-deploy.onrender.com";

/**
 * Cleans up user input for API query:
 * - Replaces slashes "/" with commas
 * - Removes extra spaces
 * - Joins multiple values into comma-separated string
 */
function formatList(input) {
  if (!input) return "";
  return input
    .split(/[\/,]/)              // split by slash or comma
    .map(item => item.trim())    // trim spaces
    .filter(item => item.length > 0) // remove empty
    .join(",");                  // join back with comma
}

export async function getRecommendations({ skin_type, product_type, concerns, allergens_list, pregnancy_safe }) {
  const params = new URLSearchParams();
  if (skin_type) params.append("skin_type", skin_type);
  if (product_type) params.append("product_type", formatList(product_type));
  if (concerns) params.append("concerns", formatList(concerns));
  if (allergens_list) params.append("allergens_list", formatList(allergens_list));
  if (pregnancy_safe) params.append("pregnancy_safe", pregnancy_safe);

  try {
    const response = await fetch(`${BASE_URL}/recommend?${params.toString()}`);
    if (!response.ok) throw new Error("Failed to fetch recommendations");
    return await response.json();
  } catch (err) {
    console.error("❌ Recommendation API error:", err);
    return { results: [], message: "Failed to fetch recommendations. Is the backend running?" };
  }
}
