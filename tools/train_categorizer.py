"""Small training script to create a simple merchant categorizer model.

This script creates a small TF-IDF + LogisticRegression model from a
synthetic dataset and saves the model + vectorizer into `app/ml/models/`.
Run locally when you want to produce a model for the categorizer.
"""
from pathlib import Path
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline


DATA = [
    ("Starbucks Coffee", "coffee"),
    ("Latte at Starbucks", "coffee"),
    ("Uber trip", "transport"),
    ("Lyft ride downtown", "transport"),
    ("Walmart groceries", "groceries"),
    ("Whole Foods market", "groceries"),
    ("Salary deposit", "income"),
    ("Rent payment", "housing"),
]


def train_and_save():
    texts, labels = zip(*DATA)
    vect = TfidfVectorizer(ngram_range=(1, 2), max_features=1000)
    clf = LogisticRegression(max_iter=1000)

    X = vect.fit_transform(texts)
    clf.fit(X, labels)

    out_dir = Path(__file__).parent.parent / "app" / "ml" / "models"
    out_dir.mkdir(parents=True, exist_ok=True)
    joblib.dump(clf, out_dir / "categorizer.pkl")
    joblib.dump(vect, out_dir / "categorizer_vect.pkl")
    print("Saved model and vectorizer to", out_dir)


if __name__ == "__main__":
    train_and_save()
