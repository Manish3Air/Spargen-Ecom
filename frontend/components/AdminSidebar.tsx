// components/AdminSidebar.tsx
"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";



const links = [
  { name: "Dashboard", href: "/admin" },
  { name: "Products", href: "/admin/products" },
  { name: "Orders", href: "/admin/orders" },
  { name: "Analytics", href: "/admin/analytics" },
  { name: "Users", href: "/admin/users" }, // future feature maybe
];

export default function AdminSidebar() {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <nav className="w-60 bg-white dark:bg-gray-800 shadow-neumorphic p-6 min-h-screen">
      <h2 className="text-2xl font-bold mb-8 text-gray-700 dark:text-gray-200">
        Admin Panel
      </h2>
      <ul className="space-y-4">
        {links.map(({ name, href }) => (
          <li key={href}>
            <button
              onClick={() => router.push(href)}
              className="w-full text-left text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
            >
              {name}
            </button>
          </li>
        ))}
      </ul>


<button
  onClick={logout}
  className="mt-8 text-red-600 font-semibold hover:underline"
>
  Logout
</button>

    </nav>
  );
}
