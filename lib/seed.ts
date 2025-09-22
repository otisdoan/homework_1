import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create sample products
  const products = [
    {
      name: "Classic White T-Shirt",
      description:
        "A comfortable and versatile white cotton t-shirt perfect for everyday wear. Made from 100% organic cotton.",
      price: 24.99,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
    },
    {
      name: "Denim Blue Jeans",
      description:
        "Classic blue denim jeans with a modern fit. Perfect for casual outings and everyday wear.",
      price: 79.99,
      image:
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop",
    },
    {
      name: "Black Leather Jacket",
      description:
        "Premium black leather jacket with a timeless design. Made from genuine leather with a comfortable fit.",
      price: 199.99,
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop",
    },
    {
      name: "Red Summer Dress",
      description:
        "Elegant red summer dress perfect for warm weather. Lightweight and breathable fabric.",
      price: 89.99,
      image:
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=500&fit=crop",
    },
    {
      name: "White Sneakers",
      description:
        "Comfortable white sneakers with modern design. Perfect for both casual and athletic wear.",
      price: 129.99,
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop",
    },
    {
      name: "Gray Hoodie",
      description:
        "Soft and cozy gray hoodie with a relaxed fit. Perfect for lounging or casual outings.",
      price: 59.99,
      image:
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop",
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log("Sample products created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
