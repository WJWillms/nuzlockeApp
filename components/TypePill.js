import React from 'react';
import { Text, View } from 'react-native';
import { typeColorMap } from '../app/Pokedex/typeColorMap';

const TypePill = ({ type, glow = false }) => {
  const bgColor = typeColorMap[type.toUpperCase()] || '#ccc';

  return (
    <View
      style={{
        backgroundColor: bgColor,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 50,

        // Strong outer glow for web
        boxShadow: glow
          ? `0 0 10px 4px ${bgColor}, 0 0 20px 6px ${bgColor}`
          : 'none',

        // Optional border to help contrast the glow
        borderWidth: glow ? 1 : 0,
        borderColor: glow ? '#fff' : 'transparent',
      }}
    >
      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>
        {type}
      </Text>
    </View>
  );
};

export default TypePill;
