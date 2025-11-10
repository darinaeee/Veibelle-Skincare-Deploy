import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# === Load cleaned datasets ===
products = pd.read_csv("processed/products_clean.csv")
allergens = pd.read_csv("processed/allergens_clean.csv")

# === Normalize column names ===
allergens.columns = allergens.columns.str.lower()
products.columns = products.columns.str.lower()

# === TF-IDF Vectorization ===
vectorizer = TfidfVectorizer(stop_words="english")
tfidf_matrix = vectorizer.fit_transform(products["ingredients"].fillna(""))

# === Similarity Matrix ===
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
products["similarity_score"] = cosine_sim.mean(axis=1)

# === Recommendation Function ===
def recommend_products(skin_condition=None, top_n=5):
    """
    Recommend skincare products, optionally filtering by skin condition.
    """
    filtered_products = products.copy()

    if skin_condition:
        skin_condition = skin_condition.lower()
        allergens["skin_condition"] = allergens["skin_condition"].str.lower()

        condition_allergens = allergens[
            allergens["skin_condition"] == skin_condition
        ]["ingredient_name"].dropna().tolist()

        if condition_allergens:
            pattern = "|".join([f"\\b{a}\\b" for a in condition_allergens if isinstance(a, str)])
            filtered_products = filtered_products[
                ~filtered_products["ingredients"].str.contains(pattern, case=False, na=False, regex=True)
            ]

    # Sort by similarity score
    recommendations = filtered_products.sort_values(by="similarity_score", ascending=False).head(top_n)

    return recommendations[["name", "brand", "ingredients"]]


if __name__ == "__main__":
    print("\nRecommended products for Cystic Acne:\n")
    print(recommend_products(skin_condition="Cystic Acne", top_n=5))
