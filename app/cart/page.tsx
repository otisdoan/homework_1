"use client";

import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Plus, Minus, Trash2, CreditCard } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { cart, updateCartItem, removeFromCart, clearCart, loading } =
    useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleQuantityChange = async (
    productId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) {
      await removeFromCart(productId);
    } else {
      await updateCartItem(productId, { quantity: newQuantity });
    }
  };

  const handleCheckout = async () => {
    if (cart.items.length === 0) {
      alert("Giỏ hàng trống! Vui lòng thêm sản phẩm trước khi thanh toán.");
      return;
    }

    setIsCheckingOut(true);
    try {
      console.log("Starting checkout process...", {
        items: cart.items,
        total: cart.total,
        itemCount: cart.itemCount,
      });

      // Validate cart items
      const validItems = cart.items.filter(
        (item) =>
          item.productId && item.name && item.price > 0 && item.quantity > 0
      );

      if (validItems.length === 0) {
        throw new Error("Không có sản phẩm hợp lệ trong giỏ hàng");
      }

      // PayOS integration
      const response = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: validItems,
          total: cart.total,
        }),
      });

      console.log(
        "Payment API response:",
        response.status,
        response.statusText
      );
      const data = await response.json();
      console.log("Payment API data:", data);

      if (!response.ok) {
        if (data.fallback) {
          // PayOS failed, show demo payment
          console.log("PayOS failed, redirecting to demo...");
          window.location.href = "/payment/demo";
          return;
        }
        if (response.status === 401) {
          // Authentication error
          alert(
            "Bạn cần đăng nhập để thanh toán. Chuyển đến trang đăng nhập..."
          );
          window.location.href = "/auth/login?redirect=/cart";
          return;
        }
        throw new Error(data.error || "Failed to create payment order");
      }

      if (data.demo) {
        // Demo mode
        console.log("Using demo payment:", data.paymentUrl);
        window.location.href = data.paymentUrl;
      } else if (data.paymentUrl) {
        // Real PayOS payment
        console.log("Using PayOS payment:", data.paymentUrl);
        window.location.href = data.paymentUrl;
      } else {
        // Fallback to demo if no payment URL
        console.log("No payment URL, using demo...");
        window.location.href = "/payment/demo";
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert(
        `Lỗi thanh toán: ${
          error instanceof Error ? error.message : "Lỗi không xác định"
        }. Chuyển đến trang demo thanh toán...`
      );
      // Fallback to demo payment on any error
      window.location.href = "/payment/demo";
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading cart...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-2 mb-8">
          <ShoppingCart className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        </div>

        {cart.items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-8">
              Add some products to get started!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="h-5 w-5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Cart Items ({cart.itemCount})
                    </h2>
                    <button
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {cart.items.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-center space-x-4">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {item.price.toLocaleString("vi-VN")} VND each
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId,
                                  item.quantity - 1
                                )
                              }
                              className="p-1 rounded-full hover:bg-gray-100"
                              disabled={loading}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                              className="p-1 rounded-full hover:bg-gray-100"
                              disabled={loading}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">
                              {(item.price * item.quantity).toLocaleString(
                                "vi-VN"
                              )}{" "}
                              VND
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow sticky top-8">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Order Summary
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        {cart.total.toLocaleString("vi-VN")} VND
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">0 VND</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>{cart.total.toLocaleString("vi-VN")} VND</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut || loading}
                    className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2"
                  >
                    <CreditCard className="h-5 w-5" />
                    <span>
                      {isCheckingOut ? "Processing..." : "Proceed to Payment"}
                    </span>
                  </button>
                  <Link
                    href="/products"
                    className="block w-full mt-3 text-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
