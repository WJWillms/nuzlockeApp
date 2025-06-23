import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';
import spriteMap from "./Pokedex/spriteMap";
import { Pokedex } from './Pokedex/sunMoonPokedex';
import soulockeTrainerTwoStyles from "./styles/soulockeTrainerTwoStyles";

const screenWidth = Dimensions.get('window').width;

const PokemonPicker = () => {
  const { trainerOneTeam } = useLocalSearchParams();
  const parsedTrainerOneTeam = JSON.parse(trainerOneTeam || '[]');

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(new Set());

  const router = useRouter();

  const handleConfirm = () => {
    const selectedArray = Array.from(selected);
    if (selectedArray.length !== parsedTrainerOneTeam.length) return;

    router.push({
      pathname: "/soulockeTeamBuilder",
      params: {
        trainerOneTeam,
        trainerTwoTeam: JSON.stringify(selectedArray),
      },
    });
  };

  const handleToggle = (id) => {
    const idStr = id.toString();
    const newSelected = new Set(selected);
    if (newSelected.has(idStr)) {
      newSelected.delete(idStr);
    } else if (newSelected.size < parsedTrainerOneTeam.length) {
      newSelected.add(idStr);
    }
    setSelected(newSelected);
  };

  const filteredPokemon = Object.entries(Pokedex).filter(([id, mon]) =>
    mon.name.toLowerCase().includes(search.toLowerCase())
  );

  const matchingMonId = parsedTrainerOneTeam[selected.size];
  const matchingMon = matchingMonId ? Pokedex[matchingMonId] : null;

  return (
    <View style={soulockeTrainerTwoStyles.container}>

      {/* 🧭 Search Row */}
      <View style={soulockeTrainerTwoStyles.searchRow}>
        <Text style={soulockeTrainerTwoStyles.trainerLabel}>Trainer 2 Choices</Text>

        {/* Search Bar */}
        <View style={soulockeTrainerTwoStyles.searchContainer}>
          <TextInput
            style={soulockeTrainerTwoStyles.searchInput}
            placeholder="Search Pokémon..."
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* 🎯 Matching To Display */}
        <View style={soulockeTrainerTwoStyles.matchingToContainer}>
          <Text style={soulockeTrainerTwoStyles.matchingToLabel}>Matching to:</Text>
          {matchingMon && (
            <View style={soulockeTrainerTwoStyles.matchingCard}>
              <Image
                source={spriteMap[matchingMon.spriteId]}
                style={soulockeTrainerTwoStyles.sprite}
              />
              <Text style={soulockeTrainerTwoStyles.name}>{matchingMon.name}</Text>
            </View>
          )}
        </View>
      </View>

      {/* 🧃 Pokémon Grid */}
      <View style={soulockeTrainerTwoStyles.gridWrapper}>
        <ScrollView contentContainerStyle={soulockeTrainerTwoStyles.gridScrollContent}>
          {filteredPokemon.map(([id, mon]) => {
            const isSelected = selected.has(id);
            return (
              <Pressable
                key={id}
                onPress={() => handleToggle(id)}
                style={[
                  soulockeTrainerTwoStyles.card,
                  isSelected && soulockeTrainerTwoStyles.cardSelected,
                ]}
              >
                <Image
                  source={spriteMap[mon.spriteId]}
                  style={soulockeTrainerTwoStyles.sprite}
                />
                <Text style={soulockeTrainerTwoStyles.name}>{mon.name}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* ✅ Confirm Button */}
      <View style={soulockeTrainerTwoStyles.buttonContainer}>
        <Pressable onPress={handleConfirm} style={soulockeTrainerTwoStyles.button}>
          <Text style={soulockeTrainerTwoStyles.buttonText}>
            Confirm Choices ({selected.size} / {parsedTrainerOneTeam.length})
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default PokemonPicker;
