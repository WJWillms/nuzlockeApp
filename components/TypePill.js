import { Dimensions, Text, View } from 'react-native';
import { typeColorMap } from '../app/Pokedex/typeColorMap';
const { width: screenWidth } = Dimensions.get("window");


const TypePill = ({ type, glow = false }) => {
  const bgColor = typeColorMap[type.toUpperCase()] || "#ccc";

  // Adjusted smaller scaling
  const horizontalPadding = Math.max(6, screenWidth * 0.004);  // ~8px on 1920px
  const verticalPadding = Math.max(2, screenWidth * 0.002);    // ~4px on 1920px
  const minWidth = Math.max(45, screenWidth * 0.035);          // ~60px on 1920px
  const fontSize = Math.max(10, Math.min(12, screenWidth * 0.006)); // ~11–12px

  return (
    <View
      style={{
        backgroundColor: bgColor,
        paddingHorizontal: horizontalPadding,
        paddingVertical: verticalPadding,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        minWidth,

        // Glow for web
        boxShadow: glow
          ? `0 0 ${screenWidth * 0.004}px ${screenWidth * 0.002}px ${bgColor},
             0 0 ${screenWidth * 0.01}px ${screenWidth * 0.003}px ${bgColor}`
          : "none",

        borderWidth: glow ? 1 : 0,
        borderColor: glow ? "#fff" : "transparent",
      }}
    >
      <Text style={{ color: "white", fontWeight: "bold", fontSize }}>
        {type}
      </Text>
    </View>
  );
};

export default TypePill;
