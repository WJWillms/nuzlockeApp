import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { Animated, Platform, Pressable, StyleSheet, View } from 'react-native';

function HoverButton({ label, onPress, backgroundColor }) {
  const scale = useRef(new Animated.Value(1)).current;
  const router = useRouter();

  const handleHoverIn = () => {
    Animated.spring(scale, {
      toValue: 1.2,
      useNativeDriver: true,
      friction: 4,
    }).start();
  };

  const handleHoverOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      style={[styles.half, { backgroundColor }]}
      onPress={onPress}
      onHoverIn={Platform.OS === 'web' ? handleHoverIn : undefined}
      onHoverOut={Platform.OS === 'web' ? handleHoverOut : undefined}
    >
      <Animated.Text style={[styles.text, { transform: [{ scale }] }]}>
        {label}
      </Animated.Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();

  const handleChoice = (isSoulocke) => {
    router.push({
      pathname: '/nuzlocke',
      params: { soulocke: isSoulocke },
    });
  };

  return (
    <View style={styles.container}>
      <HoverButton
        label="Nuzlocke"
        backgroundColor="#D0E8FF"
        onPress={() => handleChoice(false)}
      />
      <HoverButton
        label="Soulocke"
        backgroundColor="#FFD0D0"
        onPress={() => handleChoice(true)}
      />
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
