"use client";

import { useCart } from "@/contexts/CartContext";
import { CheckCircle, ShoppingBag, ArrowRight, QrCode } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PaymentSuccessPage() {
  const { clearCart } = useCart();
  const [qrCode, setQrCode] = useState<string | null>(null);

  useEffect(() => {
    // Clear cart after successful payment
    clearCart();

    // Check if there's a QR code in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const qr = urlParams.get("qr");
    if (qr) {
      setQrCode(qr);
    }
  }, [clearCart]);

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

          {qrCode && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <QrCode className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  QR Code
                </span>
              </div>
              <img
                src={qrCode}
                alt="Payment QR Code"
                className="mx-auto max-w-32 h-32 object-contain"
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Link
            href="/products"
            className="w-full inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Continue Shopping</span>
            <ArrowRight className="h-4 w-4" />
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
