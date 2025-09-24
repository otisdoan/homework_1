"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Grid, List } from "lucide-react";
import ProductCard from "./ProductCard";
import { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
  onDelete?: (id: string) => void;
  itemsPerPage?: number;
}

export default function ProductGrid({
  products,
  onDelete,
  itemsPerPage = 12,
}: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top of products section
      const productsSection = document.getElementById("products");
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const goToPreviousPage = () => {
    goToPage(currentPage - 1);
  };

  const goToNextPage = () => {
    goToPage(currentPage + 1);
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* View Controls */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, products.length)} of{" "}
          {products.length} products
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">View:</span>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "grid"
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            title="Grid view"
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "list"
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            title="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Products Grid/List */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }
      >
        {currentProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onDelete={onDelete}
            viewMode={viewMode}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          {/* Page Numbers */}
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first page, last page, current page, and pages around current page
              const showPage =
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1);

              if (!showPage) {
                // Show ellipsis for gaps
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span
                      key={page}
                      className="px-3 py-2 text-sm text-gray-500"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              }

              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    page === currentPage
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Page Info */}
      <div className="text-center text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}
