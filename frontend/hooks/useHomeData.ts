import { useState, useEffect } from "react";
import { getHomeCatalog } from "@/services/products";
import { CategoryCatalog } from "@/types/product";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useHomeData() {
  const [catalog, setCatalog] = useState<CategoryCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState<string>("");

  const loadData = async () => {
    try {
      const name = await AsyncStorage.getItem("@hema_user_name");
      if (name) {
        const firstName = name.split(" ")[0];
        setUserName(firstName);
      }
    } catch (e) {
      console.error("Erro ao ler nome do cache", e);
    }

    const response = await getHomeCatalog();

    if (response.success && response.data) {
      setCatalog(response.data);
    } else {
      setCatalog([]);
    }

    setLoading(false);
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  return { catalog, loading, refreshing, onRefresh, userName };
}
