import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { Trash2, Edit, Eye, Heart } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onDelete?: (id: string) => void;
}

export default function ProductCard({ product, onDelete }: ProductCardProps) {
  const handleDelete = () => {
    if (onDelete && confirm("Are you sure you want to delete this product?")) {
      onDelete(product.id);
    }
  };

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

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">
              ${product.price}
            </span>
            <span className="text-sm text-gray-500 line-through">$99.99</span>
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
          <Link
            href={`/products/${product.id}`}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium text-sm"
          >
            View Details
          </Link>

          <Link
            href={`/products/${product.id}/edit`}
            className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition-colors"
            title="Edit product"
          >
            <Edit className="h-4 w-4" />
          </Link>

          {onDelete && (
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
