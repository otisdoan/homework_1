"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export default function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: SimplePaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      // Scroll to top of products section
      const productsSection = document.getElementById("products");
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 mt-8">
      {/* Items info */}
      <div className="text-sm text-gray-600">
        Showing {startItem}-{endItem} of {totalItems} products
      </div>

      {/* Pagination controls */}
      <div className="flex items-center space-x-2">
        {/* Previous button */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page numbers */}
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
                  <span key={page} className="px-3 py-2 text-sm text-gray-500">
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

        {/* Next button */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Page info */}
      <div className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}
