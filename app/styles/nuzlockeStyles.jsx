import { Dimensions, StyleSheet } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const nuzlockeStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignSelf: 'center',
    width: '100%',
    paddingLeft: 80,
    //maxWidth: 800,
  },
  searchContainer: {
    alignItems: 'center',
    marginBottom: 24,
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
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
    marginTop: 24,
    alignItems: 'center',
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
});

export default nuzlockeStyles;
