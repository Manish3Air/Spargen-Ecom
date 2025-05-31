"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";


export default function RouteLoaderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500); // simulate delay
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/70 dark:bg-gray-900/70 backdrop-blur-md">
          <div className="w-16 h-16 border-4 border-dashed border-blue-500 rounded-full animate-spin" />

          <p className="text-center text-blue-600 font-semibold text-lg animate-pulse mt-6">
            ⏳ Hang on, content is loading...
          </p>
        </div>
      )}
      <div
        style={{ opacity: loading ? 0.3 : 1, transition: "opacity 0.3s ease" }}
      >
        {children}
      </div>
    </>
  );
}
