// components/TypePill.js
import React from 'react';
import { Text, View } from 'react-native';
import { typeColorMap } from '../app/Pokedex/typeColorMap'; // adjust path as needed

const TypePill = ({ type }) => {
  const bgColor = typeColorMap[type.toUpperCase()] || '#ccc';

  return (
    <View style={{
      backgroundColor: bgColor,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 50
    }}>
      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>{type}</Text>
    </View>
  );
};

export default TypePill;
