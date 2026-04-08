"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  id: string;
  partId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity" | "id"> & { quantity?: number }) => void;
  removeItem: (partId: string) => void;
  updateQuantity: (partId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
  saveCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("adr_cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    }
    setMounted(true);
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("adr_cart", JSON.stringify(items));
    }
  }, [items, mounted]);

  const addItem = (item: Omit<CartItem, "quantity" | "id"> & { quantity?: number }) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.partId === item.partId);

      if (existingItem) {
        return prevItems.map((i) =>
          i.partId === item.partId
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        );
      }

      return [
        ...prevItems,
        {
          ...item,
          id: `${item.partId}-${Date.now()}`,
          quantity: item.quantity || 1,
        },
      ];
    });
  };

  const removeItem = (partId: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.partId !== partId));
  };

  const updateQuantity = (partId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(partId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((i) =>
        i.partId === partId ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const saveCart = () => {
    localStorage.setItem("adr_cart", JSON.stringify(items));
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        totalPrice,
        saveCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
