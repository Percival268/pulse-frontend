// src/components/NewsCard.js
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { FaTwitter, FaRedditAlien, FaHackerNews } from "react-icons/fa";
import { SiGooglenews, SiYcombinator } from "react-icons/si";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import ESPNLogo from './assets/icons8-espn.svg';
import RedditLogo from './assets/icons8-reddit-24.png';
import YahooLogo from './assets/icons8-yahoo.svg';

const sourceIcons = {
  Yahoo: <img src={YahooLogo} alt="Yahoo" className="h-6" />,
  Twitter: <FaTwitter className="text-sky-400" />,
  Reddit: <img src={RedditLogo} alt="Reddit" className="h-6" />,
  ESPN: <img src={ESPNLogo} alt="ESPN" className="h-6" />,
  "Hacker News": <FaHackerNews className="text-orange-400" />,
  "YC Blog": <SiYcombinator className="text-orange-300" />,
  "Google News": <SiGooglenews className="text-blue-500" />,
  Default: <span className="text-gray-400">🌐</span>,
};

const NewsCard = ({ item, index, onVote }) => {
  const getSourceIcon = (source = "") => {
    const key = Object.keys(sourceIcons).find(k =>
      source.toLowerCase().includes(k.toLowerCase())
    );
    return sourceIcons[key] || sourceIcons.Default;
  };

  const icon = getSourceIcon(item.source);
  const timestamp = item.timestamp
    ? formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })
    : "just now";
  const isFeatured = index < 1;

  return (
    <div
      className={`group block p-6 rounded-2xl border transition-all duration-200
        ${isFeatured
          ? "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 col-span-1 sm:col-span-2"
          : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"}
        hover:border-blue-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:shadow-lg hover:scale-[1.015] hover:ring-1 hover:ring-blue-400 dark:hover:ring-blue-500`}
    >
      <div className="flex items-start gap-3">
        <div className="pt-1">{icon}</div>
        <div className="flex-1">
          <a href={item.link} target="_blank" rel="noopener noreferrer">
            <h2 className={`font-semibold group-hover:underline ${isFeatured ? "text-xl" : "text-base"}`}>
              {item.title}
            </h2>
          </a>
          {item.category && (
            <span className="inline-block text-xs font-medium text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded-full mt-2">
              {item.category}
            </span>
          )}
          <div className="mt-3 flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>{item.source || "Unknown"}</span>
            <span>{timestamp}</span>
          </div>
          

          
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
