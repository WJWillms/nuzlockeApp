import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, ImageBackground, Pressable, StyleSheet } from 'react-native';
import { loadSoulockeData } from '../components/storage'; // ✅ import the storage helper

export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const { width, height } = Dimensions.get('window');
  const [bgLoaded, setBgLoaded] = useState(false);
  const [checkedStorage, setCheckedStorage] = useState(false); // ✅ to prevent UI flicker

  // ✅ Check if saved data exists before showing landing page
  useEffect(() => {
    (async () => {
      try {
        const savedData = await loadSoulockeData();

        if (
          savedData &&
          (savedData.trainer1Team?.length > 0 ||
            savedData.trainer2Team?.length > 0)
        ) {
          // 🧭 Go straight to team builder if valid data exists
          router.replace('/soulockeTeamBuilder');
          return;
        }

        // ✅ If no saved data, show landing screen
        setCheckedStorage(true);
      } catch (err) {
        console.error("Error checking saved data:", err);
        setCheckedStorage(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!bgLoaded || !checkedStorage) return;

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
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.delay(300),
      ]).start(({ finished }) => {
        if (finished && isMounted) pulse();
      });
    };

    const timer = setTimeout(pulse, 50);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      fadeAnim.stopAnimation();
    };
  }, [bgLoaded, checkedStorage, fadeAnim]);

  const handlePress = () => router.push('/soulocke');
  const baseFontSize = Math.min(width, height) * 0.06;

  // 🧠 Don't render anything until we’ve checked storage
  if (!checkedStorage) return null;

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <ImageBackground
        source={require('../assets/images/soulockeForge2.png')}
        style={styles.background}
        resizeMode="cover"
        onLoadEnd={() => setBgLoaded(true)}
      >
        {bgLoaded && (
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
        )}
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
