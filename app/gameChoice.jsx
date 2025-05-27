import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const gameBlocks = [
  { group: 'Red / Blue / Yellow', games: ['Red', 'Blue', 'Yellow'], key: 'red-blue-yellow', image: require('@/assets/images/testImage.jpg'), },
  { group: 'Gold / Silver / Crystal', games: ['Gold', 'Silver', 'Crystal'], key: 'gold-silver-crystal', image: require('@/assets/images/testImage.jpg'), },
  { group: 'Ruby / Sapphire / Emerald', games: ['Ruby', 'Sapphire', 'Emerald'], key: 'ruby-sapphire-emerald', image: require('@/assets/images/testImage.jpg'), },
  { group: 'FireRed / LeafGreen', games: ['FireRed', 'LeafGreen'], key: 'firered-leafgreen', image: require('@/assets/images/testImage.jpg'), },
  { group: 'Diamond / Pearl / Platinum', games: ['Diamond', 'Pearl', 'Platinum'], key: 'diamond-pearl-platinum', image: require('@/assets/images/testImage.jpg'), },
  { group: 'HeartGold / SoulSilver', games: ['HeartGold', 'SoulSilver'], key: 'heartgold-soulsilver', image: require('@/assets/images/testImage.jpg'), },
  { group: 'Black / White', games: ['Black', 'White'], key: 'black-white', image: require('@/assets/images/testImage.jpg'), },
  { group: 'Black 2 / White 2', games: ['Black 2', 'White 2'], key: 'black-2-white-2', image: require('@/assets/images/testImage.jpg'), },
  { group: 'X / Y', games: ['X', 'Y'], key: 'x-y', image: require('@/assets/images/testImage.jpg'), },
  { group: 'Omega Ruby / Alpha Sapphire', games: ['Omega Ruby', 'Alpha Sapphire'], key: 'omega-ruby-alpha-sapphire', image: require('@/assets/images/testImage.jpg'), },
  { group: 'Sun / Moon', games: ['Sun', 'Moon'], key: 'sun-moon', image: require('@/assets/images/testImage.jpg'), },
  { group: 'Ultra Sun / Ultra Moon', games: ['Ultra Sun', 'Ultra Moon'], key: 'ultra-sun-ultra-moon', image: require('@/assets/images/testImage.jpg'), },
  { group: 'Sword / Shield', games: ['Sword', 'Shield'], key: 'sword-shield', image: require('@/assets/images/testImage.jpg'), },
  { group: 'Brilliant Diamond / Shining Pearl', games: ['Brilliant Diamond', 'Shining Pearl'], key: 'brilliant-diamond-shining-pearl', image: require('@/assets/images/testImage.jpg'), },
  { group: 'Scarlet / Violet', games: ['Scarlet', 'Violet'], key: 'scarlet-violet', image: require('@/assets/images/testImage.jpg'), },
];

export default function GameSelectionScreen() {
  const { soulocke } = useLocalSearchParams();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Choose a Game</Text>
      </View>

      {gameBlocks.map((block) => (
        <View key={block.key} style={styles.cardWrapper}>
          <Pressable style={styles.card} onPress={() => console.log(`Selected ${block.key}`)}>
            <Image source={block.image} style={styles.image} resizeMode="cover" />
          </Pressable>
          <Text style={styles.group}>{block.group}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 45,
    fontWeight: 'bold',
    color: 'white'
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
    gap: 16,
    backgroundColor: '#40414f'
  },
  cardWrapper: {
    width: '22%',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ccc',
    borderRadius: 12,
    width: '100%',
    aspectRatio: 1,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  group: {
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 12,
    color: 'white',
  },
});
