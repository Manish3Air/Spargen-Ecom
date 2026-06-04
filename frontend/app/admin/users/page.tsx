"use client";

import { useEffect, useState } from "react";
import BASE_URL from "@/utils/api";
import { toast } from "sonner";
import { ShieldCheck, UserRound } from "lucide-react";

interface User {
  _id: string;
  email: string;
  name?: string;
  role: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`${BASE_URL}/api/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const updateUserRole = async (id: string, newRole: "admin" | "user") => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${BASE_URL}/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Failed to update role");
      const updatedUser = await res.json();

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, role: updatedUser.role } : user
        )
      );

      toast.success(`Updated ${updatedUser.email} to ${updatedUser.role}`);
    } catch (error) {
      console.error(error);
      toast.warning("Failed to update role. Please try again.");
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
          Access
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
          Users
        </h1>
      </div>

      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          Loading users...
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          No users found.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {users.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                onToggleRole={() =>
                  updateUserRole(
                    user._id,
                    user.role === "admin" ? "user" : "admin"
                  )
                }
              />
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500 dark:bg-zinc-800 dark:text-zinc-400">
                  <tr>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="max-w-[360px] truncate px-4 py-3 font-medium text-slate-900 dark:text-white">
                        {user.email}
                      </td>
                      <td className="px-4 py-3">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() =>
                            updateUserRole(
                              user._id,
                              user.role === "admin" ? "user" : "admin"
                            )
                          }
                          className="inline-flex items-center justify-center rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 dark:border-zinc-700 dark:hover:bg-blue-950/30"
                        >
                          Make {user.role === "admin" ? "User" : "Admin"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function RoleBadge({ role }: { role: string }) {
  const isAdmin = role === "admin";
  const Icon = isAdmin ? ShieldCheck : UserRound;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
        isAdmin
          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
          : "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {role}
    </span>
  );
}

function UserCard({
  user,
  onToggleRole,
}: {
  user: User;
  onToggleRole: () => void;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="break-all text-sm font-semibold text-slate-950 dark:text-white">
            {user.email}
          </p>
          <div className="mt-2">
            <RoleBadge role={user.role} />
          </div>
        </div>
      </div>
      <button
        onClick={onToggleRole}
        className="mt-4 inline-flex w-full items-center justify-center rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 dark:border-zinc-700 dark:hover:bg-blue-950/30"
      >
        Make {user.role === "admin" ? "User" : "Admin"}
      </button>
    </article>
  );
}
