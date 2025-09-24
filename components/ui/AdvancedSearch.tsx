"use client";

import { useState } from "react";
import { Search, Filter, X, ChevronDown, ChevronUp } from "lucide-react";

interface AdvancedSearchProps {
  onSearch: (searchParams: {
    query: string;
    category: string;
    priceRange: { min: number; max: number };
    sortBy: string;
    inStock: boolean;
  }) => void;
}

export default function AdvancedSearch({ onSearch }: AdvancedSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchParams, setSearchParams] = useState({
    query: "",
    category: "",
    priceRange: { min: 0, max: 1000 },
    sortBy: "newest",
    inStock: false,
  });

  const categories = [
    "All Categories",
    "Men's Clothing",
    "Women's Clothing",
    "Accessories",
    "Shoes",
    "Sale Items",
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name-az", label: "Name: A to Z" },
    { value: "name-za", label: "Name: Z to A" },
    { value: "popular", label: "Most Popular" },
  ];

  const handleSearch = () => {
    onSearch(searchParams);
  };

  const handleReset = () => {
    const resetParams = {
      query: "",
      category: "",
      priceRange: { min: 0, max: 1000 },
      sortBy: "newest",
      inStock: false,
    };
    setSearchParams(resetParams);
    onSearch(resetParams);
  };

  const hasActiveFilters =
    searchParams.query ||
    searchParams.category ||
    searchParams.priceRange.min > 0 ||
    searchParams.priceRange.max < 1000 ||
    searchParams.sortBy !== "newest" ||
    searchParams.inStock;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      {/* Main Search Bar */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchParams.query}
            onChange={(e) =>
              setSearchParams((prev) => ({ ...prev, query: e.target.value }))
            }
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          />
        </div>

        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Search
        </button>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filters</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.slice(1).map((category) => (
          <button
            key={category}
            onClick={() =>
              setSearchParams((prev) => ({ ...prev, category: category }))
            }
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              searchParams.category === category
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="border-t pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={searchParams.category}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category === "All Categories" ? "" : category}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range ($)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={searchParams.priceRange.min || ""}
                  onChange={(e) =>
                    setSearchParams((prev) => ({
                      ...prev,
                      priceRange: {
                        ...prev.priceRange,
                        min: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-500"
                />
                <span className="flex items-center text-gray-500">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={searchParams.priceRange.max || ""}
                  onChange={(e) =>
                    setSearchParams((prev) => ({
                      ...prev,
                      priceRange: {
                        ...prev.priceRange,
                        max: parseFloat(e.target.value) || 1000,
                      },
                    }))
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-500"
                />
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={searchParams.sortBy}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    sortBy: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Additional Options */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={searchParams.inStock}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    inStock: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Apply Filters
              </button>

              {hasActiveFilters && (
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {hasActiveFilters && (
              <div className="text-sm text-blue-600 font-medium">
                Filters Active
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
