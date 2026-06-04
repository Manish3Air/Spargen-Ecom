"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import BASE_URL from "../../../../../utils/api";
import { uploadProductImages } from "@/utils/cloudinaryUpload";
import { toast } from "sonner";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  ratings: number;
  images: string[];
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [form, setForm] = useState<Product>({
    _id: "",
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    ratings: 0,
    images: [],
  });

  useEffect(() => {
    const stored = localStorage.getItem("authUser");
    if (!stored) return router.push("/login");

    const user = JSON.parse(stored);
    if (user.role !== "admin") return router.push("/login");

    if (!productId) {
      return;
    }

    fetch(`${BASE_URL}/api/products/${productId}`, {
    })
      .then((res) => res.json())
      .then((data) => setForm(data))
      .catch(() => {
        toast.warning("Product not found");
        router.push("/admin/products");
      });
  }, [productId, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) return;
    setUpdating(true);

    try {
      console.log("handle submit...", productId);
      const res = await fetch(`${BASE_URL}/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
          ratings: Number(form.ratings),
        }),
      });

      if (!res.ok) throw new Error("Failed to update product");
      toast.success("✅ Product updated!");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update product");
    } finally {
      console.log("Inside finally");
      setUpdating(false);
    }
  };

  // const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;
  //   setUploading(true);
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("upload_preset", "Spargen_Products_Images");

  //   try {
  //     const res = await fetch(
  //       `https://api.cloudinary.com/v1_1/duakao1bu/image/upload`,
  //       {
  //         method: "POST",
  //         body: formData,
  //       }
  //     );

  //     const data = await res.json();
  //     setForm((prev) => ({
  //       ...prev,
  //       images: [...prev.images, data.secure_url],
  //     }));
  //   } catch (error) {
  //     console.error("Image upload failed", error);
  //     alert("Image upload failed");
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Please log in again before uploading images.");
      return;
    }

    setUploading(true);
    try {
      const uploadedImages = await uploadProductImages(files, token);
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));
      toast.success("Images uploaded.");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const getPublicIdFromUrl = (url: string) => {
  // Cloudinary URL structure example:
  // https://res.cloudinary.com/<cloud_name>/image/upload/v1234567890/folder_name/public_id.jpg
  // This extracts folder_name/public_id without extension.
  
  try {
    const urlParts = url.split("/");
    // Get last part (filename with extension)
    const filenameWithExt = urlParts[urlParts.length - 1]; 
    // Remove extension
    const filename = filenameWithExt.split(".")[0];

    const uploadIndex = urlParts.findIndex(part => part === "upload");
    const publicPathParts = urlParts.slice(uploadIndex + 1, urlParts.length - 1);
    const folders = publicPathParts
      .filter((part) => !/^v\d+$/.test(part))
      .join("/");

    // Construct public_id
    return folders ? `${folders}/${filename}` : filename;
  } catch {
    return null;
  }
};

const handleRemoveImage = async (index: number) => {
  const imageUrl = form.images[index];
  const publicId = getPublicIdFromUrl(imageUrl);
  const token = localStorage.getItem("authToken");

  if (!publicId) {
    console.error("Invalid image URL, cannot extract public_id");
    return;
  }

  if (!token) {
    toast.error("Please log in again before deleting images.");
    return;
  }

  try {
    // Call backend to delete from Cloudinary
    const res = await fetch(`${BASE_URL}/api/cloudinary/delete-image`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ public_id: publicId }),
    });

    const data = await res.json();

    if (!data.success) {
      console.error("Failed to delete image from Cloudinary");
      return;
    }

    // Update form images state to remove URL
    const updatedImages = [...form.images];
    updatedImages.splice(index, 1);
    setForm({ ...form, images: updatedImages });

    // TODO: Optionally call backend API to update your MongoDB document to remove the image URL from product

  } catch (error) {
    console.error("Error removing image:", error);
  }
};


  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
          Inventory
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
          Edit product
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6 lg:grid-cols-2"
      >
        <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-zinc-300">
          <span>Product Name</span>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-blue-950"
        />
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-zinc-300 lg:col-span-2">
          <span>Description</span>
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="min-h-28 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-blue-950"
        />
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-zinc-300">
          <span>Price</span>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-blue-950"
          required
        />
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-zinc-300">
          <span>Stock</span>
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-blue-950"
        />
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-zinc-300">
          <span>Category</span>
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-blue-950"
        />
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-zinc-300">
          <span>Rating</span>
        <input
          type="number"
          step="0.1"
          name="ratings"
          placeholder="Ratings"
          value={form.ratings}
          onChange={handleChange}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-blue-950"
        />
        </label>

        {/* Image Upload */}
        <div className="lg:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
            Product images
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-3 w-full rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
          />
          {uploading && (
            <p className="mb-3 text-sm font-medium text-blue-600 dark:text-blue-400">
              Uploading images...
            </p>
          )}
          <div className="grid grid-cols-2 gap-3 rounded-md border border-slate-200 p-3 dark:border-zinc-800 sm:grid-cols-4 md:grid-cols-6">
            {form.images.map((url, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-md border border-slate-200 bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800"
              >
                <Image
                  src={url}
                  alt={`Product ${index + 1}`}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={updating}
          className={`inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto lg:col-span-2
          ${updating ? "cursor-not-allowed opacity-50" : ""}`}
        >
          {updating ? "Updating" : "Update"}
        </button>
      </form>
    </section>
  );
}
