const API_URL = `https://${process.env.EXPO_PUBLIC_API_URL}/categories`;

export const CategoryBadgesService = {
  async getCategories() {
    try {
      const response = await fetch(`${API_URL}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao buscar categorias.");
      }

      return data;
    } catch (error: any) {
      console.error("Erro na requisição:", error);
      throw error;
    }
  },
};
