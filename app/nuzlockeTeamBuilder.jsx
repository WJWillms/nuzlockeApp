import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, Pressable, Text, View } from 'react-native';
import { PokemonType } from './Pokedex/PokemonType';
import spriteMap from "./Pokedex/spriteMap";
import { Pokedex } from './Pokedex/sunMoonPokedex';
import typeIconMap from './Pokedex/typeIconMap';
import nuzlockeTBStyles from "./styles/nuzlockeTBStyles";

const screenWidth = Dimensions.get('window').width;

const NuzlockeTeamBuilder = () => {
    const router = useRouter();
    const { team } = useLocalSearchParams();
    const parsedTeam = JSON.parse(team); // array of selected Pokémon IDs
    const allValidTeams = getTeamsFromSelection(parsedTeam);
    const [teamIndex, setTeamIndex] = useState(0);
    const currentTeam = allValidTeams[teamIndex];

    const typeNameToId = Object.fromEntries(
        Object.entries(PokemonType).map(([key, value]) => [key.toUpperCase(), value])
    );

    // Collect resistances for the current team
    const resistanceSummary = {
        immune: {},
        quarter: {},
        half: {},
    };

    currentTeam.forEach((id) => {
        const mon = Pokedex[id];
        if (!mon?.resistances) return;

        Object.entries(mon.resistances).forEach(([type, value]) => {
            const key = type.toUpperCase();

            if (value === 0) {
                resistanceSummary.immune[key] = (resistanceSummary.immune[key] || 0) + 1;
            } else if (value === 0.25) {
                resistanceSummary.quarter[key] = (resistanceSummary.quarter[key] || 0) + 1;
            } else if (value === 0.5) {
                resistanceSummary.half[key] = (resistanceSummary.half[key] || 0) + 1;
            }
        });
    });

    const weaknessSummary = {
        x2: {},
        x4: {},
    };

    currentTeam.forEach((id) => {
        const mon = Pokedex[id];
        if (!mon?.weaknesses) return;

        Object.entries(mon.weaknesses).forEach(([type, value]) => {
            const key = type.toUpperCase();
            if (value === 2) {
                weaknessSummary.x2[key] = (weaknessSummary.x2[key] || 0) + 1;
            } else if (value === 4) {
                weaknessSummary.x4[key] = (weaknessSummary.x4[key] || 0) + 1;
            }
        });
    });

    const teamStats = {
        hp: 0,
        attack: 0,
        defense: 0,
        specialAttack: 0,
        specialDefense: 0,
        speed: 0,
        totalBaseStats: 0,
    };

    currentTeam.forEach(id => {
        const p = Pokedex[id];
        if (!p) return;
        teamStats.hp += p.hp;
        teamStats.attack += p.attack;
        teamStats.defense += p.defense;
        teamStats.specialAttack += p.specialAttack;
        teamStats.specialDefense += p.specialDefense;
        teamStats.speed += p.speed;
        teamStats.totalBaseStats += p.totalBaseStats;
    });

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

    function getTeamsFromSelection(selectedIds, maxTeamSize = 6) {
        const n = selectedIds.length;
        const size = Math.min(maxTeamSize, n);

        for (let k = size; k >= 1; k--) {
            const combos = getCombinations(selectedIds, k);
            if (combos.length > 0) {
                return combos;
            }
        }
        return [];
    }

    return (
        <View style={{ flex: 1 }}>
            {/* Banner */}
            <View style={nuzlockeTBStyles.banner}>
                {teamIndex > 0 ? (
                    <Pressable onPress={() => setTeamIndex((prev) => prev - 1)}>
                        <Text style={nuzlockeTBStyles.navButton}>← Previous Team</Text>
                    </Pressable>
                ) : (
                    <View style={nuzlockeTBStyles.placeholder} />
                )}

                <Text style={nuzlockeTBStyles.teamTitle}>
                    Team {teamIndex + 1} of {allValidTeams.length}
                </Text>

                {teamIndex < allValidTeams.length - 1 ? (
                    <Pressable onPress={() => setTeamIndex((prev) => prev + 1)}>
                        <Text style={nuzlockeTBStyles.navButton}>Next Team →</Text>
                    </Pressable>
                ) : (
                    <View style={nuzlockeTBStyles.placeholder} />
                )}
            </View>

            {/* Sprite Display */}
            <View style={nuzlockeTBStyles.teamContainer}>
                {currentTeam.map((id) => {
                    const paddedId = id.toString().padStart(3, '0');
                    const pokemon = Pokedex[id];
                    const sprite = spriteMap[paddedId];

                    return (
                        <View key={id} style={{ alignItems: 'center' }}>
                            <View style={nuzlockeTBStyles.pokemonSlot}>
                                <Image source={sprite} style={nuzlockeTBStyles.sprite} />
                                <Text style={nuzlockeTBStyles.name}>{pokemon.name}</Text>
                            </View>

                            {/* Type Icons Below Sprite */}
                            <View
                                style={[
                                    nuzlockeTBStyles.typeIconRow,
                                    !pokemon.typeTwo && { justifyContent: 'center' },
                                ]}
                            >
                                <Image
                                    source={typeIconMap[pokemon.typeOneId]}
                                    style={nuzlockeTBStyles.typeIcon}
                                />
                                {pokemon.typeTwo && (
                                    <Image
                                        source={typeIconMap[pokemon.typeTwoId]}
                                        style={nuzlockeTBStyles.typeIcon}
                                    />
                                )}
                            </View>
                        </View>
                    );
                })}
            </View>

            {/* Bottom 3-column Section */}
            <View style={nuzlockeTBStyles.bottomSection}>
                {/* Column 1: Resistances */}
                <View style={nuzlockeTBStyles.column}>
                    <Text style={nuzlockeTBStyles.sectionHeader}>Resistances</Text>

                    {Object.keys(resistanceSummary.immune).length > 0 && (
                        <View>
                            <Text style={nuzlockeTBStyles.subHeader}>Immunities:</Text>
                            <View style={[nuzlockeTBStyles.resistRow, { flexWrap: 'wrap' }]}>
                                {Object.entries(resistanceSummary.immune).map(([type, count]) => {
                                    const typeId = typeNameToId[type];
                                    return (
                                        <View
                                            key={type}
                                            style={{
                                                width: '20%',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginBottom: 8,
                                            }}
                                        >
                                            <Image
                                                source={typeIconMap[typeId]}
                                                style={nuzlockeTBStyles.typeIconSmall}
                                            />
                                            <Text style={{ marginLeft: 6 }}>x{count}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    )}

                    {Object.keys(resistanceSummary.quarter).length > 0 && (
                        <View>
                            <Text style={nuzlockeTBStyles.subHeader}>0.25× Resistances:</Text>
                            <View style={[nuzlockeTBStyles.resistRow, { flexWrap: 'wrap' }]}>
                                {Object.entries(resistanceSummary.quarter).map(([type, count]) => {
                                    const typeId = typeNameToId[type];
                                    return (
                                        <View
                                            key={type}
                                            style={{
                                                width: '20%',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginBottom: 8,
                                            }}
                                        >
                                            <Image
                                                source={typeIconMap[typeId]}
                                                style={nuzlockeTBStyles.typeIconSmall}
                                            />
                                            <Text style={{ marginLeft: 6 }}>x{count}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    )}

                    {Object.keys(resistanceSummary.half).length > 0 && (
                        <View>
                            <Text style={nuzlockeTBStyles.subHeader}>0.5× Resistances:</Text>
                            <View style={[nuzlockeTBStyles.resistRow, { flexWrap: 'wrap' }]}>
                                {Object.entries(resistanceSummary.half).map(([type, count]) => {
                                    const typeId = typeNameToId[type];
                                    return (
                                        <View
                                            key={type}
                                            style={{
                                                width: '20%',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginBottom: 8,
                                            }}
                                        >
                                            <Image
                                                source={typeIconMap[typeId]}
                                                style={nuzlockeTBStyles.typeIconSmall}
                                            />
                                            <Text style={{ marginLeft: 6 }}>x{count}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    )}
                </View>

                {/* Column 2: Stats */}
                <View style={nuzlockeTBStyles.column}>
                    <Text style={[nuzlockeTBStyles.sectionHeader, { textAlign: 'center' }]}>Stats</Text>
                </View>


                {/* Column 3: Weaknesses */}
                <View style={nuzlockeTBStyles.column}>
                    <Text style={nuzlockeTBStyles.sectionHeader}>Weaknesses</Text>
                    <View>
                        {Object.keys(weaknessSummary.x4).length > 0 && (
                            <View>
                                <Text style={nuzlockeTBStyles.subHeader}>4× Weaknesses:</Text>
                                <View style={[nuzlockeTBStyles.resistRow, { flexWrap: 'wrap' }]}>
                                    {Object.entries(weaknessSummary.x4).map(([type, count]) => {
                                        const typeId = typeNameToId[type];
                                        return (
                                            <View
                                                key={type}
                                                style={{
                                                    width: '20%',
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    marginBottom: 8,
                                                }}
                                            >
                                                <Image
                                                    source={typeIconMap[typeId]}
                                                    style={nuzlockeTBStyles.typeIconSmall}
                                                />
                                                <Text style={{ marginLeft: 6 }}>x{count}</Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                        )}

                        {Object.keys(weaknessSummary.x2).length > 0 && (
                            <View>
                                <Text style={nuzlockeTBStyles.subHeader}>2× Weaknesses:</Text>
                                <View style={[nuzlockeTBStyles.resistRow, { flexWrap: 'wrap' }]}>
                                    {Object.entries(weaknessSummary.x2).map(([type, count]) => {
                                        const typeId = typeNameToId[type];
                                        return (
                                            <View
                                                key={type}
                                                style={{
                                                    width: '20%',
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    marginBottom: 8,
                                                }}
                                            >
                                                <Image
                                                    source={typeIconMap[typeId]}
                                                    style={nuzlockeTBStyles.typeIconSmall}
                                                />
                                                <Text style={{ marginLeft: 6 }}>x{count}</Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                        )}
                    </View>

                </View>
            </View>
        </View>
    );


};

export default NuzlockeTeamBuilder;

