// src/components/WeatherBar.js
import React from "react";

const WeatherBar = ({ weather, localTime }) => {
  if (!weather) return null;
  return (
    <div className="text-center mb-4 text-sm text-zinc-600 dark:text-zinc-300">
      📍 {weather.location} • {weather.temperature}°C, {weather.condition} • {localTime}
    </div>
  );
};

export default WeatherBar;