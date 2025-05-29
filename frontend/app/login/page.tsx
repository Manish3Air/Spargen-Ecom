"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { BorderBeam } from "@/components/magicui/border-beam";
import { toast } from "sonner";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

export default function LoginPage() {
  const { login, handleGoogleLogin } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await login(form.email, form.password);
    if (data) {
      if (data.user.role === "admin") {
        toast.success("Admin logged in!");
        router.push("/admin");
      } else {
        toast.success("User logged in!");
        router.push("/");
      }
    } else {
      setError("❌ Invalid email or password.");
    }
  };



  return (
    <main className="relative min-h-screen flex items-center justify-center bg-[#f0f5ff] dark:bg-[#0a0a0a] px-4 py-12">
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden">
        <form
          onSubmit={handleSubmit}
          className=" bg-[#e0e5ec] dark:bg-gray-900 p-8 rounded-2xl shadow-neumorphic-inner dark:shadow-none w-full max-w-md space-y-6"
        >
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
            Welcome Back 👋
          </h1>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <InputField
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <PasswordField
            label="Password"
            value={form.password}
            showPassword={showPassword}
            toggleShow={() => setShowPassword(!showPassword)}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-gray-600 dark:accent-blue-500"
              />
              Remember me
            </label>
            <a href="#" className="text-blue-500 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-xl font-semibold text-gray-800 dark:text-gray-200 bg-[#d1d9e6] dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all shadow-neumorphic dark:shadow-lg"
          >
            Login
          </button>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <SocialButton
              label="Google"
              onSuccess={handleGoogleLogin}
              onError={() => toast.error("Google Login Failed")}
              className="w-1 sm:w-full rounded-xl"
            />
          </div>
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            Do not have an acoount?
            <Link
              href="/register"
              className="ml-2 text-blue-500  hover:underline hover:text-blue-700"
            >
              Register
            </Link>
          </p>
        </form>

        <BorderBeam
          duration={4}
          size={300}
          reverse
          className="from-transparent via-green-500 to-transparent"
        />
      </div>
    </main>
  );
}

interface InputFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function InputField({
  label,
  type = "text",
  value,
  onChange,
}: InputFieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder="manish@tech.com"
        onChange={onChange}
        required
        className="w-full p-3 rounded-xl bg-[#f5f6fa] dark:bg-gray-800 shadow-inner text-sm text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
    </div>
  );
}

interface PasswordFieldProps {
  label: string;
  value: string;
  showPassword: boolean;
  toggleShow: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function PasswordField({
  label,
  value,
  showPassword,
  toggleShow,
  onChange,
}: PasswordFieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          placeholder="********"
          onChange={onChange}
          required
          className="w-full p-3 rounded-xl bg-[#f5f6fa] dark:bg-gray-800 shadow-inner text-sm text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-200 pr-10"
        />
        <button
          type="button"
          onClick={toggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
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
