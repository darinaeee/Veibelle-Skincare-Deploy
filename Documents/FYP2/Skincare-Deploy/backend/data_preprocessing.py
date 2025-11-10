import pandas as pd
import os

def preprocess():
    print("🔹 Loading datasets...")

    # Define paths
    product_path = os.path.join("data", "cosmetic_p.csv")
    allergen_path = os.path.join("data", "allergen_dataset.csv")

    # Load datasets
    products = pd.read_csv(product_path)
    allergens = pd.read_csv(allergen_path)

    print(f"Products loaded: {products.shape}")
    print(f"Allergens loaded: {allergens.shape}")

    # --- Clean Products Dataset ---
    if "ingredients" in products.columns:
        products["ingredients"] = products["ingredients"].fillna("").astype(str).str.lower()

    # Ensure numeric fields are correct
    if "price" in products.columns:
        products["price"] = pd.to_numeric(products["price"], errors="coerce")

    if "rank" in products.columns:
        products["rank"] = pd.to_numeric(products["rank"], errors="coerce")

    # --- Clean Allergens Dataset ---
    # Convert Yes/No or 1/0 columns to integers
    yes_no_columns = [
        "skin_type_sensitive", "skin_type_oily", "skin_type_dry",
        "skin_type_combination", "skin_type_normal"
    ]

    for col in yes_no_columns:
        if col in allergens.columns:
            allergens[col] = allergens[col].fillna("No").astype(str).str.strip().str.lower()
            allergens[col] = allergens[col].map({"yes": 1, "no": 0, "1": 1, "0": 0}).fillna(0).astype(int)

    # --- Save Preprocessed Versions ---
    os.makedirs("processed", exist_ok=True)
    products.to_csv("processed/products_clean.csv", index=False)
    allergens.to_csv("processed/allergens_clean.csv", index=False)

    print("✅ Preprocessing complete. Clean datasets saved in 'processed/' folder.")

if __name__ == "__main__":
    preprocess()
