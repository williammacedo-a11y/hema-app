import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // --- HEADER DA CATEGORIA ---
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  categoryTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  categorySubtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  // --- BARRA DE FILTROS ---
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F2F2F2',
    height: 48,
  },
  filterButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  filterSeparator: {
    width: 1,
    height: '50%',
    backgroundColor: '#EEE',
  },
  // --- GRID DE PRODUTOS ---
  listContainer: {
    padding: 8,
    paddingBottom: 30,
  },
  row: {
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    width: (width / 2) - 16,
    margin: 8,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    // Shadow suave
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  imagePlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: '#F9F9F9',
  },
  productContent: {
    padding: 10,
  },
  productName: {
    fontSize: 13,
    color: '#222',
    fontWeight: '400',
    height: 36,
    lineHeight: 18,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#E31837',
    paddingVertical: 8,
    borderRadius: 2,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});