from fastapi import FastAPI
import pandas as pd

app = FastAPI()

skincare_df = pd.read_csv("processed/products_clean.csv")
allergen_df = pd.read_csv("processed/allergens_clean.csv")

@app.get("/")
def root():
    return {"message": "Backend is running!"}
