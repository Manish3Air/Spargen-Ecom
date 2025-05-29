"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Image from "next/image";
import Link from "next/link";
import BASE_URL from "../../utils/api";
import { TextAnimate } from "@/components/magicui/text-animate";
import { BorderBeam } from "@/components/magicui/border-beam";
import FilterDropdown from "@/components/FilterDropdown";
import { useSearchParams } from 'next/navigation';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string | string[];
  description?: string;
  category?: string;
  ratings?: number;
}

const categories = ["Smartphones", "Tablets", "Accessories", "Smartwatches"];
const ratingOptions = [5, 4, 3, 2, 1];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const { addToCart, cartItems } = useCart();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const [animate, setAnimate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState("");

  const searchParams = useSearchParams();
  const category = searchParams.get('category');

useEffect(() => {
  if (category && typeof category === "string") {
    setSelectedCategory(category);
  }
}, [category]);


  const ProductDescription = ({ description }: { description: string }) => {
    const [expanded, setExpanded] = useState(false);
    const toggleExpanded = () => setExpanded(!expanded);
    const shortDescription = description.slice(0, 100);
    return (
      <div className="text-sm text-center mt-1">
        <p>{expanded ? description : `${shortDescription}...`}</p>
        {description.length > 100 && (
          <button
            onClick={toggleExpanded}
            className="text-blue-600 hover:underline font-medium mt-1"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>
    );
  };

  const playPopSound = () => {
    const audio = new Audio("/Sounds/preview.mp3");
    audio.play();
  };

  const handleAddToCart = (product: Product) => {
    playPopSound();
    addToCart({ ...product, quantity: 1 });
    setAnimate(true);
    setTimeout(() => setAnimate(false), 500);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/products`);
        const data = await res.json();
        setProducts(data.products || data);
        setFilteredProducts(data.products || data);
      } catch (err) {
        console.error("Failed to load products:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (selectedRating !== null) {
      filtered = filtered.filter(
        (product) => (product.ratings ?? 0) >= selectedRating
      );
    }

    if (sortOrder === "asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, selectedRating, sortOrder, products]);

  return (
    <main className="p-6 bg-[#f0f5ff] dark:bg-[#0a0a0a] text-gray-900 dark:text-white min-h-screen">
      <TextAnimate
        animation="fadeIn"
        by="word"
        className="text-3xl font-extrabold mb-8 text-center"
      >
        🛍️ Explore Our Products
      </TextAnimate>

      <FilterDropdown
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          selectedRating={selectedRating}
          setSelectedRating={setSelectedRating}
          ratingOptions={ratingOptions}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Grid */}
        <section className="flex-1">
          {filteredProducts.length === 0 ? (
            <p className="text-center">No products match your filters.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-md transition-transform hover:scale-105"
                >
                  <Link href={`/products/${product._id}`}>
                    <div className="relative w-full h-52 mb-3 rounded-lg overflow-hidden">
                      <Image
                        src={
                          typeof product.images === "string"
                            ? product.images
                            : product.images[0] || "/placeholder.png"
                        }
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      {isWishlisted(product._id) && (
                        <span className="absolute top-2 right-2 text-sm bg-red-500 text-white px-2 py-1 rounded-md">
                          ❤️
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-center">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-center font-bold mt-1">
                    ₹{product.price.toFixed(2)}
                  </p>

                  <ProductDescription description={product.description || ""} />

                  <div className="flex justify-center gap-2 mt-4">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="relative dark:bg-black px-4 py-2 border-2 rounded-xl font-semibold text-sm shadow-amber-500 shadow-sm hover:shadow-[2px_2px_4px_#c5c9d1,-2px_-2px_-4px_#ffffff] transition transform hover:scale-102 text-gray-900 dark:text-white"
                    >
                      🛒 Add to Cart
                      <BorderBeam
                        size={40}
                        initialOffset={20}
                        className="from-transparent via-yellow-500 to-transparent"
                        transition={{
                          type: "spring",
                          stiffness: 60,
                          damping: 20,
                        }}
                      />
                    </button>

                    <button
                      onClick={() =>
                        isWishlisted(product._id)
                          ? removeFromWishlist(product._id)
                          : addToWishlist(product)
                      }
                      className="px-4 py-2 rounded-lg text-sm font-semibold bg-pink-100 text-pink-600 hover:bg-pink-200"
                    >
                      {isWishlisted(product._id) ? "💔 Remove" : "💖 Wishlist"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Sticky Cart Icon */}
      <Link
        href="/cart"
        onClick={() => setAnimate(false)}
        className={`fixed bottom-6 right-5 md:right-20 z-50 px-4 py-4 rounded-full shadow-lg bg-[#e0e5ec] dark:bg-[#1f1f1f] text-black dark:text-white flex items-center gap-2 ${
          animate ? "animate-bounce scale-110" : ""
        }`}
      >
        <span className="text-2xl">🛒</span>
        <div>
          <span className="block  text-xs font-bold">
            {cartItems.reduce((total, item) => total + item.quantity, 0)} items
          </span>
          <span className="text-xs font-bold bg-red-500 rounded-full p-2">
            ₹
            {cartItems
              .reduce((sum, item) => sum + item.quantity * item.price, 0)
              .toFixed(2)}
          </span>
        </div>
      </Link>
    </main>
  );
}
