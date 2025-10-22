import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { items, total } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    // Always use demo mode for testing
    console.log("Using demo mode for testing");
    return NextResponse.json({
      orderCode: Math.floor(Math.random() * 1000000),
      paymentUrl: "/payment/demo",
      demo: true,
    });
  } catch (error) {
    console.error("Test payment error", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
