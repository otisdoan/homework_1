"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Filter, X, SlidersHorizontal } from "lucide-react";

interface SearchFilterProps {
  products: any[];
  onFilteredProducts: (filteredProducts: any[]) => void;
}

export default function SearchFilter({
  products,
  onFilteredProducts,
}: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(
        (product) => product.price >= parseFloat(priceRange.min)
      );
    }
    if (priceRange.max) {
      filtered = filtered.filter(
        (product) => product.price <= parseFloat(priceRange.max)
      );
    }

    // Sort products
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-az":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-za":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [products, searchTerm, priceRange, sortBy]);

  // Update parent component when filtered products change
  useEffect(() => {
    onFilteredProducts(filteredProducts);
  }, [filteredProducts, onFilteredProducts]);

  const clearFilters = () => {
    setSearchTerm("");
    setPriceRange({ min: "", max: "" });
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchTerm || priceRange.min || priceRange.max || sortBy !== "newest";

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search products by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="text-sm font-medium text-black">Filters</span>
          {hasActiveFilters && (
            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
              Active
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="border-t pt-4 space-y-4">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range ($)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  placeholder="Min price"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-500"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Max price"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-az">Name: A to Z</option>
              <option value="name-za">Name: Z to A</option>
            </select>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {filteredProducts.length} of {products.length} products
          </span>
          {hasActiveFilters && (
            <span className="text-blue-600 font-medium">Filters applied</span>
          )}
        </div>
      </div>
    </div>
  );
}
