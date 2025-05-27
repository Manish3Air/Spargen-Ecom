"use client";
import { useAuth } from "@/context/AuthContext";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  images: string | string[];
  description?: string;
  stock?: boolean;
  rating?: number;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // Load wishlist for user
  useEffect(() => {
    if (currentUser) {
      const stored = localStorage.getItem(`wishlist-${currentUser.email}`);
      if (stored) {
        try {
          setWishlist(JSON.parse(stored));
        } catch {
          setWishlist([]); // fallback on parse fail
        }
      } else {
        setWishlist([]); // if no wishlist exists for this user
      }
    } else {
      setWishlist([]); // reset when logged out
    }
  }, [currentUser]);

  // Save wishlist per user
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        `wishlist-${currentUser.email}`,
        JSON.stringify(wishlist)
      );
    }
  }, [wishlist, currentUser]);

  const addToWishlist = (item: WishlistItem) => {
    setWishlist((prev) => {
      if (prev.some((i) => i._id === item._id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item._id !== id));
  };

  const isWishlisted = (id: string) =>
    wishlist.some((item) => item._id === id);

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isWishlisted }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context)
    throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
};
