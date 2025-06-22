import requests

def get_location():
    try:
        response = requests.get("https://ipinfo.io/json")
        data = response.json()
        return data.get("city")
    except Exception as e:
        print(f"[Location Error] {e}")
        return None

def get_weather_data(location):
    try:
        url = f"https://wttr.in/{location}?format=j1"
        response = requests.get(url, timeout=5)
        data = response.json()

        current = data["current_condition"][0]
        area = data["nearest_area"][0]["areaName"][0]["value"]

        return {
            "location": area,
            "temperature": current["temp_C"],
            "condition": current["weatherDesc"][0]["value"],
            "wind": f"{current['windspeedKmph']} km/h {current['winddir16Point']}",
            "humidity": current["humidity"],
            "visibility": current["visibility"]
        }

    except Exception as e:
        print(f"[Weather Error] {e}")
        return None
