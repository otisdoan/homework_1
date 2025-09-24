import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { CreateProductData } from "@/types/product";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await prisma.products.count();

    // Get paginated products
    const productsList = await prisma.products.findMany({
      skip,
      take: limit,
      orderBy: {
        createdat: "desc",
      },
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      products: productsList,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
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
