import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, Text, View } from 'react-native';
import RadarChart from '../components/RadarChart';
import TypePill from '../components/TypePill';
import { PokemonType } from './Pokedex/PokemonType';
import spriteMap from "./Pokedex/spriteMap";
import { Pokedex } from './Pokedex/sunMoonPokedex';
import nuzlockeTBStyles from "./styles/nuzlockeTBStyles";


const screenWidth = Dimensions.get('window').width;

const NuzlockeTeamBuilder = () => {
    const router = useRouter();
    const { team } = useLocalSearchParams();
    const parsedTeam = JSON.parse(team); // array of selected Pokémon IDs
    const [teamIndex, setTeamIndex] = useState(0);

    const [activeCharts, setActiveCharts] = useState(['Total']);
    const individualColors = ['#f87171', '#34d399', '#60a5fa', '#facc15', '#a78bfa', '#fb923c']; //Colors for Charts
    const [selectedOption, setSelectedOption] = useState('none'); //For sorting picker
    const allValidTeams = getTeamsFromSelection(parsedTeam, 6, selectedOption);
    const currentTeam = allValidTeams[teamIndex];


    const typeNameToId = Object.fromEntries(
        Object.entries(PokemonType).map(([key, value]) => [key.toUpperCase(), value])
    );

    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    //                                   Resistances
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
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

    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    //                                   Weaknesses
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////

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

    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    //                                   Stats/Charts
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////

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

    const chartOptions = [
        {
            label: 'Total',
            stats: [
                teamStats.hp,
                teamStats.attack,
                teamStats.defense,
                teamStats.speed,
                teamStats.specialDefense,
                teamStats.specialAttack,
            ],
            color: '#007AFF',
        },
        ...currentTeam.map((id, idx) => {
            const p = Pokedex[id];
            const colors = ['#FF3B30', '#34C759', '#FF9500', '#AF52DE', '#5AC8FA', '#5856D6'];
            return {
                label: p.name,
                stats: [
                    p.hp,
                    p.attack,
                    p.defense,
                    p.speed,
                    p.specialDefense,
                    p.specialAttack,
                ],
                color: colors[idx % colors.length],
            };
        }),
    ];

    const toggleChart = (key) => {
        setActiveCharts(prev =>
            prev.includes(key)
                ? prev.filter(k => k !== key)
                : [...prev, key]
        );
    };

    const radarSeries = [];

    if (activeCharts.includes('total')) {
        radarSeries.push({
            label: 'Total',
            color: '#8884d8',
            stats: [
                teamStats.hp,
                teamStats.attack,
                teamStats.defense,
                teamStats.speed,
                teamStats.specialDefense,
                teamStats.specialAttack,
            ],
        });
    }

    currentTeam.forEach((id, idx) => {
        const mon = Pokedex[id];
        if (!mon) return;
        const key = `p${idx}`;
        if (activeCharts.includes(key)) {
            radarSeries.push({
                label: mon.name,
                color: individualColors[idx % individualColors.length],
                stats: [
                    mon.hp,
                    mon.attack,
                    mon.defense,
                    mon.speed,
                    mon.specialDefense,
                    mon.specialAttack,
                ],
            });
        }
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

    function getTeamsFromSelection(selectedIds, maxTeamSize = 6, sortOption = "none") {
        const n = selectedIds.length;
        const size = Math.min(maxTeamSize, n);

        for (let k = size; k >= 1; k--) {
            const combos = getCombinations(selectedIds, k);
            if (combos.length > 0) {
                return sortTeams(combos, sortOption);  // <- sort here
            }
        }
        return [];
    }

    function sortTeams(teams, option) {
        const getStatTotal = (team, key) => team.reduce((sum, id) => sum + (Pokedex[id]?.[key] || 0), 0);

        const getResistanceScore = (team) => {
            let score = 0;
            team.forEach(id => {
                const res = Pokedex[id]?.resistances || {};
                Object.values(res).forEach(val => {
                    if (val === 0) score += 3;
                    else if (val === 0.25) score += 2;
                    else if (val === 0.5) score += 1;
                });
            });
            return score;
        };

        const getWeaknessScore = (team) => {
            let score = 0;
            team.forEach(id => {
                const weak = Pokedex[id]?.weaknesses || {};
                Object.values(weak).forEach(val => {
                    if (val === 4) score += 2;
                    else if (val === 2) score += 1;
                });
            });
            return score;
        };

        switch (option) {
            case "total": return teams.sort((a, b) => getStatTotal(b, "totalBaseStats") - getStatTotal(a, "totalBaseStats"));
            case "attack": return teams.sort((a, b) => getStatTotal(b, "attack") - getStatTotal(a, "attack"));
            case "spatk": return teams.sort((a, b) => getStatTotal(b, "specialAttack") - getStatTotal(a, "specialAttack"));
            case "defense": return teams.sort((a, b) => getStatTotal(b, "defense") - getStatTotal(a, "defense"));
            case "spdef": return teams.sort((a, b) => getStatTotal(b, "specialDefense") - getStatTotal(a, "specialDefense"));
            case "speed": return teams.sort((a, b) => getStatTotal(b, "speed") - getStatTotal(a, "speed"));
            case "resist": return teams.sort((a, b) => getResistanceScore(b) - getResistanceScore(a));
            case "weak": return teams.sort((a, b) => getWeaknessScore(a) - getWeaknessScore(b));
            default: return teams;
        }
    }

    //Use Effect puts user back on the 1st team after selecting a new sort.
    useEffect(() => {
        setTeamIndex(0);
    }, [selectedOption]);



    const displayedStats = chartOptions
        .filter(entry => activeCharts.includes(entry.label))
        .map(entry => ({
            stats: entry.stats,
            color: entry.color,
        }));


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
            <View style={{ width: '100%', marginLeft: 120, alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', position: 'relative' }}>
                    {/* Sprite Display Block */}
                    <View style={{ alignItems: 'center' }}>
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

                                        {/* Type Icons */}
                                        <View
                                            style={[
                                                nuzlockeTBStyles.typeIconRow,
                                                !pokemon.typeTwo && { justifyContent: 'center' },
                                            ]}
                                        >
                                            <TypePill type={pokemon.typeOne} />
                                            {pokemon.typeTwo && (
                                                <TypePill type={pokemon.typeTwo} />
                                            )}
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    {/* Dropdown - shifted just right of sprites */}
                    <View
                        style={{
                            marginLeft: 100, // Adjust as needed
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Sort Options</Text>
                        <View
                            style={{
                                borderWidth: 1,
                                borderColor: '#ccc',
                                borderRadius: 8,
                                overflow: 'hidden',
                                width: 140,
                            }}
                        >
                            <Picker
                                selectedValue={selectedOption}
                                onValueChange={(itemValue) => setSelectedOption(itemValue)}
                                style={{
                                    height: 40,
                                    width: '100%',
                                }}
                            >
                                <Picker.Item label="None" value="none" />
                                <Picker.Item label="Total Stats" value="total" />
                                <Picker.Item label="Highest Attack" value="attack" />
                                <Picker.Item label="Highest Special Attack" value="spatk" />
                                <Picker.Item label="Highest Defense" value="defense" />
                                <Picker.Item label="Highest Special Defense" value="spdef" />
                                <Picker.Item label="Highest Speed" value="speed" />
                                <Picker.Item label="Most Resistances" value="resist" />
                                <Picker.Item label="Least Weaknesses" value="weak" />
                            </Picker>
                        </View>
                    </View>
                </View>
            </View>




            {/* Bottom 3-column Section */}
            <View style={nuzlockeTBStyles.bottomSection}>
                {/* Column 1: Resistances */}
                <View style={nuzlockeTBStyles.column}>
                    <Text style={nuzlockeTBStyles.sectionHeader}>RESISTANCES</Text>

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
                                            <TypePill type={type} />
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
                                            <TypePill type={type} />
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
                                            <TypePill type={type} />
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
                    <Text style={nuzlockeTBStyles.sectionHeader}>STATS</Text>

                    <View style={nuzlockeTBStyles.chartWithButtons}>
                        {/* Radar Chart */}
                        <RadarChart
                            data={displayedStats} // ← active overlays (team + toggled Pokémon)
                            labels={['HP', 'ATK', 'DEF', 'SPD', 'SpD', 'SpA']}
                            size={180}
                        />

                        {/* Buttons */}
                        <View style={nuzlockeTBStyles.chartButtonContainer}>
                            {chartOptions.map((entry, index) => (
                                <Pressable
                                    key={index}
                                    onPress={() => toggleChart(entry.label)}
                                    style={[
                                        nuzlockeTBStyles.chartButton,
                                        { backgroundColor: entry.color + 'cc' }, // translucent color
                                        activeCharts.includes(entry.label) && nuzlockeTBStyles.chartButtonActive,
                                    ]}
                                >
                                    <Text style={nuzlockeTBStyles.chartButtonText}>{entry.label}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    {/* Stat Totals Below */}
                    <View style={nuzlockeTBStyles.statsTotalsContainer}>
                        {[
                            ['HP:', teamStats.hp],
                            ['Attack:', teamStats.attack],
                            ['Defense:', teamStats.defense],
                            ['Special Attack:', teamStats.specialAttack],
                            ['Special Defense:', teamStats.specialDefense],
                            ['Speed:', teamStats.speed],
                            ['Total Base Stats:', teamStats.totalBaseStats],
                        ].map(([label, value]) => (
                            <View key={label} style={nuzlockeTBStyles.statRow}>
                                <Text style={nuzlockeTBStyles.statLabel}>{label}</Text>
                                <Text
                                    style={[
                                        nuzlockeTBStyles.statValue,
                                        label === 'Total Base Stats:' && nuzlockeTBStyles.statValueBold,
                                    ]}
                                >
                                    {value}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>



                {/* Column 3: Weaknesses */}
                <View style={nuzlockeTBStyles.column}>
                    <Text style={nuzlockeTBStyles.sectionHeader}>WEAKNESSES</Text>
                    <View>
                        {/* 4× Weaknesses */}
                        {Object.keys(weaknessSummary.x4).length > 0 && (
                            <View>
                                <Text style={nuzlockeTBStyles.subHeader}>4× Weaknesses:</Text>
                                <View style={[nuzlockeTBStyles.resistRow, { flexWrap: 'wrap' }]}>
                                    {Object.entries(weaknessSummary.x4).map(([type, count]) => {
                                        const typeId = typeNameToId[type];

                                        // Check if this type is covered in any resistance
                                        const isCovered =
                                            resistanceSummary.immune[type] ||
                                            resistanceSummary.half[type] ||
                                            resistanceSummary.quarter[type];

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
                                                <TypePill type={type} glow={!isCovered} />
                                                <Text style={{ marginLeft: 6 }}>x{count}</Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                        )}

                        {/* 2× Weaknesses */}
                        {Object.keys(weaknessSummary.x2).length > 0 && (
                            <View>
                                <Text style={nuzlockeTBStyles.subHeader}>2× Weaknesses:</Text>
                                <View style={[nuzlockeTBStyles.resistRow, { flexWrap: 'wrap' }]}>
                                    {Object.entries(weaknessSummary.x2).map(([type, count]) => {
                                        const typeId = typeNameToId[type];

                                        const isCovered =
                                            resistanceSummary.immune[type] ||
                                            resistanceSummary.half[type] ||
                                            resistanceSummary.quarter[type];

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
                                                <TypePill type={type} glow={!isCovered} />
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

