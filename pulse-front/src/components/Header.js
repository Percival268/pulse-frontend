// src/components/Header.js
import React from "react";
import { Sun, Moon } from "lucide-react";

const Header = ({ darkMode, toggleDarkMode, weather, localTime }) => {
  return (
    <div className="mb-8">
      {/* Weather block - top on small screens, left on md+ */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        {weather && (
          <div className="text-sm text-zinc-600 dark:text-zinc-300 md:order-1 order-2">
            📍 {weather.location} • {weather.temperature}°C, {weather.condition} • {localTime}
          </div>
        )}
        <div className="relative w-full flex justify-center md:order-2 order-1">
          <h1 className="text-4xl font-extrabold text-center">
            <span className="text-blue-600 dark:text-blue-400">📰 Pulse</span> – Trending
          </h1>
          <button
            onClick={toggleDarkMode}
            className="absolute right-0 top-0 p-2 rounded-full border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
