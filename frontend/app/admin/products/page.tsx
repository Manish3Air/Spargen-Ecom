"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BASE_URL from "@/utils/api";
import {toast} from "sonner";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  description?: string;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${BASE_URL}/api/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch");
      setProducts(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
      toast.error(err.message);
      }else{
        console.error("An unexpected error occurred:", err);
      }
    } finally {
      setLoading(false);
    }
  };

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
      setProducts(products.filter((p) => p._id !== id));
      toast.success("✅ Product deleted");
    } catch (err: unknown) {
      if (err instanceof Error) {
      toast.error(err.message);
      }else{
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
  }, [router]);

  return (
    <main className="p-6 bg-[#f0f5ff] dark:bg-black min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700 dark:text-white">
          📦 Products
        </h1>
        <button
          onClick={() => router.push("/admin/products/new")}
          className="cursor-pointer bg-[#d1d9e6] hover:bg-gray-300 text-black text-sm px-4 py-2 rounded shadow"
        >
          ➕ Add Product
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600 dark:text-white">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-600 dark:text-white">No products found.</p>
      ) : (
        <table className="w-full text-sm bg-[#f0f5ff] dark:bg-gray-900 rounded shadow">
          <thead className="bg-gray-300 dark:bg-gray-800 text-left">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              
              <tr key={product._id} className="border-t">
                <td className="p-3 w-[160px] flex justify-start gap-2">
                  {product.images?.map((imgUrl, index) => (
                    <Image
                      key={index}
                      src={imgUrl || "/placeholder.png"}
                      alt={`${product.name} ${index + 1}`}
                      width={60}
                      height={30}
                      className="object-contain"
                    />
                  ))}
                </td>
                <td className="p-3 font-medium">{product.name}</td>
                <td className="p-3 text-black dark:text-gray-300">
                  ${product.price}
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() =>
                      router.push(`/admin/products/${product._id}/edit`)
                    }
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
