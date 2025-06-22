# train_classifier.py

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import joblib

# Load your labeled dataset
data = pd.read_csv("headlines.csv")  # must have 'title' and 'category' columns

# Split into features and labels
X = data["title"]
y = data["category"]

# Create the pipeline
model = Pipeline([
    ("tfidf", TfidfVectorizer(stop_words="english")),
    ("clf", LogisticRegression(max_iter=500))
])

# Train the model
model.fit(X, y)

# Save the model
joblib.dump(model, "headline_classifier.joblib")
print("✅ Model trained and saved as 'headline_classifier.joblib'")
