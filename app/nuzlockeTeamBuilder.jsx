import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import spriteMap from "./Pokedex/spriteMap";
import { Pokedex } from './Pokedex/sunMoonPokedex';
import nuzlockeTBStyles from "./styles/nuzlockeTBStyles";

const NuzlockeTeamBuilder = () => {
  const router = useRouter();
  const { team } = useLocalSearchParams();
  const parsedTeam = JSON.parse(team); // array of selected Pokémon IDs
  const allValidTeams = getTeamsFromSelection(parsedTeam); // only max-sized combos
  const [teamIndex, setTeamIndex] = useState(0);
  const currentTeam = allValidTeams[teamIndex];

  // Helper function: generates all combinations of a given length
  function getCombinations(arr, k) {
    const result = [];
    const backtrack = (start, path) => {
      if (path.length === k) {
        result.push([...path]);
        return;
      }
      for (let i = start; i < arr.length; i++) {
        path.push(arr[i]);
        backtrack(i + 1, path);
        path.pop();
      }
    };
    backtrack(0, []);
    return result;
  }

  // Master function: decides best team size and returns combos
  function getTeamsFromSelection(selectedIds, maxTeamSize = 6) {
    const n = selectedIds.length;
    const size = Math.min(maxTeamSize, n);

    // Try from largest size down to 1
    for (let k = size; k >= 1; k--) {
      const combos = getCombinations(selectedIds, k);
      if (combos.length > 0) {
        return combos; // only return the highest possible team size
      }
    }

    return []; // fallback
  }

  return (
    <View>
      {/* Banner */}
      <View style={nuzlockeTBStyles.banner}>
        {teamIndex > 0 ? (
          <Pressable onPress={() => setTeamIndex((prev) => prev - 1)}>
            <Text style={nuzlockeTBStyles.navButton}>← Previous Team</Text>
          </Pressable>
        ) : <View style={nuzlockeTBStyles.placeholder} />}

        <Text style={nuzlockeTBStyles.teamTitle}>
          Team {teamIndex + 1} of {allValidTeams.length}
        </Text>

        {teamIndex < allValidTeams.length - 1 ? (
          <Pressable onPress={() => setTeamIndex((prev) => prev + 1)}>
            <Text style={nuzlockeTBStyles.navButton}>Next Team →</Text>
          </Pressable>
        ) : <View style={nuzlockeTBStyles.placeholder} />}
      </View>

      {/* Sprite Display */}
      <View style={nuzlockeTBStyles.teamContainer}>
        {currentTeam.map((id) => {
          const paddedId = id.toString().padStart(3, '0'); // 🔥 key fix here
          const pokemon = Pokedex[id];
          const sprite = spriteMap[paddedId];

          return (
            <View key={id} style={nuzlockeTBStyles.pokemonSlot}>
              <Image source={sprite} style={nuzlockeTBStyles.sprite} />
              <Text style={nuzlockeTBStyles.name}>{pokemon.name}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default NuzlockeTeamBuilder;

