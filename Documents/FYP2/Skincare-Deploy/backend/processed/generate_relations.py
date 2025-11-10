import os
import pandas as pd
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === PATH SETUP ===
base_path = os.path.join(os.path.dirname(__file__), "processed")

# === LOAD DATASETS ===
print("🔹 Loading all datasets...")
try:
    products = pd.read_csv(os.path.join(base_path, "products_clean.csv"))
    ingredients = pd.read_csv(os.path.join(base_path, "ingredients_cleaned_preprocessed.csv"))
    prod_ing = pd.read_csv(os.path.join(base_path, "product_ingredients.csv"))
    prod_allergens = pd.read_csv(os.path.join(base_path, "product_allergens.csv"))
    allergens = pd.read_csv(os.path.join(base_path, "allergens_clean.csv"))
    categories = pd.read_csv(os.path.join(base_path, "categories_summary.csv"))

    print("✅ All datasets loaded successfully!")

except Exception as e:
    print(f"❌ Error loading datasets: {e}")
    products = None

# === PREPROCESS ===
if products is not None:
    # Merge products with ingredient info
    merged = products.merge(prod_ing, left_on="Label", right_on="product_id", how="left")
    merged = merged.merge(ingredients, left_on="ingredient_name", right_on="name", how="left")
    merged = merged.merge(prod_allergens, left_on="Label", right_on="product_id", how="left")
    merged = merged.merge(allergens, left_on="allergen_name", right_on="ingredient_name", how="left")

    # Combine text for TF-IDF (description + ingredients + functions)
    merged["combined_text"] = (
        merged["ingredients"].fillna("") + " " +
        merged["short_description"].fillna("") + " " +
        merged["what_does_it_do"].fillna("")
    )

    print(f"✅ Merged dataset shape: {merged.shape}")

    # TF-IDF
    print("🔹 Building TF-IDF matrix...")
    tfidf = TfidfVectorizer(stop_words="english")
    tfidf_matrix = tfidf.fit_transform(merged["combined_text"])
    cosine_sim = cosine_similarity(tfidf_matrix)
    print(f"✅ TF-IDF matrix shape: {cosine_sim.shape}")
else:
    merged = None
    cosine_sim = None

@app.get("/")
def home():
    return {"message": "Veibelle Recommendation API is running!"}

# === RECOMMENDATION ENDPOINT ===
@app.get("/recommend")
def recommend(
    skin_type: str = Query(None),
    product_type: str = Query(None),
    concerns: str = Query(None),
    allergens_list: str = Query(None)
):
    if merged is None:
        return {"error": "Datasets not loaded."}

    df = merged.copy()
    print(f"🔍 Filters received: {skin_type}, {product_type}, {concerns}, {allergens_list}")

    # Filter 1: Skin type
    if skin_type:
        st = skin_type.split()[0]
        df = df[df[st].astype(str).str.lower() == "1"]

    # Filter 2: Product type/category
    if product_type:
        df = df[df["category"].astype(str).str.contains(product_type, case=False, na=False)]

    # Filter 3: Concerns
    if concerns:
        keywords = [kw.strip().lower() for kw in concerns.split(",")]
        df = df[df["combined_text"].str.lower().apply(lambda text: any(k in text for k in keywords))]

    # Filter 4: Allergens
    if allergens_list:
        allergens_exclude = [a.strip().lower() for a in allergens_list.split(",")]
        df = df[~df["ingredients"].str.lower().apply(lambda text: any(a in text for a in allergens_exclude))]

    # Fallback if too few results
    if len(df) < 5:
        print("⚠️ Few matches found, using cosine similarity fallback.")
        sim_scores = cosine_sim[:5]
        indices = sim_scores.argsort()[0][-5:][::-1]
        df = merged.iloc[indices]

    top = df.head(5)
    results = [
        {
            "name": row["name"],
            "brand": row.get("brand", ""),
            "price": row.get("price", ""),
            "rank": row.get("rank", ""),
        }
        for _, row in top.iterrows()
    ]
    return {"results": results}
