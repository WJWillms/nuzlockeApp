import { Link } from 'expo-router';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

function HoverButton({ label, href, backgroundColor }) {
  return (
    <Link href={href} asChild>
      <Pressable
        style={({ hovered }) => [
          {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor,
          },
          hovered && Platform.OS === 'web' && { opacity: 0.8, cursor: 'pointer' },
        ]}
      >
        <Text style={styles.text}>{label}</Text>
      </Pressable>
    </Link>
  );
}



export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <HoverButton label="Nuzlocke" href="/nuzlocke" backgroundColor="#D0E8FF" />
      <HoverButton label="Soulocke" href="/soulocke" backgroundColor="#FFD0D0" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  half: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //cursor: 'pointer',
  },
  text: {
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: Platform.select({
      ios: 'Courier New',
      android: 'monospace',
      web: 'Courier New',
    }),
    textAlign: 'center',
    paddingHorizontal: 10,
    color: '#222',
  },
});

