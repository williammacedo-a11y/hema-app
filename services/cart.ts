import { supabase } from "./supabase";

// Tipagem exata baseada no JSON do seu banco
export interface CartItem {
  nome: string;
  tipo: string;
  total: number; // Valor unitário
  qtd_desc: string;
  qtd_numerica: number;
  image_url?: string; // Para a foto do produto
}

// Usando o ID que você forneceu. Futuramente virá do Auth do usuário logado.
const CLIENTE_ID = "554184418576";

export async function getCartFromDB(): Promise<CartItem[]> {
  try {
    const { data, error } = await supabase
      .from("carrinhos_ativos")
      .select("itens")
      .eq("cliente_id", CLIENTE_ID)
      .single();

    if (error || !data?.itens) return [];

    // O Supabase retorna como String JSON, então fazemos o parse
    return typeof data.itens === "string" ? JSON.parse(data.itens) : data.itens;
  } catch (error) {
    console.error("Erro ao buscar carrinho:", error);
    return [];
  }
}

export async function saveCartToDB(items: CartItem[]): Promise<void> {
  try {
    await supabase.from("carrinhos_ativos").upsert(
      {
        cliente_id: CLIENTE_ID,
        itens: JSON.stringify(items), // Transforma o array de volta em texto JSON
        updated_at: new Date().toISOString(),
      },
      { onConflict: "cliente_id" },
    );
  } catch (error) {
    console.error("Erro ao salvar carrinho:", error);
  }
}
