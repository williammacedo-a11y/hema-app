import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
  },
  // --- BANNER PROMOCIONAL ---
  promoBanner: {
    backgroundColor: '#E31837', // Vermelho da marca
    margin: 16,
    padding: 24,
    borderRadius: 4,
    justifyContent: 'center',
  },
  promoTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  promoSubtitle: {
    color: '#FFF',
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 16,
  },
  promoButton: {
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 2, // Estilo mais quadrado (Amazon-like)
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    color: '#E31837',
    fontWeight: '700',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  // --- CABEÇALHOS DE SEÇÃO ---
  sectionHeader: {
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  // --- CATEGORIAS ---
  categoriesContainer: {
    paddingLeft: 16,
    paddingBottom: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryCircle: {
    width: 65,
    height: 65,
    borderRadius: 4, // Pouco arredondado como pedido
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#EEE',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  // --- GRID DE PRODUTOS ---
  productGridContainer: {
    paddingHorizontal: 8,
  },
  productGridRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: '#FFF',
    width: (width / 2) - 24,
    margin: 8,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  productImagePlaceholder: {
    height: 130,
    backgroundColor: '#FBFBFB',
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    color: '#222',
    height: 38,
    marginBottom: 4,
    lineHeight: 18,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#E31837',
    paddingVertical: 8,
    borderRadius: 2,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  // --- OFERTAS ---
  offersContainer: {
    paddingLeft: 16,
    paddingBottom: 30,
  },
  offerCard: {
    width: 150,
    marginRight: 16,
  },
  offerImagePlaceholder: {
    width: 150,
    height: 110,
    backgroundColor: '#F5F5F5',
    borderRadius: 2,
    marginBottom: 8,
  },
  offerName: {
    fontSize: 13,
    color: '#444',
    marginBottom: 2,
  },
  oldPriceText: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  promoPriceText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#E31837',
  },
});