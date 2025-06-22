// src/pages/Home.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import CategoryFilter from "../components/CategoryFilter";
import NewsCard from "../components/NewsCard";
import OneSignal from "react-onesignal";

const API_URL = process.env.REACT_APP_API_URL || "https://pulse-backend.onrender.com";


const Home = () => {
  const [headlines, setHeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem("theme") === "dark"
  );
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [weather, setWeather] = useState(null);
  const [localTime, setLocalTime] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const initOneSignal = async () => {
      if (!window.OneSignalInitialized) {
        await OneSignal.init({
          appId: "ccebf6b2-767a-4fe8-ad2a-a2a2a2f66adc",
          serviceWorkerPath: "OneSignalSDKWorker.js",
          notifyButton: {
            enable: true,
          },
          allowLocalhostAsSecureOrigin: true,
        });

        window.OneSignalInitialized = true;

        const permission = await OneSignal.Notifications.permission; // "default", "granted", "denied"
        if (permission === "denied") {
          setNotificationsEnabled(false);
        }
        if (permission === "denied") {
          setNotificationsEnabled(false);
        }
      }
    };

    initOneSignal();
  }, []);

   useEffect(() => {
    const fetchHeadlines = async () => {
      try {
        const res = await axios.get(`${API_URL}/trending`);
        const headlinesWithVotes = res.data.map(h => ({ ...h, upvotes: 0, downvotes: 0 }));
        setHeadlines(headlinesWithVotes);
      } catch (err) {
        console.error("Error fetching headlines:", err);
        setError("Failed to load trending news.");
      } finally {
        setLoading(false);
      }
    };
    fetchHeadlines();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await axios.get(`${API_URL}/weather?lat=${latitude}&lon=${longitude}`);
          if (!res.data.error) {
            const { location, temperature, condition } = res.data;
            setWeather({ location, temperature, condition });
            setLocalTime(new Date().toLocaleTimeString());
          }
        } catch (e) {
          console.error("Weather fetch failed", e);
        }
      },
      (err) => {
        console.warn("Geolocation denied or failed", err);
        setWeather(null);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(headlines.map((h) => h.category || "General")))
  ];

  const visibleHeadlines =
    selectedCategory === "All"
      ? headlines
      : headlines.filter((item) => item.category === selectedCategory);

  const handleVote = (index, type) => {
    setHeadlines(prev => {
      const updated = [...prev];
      const item = { ...updated[index] };
      if (type === "up") item.upvotes += 1;
      if (type === "down") item.downvotes += 1;
      updated[index] = item;
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white px-6 py-10 font-sans transition-colors duration-300">
      <Header
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        weather={weather}
        localTime={localTime}
      />

      {!notificationsEnabled && (
        <div className="text-xs text-red-500 text-center mb-4">
          Notifications are blocked. Enable them in your browser settings to receive alerts.
        </div>
      )}

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 text-gray-400">⏳</div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 text-lg">{error}</div>
      ) : headlines.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">No headlines available.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleHeadlines.map((item, index) => (
            <NewsCard
              key={index}
              item={item}
              index={index}
              onVote={handleVote}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;

