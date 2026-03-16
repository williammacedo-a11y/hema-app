import React, { createContext, useContext, useState, useEffect } from "react";
import * as cartService from "@/services/cart";

type Cart = any;
type CartItem = any;

type CartContextType = {
  cart: Cart | null;
  items: CartItem[];
  loading: boolean;
  cartCount: number;
  refreshCart: () => Promise<void>;
  addItem: (data: any) => Promise<void>;
  updateItem: (id: string, data: any) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
};

type AddCartItemDTO = {
  product_id: string;
  quantity?: number;
  weight?: number;
  price: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const cartCount = items.length;

  async function refreshCart() {
    try {
      setLoading(true);
      const data = await cartService.getCartService();

      if (data) {
        setCart(data.cart || {});
        setItems(data.items || []);
      }
    } catch (err) {
      console.error("Erro ao buscar carrinho", err);
    } finally {
      setLoading(false);
    }
  }

  async function addItem(data: AddCartItemDTO) {
    const previousItems = [...items];

    const tempItem = {
      id: `temp-${Date.now()}`,
      product_id: data.product_id,
      quantity: data.quantity || 0,
      weight: data.weight || 0,
      product: {},
    };

    setItems((prev) => [...prev, tempItem]);

    try {
      await cartService.addCartItemService(data);
      await refreshCart();
    } catch (err) {
      setItems(previousItems);
      console.error("Erro ao adicionar item", err);
      throw err;
    }
  }

  async function updateItem(
    id: string,
    data: { quantity?: number; weight?: number },
  ) {
    const previousItems = [...items];

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, ...data } : item,
      ),
    );

    try {
      await cartService.updateCartItemService(id, data);
    } catch (err) {
      setItems(previousItems);
      console.error("Erro ao atualizar item, revertendo estado local", err);
    }
  }

  async function removeItem(id: string) {
    const previousItems = [...items];

    setItems((currentItems) => currentItems.filter((item) => item.id !== id));

    try {
      await cartService.removeCartItemService(id);
    } catch (err) {
      setItems(previousItems);
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
        cartCount,
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
