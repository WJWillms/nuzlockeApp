import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
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
import soulockeStyles from "./styles/soulockeStyles";

const screenWidth = Dimensions.get('window').width;

const PokemonPicker = ({ onConfirm }) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(new Set());

  const router = useRouter();
  const { trainerOneTeam, trainerTwoTeam } = useLocalSearchParams();
  const parsedT1 = JSON.parse(trainerOneTeam || '[]');
  const parsedT2 = JSON.parse(trainerTwoTeam || '[]');

  const handleConfirm = () => {
    const selectedArray = Array.from(selected);

    // Build two sets:
    const updatedTrainerOneTeam = [...parsedT1, ...selectedArray]; // full
    const newOnlyTrainerOne = selectedArray; // just the additions

    router.push({
      pathname: "/soulockeTrainerTwo",
      params: {
        trainerOneTeam: JSON.stringify(updatedTrainerOneTeam),
        newTrainerOneOnly: JSON.stringify(newOnlyTrainerOne),
        trainerTwoTeam: JSON.stringify(parsedT2), // might be empty if first time
      },
    });
  };

  const handleToggle = (id) => {
    const newSelected = new Set(selected);
    newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
    setSelected(newSelected);
  };

  const filteredPokemon = Object.entries(Pokedex).filter(([id, mon]) =>
    mon.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={soulockeStyles.container}>
      {/* Search Bar */}
      {/* Search Row */}
      <View style={soulockeStyles.searchRow}>
        {/* Label on the left */}
        <Text style={soulockeStyles.trainerLabel}>Trainer 1 Choices</Text>

        {/* Search Bar in the center */}
        <View style={soulockeStyles.searchContainer}>
          <TextInput
            style={soulockeStyles.searchInput}
            placeholder="Search Pokémon..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>


      {/* Pokémon Grid */}
      <View style={soulockeStyles.gridWrapper}>
        <ScrollView contentContainerStyle={soulockeStyles.gridScrollContent}>
          {filteredPokemon.map(([id, mon]) => {
            const isSelected = selected.has(id);
            return (
              <Pressable
                key={id}
                onPress={() => handleToggle(id)}
                style={[
                  soulockeStyles.card,
                  isSelected && soulockeStyles.cardSelected,
                ]}
              >
                <Image
                  source={spriteMap[mon.spriteId]}
                  style={soulockeStyles.sprite}
                />
                <Text style={soulockeStyles.name}>{mon.name}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Confirm Button */}
      <View style={soulockeStyles.buttonContainer}>
        <Pressable onPress={handleConfirm} style={soulockeStyles.button}>
          <Text style={soulockeStyles.buttonText}>
            Confirm Choices ({selected.size})
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default PokemonPicker;