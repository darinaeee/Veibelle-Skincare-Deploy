import pandas as pd
from sqlalchemy import create_engine, text

# ---------------------------
# Configuration
# ---------------------------
MYSQL_USER = "root"
MYSQL_PASSWORD = "darlina"
MYSQL_HOST = "localhost"
MYSQL_DB = "skincare"

SKINCARE_CSV = "processed/products_clean.csv"   # products dataset
ALLERGEN_CSV = "processed/allergens_clean.csv"    # allergens dataset

# ---------------------------
# Create MySQL connection
# ---------------------------
engine = create_engine(f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}/{MYSQL_DB}")

with engine.begin() as conn:  # begin() gives automatic transaction
    # 1️⃣ Disable foreign key checks
    conn.execute(text("SET FOREIGN_KEY_CHECKS=0;"))

    # 2️⃣ Drop tables if they exist
    conn.execute(text("DROP TABLE IF EXISTS allergens;"))
    conn.execute(text("DROP TABLE IF EXISTS products;"))

    # 3️⃣ Import skincare products
    print("📥 Importing skincare products...")
    skincare_df = pd.read_csv(SKINCARE_CSV)
    skincare_df.to_sql('products', con=conn, if_exists='replace', index=False)

    # 4️⃣ Import allergens
    print("📥 Importing allergens...")
    allergen_df = pd.read_csv(ALLERGEN_CSV)
    allergen_df.to_sql('allergens', con=conn, if_exists='replace', index=False)

    # 5️⃣ Re-enable foreign key checks
    conn.execute(text("SET FOREIGN_KEY_CHECKS=1;"))

print("✅ CSVs imported into MySQL safely!")

# 6️⃣ Optional: show top rows
print("\nSkincare sample:")
print(skincare_df.head())
print("\nAllergens sample:")
print(allergen_df.head())
