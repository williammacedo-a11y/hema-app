import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    paddingVertical: 10,
    marginBottom: 0,
  },
  loaderContainer: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  badge: {
    backgroundColor: "#E31837",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: "#E31837",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    textTransform: "capitalize",
  },
});
