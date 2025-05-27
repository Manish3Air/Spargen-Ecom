"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { BorderBeam } from "@/components/magicui/border-beam";
import { toast } from "sonner";
export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = await register(form);
  
    setLoading(false);
    if (success) {
      toast.success("✅ Registered! Please log in.");
      router.push("/login");
    } else {
      console.log("Registration failed");
      setError("⚠️ Registration failed or email already in use.");
    }
  };

  const handleGoogleLogin = () => {
    toast.warning("🔄 Google login coming soon");
  };

  const handleFacebookLogin = () => {
    toast.warning("🔄 Facebook login coming soon");
  };

  return (
    <main className="min-h-screen flex items-center justify-center  bg-[#f0f5ff] dark:bg-[#0a0a0a] px-4 py-12 transition-colors duration-300">
      <div className="relative w-full max-w-md rounded-2xl">
      <form
        onSubmit={handleSubmit}
        className=" p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-neumorphic-inner dark:shadow-neumorphic-inner-dark space-y-6 transition-colors duration-300"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          Create your Account
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
          disabled={loading}
          className={`w-full py-2 rounded-xl font-semibold text-gray-800 bg-[#d1d9e6] hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-800 dark:text-white transition-all duration-200 shadow-neumorphic ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <div className="flex items-center justify-between gap-4">
          <SocialButton
            label="Google"
            onClick={handleGoogleLogin}
            className="bg-red-500 hover:bg-red-600 text-white"
          />
          <SocialButton
            label="Facebook"
            onClick={handleFacebookLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          />
        </div>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          Already Have an Account?
          <Link
            href="/login"
            className="ml-2 text-blue-500  hover:underline hover:text-blue-700"
          >
            Login
          </Link>
        </p>
      </form>

      <BorderBeam
        duration={6}
        size={400}
        className="from-transparent via-red-500 to-transparent"
      />

      <BorderBeam
        duration={6}
        delay={3}
        size={400}
        className="from-transparent via-blue-500 to-transparent"
      />
      </div>
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

function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}: InputFieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required
        className="w-full p-3 rounded-xl bg-[#f5f6fa] dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-100 shadow-inner dark:shadow-inner-dark placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
    </div>
  );
}

interface SocialButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
}

function SocialButton({ label, onClick, className }: SocialButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium w-1/2 ${className}`}
    >
      {label}
    </button>
  );
}
