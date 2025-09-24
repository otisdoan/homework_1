"use client";

import { useState } from "react";
import { Star, ThumbsUp, ThumbsDown, User, MessageCircle } from "lucide-react";

interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  avatar?: string;
  verified: boolean;
}

interface ProductReviewsProps {
  productId: string;
}

// Mock reviews data - in real app, this would come from API
const mockReviews: Review[] = [
  {
    id: 1,
    user: "John D.",
    rating: 5,
    comment:
      "Excellent quality! The material feels premium and the fit is perfect. Highly recommend this product to anyone looking for good value.",
    date: "2024-01-15",
    helpful: 12,
    verified: true,
  },
  {
    id: 2,
    user: "Sarah M.",
    rating: 4,
    comment:
      "Great product overall. The design is beautiful and it arrived quickly. Only minor issue is the sizing runs slightly small.",
    date: "2024-01-10",
    helpful: 8,
    verified: true,
  },
  {
    id: 3,
    user: "Mike R.",
    rating: 5,
    comment:
      "Outstanding! Exceeded my expectations. The attention to detail is impressive and customer service was excellent.",
    date: "2024-01-05",
    helpful: 15,
    verified: false,
  },
  {
    id: 4,
    user: "Emily W.",
    rating: 4,
    comment:
      "Good product for the price. Quality is solid and it looks exactly like the photos. Would buy again.",
    date: "2024-01-01",
    helpful: 6,
    verified: true,
  },
];

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "rating-high" | "rating-low" | "helpful"
  >("newest");

  const averageRating =
    mockReviews.reduce((sum, review) => sum + review.rating, 0) /
    mockReviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: mockReviews.filter((review) => review.rating === rating).length,
    percentage:
      (mockReviews.filter((review) => review.rating === rating).length /
        mockReviews.length) *
      100,
  }));

  const sortedReviews = [...mockReviews].sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "rating-high":
        return b.rating - a.rating;
      case "rating-low":
        return a.rating - b.rating;
      case "helpful":
        return b.helpful - a.helpful;
      default: // newest
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const displayedReviews = showAll ? sortedReviews : sortedReviews.slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <MessageCircle className="h-6 w-6 mr-2" />
          Customer Reviews
        </h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="rating-high">Highest Rating</option>
          <option value="rating-low">Lowest Rating</option>
          <option value="helpful">Most Helpful</option>
        </select>
      </div>

      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-6 w-6 ${
                  i < Math.round(averageRating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="text-gray-600">
            Based on {mockReviews.length} reviews
          </div>
        </div>

        <div className="space-y-2">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center text-sm">
              <span className="w-8">{rating}</span>
              <Star className="h-4 w-4 text-yellow-400 fill-current mr-2" />
              <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="w-8 text-gray-600">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {displayedReviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-gray-200 pb-6 last:border-b-0"
          >
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      {review.user}
                    </span>
                    {review.verified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDate(review.date)}
                  </span>
                </div>

                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">
                  {review.comment}
                </p>

                <div className="flex items-center space-x-4 text-sm">
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors">
                    <ThumbsUp className="h-4 w-4" />
                    <span>Helpful ({review.helpful})</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors">
                    <ThumbsDown className="h-4 w-4" />
                    <span>Not helpful</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More/Less Button */}
      {mockReviews.length > 3 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {showAll ? "Show Less" : `Show All ${mockReviews.length} Reviews`}
          </button>
        </div>
      )}

      {/* Write Review Button */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium">
          Write a Review
        </button>
      </div>
    </div>
  );
}
