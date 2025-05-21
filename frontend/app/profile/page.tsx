"use client";

import { useAuth, User } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserCircle, PackageCheck } from "lucide-react";

export default function ProfilePage() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "" });

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    } else {
      setForm({ name: currentUser.name, email: currentUser.email });
    }
  }, [currentUser, router]);

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim())
      return alert("⚠️ All fields are required");

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map((u: User) =>
      u.email === currentUser?.email ? { ...u, ...form } : u
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("authUser", JSON.stringify(form));
    alert("✅ Profile updated. Please log in again.");
    logout();
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-[#f0f5ff] dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-xl shadow-neumorphic dark:shadow-md space-y-5">
        <div className="flex flex-col items-center gap-2">
          <UserCircle className="w-16 h-16 text-gray-400 dark:text-gray-300" />
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your personal information and account details.
          </p>
        </div>

        <div className="space-y-3">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-2 rounded shadow-inner bg-gray-100 dark:bg-gray-700 text-sm"
            placeholder="Name"
          />
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-2 rounded shadow-inner bg-gray-100 dark:bg-gray-700 text-sm"
            placeholder="Email"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => router.push("/orders")}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-medium transition"
          >
            <PackageCheck className="w-4 h-4" />
            My Orders
          </button>

          <button
            onClick={handleSave}
            className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 rounded font-medium transition"
          >
            Save & Logout
          </button>
        </div>
      </div>
    </main>
  );
}
