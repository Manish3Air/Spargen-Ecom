"use client";
import { useAuth } from "@/context/AuthContext";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";
export interface CartItem {
  _id: string;
  name: string;
  price: number;
  images: string | string[];
  quantity: number;
  description?: string;
  stock?: boolean;
  rating?: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { currentUser } = useAuth();

  // Load cart for logged-in user
  useEffect(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`cart-${currentUser.email}`);
      if (saved) {
        try {
          setCartItems(JSON.parse(saved));
        } catch {
          console.error("Failed to parse cart.");
        }
      }
    }
  }, [currentUser]);

  // Save cart per user
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        `cart-${currentUser.email}`,
        JSON.stringify(cartItems)
      );
    }
  }, [cartItems, currentUser]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i._id === item._id);
      if (existing) {
        return prev.map((i) =>
          i._id === item._id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
    toast.success("✅ Item added to cart!");
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart must be used within a CartProvider");
  return context;
};
