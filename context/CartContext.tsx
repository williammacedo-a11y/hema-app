import React, { createContext, useState, useEffect, useContext } from "react";
import { getCartFromDB, saveCartToDB, CartItem } from "@/services/cart";

interface CartContextData {
  cartItems: CartItem[];
  cartCount: number;
  updateQuantity: (
    nome: string,
    action: "increase" | "decrease",
  ) => Promise<void>;
  removeItem: (nome: string) => Promise<void>;
  addToCart: (item: CartItem) => Promise<void>;
}

export const CartContext = createContext<CartContextData>(
  {} as CartContextData,
);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getCartFromDB();
      setCartItems(data);
    }
    load();
  }, []);

  // Função interna para atualizar a tela e o banco ao mesmo tempo
  const syncCart = async (newItems: CartItem[]) => {
    setCartItems(newItems);
    await saveCartToDB(newItems);
  };

  // CREATE / UPDATE (Adicionar produto novo ou somar se já existir)
  const addToCart = async (newItem: CartItem) => {
    const itemExists = cartItems.find((item) => item.nome === newItem.nome);

    if (itemExists) {
      const newItems = cartItems.map((item) =>
        item.nome === newItem.nome
          ? { ...item, qtd_numerica: item.qtd_numerica + 1 }
          : item,
      );
      await syncCart(newItems);
    } else {
      await syncCart([...cartItems, newItem]);
    }
  };

  // UPDATE (Aumentar ou diminuir quantidade)
  const updateQuantity = async (
    nome: string,
    action: "increase" | "decrease",
  ) => {
    const newItems = cartItems.map((item) => {
      if (item.nome === nome) {
        const newQty =
          action === "increase" ? item.qtd_numerica + 1 : item.qtd_numerica - 1;
        return { ...item, qtd_numerica: Math.max(1, newQty) };
      }
      return item;
    });
    await syncCart(newItems);
  };

  // DELETE (Remover item)
  const removeItem = async (nome: string) => {
    const newItems = cartItems.filter((item) => item.nome !== nome);
    await syncCart(newItems);
  };

  const cartCount = (cartItems || []).reduce(
    (acc, item) => acc + item.qtd_numerica,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems: cartItems || [],
        cartCount,
        updateQuantity,
        removeItem,
        addToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
