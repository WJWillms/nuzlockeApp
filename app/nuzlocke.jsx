import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native';
import spriteMap from "./Pokedex/spriteMap";
import { Pokedex } from './Pokedex/sunMoonPokedex';
import nuzlockeStyles from "./styles/nuzlockeStyles";

const screenWidth = Dimensions.get('window').width;

const PokemonPicker = ({ onConfirm }) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(new Set());

  const handleToggle = (id) => {
    const newSelected = new Set(selected);
    newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
    setSelected(newSelected);
  };

  const filteredPokemon = Object.entries(Pokedex).filter(([id, mon]) =>
    mon.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={nuzlockeStyles.container}>
      {/* Search Bar */}
      <View style={nuzlockeStyles.searchContainer}>
        <TextInput
          style={nuzlockeStyles.searchInput}
          placeholder="Search Pokémon..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Pokémon Grid */}
      <ScrollView contentContainerStyle={nuzlockeStyles.grid}>
        {filteredPokemon.map(([id, mon]) => {
          const isSelected = selected.has(id);
          return (
            <Pressable
              key={id}
              onPress={() => handleToggle(id)}
              style={[
                nuzlockeStyles.card,
                isSelected && nuzlockeStyles.cardSelected,
              ]}
            >
              <Image
                source={spriteMap[mon.spriteId]}
                style={nuzlockeStyles.sprite}
              />
              <Text style={nuzlockeStyles.name}>{mon.name}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Confirm Button */}
      <View style={nuzlockeStyles.buttonContainer}>
        <Pressable
          onPress={() => onConfirm(Array.from(selected))}
          style={nuzlockeStyles.button}
        >
          <Text style={nuzlockeStyles.buttonText}>
            Confirm Choices ({selected.size})
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default PokemonPicker;
