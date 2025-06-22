# classify_headline.py

import joblib
import sys

# Load the trained model
model = joblib.load("headline_classifier.joblib")

def classify_headline(title):
    return model.predict([title])[0]

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python classify_headline.py \"Your headline here\"")
    else:
        title = sys.argv[1]
        category = classify_headline(title)
        print(f"📰 Predicted category: {category}")
