"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { BorderBeam } from "@/components/magicui/border-beam";
import { toast } from "sonner";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

export default function RegisterPage() {
  const { register, handleGoogleLogin } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = await register(form);
    setLoading(false);

    if (success) {
      toast.success("Registered! Please log in to get started.");
      router.push("/login");
    } else {
      setError("⚠️ Registration failed or email already in use.");
    }
  };



  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#f0f5ff] dark:bg-[#0a0a0a] transition-colors duration-300">
      <div className="relative w-full max-w-lg sm:max-w-md md:max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-lg dark:shadow-2xl overflow-hidden">
        <form
          onSubmit={handleSubmit}
          className="px-6 sm:px-8 py-10 space-y-6 transition-colors duration-300"
        >
          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
            Create your Account
          </h1>

          {error && (
            <p className="text-sm text-red-500 text-center font-medium">
              {error}
            </p>
          )}

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
            className={`w-full py-2 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-neumorphic dark:shadow-neumorphic-dark ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <SocialButton
              label="Google"
              onSuccess={handleGoogleLogin}
              onError={() => toast.error("Google Login Failed")}
              className="w-1 sm:w-full rounded-xl"
            />
          </div>

          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            Already Have an Account?
            <Link
              href="/login"
              className="ml-1 text-blue-600 hover:underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Login
            </Link>
          </p>
        </form>

        {/* Border beams for glow effect */}
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
  onClick?: () => void;
  onSuccess?: (response: CredentialResponse) => void;
  onError?: () => void;
  className?: string;
}

function SocialButton({
  label,
  onClick,
  onSuccess,
  onError,
  className = "",
}: SocialButtonProps) {
  if (label === "Google") {
    return (
      <div className={`w-1/2 flex justify-center ${className}`}>
        <GoogleLogin
        type="standard"
        theme="filled_blue"
          onSuccess={onSuccess ?? (() => {})}
          onError={onError ?? (() => {})}
          size="large"
          shape="circle"
        />
      </div>
    );
  }

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
