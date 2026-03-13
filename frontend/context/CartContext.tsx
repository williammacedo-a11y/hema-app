import React, { createContext, useContext, useState, useEffect } from "react";
import * as cartService from "@/services/cart";

type Cart = any;
type CartItem = any;

type CartContextType = {
  cart: Cart | null;
  items: CartItem[];
  loading: boolean;
  refreshCart: () => Promise<void>;
  addItem: (data: any) => Promise<void>;
  updateItem: (id: string, data: any) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function refreshCart() {
    try {
      setLoading(true);

      const response = await cartService.getCartService();

      setCart(response.cart);
      setItems(response.items ?? []);
    } catch (err) {
      console.error("Erro ao buscar carrinho", err);
    } finally {
      setLoading(false);
    }
  }

  async function addItem(data: any) {
    try {
      await cartService.addCartItemService(data);
      await refreshCart();
    } catch (err) {
      console.error("Erro ao adicionar item", err);
    }
  }

  async function updateItem(id: string, data: any) {
    try {
      await cartService.updateCartItemService(id, data);
      await refreshCart();
    } catch (err) {
      console.error("Erro ao atualizar item", err);
    }
  }

  async function removeItem(id: string) {
    try {
      await cartService.removeCartItemService(id);
      await refreshCart();
    } catch (err) {
      console.error("Erro ao remover item", err);
    }
  }

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        loading,
        refreshCart,
        addItem,
        updateItem,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart deve ser usado dentro de CartProvider");
  }

  return context;
}
