import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import * as cartService from "@/services/cart";
import Toast from "react-native-toast-message";

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

  // 🔹 REFRESH
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
        // Em caso de erro, removemos o item temporário recarregando o carrinho real
        await refreshCart();
        console.error("Erro ao adicionar item", err);
        throw err;
      }
    },
    [refreshCart],
  );

  const updateItem = useCallback(
    async (id: string, data: { quantity?: number; weight?: number }) => {
      setItems((currentItems) =>
        currentItems.map((item) =>
          item.id === id ? { ...item, ...data } : item,
        ),
      );

      try {
        setLoading(true);
        await cartService.updateCartItemService(id, data);

        const res = await cartService.getCartService();
        if (res) {
          setCart(res.cart);
          setItems(res.items || []);
        }
      } catch (err) {
        // Recarrega o estado real em caso de erro
        const res = await cartService.getCartService();
        if (res) {
          setCart(res.cart);
          setItems(res.items || []);
        }
        console.error("Erro ao atualizar item", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const removeItem = useCallback(
    async (id: string) => {
      setItems((currentItems) => currentItems.filter((item) => item.id !== id));

      try {
        setLoading(true);
        await cartService.removeCartItemService(id);

        Toast.show({ type: "success", text1: "Removido com sucesso!" });

        const res = await cartService.getCartService();
        if (res) {
          setCart(res.cart);
          setItems(res.items || []);
        }
      } catch (err) {
        // Recarrega o estado real em caso de erro
        const res = await cartService.getCartService();
        if (res) {
          setCart(res.cart);
          setItems(res.items || []);
        }
        console.error("Erro ao remover item", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // 🔹 INITIAL LOAD
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // 🔹 MEMO DO CONTEXTO
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
