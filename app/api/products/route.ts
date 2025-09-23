import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { CreateProductData } from "@/types/product";

export async function GET() {
  try {
    const productsList = await prisma.products.findMany();
    return NextResponse.json(productsList);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateProductData = await request.json();

    // Validate required fields
    if (!body.name || !body.description || body.price === undefined) {
      return NextResponse.json(
        { error: "Name, description, and price are required" },
        { status: 400 }
      );
    }

    // Validate price is positive
    if (body.price < 0) {
      return NextResponse.json(
        { error: "Price must be a positive number" },
        { status: 400 }
      );
    }

    const product = await prisma.products.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        image: body.image || null,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
