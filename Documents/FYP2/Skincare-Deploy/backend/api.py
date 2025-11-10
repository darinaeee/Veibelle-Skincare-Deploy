from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os, traceback
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv

# ================================================================
# 🚀 VeiBelle Skincare Recommender API (Weighted TF-IDF Version)
# ================================================================

# Load .env
load_dotenv()
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

app = FastAPI(title="VeiBelle Skincare Recommender API")

# --- Allow CORS for frontend ---

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",   # Add your React dev server
        "http://127.0.0.1:5173",   # Optional
        "http://127.0.0.1:5174",   # Optional
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Load Datasets ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROCESSED = os.path.join(BASE_DIR, "processed")

paths = {
    "products": os.path.join(PROCESSED, "products_clean.csv"),
    "ingredients": os.path.join(PROCESSED, "ingredients_cleaned_preprocessed.csv"),
    "product_ingredients": os.path.join(PROCESSED, "product_ingredients.csv"),
    "product_allergens": os.path.join(PROCESSED, "product_allergens.csv"),
}

try:
    products_df = pd.read_csv(paths["products"])
    ingredients_df = pd.read_csv(paths["ingredients"])
    product_ing = pd.read_csv(paths["product_ingredients"])
    product_allergens = pd.read_csv(paths["product_allergens"])
    print("✅ All datasets loaded successfully.")
except Exception as e:
    print("❌ Failed to load one or more datasets:", e)
    traceback.print_exc()
    products_df = ingredients_df = product_ing = product_allergens = None

# ================================================================
# 🧠 Weighted TF-IDF Training
# ================================================================
if products_df is not None:
    for col in ["ingredients", "Label", "brand", "name"]:
        if col not in products_df.columns:
            products_df[col] = ""

    def build_weighted_text(row):
        ingredients = str(row.get("ingredients", "")) * 3
        label = str(row.get("Label", "")) * 2
        brand = str(row.get("brand", "")) * 1
        name = str(row.get("name", "")) * 1
        return " ".join([ingredients, label, brand, name])

    products_df["search_text"] = products_df.apply(build_weighted_text, axis=1)

    vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), min_df=2)
    full_tfidf = vectorizer.fit_transform(products_df["search_text"].fillna(""))

    print("✅ Weighted TF-IDF search_text created and vectorized successfully.")
else:
    vectorizer, full_tfidf = None, None

# ================================================================
# 🧴 Concern Synonyms
# ================================================================
CONCERN_SYNONYMS = {
    "acne": ["acne", "pimple", "blemish", "breakout", "salicylic acid", "niacinamide"],
    "hydrating": ["hydrating", "moisturiz", "hyaluronic", "glycerin", "ceramide"],
    "dry": ["dry", "dehydrated", "flaky", "ceramide"],
    "wrinkle": ["wrinkle", "fine line", "retinol", "peptide", "anti-aging"],
    "pigmentation": ["pigment", "dark spot", "vitamin c", "niacinamide"],
    "sensitive": ["sensitive", "calm", "soothe", "aloe", "centella"],
    "puffiness": ["puff", "eye bag", "de-puff", "caffeine"],
    "dark circles": ["dark circle", "eye bag"],
    "uv protection": ["spf", "sunscreen", "broad spectrum", "uva", "uvb"],
    "dullness": ["dull", "lack of radiance", "brightening", "radiance"],
}

def expand_concerns(concern_list):
    expanded = []
    for c in concern_list:
        c_lower = c.strip().lower()
        if c_lower in CONCERN_SYNONYMS:
            expanded.extend(CONCERN_SYNONYMS[c_lower])
        else:
            expanded.append(c_lower)
    return " ".join(sorted(set(expanded)))

# ================================================================
# 🔍 Core Recommendation Logic
# ================================================================
SKIN_TYPE_MAPPING = {
    "Dry Skin": "Dry",
    "Oily Skin": "Oily",
    "Normal Skin": "Normal",
    "Combination Skin": "Combination",
    "Sensitive Skin": "Sensitive",
}

def get_recommendations(
    skin_type=None,
    product_type=None,
    concerns=None,
    allergens_list=None,
    pregnancy_safe=None,
    top_n=5,
):
    if products_df is None:
        return []

    df = products_df.copy()

    # --- Skin type filter ---
    if skin_type:
        col_name = SKIN_TYPE_MAPPING.get(skin_type)
        if col_name and col_name in df.columns:
            df = df[df[col_name] == 1]

    # --- Product type filter ---
    if product_type:
        types = [t.strip() for t in product_type.replace("/", ",").split(",")]
        df = df[df["Label"].str.lower().apply(lambda x: any(t.lower() in x for t in types))]

    # --- Allergens filter ---
    if allergens_list and product_allergens is not None:
        allergens_lower = [a.lower() for a in allergens_list]
        bad_products = product_allergens[
            product_allergens["allergen_name"].str.lower().isin(allergens_lower)
        ]["product_id"].unique()
        df = df[~df.index.isin(bad_products)]

    # --- Pregnancy-safe filter ---
    if pregnancy_safe and pregnancy_safe.lower() == "yes" and ingredients_df is not None:
        unsafe_ing = ingredients_df[
            ingredients_df["who_should_avoid"].str.contains("Pregnancy", case=False, na=False)
        ]["name"].str.lower().tolist()
        df = df[~df["ingredients"].fillna("").str.lower().apply(
            lambda x: any(u in x for u in unsafe_ing)
        )]
        print("🍼 Pregnancy-safe filter applied.")

    if df.empty:
        return []

    # --- TF-IDF similarity ---
    subset_indices = df.index.tolist()
    subset_matrix = full_tfidf[subset_indices]

    concern_text = expand_concerns(concerns) if concerns else "hydrating soothing gentle"
    user_vector = vectorizer.transform([concern_text])

    sims = cosine_similarity(user_vector, subset_matrix).flatten()
    df["similarity"] = sims
    df = df.sort_values(by="similarity", ascending=False).head(top_n)

    return df[["Label", "brand", "name", "similarity"]].to_dict(orient="records")

# ================================================================
# 🌐 FastAPI Endpoint
# ================================================================
@app.get("/recommend")
def recommend_products(
    skin_type: str = Query(None),
    product_type: str = Query(None),
    concerns: str = Query(None),
    allergens_list: str = Query(None),
    pregnancy_safe: str = Query(None),
    top_n: int = Query(5),
):
    try:
        concern_list = [c.strip() for c in concerns.split(",")] if concerns else []
        allergen_list = [a.strip() for a in allergens_list.split(",")] if allergens_list else []

        results = get_recommendations(
            skin_type=skin_type,
            product_type=product_type,
            concerns=concern_list,
            allergens_list=allergen_list,
            pregnancy_safe=pregnancy_safe,
            top_n=top_n,
        )

        if not results:
            return {"results": [], "message": "No matches found for your filters."}
        return {"results": results}

    except Exception as e:
        print("❌ Error in /recommend:", e)
        traceback.print_exc()
        return {"results": [], "message": "Error occurred during recommendation."}
