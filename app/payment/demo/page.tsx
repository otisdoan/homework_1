"use client";

import { useCart } from "@/contexts/CartContext";
import { CheckCircle, XCircle, CreditCard, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function PaymentDemoPage() {
  const { cart, clearCart } = useCart();
  const [status, setStatus] = useState<"processing" | "success" | "failed">(
    "processing"
  );
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Simulate payment processing
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setStatus("success");
          clearCart();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [clearCart]);

  const handleCancel = () => {
    setStatus("failed");
  };

  if (status === "processing") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Processing Payment...
            </h1>
            <p className="text-gray-600">
              Please wait while we process your payment
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Redirecting in {countdown} seconds
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                Order Summary
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Items ({cart.itemCount})</span>
                  <span>{cart.total.toLocaleString("vi-VN")} VND</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-1 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{cart.total.toLocaleString("vi-VN")} VND</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCancel}
              className="w-full text-red-600 hover:text-red-700 font-medium"
            >
              Cancel Payment
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600">
              Thank you for your purchase. Your order has been processed
              successfully.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/products"
              className="w-full inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <CreditCard className="h-5 w-5" />
              <span>Continue Shopping</span>
            </Link>

            <Link
              href="/"
              className="w-full inline-flex items-center justify-center text-gray-600 hover:text-gray-800 font-medium"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Cancelled
            </h1>
            <p className="text-gray-600">
              Your payment was cancelled. No charges have been made.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/cart"
              className="w-full inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Cart</span>
            </Link>

            <Link
              href="/products"
              className="w-full inline-flex items-center justify-center text-gray-600 hover:text-gray-800 font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
