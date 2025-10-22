import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const COOKIE_NAME = "token";

async function getUserId(request: NextRequest): Promise<string | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      sub: string;
      email: string;
    };
    return payload.sub;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, total } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    // Check if PayOS credentials are configured
    if (
      !process.env.PAYOS_CLIENT_ID ||
      !process.env.PAYOS_API_KEY ||
      !process.env.PAYOS_CHECKSUM_KEY
    ) {
      console.log("PayOS credentials not configured, using demo mode");
      // Demo mode - return a mock payment URL
      return NextResponse.json({
        orderCode: Math.floor(Math.random() * 1000000),
        paymentUrl: "/payment/demo",
        demo: true,
      });
    }

    try {
      // Create order data for PayOS
      const orderCode = Math.floor(Math.random() * 1000000);
      const paymentData = {
        orderCode: orderCode,
        amount: Math.round(total), // PayOS expects amount in VND (not cents)
        description: `Thanh toán đơn hàng - ${items.length} sản phẩm`,
        items: items.map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          price: Math.round(item.price),
        })),
        returnUrl: `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3002"
        }/payment/success`,
        cancelUrl: `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3002"
        }/cart`,
      };

      console.log("Creating PayOS payment with data:", paymentData);

      // Create payment link using PayOS API directly
      const payosResponse = await fetch(
        "https://api-merchant.payos.vn/v2/payment-requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-client-id": process.env.PAYOS_CLIENT_ID,
            "x-api-key": process.env.PAYOS_API_KEY,
          },
          body: JSON.stringify(paymentData),
        }
      );

      if (!payosResponse.ok) {
        const errorData = await payosResponse.json();
        console.error("PayOS API error:", errorData);
        return NextResponse.json(
          {
            error: "Failed to create payment order",
            details: errorData,
            fallback: true,
          },
          { status: 500 }
        );
      }

      const paymentData_response = await payosResponse.json();

      return NextResponse.json({
        orderCode: orderCode,
        paymentUrl: paymentData_response.checkoutUrl,
        qrCode: paymentData_response.qrCode,
      });
    } catch (payosError) {
      console.error("PayOS API error:", payosError);
      return NextResponse.json(
        {
          error: "Failed to create payment order",
          details:
            payosError instanceof Error
              ? payosError.message
              : "Unknown PayOS error",
          fallback: true,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Create payment order error", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
