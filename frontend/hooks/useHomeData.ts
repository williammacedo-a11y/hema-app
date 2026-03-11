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
      await AsyncStorage.getItem("@hema_user_name").then((name) => {
        if (name) {
          let firstName = name.split(" ");
          setUserName(firstName[0]);
        }
      });
      const data = await getHomeCatalog();
      setCatalog(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
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
