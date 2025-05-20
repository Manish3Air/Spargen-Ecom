"use client";
import React, { useEffect } from "react";
import ProductCard from "@/components/product/ProductCard";
import { useCart } from "@/context/CartContext";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { Button } from "@/components/magicui/Button";
import Link from "next/link";
import { Phone, TabletSmartphone, Rocket } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import { Marquee } from "@/components/magicui/marquee";
import { cn } from "@/lib/utils"; 


const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Jane",
    username: "@jane",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/james",
  },
];

const sampleProducts = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    price: 999,
    description: "Latest iPhone with A17 chip",
    stock: true,
    rating: 4.5,
    image: ["/Images/img1.png", "/Images/img2.png", "/Images/img3.png", "/Images/img3.png"],
  },
  {
    id: "2",
    name: "Samsung Galaxy S24",
    price: 899,
    description: "Latest Samsung with Snapdragon 8 Gen 3",
    stock: false,
    rating: 4.7,
    image: ["/Images/img2.png", "/Images/img1.png", "/Images/img3.png", "/Images/img3.png"],
  },
  {
    id: "3",
    name: "iPad Air",
    price: 599,
    description: "Latest iPad with M2 chip",
    stock: true,
    rating: 4.6,
    image:["/Images/img3.png", "/Images/img2.png", "/Images/img1.png", "/Images/img3.png"],
  },
  {
    id: "4",
    name: "OnePlus 12",
    price: 749,
    description: "Latest OnePlus with Snapdragon 8 Gen 3",
    stock: true,
    rating: 4.4,
    image: ["/Images/img1.png", "/Images/img2.png", "/Images/img3.png", "/Images/img3.png"],
  },
];



export default function Home() {
  const { addToCart } = useCart();
  const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <Image className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};



  useEffect(() => {
    const stored = localStorage.getItem("products");
    if (stored) {
    localStorage.setItem("products", JSON.stringify(sampleProducts));
    }
  }, []);

  const product = sampleProducts[0]; // Example product
    const images = Array.isArray(product.image) ? product.image : [product.image];

  return (
    <main className="p-6 min-h-screen bg-blue-100 dark:bg-[#0a0a0a] text-gray-900 dark:text-white">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to Mobile <AnimatedGradientText> Plaza</AnimatedGradientText>
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">Your one-stop shop for the latest smartphones and tablets</p>
      </header>

      {/* IMAGE CAROUSEL WITH ZOOM */}
        <div className="w-full p-5 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={10}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            navigation={true}
            className="rounded-xl  shadow-inner"
          >
            {images.map((img, idx) => (
              <SwiperSlide key={idx}>
                <div className="w-full p-60  h-[350px] flex justify-center items-center overflow-hidden rounded-xl cursor-zoom-in">
                  <Image
                    src={typeof product.image === "string" ? product.image : product.image[0] || "/placeholder.png"}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="object-contain transition-transform duration-300 ease-in-out hover:scale-125"
                    draggable={false}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

       {/* Hero Section */}
      <section className="relative rounded-xl mt-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500   py-20 text-center">
        <h1 className="text-5xl font-bold mb-4 text-white">Discover the Latest in Mobile & Tablet Technology</h1>
        <p className="text-lg max-w-2xl mx-auto mb-6 text-white">Shop the latest smartphones, tablets, and accessories from top brands like Apple, Samsung, OnePlus, and more!</p>
        <Link href="/products">
          <Button  className="rounded-xl text-lg">Shop Now</Button>
        </Link>
      </section>

      

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center px-6 py-12">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md">
          <Phone size={40} className="mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Latest Devices</h3>
          <p className="text-muted-foreground">Stay ahead with our curated collection of the most advanced smartphones and tablets.</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md">
          <Rocket size={40} className="mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
          <p className="text-muted-foreground">We ensure quick and safe delivery to your doorstep, wherever you are.</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md">
          <TabletSmartphone size={40} className="mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
          <p className="text-muted-foreground">Need help? Our tech experts are just a click away to assist you anytime.</p>
        </div>
      </section>

      <section className="my-10">
        <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {sampleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={(item) => addToCart(item)}
            />
          ))}
        </div>
      </section>

      <section className="my-16">
        <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[{name:"Smartphones",image:"/Images/img1.png"}, {name:"Tablets",image:"/Images/img2.png"}, {name:"Accessories",image:"/Images/img3.png"}, {name:"Smartwatches",image:"/Images/img1.png"}].map((cat, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow text-center hover:shadow-white dark:hover:shadow-gray-700 transition-transform">
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded mb-4 hover:scale-105 transition-transform">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  width={100}
                  height={100}
                  className="object-cover w-full h-full rounded"
                />
              </div>
              <h3 className="text-xl font-semibold">{cat.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* <section className="my-16 bg-gray-100 dark:bg-gray-800 p-10 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-10">What Our Customers Say</h2>
        <Marquee>
        <div className="grid md:grid-cols-3 gap-6">
          
          {["Amit Sharma", "Priya Patel", "Rahul Mehta"].map((name, i) => (
            
            <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow text-center">
              <p className="italic text-gray-700 dark:text-gray-300">“Amazing experience shopping here!”</p>
              <h4 className="mt-4 font-semibold">{name}</h4>
            </div>
            
          ))}
          
        </div>
        </Marquee>
      </section> */}
      {/* Customer Reviews Section */}
        <section className="my-16 bg-gray-100 dark:bg-gray-900 p-10 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-10">What Our Customers Say</h2>
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
      </section>

      

      <section className="my-16">
        <h2 className="text-3xl font-bold text-center mb-6">Top Brands</h2>
        <div className="flex justify-center gap-10 flex-wrap items-center">
          {["apple", "samsung", "oneplus", "xiaomi"].map((brand,i) => (
            <div key={i} className="h-8 w-24 text-center bg-gray-300 dark:bg-gray-700 rounded">{brand}</div>
          ))}
        </div>
      </section>

      <section className="my-16">
        <h2 className="text-3xl font-bold text-center mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4 max-w-3xl mx-auto">
          {["How fast is delivery?", "Do you offer returns?", "Is there a warranty?"]
            .map((q, i) => (
              <details key={i} className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
                <summary className="cursor-pointer font-semibold">{q}</summary>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Answer coming soon.</p>
              </details>
            ))}
        </div>
      </section>

       {/* CTA Section */}
      <section className="px-6 py-20 text-center">
        <h2 className="text-4xl font-bold mb-4">Join the Mobile Revolution</h2>
        <p className="text-lg text-muted-foreground mb-6">Sign up now and get exclusive deals, early access, and tech news straight to your inbox.</p>
        <Link href="/register">
          <Button  className="rounded-xl text-lg">Get Started</Button>
        </Link>
      </section>
    </main>
     
  );
}
