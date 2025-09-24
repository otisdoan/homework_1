"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  return <ProductDetailClient productId={id} />;
}

function ProductDetailClient({ productId }: { productId: string }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Product not found");
        }
        throw new Error("Failed to fetch product");
      }
      const data = await response.json();
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!product || !confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      router.push("/");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Loading product...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-red-600 mb-4">Error: {error}</div>
            <Link
              href="/"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Products</span>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  width={600}
                  height={400}
                  className="w-full h-64 md:h-full object-cover"
                />
              ) : (
                <div className="w-full h-64 md:h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-lg">
                    No image available
                  </span>
                </div>
              )}
            </div>

            <div className="md:w-1/2 p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <div className="flex space-x-2">
                  <Link
                    href={`/products/${product.id}/edit`}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="Edit product"
                  >
                    <Edit className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Delete product"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-bold text-blue-600">
                  ${product.price}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="text-sm text-gray-500">
                <p>
                  Created: {new Date(product.createdAt).toLocaleDateString()}
                </p>
                <p>
                  Updated: {new Date(product.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
