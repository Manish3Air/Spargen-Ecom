"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BASE_URL from "@/utils/api";
import { toast } from "sonner";
import {
  Edit,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Search,
} from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  description?: string;
}

const ITEMS_PER_PAGE = 12;

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${BASE_URL}/api/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch products");
      setProducts(data);
      setCurrentPage(1);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        console.error("An unexpected error occurred:", err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${BASE_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Delete failed");
      setProducts((current) => current.filter((p) => p._id !== id));
      toast.success("Product deleted successfully");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        console.error("An unexpected error occurred:", err);
      }
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("authUser");
    const user = stored ? JSON.parse(stored) : null;
    if (!user || user.role !== "admin") {
      router.push("/login");
    } else {
      fetchProducts();
    }
  }, [router, fetchProducts]);

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Update page if search results are less than current page
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg border border-slate-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <div className="aspect-square w-full bg-slate-200 rounded dark:bg-zinc-700"></div>
            <div className="mt-3 h-4 w-3/4 bg-slate-200 rounded dark:bg-zinc-700"></div>
            <div className="mt-2 h-3 w-1/2 bg-slate-200 rounded dark:bg-zinc-700"></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            INVENTORY
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
            Products
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
            Manage {products.length} products
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/products/new")}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-95 sm:w-auto lg:px-6 lg:py-3"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : products.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <ImageOff className="mx-auto h-12 w-12 text-slate-300 dark:text-zinc-600" />
          <p className="mt-4 text-sm font-medium text-slate-600 dark:text-zinc-400">
            No products yet
          </p>
          <p className="text-xs text-slate-500 dark:text-zinc-500">
            Click Add Product to create your first product
          </p>
        </div>
      ) : (
        <>
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products by name..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500"
            />
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between text-sm">
            <p className="text-slate-600 dark:text-zinc-400">
              Showing{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {filteredProducts.length === 0
                  ? 0
                  : startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {Math.min(endIndex, filteredProducts.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {filteredProducts.length}
              </span>{" "}
              products
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <Search className="mx-auto h-12 w-12 text-slate-300 dark:text-zinc-600" />
              <p className="mt-4 text-sm font-medium text-slate-600 dark:text-zinc-400">
                No products found
              </p>
              <p className="text-xs text-slate-500 dark:text-zinc-500">
                Try adjusting your search terms
              </p>
            </div>
          ) : (
            <>
              {/* Products Grid - Mobile/Tablet */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
                {paginatedProducts.map((product) => (
                  <ProductCardMobile
                    key={product._id}
                    product={product}
                    onEdit={() =>
                      router.push(`/admin/products/${product._id}/edit`)
                    }
                    onDelete={() => deleteProduct(product._id)}
                  />
                ))}
              </div>

              {/* Products Grid - Desktop */}
              <div className="hidden grid-cols-2 gap-4 lg:grid lg:grid-cols-3 xl:grid-cols-4">
                {paginatedProducts.map((product) => (
                  <ProductCardDesktop
                    key={product._id}
                    product={product}
                    onEdit={() =>
                      router.push(`/admin/products/${product._id}/edit`)
                    }
                    onDelete={() => deleteProduct(product._id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`h-8 w-8 rounded-md text-sm font-semibold transition ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}

function ProductImageCarousel({
  images,
  productName,
}: {
  images: string[];
  productName: string;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const validImages = images?.filter((img) => img) ?? [];

  if (validImages.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg border border-slate-200 bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800">
        <ImageOff className="h-8 w-8 text-slate-400 dark:text-zinc-600" />
      </div>
    );
  }

  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) =>
      prev === 0 ? validImages.length - 1 : prev - 1
    );
  };

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) =>
      prev === validImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800">
      <Image
        src={validImages[currentImageIndex] || "/placeholder.png"}
        alt={`${productName} ${currentImageIndex + 1}`}
        fill
        className="object-contain"
        sizes="(max-width: 768px) 100vw, 300px"
      />

      {validImages.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white transition hover:bg-black/70"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white transition hover:bg-black/70"
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {validImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-1.5 w-1.5 rounded-full transition ${
                  index === currentImageIndex
                    ? "bg-white"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ProductCardMobile({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white shadow-sm transition hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900">
      <ProductImageCarousel
        images={product.images}
        productName={product.name}
      />
      <div className="p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-950 dark:text-white">
          {product.name}
        </h3>
        <p className="mt-2 text-lg font-bold text-blue-600 dark:text-blue-400">
          ₹{product.price.toLocaleString()}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={onEdit}
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100 active:scale-95 dark:border-blue-900/30 dark:bg-blue-950/20 dark:hover:bg-blue-950/40"
          >
            <Edit className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            onClick={onDelete}
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 active:scale-95 dark:border-red-900/30 dark:bg-red-950/20 dark:hover:bg-red-950/40"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

function ProductCardDesktop({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="group rounded-lg border border-slate-200 bg-white shadow-sm transition hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
      <div className="relative">
        <ProductImageCarousel
          images={product.images}
          productName={product.name}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-black/0 transition group-hover:bg-black/40">
          <button
            onClick={onEdit}
            className="pointer-events-auto rounded-full bg-white p-2 text-blue-600 shadow-lg transition hover:bg-blue-50 active:scale-95"
            aria-label={`Edit ${product.name}`}
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            onClick={onDelete}
            className="pointer-events-auto rounded-full bg-white p-2 text-red-600 shadow-lg transition hover:bg-red-50 active:scale-95"
            aria-label={`Delete ${product.name}`}
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-950 dark:text-white">
          {product.name}
        </h3>
        <p className="mt-2 text-lg font-bold text-blue-600 dark:text-blue-400">
          ₹{product.price.toLocaleString()}
        </p>
      </div>
    </article>
  );
}
