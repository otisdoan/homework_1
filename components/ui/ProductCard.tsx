import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { Trash2, Edit, Eye, Heart, ShoppingCart } from "lucide-react";
import { formatVND } from "@/lib/currency";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  product: Product;
  onDelete?: (id: string) => void;
  viewMode?: "grid" | "list";
}

export default function ProductCard({
  product,
  onDelete,
  viewMode = "grid",
}: ProductCardProps) {
  const [isAuthed, setIsAuthed] = useState(false);
  const { addToCart, loading } = useCart();

  useEffect(() => {
    setIsAuthed(
      typeof document !== "undefined" && document.cookie.includes("token=")
    );
  }, []);

  const handleAddToCart = async () => {
    try {
      await addToCart({
        productId: product.id,
        quantity: 1,
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };
  const handleDelete = () => {
    if (onDelete && confirm("Are you sure you want to delete this product?")) {
      onDelete(product.id);
    }
  };

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex">
        <div className="relative w-48 h-32 flex-shrink-0">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400 text-2xl mb-1">📦</div>
                <span className="text-gray-400 text-xs">No image</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-3">
                {product.description}
              </p>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <Link
                href={`/products/${product.id}`}
                className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition-colors"
                title="View details"
              >
                <Eye className="h-4 w-4" />
              </Link>
              {isAuthed && (
                <Link
                  href={`/products/${product.id}/edit`}
                  className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Edit product"
                >
                  <Edit className="h-4 w-4" />
                </Link>
              )}
              {onDelete && isAuthed && (
                <button
                  onClick={handleDelete}
                  className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors"
                  title="Delete product"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-blue-600">
                {formatVND(product.price)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                2.399.760 VND
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-sm">
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">(4.8)</span>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-500">
            <p>Added {new Date(product.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
      <div className="relative overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={200}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center">
              <div className="text-gray-400 text-4xl mb-2">📦</div>
              <span className="text-gray-400 text-sm">No image</span>
            </div>
          </div>
        )}

        {/* Overlay with actions */}
        <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
            <Link
              href={`/products/${product.id}`}
              className="bg-white text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors"
              title="View details"
            >
              <Eye className="h-4 w-4" />
            </Link>
            <button
              className="bg-white text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
              title="Add to favorites"
            >
              <Heart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">
              {formatVND(product.price)}
            </span>
            <span className="text-sm text-gray-500 line-through">
              2.399.760 VND
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-sm">
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">(4.8)</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleAddToCart}
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-center font-medium text-sm flex items-center justify-center space-x-1"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>

          <Link
            href={`/products/${product.id}`}
            className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition-colors"
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </Link>

          {isAuthed && (
            <Link
              href={`/products/${product.id}/edit`}
              className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition-colors"
              title="Edit product"
            >
              <Edit className="h-4 w-4" />
            </Link>
          )}

          {onDelete && isAuthed && (
            <button
              onClick={handleDelete}
              className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors"
              title="Delete product"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-3 text-xs text-gray-500">
          <p>Added {new Date(product.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
