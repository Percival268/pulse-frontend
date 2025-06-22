from bs4 import BeautifulSoup
import requests

def fetch_google_news():
    url = "https://news.google.com"
    r = requests.get(url)
    soup = BeautifulSoup(r.text, 'lxml')
    articles = soup.select('article h3 a')
    headlines = []
    for a in articles:
        title = a.get_text(strip=True)
        link = url + a['href'][1:] if a['href'].startswith('.') else a['href']
        headlines.append({"title": title, "link": link, "source": "Google News"})
    return headlines

def fetch_reddit_news():
    url = "https://www.reddit.com/r/popular/"
    headers = {'User-Agent': 'Mozilla/5.0'}
    r = requests.get(url, headers=headers)
    soup = BeautifulSoup(r.text, 'lxml')
    articles = soup.select('h3')
    headlines = []
    for h in articles:
        title = h.get_text(strip=True)
        link = url
        headlines.append({"title": title, "link": link, "source": "Reddit"})
    return headlines
