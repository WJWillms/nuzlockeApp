// components/HoverTooltip.js
import { useState } from "react";
import { Animated, Text, View } from "react-native";

const HoverTooltip = ({ children, tooltipText }) => {
  const [visible, setVisible] = useState(false);
  const opacity = useState(new Animated.Value(0))[0];

  const showTooltip = () => {
    setVisible(true);
    Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }).start();
  };

  const hideTooltip = () => {
    Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }).start(() =>
      setVisible(false)
    );
  };

  return (
    <View
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      style={{ position: "relative", alignItems: "center" }}
    >
      {children}
      {visible && (
        <Animated.View
          style={{
            position: "absolute",
            bottom: "120%",
            backgroundColor: "rgba(0,0,0,0.85)",
            padding: 6,
            borderRadius: 6,
            zIndex: 10,
            opacity,
            width: 150,
          }}
        >
          <Text style={{ color: "white", fontSize: 12, textAlign: "center" }}>
            {tooltipText}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

export default HoverTooltip;
