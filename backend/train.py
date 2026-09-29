# backend/train.py
import os, json, joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression

from rules import evaluate_scheme_for_village

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
MODEL_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODEL_DIR, exist_ok=True)

with open(os.path.join(DATA_DIR, "dss_villages.json"), "r", encoding="utf-8") as f:
    villages = json.load(f)
with open(os.path.join(DATA_DIR, "dss_schemes.json"), "r", encoding="utf-8") as f:
    schemes = json.load(f)

df = pd.DataFrame(villages)

# Choose some features (expand as needed)
num_features = [
    "population","pct_st_population","pct_pucca_houses","fhtc_coverage_pct",
    "hamlet_count","hamlets_leq_20hh","nearest_health_center_km",
    "pct_un_electrified","pct_lpg_coverage","total_farmland_ha",
    "irrigated_area_ha","pct_forest_cover","num_fra_patta_holders",
    "num_shgs","avg_land_holding_acre"
]
cat_features = [
    "state","district","block","groundwater_index","mobile_connectivity",
    "income_level","has_cfr","is_hilly_area","is_aspirational_block",
    "is_pvtg","tourism_potential"
]

X = df[num_features + cat_features].copy()
# coerce missing booleans/strings
for c in cat_features:
    if c not in X: X[c] = None
for n in num_features:
    if n not in X: X[n] = 0

pre = ColumnTransformer(
    transformers=[
        ("num", "passthrough", [c for c in num_features if c in X.columns]),
        ("cat", OneHotEncoder(handle_unknown="ignore"), [c for c in cat_features if c in X.columns]),
    ]
)

for s in schemes:
    # create labels from rules
    y = []
    for v in villages:
        ok, _ = evaluate_scheme_for_village(v, s)
        y.append(1 if ok else 0)

    model = Pipeline([
        ("prep", pre),
        ("clf", LogisticRegression(max_iter=1000))
    ])
    model.fit(X, y)
    joblib.dump(model, os.path.join(MODEL_DIR, f"{s['scheme_id']}.joblib"))

print("Models trained to backend/models/ (distilled from rules).")
