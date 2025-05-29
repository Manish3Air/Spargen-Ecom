"use client"
import { useRouter } from "next/navigation";
import Image from "next/image";

const ShopByCategory = () => {
  const router = useRouter();

  const handleCategoryClick = (category: string) => {
    router.push(`/products?category=${encodeURIComponent(category)}`);
  };

  const categories = [
    { name: "Smartphones", image: "/Images/Smartphones.png" },
    { name: "Tablets", image: "/Images/Tablets.webp" },
    { name: "Accessories", image: "/Images/Accessories.jpg" },
    { name: "Smartwatches", image: "/Images/applewatch.jpg" },
  ];

  return (
    <section className="my-16">
      <h2 className="text-3xl font-bold text-center mb-8">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => handleCategoryClick(cat.name)}
            className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow text-center hover:shadow-white dark:hover:shadow-gray-700 transition-transform focus:outline-none"
          >
            <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded mb-4 hover:scale-105 transition-transform overflow-hidden">
              <Image
                src={cat.image}
                alt={cat.name}
                width={100}
                height={100}
                className="object-contain w-full h-full rounded"
              />
            </div>
            <h3 className="text-xl font-semibold">{cat.name}</h3>
          </button>
        ))}
      </div>
    </section>
  );
};

export default ShopByCategory;
