"use client";

import { useEffect, useState } from "react";
import BASE_URL from "@/utils/api";
import { toast } from "sonner";
// import axios from "axios";

interface User {
  _id: string;
  email: string;
  name?: string;
  role: string;
}

export default function AdminUsersPage() {
const [users, setUsers] = useState<User[]>([]);

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/users`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  fetchUsers();
}, []);

const updateUserRole = async (id: string, newRole: "admin" | "user") => {
  try {
    const res = await fetch(`${BASE_URL}/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    if (!res.ok) throw new Error("Failed to update role");
    const updatedUser = await res.json();

    // Update local state
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === id ? { ...user, role: updatedUser.role } : user
      )
    );

    toast.success(`✅ Updated role of ${updatedUser.email} to ${updatedUser.role}`);
  } catch (error) {
    console.error(error);
    toast.warning("❌ Failed to update role. Please try again.");
  }
};


  return (
    <main className="p-6 bg-[#f0f5ff] dark:bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">👥 Manage Users</h1>

      {users.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No users found.</p>
      ) : (
        <table className="w-full text-left border-collapse bg-white rounded-xl shadow overflow-hidden">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) && users.map((user) => (
              <tr key={user.email} className="border-t">
                <td className="p-3 text-gray-800">{user.email}</td>
                <td className="p-3 text-gray-600 capitalize">{user.role}</td>
                <td className="p-3">
                  <button
                    onClick={() =>
                      updateUserRole(user._id, user.role === "admin" ? "user" : "admin")
                    }
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Make {user.role === "admin" ? "User" : "Admin"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
