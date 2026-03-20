import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import * as cartService from "@/services/cart";
import { Toast } from "@/util/toast";

type Cart = any;
type CartItem = any;

type CartContextType = {
  cart: Cart | null;
  items: CartItem[];
  loading: boolean;
  cartCount: number;
  refreshCart: () => Promise<void>;
  addItem: (data: AddCartItemDTO) => Promise<void>;
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

  const refreshCart = useCallback(async () => {
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
  }, []);

  const addItem = useCallback(
    async (data: AddCartItemDTO) => {
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

        const dataFromServer = await cartService.getCartService();
        if (dataFromServer) {
          setCart(dataFromServer.cart || {});
          setItems(dataFromServer.items || []);
        }
      } catch (err) {
        setItems(previousItems);
        console.error("Erro ao adicionar item", err);
        throw err;
      }
    },
    [items],
  );

  const updateItem = useCallback(
    async (id: string, data: { quantity?: number; weight?: number }) => {
      const previousItems = [...items];
      const previousCart = cart;

      setItems((currentItems) =>
        currentItems.map((item) =>
          item.id === id ? { ...item, ...data } : item,
        ),
      );

      try {
        await cartService.updateCartItemService(id, data);

        const res = await cartService.getCartService();
        if (res) {
          setCart(res.cart);
          setItems(res.items || []);
        }
      } catch (err) {
        setItems(previousItems);
        setCart(previousCart);
        Toast.show({ type: "error", text1: "Erro ao atualizar quantidade." });
        console.error("Erro ao atualizar item", err);
      }
    },
    [items, cart],
  );

  const removeItem = useCallback(
    async (id: string) => {
      const previousItems = [...items];
      const previousCart = cart;

      setItems((currentItems) => currentItems.filter((item) => item.id !== id));

      Toast.show({ type: "success", text1: "Removido com sucesso!" });

      try {
        await cartService.removeCartItemService(id);

        const res = await cartService.getCartService();
        if (res) {
          setCart(res.cart);

          if (res.items) setItems(res.items);
        }
      } catch (err) {
        setItems(previousItems);
        setCart(previousCart);
        Toast.show({
          type: "error",
          text1: "Não foi possível remover o item.",
        });
        console.error("Erro ao remover item", err);
      }
    },
    [items, cart],
  );

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const value = useMemo(
    () => ({
      cart,
      items,
      loading,
      cartCount,
      refreshCart,
      addItem,
      updateItem,
      removeItem,
    }),
    [
      cart,
      items,
      loading,
      cartCount,
      refreshCart,
      addItem,
      updateItem,
      removeItem,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de CartProvider");
  }
  return context;
}
