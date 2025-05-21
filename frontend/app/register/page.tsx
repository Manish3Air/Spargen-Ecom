"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = register(form);
    if (success) {
      alert("✅ Registered! Please log in.");
      router.push("/login");
    } else {
      setError("⚠️ Email already in use");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center  bg-[#f0f5ff] dark:bg-[#0a0a0a] px-4 py-12 transition-colors duration-300">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-neumorphic-inner dark:shadow-neumorphic-inner-dark space-y-6 transition-colors duration-300"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          Create an Account
        </h1>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <InputField
          label="Full Name"
          type="text"
          placeholder="Manish Raj Pandey"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <InputField
          label="Email"
          type="email"
          placeholder="manish@tech.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <InputField
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          type="submit"
          className="w-full py-2 rounded-xl font-semibold text-gray-800 bg-[#d1d9e6] hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white transition-all duration-200 shadow-neumorphic"
        >
          Register
        </button>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
        Already Have an Account?
        <a href="/login" className="ml-2 text-blue-500  hover:underline hover:text-blue-700">
          Login
        </a>
      </p>
      </form>
      
    </main>
  );
}

interface InputFieldProps {
  label: string;
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function InputField({ label, type = "text", value, onChange,placeholder }: InputFieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required
        className="w-full p-3 rounded-xl bg-[#f5f6fa] dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-100 shadow-inner dark:shadow-inner-dark placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
    </div>
  );
}
