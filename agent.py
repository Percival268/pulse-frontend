# agent.py - Headline Scoring and Deduplication Logic

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

keywords = ["breaking", "trending", "just in", "alert", "hot take", "exclusive"]
important_entities = ["elon", "ai", "india", "musk", "china", "usa", "bitcoin", "usa"]

def score_headline(title, upvotes=None, comments=None, views=None):
    score = 0
    title_lower = title.lower()

    # Keyword scoring
    for word in keywords:
        if word in title_lower:
            score += 10

    # Length scoring
    title_length = len(title)
    if title_length > 80:
        score += 3
    elif title_length < 30:
        score -= 2  # Very short titles often lack context

    # Entity scoring
    for entity in important_entities:
        if entity in title_lower:
            score += 5

    # Question bonus
    if title.endswith('?'):
        score += 2

    # Engagement scoring
    if upvotes:
        score += min(upvotes // 50, 10)
    if comments:
        score += min(comments // 10, 5)
    if views:
        score += min(views // 1000, 5)

    return score

def deduplicate_headlines(headlines, threshold=0.7):
    titles = [h['title'] for h in headlines]
    tfidf = TfidfVectorizer(stop_words='english').fit_transform(titles)
    sim_matrix = cosine_similarity(tfidf)

    to_remove = set()
    for i in range(len(sim_matrix)):
        for j in range(i + 1, len(sim_matrix)):
            if sim_matrix[i, j] > threshold:
                to_remove.add(j)

    deduped = [h for idx, h in enumerate(headlines) if idx not in to_remove]
    return deduped



def classify_category(title: str) -> str:
    title = title.lower()
    categories = {
        "Politics": ["election", "president", "prime minister", "parliament", "government", "bjp", "congress", "modi", "biden"],
        "Technology": ["tech", "ai", "software", "robot", "startup", "elon", "musk", "chatgpt", "openai", "spacex"],
        "Health": ["covid", "health", "virus", "hospital", "vaccine", "disease", "flu"],
        "Finance": ["stock", "inflation", "economy", "market", "crypto", "bitcoin", "bank", "recession"],
        "World": ["war", "iran", "russia", "china", "usa", "diplomacy", "israel"],
        "Entertainment": ["movie", "film", "celebrity", "actor", "bollywood", "tv", "series", "music", "festival"],
        "Sports": ["football", "cricket", "tournament", "match", "goal", "win", "cup", "olympics"],
    }

    # Give score for each category
    scores = {}
    for cat, keywords in categories.items():
        scores[cat] = sum(title.count(k) for k in keywords)

    # If all are 0 → return General
    if all(score == 0 for score in scores.values()):
        return "General"

    # Prioritize the most specific category (tie-breaking)
    priority = ["Sports", "Politics", "Technology", "Finance", "World", "Health", "Entertainment"]

    # Sort by score, then priority order
    sorted_scores = sorted(scores.items(), key=lambda x: (-x[1], priority.index(x[0]) if x[0] in priority else 999))

    return sorted_scores[0][0]

