"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import BASE_URL from "../../../../../utils/api";
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
  const token = localStorage.getItem("authToken");
  
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
  if (!files) return;

  setUploading(true);
  const uploadedImages: string[] = [];
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

    // Get folder(s) path between "upload" and filename
    const uploadIndex = urlParts.findIndex(part => part === "upload");
    const folders = urlParts.slice(uploadIndex + 1, urlParts.length - 1).join("/");

    // Construct public_id
    return folders ? `${folders}/${filename}` : filename;
  } catch {
    return null;
  }
};

const handleRemoveImage = async (index: number) => {
  const imageUrl = form.images[index];
  const publicId = getPublicIdFromUrl(imageUrl);

  if (!publicId) {
    console.error("Invalid image URL, cannot extract public_id");
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
    <main className="p-6 bg-[#f0f5ff] dark:bg-black min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 p-4 rounded shadow space-y-6 max-w-5xl"
      >
        <h1 className="text-2xl font-bold  text-gray-800 dark:text-white">
          ✏️ Edit Product
        </h1>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-2 rounded border border-gray-300"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 rounded border border-gray-300"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full p-2 rounded border border-gray-300"
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          className="w-full p-2 rounded border border-gray-300"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-2 rounded border border-gray-300"
        />
        <input
          type="number"
          step="0.1"
          name="ratings"
          placeholder="Ratings"
          value={form.ratings}
          onChange={handleChange}
          className="w-full p-2 rounded border border-gray-300"
        />

        {/* Image Upload */}
        <div>
          <label className="block mb-2 text-gray-700 dark:text-white font-medium">
            Product Images
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-3 w-full p-2 rounded border border-gray-300"
          />
          {uploading && <p className="text-blue-600">Uploading images...</p>}
          <div className="flex flex-wrap gap-4 border-2 p-2">
            {form.images.map((url, index) => (
              <div
                key={index}
                className="relative w-24 h-24 border rounded overflow-hidden"
              >
                <Image
                  src={url}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs"
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
          className={`bg-[#d1d9e6] hover:bg-gray-300 cursor-pointer px-4 py-2 rounded font-medium text-gray-800
          ${updating ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {updating ? "Updating" : "Update"}
        </button>
      </form>
    </main>
  );
}
