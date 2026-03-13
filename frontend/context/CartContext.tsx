interface CartContextData {
  cart: any;
  items: any[];
  loading: boolean;

  refreshCart: () => Promise<void>;
  addItem: (data: AddCartItemDTO) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
}

import React, { createContext, useState, useContext, useEffect } from "react";
import {
  addCartItem,
  AddCartItemDTO,
} from "@/services/cart";

const CartContext = createContext({} as CartContextData);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function refreshCart() {
    const data = await getCart();

    setCart(data.cart);
    setItems(data.items);
  }

  async function addItem(dto: AddCartItemDTO) {
    await addCartItem(dto);
    await refreshCart();
  }

  async function removeItem(id: string) {
    await removeCartItem(id);
    await refreshCart();
  }

  useEffect(() => {
    refreshCart().finally(() => setLoading(false));
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        loading,
        refreshCart,
        addItem,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
