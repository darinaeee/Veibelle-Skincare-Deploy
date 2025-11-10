import pandas as pd
import os
import ast
import re

def clean_ingredients():
    print("🔹 Loading ingredients dataset...")

    # Paths
    data_dir = "data"
    processed_dir = "processed"
    ingredients_path = os.path.join(data_dir, "ingredients_clean.csv")

    # Load
    ingredients = pd.read_csv(ingredients_path)
    print(f"Ingredients loaded: {ingredients.shape}")

    # --- Cleaning Steps ---

    # 1. Trim column names
    ingredients.columns = ingredients.columns.str.strip()

    # 2. Clean text columns
    text_cols = [
        "name", "scientific_name", "short_description",
        "what_is_it", "what_does_it_do", "who_is_it_good_for",
        "who_should_avoid", "url"
    ]
    for col in text_cols:
        if col in ingredients.columns:
            ingredients[col] = ingredients[col].astype(str).str.strip()
            ingredients[col] = ingredients[col].replace(["nan", "None", "NaN"], "")

    # 3. Normalize line breaks, spaces, and bullets
    for col in ["short_description", "what_is_it", "what_does_it_do"]:
        if col in ingredients.columns:
            ingredients[col] = (
                ingredients[col]
                .str.replace(r"\n+", " ", regex=True)
                .str.replace(r"\s{2,}", " ", regex=True)
                .str.replace(r"•|-", "•", regex=True)
                .str.strip()
            )

    # 4. Clean list-like strings
    def clean_list_string(s):
        if not isinstance(s, str):
            return []
        try:
            lst = ast.literal_eval(s)
            if isinstance(lst, list):
                return [x.strip() for x in lst if x.strip() and x.strip() != ","]
        except (ValueError, SyntaxError):
            pass
        return [s.strip()] if s.strip() else []

    if "who_is_it_good_for" in ingredients.columns:
        ingredients["who_is_it_good_for"] = ingredients["who_is_it_good_for"].apply(clean_list_string)

    if "who_should_avoid" in ingredients.columns:
        ingredients["who_should_avoid"] = ingredients["who_should_avoid"].apply(clean_list_string)

    # 5. Clean URLs & remove duplicates
    if "url" in ingredients.columns:
        ingredients["url"] = ingredients["url"].str.strip().str.replace(" ", "")
    if "name" in ingredients.columns:
        ingredients.drop_duplicates(subset=["name"], inplace=True)

    # 6. Remove any leftover HTML
    for col in ["short_description", "what_is_it", "what_does_it_do"]:
        if col in ingredients.columns:
            ingredients[col] = ingredients[col].str.replace(r"<.*?>", "", regex=True)

    # --- Save ---
    os.makedirs(processed_dir, exist_ok=True)
    output_path = os.path.join(processed_dir, "ingredients_cleaned_preprocessed.csv")
    ingredients.to_csv(output_path, index=False)

    print("✅ Ingredients cleaned and saved in 'processed/ingredients_cleaned_preprocessed.csv'")
    print(f"   Rows: {ingredients.shape[0]} | Columns: {ingredients.shape[1]}")

if __name__ == "__main__":
    clean_ingredients()
