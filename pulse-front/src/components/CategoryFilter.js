// src/components/CategoryFilter.js
import React from "react";

const CategoryFilter = ({ categories, selectedCategory, setSelectedCategory }) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-8">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`px-4 py-1 rounded-full text-sm font-medium border transition
            ${selectedCategory === category
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-700"}`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;