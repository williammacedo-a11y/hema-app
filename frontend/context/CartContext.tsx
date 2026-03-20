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

  // 🔹 REFRESH (Puxa os dados reais do banco)
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

  // 🔹 ADD ITEM (Totalmente Otimista)
  const addItem = useCallback(
    async (data: AddCartItemDTO) => {
      // 1. Guarda o estado antigo em caso de rollback
      const previousItems = [...items];

      // 2. Cria o item falso (Mock) para a UI reagir instantaneamente
      const tempItem = {
        id: `temp-${Date.now()}`,
        product_id: data.product_id,
        quantity: data.quantity || 0,
        weight: data.weight || 0,
        product: {}, // Lembre-se que sem os dados do produto, a imagem pode piscar no carrinho
      };

      // 3. Atualiza a tela NA HORA (sem await)
      setItems((prev) => [...prev, tempItem]);

      // IMPORTANTE: NÃO FAÇA TOAST AQUI!
      // O Toast de sucesso já está sendo disparado no handleAddToCart (HomeScreen) instantaneamente.

      try {
        // 4. Manda pro servidor de forma assíncrona
        await cartService.addCartItemService(data);

        // 5. Depois que salvou em background, atualiza o ID real e valores em silêncio
        const dataFromServer = await cartService.getCartService();
        if (dataFromServer) {
          setCart(dataFromServer.cart || {});
          setItems(dataFromServer.items || []);
        }
      } catch (err) {
        // Se deu erro, reverte a tela pro que era antes
        setItems(previousItems);
        // O Toast de erro já está sendo tratado no catch da tela que chamou a função!
        console.error("Erro ao adicionar item", err);
        throw err;
      }
    },
    [items], // Adicionei items como dependência para o rollback funcionar
  );

  // 🔹 UPDATE ITEM (Otimista)
  const updateItem = useCallback(
    async (id: string, data: { quantity?: number; weight?: number }) => {
      const previousItems = [...items];
      const previousCart = cart;

      // Atualiza a tela na hora (não bloqueia a renderização)
      setItems((currentItems) =>
        currentItems.map((item) =>
          item.id === id ? { ...item, ...data } : item,
        ),
      );

      try {
        // Não seto loading=true aqui para não piscar a tela do usuário
        await cartService.updateCartItemService(id, data);

        // Atualiza os totais (preço) em background
        const res = await cartService.getCartService();
        if (res) {
          setCart(res.cart);
          setItems(res.items || []);
        }
      } catch (err) {
        // Rollback
        setItems(previousItems);
        setCart(previousCart);
        Toast.show({ type: "error", text1: "Erro ao atualizar quantidade." });
        console.error("Erro ao atualizar item", err);
      }
    },
    [items, cart],
  );

  // 🔹 REMOVE ITEM (Otimista)
  const removeItem = useCallback(
    async (id: string) => {
      const previousItems = [...items];
      const previousCart = cart;

      // Remove da tela no exato momento que clicou (ou que puxou o swipe)
      setItems((currentItems) => currentItems.filter((item) => item.id !== id));

      // O Toast agora entra aqui, instantaneamente!
      Toast.show({ type: "success", text1: "Removido com sucesso!" });

      try {
        // Faz a exclusão real no banco
        await cartService.removeCartItemService(id);

        // Atualiza o subtotal do carrinho
        const res = await cartService.getCartService();
        if (res) {
          setCart(res.cart);
          // Só atualiza os itens se vieram do servidor, senão mantém a otimista
          if (res.items) setItems(res.items);
        }
      } catch (err) {
        // Se a internet cair, o item volta pra tela e avisa o usuário
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
