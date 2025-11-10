import pandas as pd
import ast
import os

# === Paths ===
data_path = "processed/ingredients_cleaned_preprocessed.csv"
output_path = "processed/categories_summary.csv"

# === Load CSV ===
if not os.path.exists(data_path):
    raise FileNotFoundError(f"❌ CSV not found at {data_path}")
else:
    print(f"✅ Loaded file from: {data_path}")

df = pd.read_csv(data_path)

# === Function to extract unique cleaned values ===
def extract_values(series):
    unique_values = {}
    for val in series.dropna():
        try:
            # Handle list-like strings (e.g. "['Dry skin', 'Wrinkles']")
            items = ast.literal_eval(val) if val.strip().startswith('[') else [val]
        except Exception:
            items = [val]

        for item in items:
            for sub in str(item).split(','):
                clean = sub.strip()
                if clean:
                    unique_values[clean] = unique_values.get(clean, 0) + 1
    return unique_values

# === Extract data ===
good_for_dict = extract_values(df['who_is_it_good_for'])
avoid_dict = extract_values(df['who_should_avoid'])

# === Print to console ===
print("\n🧴 Unique 'who_is_it_good_for' values:")
for v, count in sorted(good_for_dict.items()):
    print(f"- {v} ({count})")

print("\n🚫 Unique 'who_should_avoid' values:")
for v, count in sorted(avoid_dict.items()):
    print(f"- {v} ({count})")

# === Save summary to CSV ===
summary_df = pd.DataFrame([
    {"category": "who_is_it_good_for", "value": k, "count": v}
    for k, v in good_for_dict.items()
] + [
    {"category": "who_should_avoid", "value": k, "count": v}
    for k, v in avoid_dict.items()
])

summary_df.to_csv(output_path, index=False, encoding='utf-8-sig')

print(f"\n💾 Summary saved to: {output_path}")
