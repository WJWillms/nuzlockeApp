import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, ImageBackground, Pressable, StyleSheet } from 'react-native';

export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0.15)).current;
  const router = useRouter();
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    let isMounted = true;

    const pulse = () => {
      if (!isMounted) return;
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.delay(300),
        Animated.timing(fadeAnim, {
          toValue: 0.0,
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.delay(300),
      ]).start(({ finished }) => {
        if (finished && isMounted) pulse(); // manually loop smoothly
      });
    };

    pulse();

    return () => {
      isMounted = false;
      fadeAnim.stopAnimation();
    };
  }, [fadeAnim]);

  const handlePress = () => {
    router.push('/soulocke');
  };

  const baseFontSize = Math.min(width, height) * 0.06;

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <ImageBackground
        source={require('../assets/images/soulockeForge2.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <Animated.Text
          style={[
            styles.text,
            {
              opacity: fadeAnim,
              fontSize: baseFontSize,
              marginTop: height * 0.1,
            },
          ]}
        >
          Enter the Forge
        </Animated.Text>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
    fontFamily: 'Courier New',
  },
});
