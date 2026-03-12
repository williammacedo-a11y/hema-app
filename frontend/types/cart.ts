export type Cart = {
  id: string;
  user_id: string;
  total_price: number;
  created_at: string;
  updated_at: string;
};

export type CartItems = {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number | null;
  weight: number | null;
  price: number;
  created_at: string;
};

export type CartItemWithProduct = {
  id: string;
  cart_id: string;
  product_id: string;

  quantity: number | null;
  weight: number | null;
  price: number;

  product: {
    id: string;
    name: string;
    image_url: string | null;
    type: "unit" | "weight";
  };
};

export type AddCartItemDTO = {
  product_id: string;
  quantity?: number;
  weight?: number;
};

