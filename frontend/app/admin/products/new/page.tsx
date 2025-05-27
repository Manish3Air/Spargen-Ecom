"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import BASE_URL from "@/utils/api";
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
  if (!files) return;

  setUploading(true);
  const uploadedImages: string[] = [];
    const token = localStorage.getItem("authToken");
  for (let i = 0; i < files.length; i++) {
    // Fetch signature from backend
    const sigRes = await fetch(`${BASE_URL}/api/cloudinary/signature`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });


    if (!sigRes.ok) {
      console.error("Failed to get signature");
      continue;
    }
    const sigData = await sigRes.json();

    const formData = new FormData();
    formData.append("file", files[i]);
    formData.append("upload_preset", sigData.uploadPreset);
    formData.append("timestamp", sigData.timestamp.toString());
    formData.append("signature", sigData.signature);
    formData.append("api_key", sigData.apiKey);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.secure_url) {
      uploadedImages.push(data.secure_url);
    } else {
      console.error("Upload failed", data);
    }
  }

  setForm((prev) => ({ ...prev, images: [...prev.images, ...uploadedImages] }));
  setUploading(false);
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
    <main className="p-6 bg-[#f0f5ff] dark:bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">➕ Add New Product</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 p-6 rounded shadow space-y-4 max-w-xl"
      >
        <label className="text-lg text-black dark:text-gray-300"> Product Name </label>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 rounded border"
          required
        />
        <label className="text-lg text-black dark:text-gray-300"> Price </label>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full p-2 rounded border"
          required
        />
        <label className="text-lg text-black dark:text-gray-300"> stock availability </label>
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          className="w-full p-2 rounded border"
        />
        <label className="text-lg text-black dark:text-gray-300"> Category </label>
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-2 rounded border"
        />
        <label className="text-lg text-black dark:text-gray-300"> Rating </label>
        <input
          type="number"
          step="0.1"
          max="5"
          name="ratings"
          placeholder="Ratings (0-5)"
          value={form.ratings}
          onChange={handleChange}
          className="w-full p-2 rounded border"
        />
        <label className="text-lg text-black dark:text-gray-300"> Product Description </label>
        <textarea
          name="description"
          placeholder="Product Description (optional)"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 rounded border"
        />
        <label className="text-lg text-black dark:text-gray-300"> Upload multiple images </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="w-full p-2 rounded border"
        />
        {uploading && <p className="text-blue-600">Uploading images...</p>}
        <div className="flex gap-2 flex-wrap">
          {form.images.map((url, idx) => (
            <Image
              key={idx}
              src={url}
              alt={`Uploaded ${idx}`}
              className="w-24 h-24 object-cover rounded border"
            />
          ))}
        </div>

        <button
          type="submit"
          className="bg-[#d1d9e6] hover:bg-gray-300 px-4 py-2 rounded font-medium text-gray-800"
        >
          Add Product
        </button>
      </form>
    </main>
  );
}
