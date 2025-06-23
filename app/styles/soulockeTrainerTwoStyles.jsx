import { Dimensions, StyleSheet } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const soulockeTrainerTwoStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
  },
  searchContainer: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 12,
    paddingTop: 12,
    paddingRight: 90,
    backgroundColor: '#ddd'
  },
  searchInput: {
    width: '70%',
    maxWidth: 500,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 9999,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // center overall row if needed
    paddingHorizontal: 16,
    backgroundColor: '#ddd'
  },
  
  trainerLabel: {
    paddingLeft: 260,
    fontSize: 24,
    fontWeight: 'bold',
    flexShrink: 0,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingTop: 12,
    paddingLeft: 80,
    backgroundColor: '#999'
  },
  card: {
    width: 160, // or 120, or 140 — whatever feels right visually
    marginRight: 12,
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  
  
  cardSelected: {
    backgroundColor: '#e0f0ff',
    borderColor: '#3399ff',
  },
  sprite: {
    width: 64,
    height: 64,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  name: {
    fontSize: 14,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingTop: 12,
    paddingBottom: 12,
    alignItems: 'center',
    backgroundColor: '#ddd'
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 9999,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  gridWrapper: {
    flex: 1,
    backgroundColor: '#999',
  },
  
  gridScrollContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingTop: 12,
    paddingLeft: 80,
  },
  matchingToContainer: {
    alignItems: 'center',
    marginLeft: 16,
    paddingRight: 210,
  },
  
  matchingToLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  
  matchingCard: {
    width: 160, // or 120, or 140 — whatever feels right visually
    marginRight: 12,
    marginBottom: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  
});

export default soulockeTrainerTwoStyles;
