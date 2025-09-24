"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import SearchFilter from "@/components/ui/SearchFilter";
import AdvancedSearch from "@/components/ui/AdvancedSearch";
import ProductGrid from "@/components/ui/ProductGrid";
import { Package, Search as SearchIcon } from "lucide-react";

export default function SearchDemo() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<"basic" | "advanced">("basic");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleFilteredProducts = (filtered: Product[]) => {
    setFilteredProducts(filtered);
  };

  const handleAdvancedSearch = (searchParams: any) => {
    // This would be implemented with more sophisticated filtering
    // For now, we'll use the basic search functionality
    console.log("Advanced search params:", searchParams);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <div className="text-lg text-gray-600">Loading products...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-4 max-w-md mx-auto">
              <div className="text-red-600 mb-2">⚠️ Error: {error}</div>
            </div>
            <button
              onClick={fetchProducts}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-lg">
              <SearchIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Search & Filter Demo
              </h1>
              <p className="text-gray-600">
                Test the search and filtering capabilities
              </p>
            </div>
          </div>
        </div>

        {/* Search Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setSearchMode("basic")}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                searchMode === "basic"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Basic Search
            </button>
            <button
              onClick={() => setSearchMode("advanced")}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                searchMode === "advanced"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Advanced Search
            </button>
          </div>
        </div>

        {/* Search Components */}
        {searchMode === "basic" ? (
          <SearchFilter
            products={products}
            onFilteredProducts={handleFilteredProducts}
          />
        ) : (
          <AdvancedSearch onSearch={handleAdvancedSearch} />
        )}

        {/* Results */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Search Results
              </h2>
              <p className="text-gray-600">
                {filteredProducts.length} of {products.length} products found
              </p>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Package className="h-4 w-4" />
              <span>Total Products: {products.length}</span>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                No Products Found
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Try adjusting your search criteria or filters to find what
                you're looking for.
              </p>
            </div>
          ) : (
            <ProductGrid products={filteredProducts} itemsPerPage={12} />
          )}
        </div>

        {/* Features Info */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Search Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Basic Search</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Search by product name or description</li>
                <li>• Filter by price range</li>
                <li>• Sort by various criteria</li>
                <li>• Real-time filtering</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Advanced Search
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Category-based filtering</li>
                <li>• Advanced price range controls</li>
                <li>• Multiple sorting options</li>
                <li>• Stock availability filter</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
