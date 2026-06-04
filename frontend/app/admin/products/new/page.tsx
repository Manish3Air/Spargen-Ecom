"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import BASE_URL from "@/utils/api";
import { uploadProductImages } from "@/utils/cloudinaryUpload";
import { toast } from "sonner";
import Image from "next/image";

export default function AddProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    ratings: "",
    images: [] as string[],
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" || name === "ratings" ? Number(value) : value,
    }));
  };

  // const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = e.target.files;
  //   if (!files) return;

  //   setUploading(true);
  //   const uploadedImages: string[] = [];

  //   for (let i = 0; i < files.length; i++) {
  //     const formData = new FormData();
  //     formData.append("file", files[i]);
  //     formData.append("upload_preset", "Spargen_Products_Images");
  //     formData.append("cloud_name", "duakao1bu");

  //     const res = await fetch("https://api.cloudinary.com/v1_1/duakao1bu/image/upload", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     const data = await res.json();
  //     uploadedImages.push(data.secure_url);
  //   }

  //   setForm((prev) => ({ ...prev, images: [...prev.images, ...uploadedImages] }));
  //   setUploading(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.price || form.images.length === 0) {
      toast.warning("Please fill in all required fields.");
      return;
    }
      const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(`${BASE_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success("✅ Product added!");
        router.push("/admin/products");
      } else {
        const data = await res.json();
        toast.warning("❌ Failed: " + data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Error adding product.");
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
          Inventory
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
          Add new product
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
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-blue-950"
          required
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
          <span>Stock availability</span>
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
          max="5"
          name="ratings"
          placeholder="Ratings (0-5)"
          value={form.ratings}
          onChange={handleChange}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-blue-950"
        />
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-zinc-300 lg:col-span-2">
          <span>Product Description</span>
        <textarea
          name="description"
          placeholder="Product Description (optional)"
          value={form.description}
          onChange={handleChange}
          className="min-h-28 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-blue-950"
        />
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-zinc-300 lg:col-span-2">
          <span>Upload multiple images</span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="w-full rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
        />
        </label>
        {uploading && (
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 lg:col-span-2">
            Uploading images...
          </p>
        )}
        <div className="flex flex-wrap gap-2 lg:col-span-2">
          {form.images.map((url, idx) => (
            <Image
              key={idx}
              src={url}
              alt={`Uploaded ${idx}`}
              width={96}
              height={96}
              className="h-24 w-24 rounded-md border border-slate-200 object-cover dark:border-zinc-700"
            />
          ))}
        </div>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto lg:col-span-2"
        >
          Add Product
        </button>
      </form>
    </section>
  );
}
