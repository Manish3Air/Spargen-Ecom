"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = register(form);
    if (success) {
      alert("✅ Registered! Please log in.");
      router.push("/login");
    } else {
      alert("⚠️ Email already in use");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#e0e5ec] dark:bg-gray-900 transition-colors">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-neumorphic dark:shadow-neumorphic-dark space-y-6 transition-colors"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">
          Create an Account
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-4 py-2 rounded-lg bg-[#f5f6fa] dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-100 shadow-inner dark:shadow-inner-dark placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-4 py-2 rounded-lg bg-[#f5f6fa] dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-100 shadow-inner dark:shadow-inner-dark placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full px-4 py-2 rounded-lg bg-[#f5f6fa] dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-100 shadow-inner dark:shadow-inner-dark placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
        />

        <button
          type="submit"
          className="w-full py-2 bg-[#d1d9e6] dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition"
        >
          Register
        </button>
      </form>
    </main>
  );
}
