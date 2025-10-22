import { NextRequest, NextResponse } from "next/server";
import payos from "@/lib/payos";

export async function POST(request: NextRequest) {
  try {
    const webhookData = await request.json();

    console.log("PayOS webhook received:", webhookData);

    // Verify webhook data
    const isValid = payos.verifyPaymentWebhookData(webhookData);

    if (isValid && webhookData.code === "00") {
      console.log("Payment successful:", {
        orderCode: webhookData.orderCode,
        amount: webhookData.amount,
        description: webhookData.description,
      });

      // Here you can update your database, send confirmation email, etc.
      // For now, just log the success

      return NextResponse.json({
        success: true,
        message: "Payment processed successfully",
      });
    } else {
      console.log("Payment failed or invalid webhook:", webhookData);
      return NextResponse.json({
        success: false,
        message: "Payment failed or invalid webhook",
      });
    }
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
