import { View, FlatList } from "react-native";
import { styles } from "../styles/home.styles";

export const SkeletonGrid = () => (
  <FlatList
    data={[1, 2, 3, 4, 5, 6]}
    renderItem={() => <SkeletonCard />}
    keyExtractor={(item) => item.toString()}
    numColumns={2}
    scrollEnabled={false}
    columnWrapperStyle={styles.productGridRow}
    contentContainerStyle={styles.productGridContainer}
  />
);

export default function SkeletonCard() {
  return (
    <View style={styles.productCard}>
      <View
        style={[styles.productImagePlaceholder, { backgroundColor: "#EAEAEA" }]}
      />

      <View style={styles.productInfo}>
        <View
          style={{
            height: 14,
            backgroundColor: "#EAEAEA",
            borderRadius: 6,
            marginBottom: 8,
            width: "80%",
          }}
        />

        <View
          style={{
            height: 14,
            backgroundColor: "#EAEAEA",
            borderRadius: 6,
            marginBottom: 12,
            width: "40%",
          }}
        />

        <View
          style={{
            height: 32,
            backgroundColor: "#EAEAEA",
            borderRadius: 8,
          }}
        />
      </View>
    </View>
  );
}
