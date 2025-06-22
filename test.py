'''import feedparser

rss_url = "https://news.google.com/rss/search?q=technology"
feed = feedparser.parse(rss_url)

for entry in feed.entries:
    print(entry.title)
    print(entry.link)
    print("---")
'''
'''
import feedparser
import requests

rss_url = "https://www.reddit.com/r/news/.rss"
headers = {'User-Agent': 'Mozilla/5.0 (compatible; yourbot/1.0)'}

r = requests.get(rss_url, headers=headers, timeout=10)
feed = feedparser.parse(r.text)

for entry in feed.entries:
    print(entry.title)
    print(entry.link)'''

import requests
from dotenv import load_dotenv
import os
# Replace with your actual SambaNova API endpoint and key
API_URL = "https://inference.api.sambanova.ai/deployments/<your_deployment_id>/infer"

load_dotenv()
SAMBA_API_KEY = "ac626e59-988a-4168-9cf5-6cc2d1758015"
API_KEY = SAMBA_API_KEY

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

data = {
    "prompt": "Hello, SambaNova!",
    "max_tokens": 10
}

try:
    response = requests.post(API_URL, headers=headers, json=data)
    response.raise_for_status()  # Raises an error for 4xx/5xx responses

    print("✅ API is working!")
    print("Response:")
    print(response.json())

except requests.exceptions.RequestException as e:
    print("❌ API test failed.")
    print("Error:", e)

