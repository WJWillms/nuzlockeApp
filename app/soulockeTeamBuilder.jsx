import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import PokemonDetailModal from "../components/PokemonDetailModal";
import RadarChart from '../components/RadarChart';
import { clearSoulockeData, clearSoulockeTeamsOnly, loadSoulockeData, saveSoulockeData } from "../components/storage"; // adjust path if needed
import TypePill from '../components/TypePill';
import spriteMap from "./Pokedex/spriteMap";
import { Pokedex } from './Pokedex/sunMoonPokedex';
import soulockeTBStyles from "./styles/soulockeTBStyles";




const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const soulockeTeamBuilder = () => {
    const router = useRouter();
    const { trainerOneTeam, trainerTwoTeam } = useLocalSearchParams();


    const parsedTrainerOneTeam = JSON.parse(trainerOneTeam || '[]');
    const parsedTrainerTwoTeam = JSON.parse(trainerTwoTeam || '[]');

    const [localTrainerOneTeam, setLocalTrainerOneTeam] = useState(parsedTrainerOneTeam);
    const [localTrainerTwoTeam, setLocalTrainerTwoTeam] = useState(parsedTrainerTwoTeam);

    const [teamIndex, setTeamIndex] = useState(0);
    const [validCombos, setValidCombos] = useState([]);
    const [sortOption, setSortOption] = useState('none');


    // Inside your component function, near the top (before using team1/team2)
    const sortedCombos = sortCombosByOption(
        validCombos,
        localTrainerOneTeam,
        localTrainerTwoTeam,
        sortOption
    );
    // 1. Ensure teamIndex stays valid
    const safeTeamIndex = Math.min(teamIndex, sortedCombos.length - 1);

    // Then use sortedCombos to get current indices:
    const currentIndices = sortedCombos[safeTeamIndex] || [];

    const team1 = currentIndices.map(i => localTrainerOneTeam[i]).filter(Boolean);
    const team2 = currentIndices.map(i => localTrainerTwoTeam[i]).filter(Boolean);


    const [activeCharts, setActiveCharts] = useState(['T1_Total', 'T2_Total']);

    const individualColors = ['#f87171', '#34d399', '#60a5fa', '#facc15', '#a78bfa', '#fb923c']; //Colors for Charts

    const [showFlyerModal, setShowFlyerModal] = useState(false);
    const [flyingTypePairs, setFlyingTypePairs] = useState([]);
    const [toggleStates, setToggleStates] = useState({});
    const [flyerTypeOverrides, setFlyerTypeOverrides] = useState({});
    const [tempOverrides, setTempOverrides] = useState({});

    const [ruleBreakingOption, setRuleBreakingOption] = useState('no'); // default to "no"

    const [focusPair, setFocusPair] = useState(null);
    const [allPairs, setAllPairs] = useState([]);

    const [showRemovePairs, setShowRemovePairs] = useState(false);
    const [tempRemovedPairs, setTempRemovedPairs] = useState({});

    const [selectedPokemon, setSelectedPokemon] = useState(null);




    <PokemonDetailModal
        visible={!!selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
        pokemon={selectedPokemon}
    />



    //Used to help Load/Save Storage
    useEffect(() => {
        (async () => {
            try {
                const savedData = await loadSoulockeData();

                const hasSavedTeams =
                    savedData &&
                    (Array.isArray(savedData.trainer1Team) && savedData.trainer1Team.length > 0 ||
                        Array.isArray(savedData.trainer2Team) && savedData.trainer2Team.length > 0);

                if (hasSavedTeams) {
                    // --- Load saved data ---
                    setLocalTrainerOneTeam(savedData.trainer1Team || []);
                    setLocalTrainerTwoTeam(savedData.trainer2Team || []);

                    if (savedData.flyerEdits) setFlyerTypeOverrides(savedData.flyerEdits);
                    if (savedData.ruleBreakingOption) setRuleBreakingOption(savedData.ruleBreakingOption);
                    if (savedData.focusPair !== undefined) setFocusPair(savedData.focusPair);
                    if (savedData.sortOption) setSortOption(savedData.sortOption);

                    console.log("Loaded saved Soulocke data");
                } else {
                    // --- No teams saved: preserve settings but use new teams ---
                    const preservedFlyerEdits = savedData?.flyerEdits || flyerTypeOverrides;
                    const preservedRuleOption = savedData?.ruleBreakingOption || ruleBreakingOption;
                    const preservedFocusPair = savedData?.focusPair ?? focusPair;
                    const preservedSort = savedData?.sortOption || sortOption;

                    // Load preserved settings into state
                    if (preservedFlyerEdits) setFlyerTypeOverrides(preservedFlyerEdits);
                    if (preservedRuleOption) setRuleBreakingOption(preservedRuleOption);
                    if (preservedFocusPair !== undefined) setFocusPair(preservedFocusPair);
                    if (preservedSort) setSortOption(preservedSort);

                    // Use incoming teams from params
                    setLocalTrainerOneTeam(parsedTrainerOneTeam);
                    setLocalTrainerTwoTeam(parsedTrainerTwoTeam);

                    // Save combined data
                    await saveSoulockeData({
                        trainer1Team: parsedTrainerOneTeam,
                        trainer2Team: parsedTrainerTwoTeam,
                        flyerEdits: preservedFlyerEdits,
                        ruleBreakingOption: preservedRuleOption,
                        focusPair: preservedFocusPair,
                        sortOption: preservedSort,
                    });

                    console.log("Initialized new Soulocke data (preserved flyer edits and settings)");
                }
            } catch (err) {
                console.error("Error loading Soulocke data:", err);
            }
        })();
    }, []);


    //Used to help save storage.
    useEffect(() => {
        const saveAll = async () => {
            try {
                await saveSoulockeData({
                    trainer1Team: localTrainerOneTeam,
                    trainer2Team: localTrainerTwoTeam,
                    flyerEdits: flyerTypeOverrides,
                    ruleBreakingOption,
                    focusPair,
                    sortOption,
                });
            } catch (err) {
                console.error("Error auto-saving Soulocke data:", err);
            }
        };

        // Only save after initial load to avoid overwriting before data is ready
        if (localTrainerOneTeam.length || localTrainerTwoTeam.length) {
            saveAll();
        }
    }, [
        localTrainerOneTeam,
        localTrainerTwoTeam,
        flyerTypeOverrides,
        ruleBreakingOption,
        focusPair,
        sortOption,
    ]);









    // You now have Trainer 1 and 2's Pokémon IDs for this combo


    useEffect(() => {
        const buildValidCombos = () => {
            const totalCount = localTrainerOneTeam.length;
            const indexList = Array.from({ length: totalCount }, (_, i) => i);

            let maxValidCombos = [];
            let currentSize = Math.min(6, totalCount);

            while (currentSize > 0 && maxValidCombos.length === 0) {
                const allCombos = getCombinations(indexList, currentSize);

                const validCombos = allCombos.filter((combo) => {
                    // If a focus pair is selected, skip combos that don't include it
                    const focusIndex = focusPair !== null ? Number(focusPair) : null;
                    if (focusIndex !== null && !combo.includes(focusIndex)) {
                        return false;
                    }



                    const typeCounts = {};

                    for (let i = 0; i < combo.length; i++) {
                        const idx = combo[i];

                        const mon1Id = localTrainerOneTeam[idx];
                        const mon2Id = localTrainerTwoTeam[idx];

                        const mon1 = Pokedex[mon1Id];
                        const mon2 = Pokedex[mon2Id];

                        const key1 = `T1-${idx}`;
                        const key2 = `T2-${idx}`;

                        const mon1Type = flyerTypeOverrides[key1] ? mon1.typeTwoId : mon1.typeOneId;
                        const mon2Type = flyerTypeOverrides[key2] ? mon2.typeTwoId : mon2.typeOneId;

                        // Track type usage
                        typeCounts[mon1Type] = (typeCounts[mon1Type] || 0) + 1;
                        typeCounts[mon2Type] = (typeCounts[mon2Type] || 0) + 1;
                    }

                    const typeFrequencies = Object.values(typeCounts);

                    if (ruleBreakingOption === 'yes') {
                        const numTwos = typeFrequencies.filter((count) => count === 2).length;
                        const hasThreesOrMore = typeFrequencies.some((count) => count > 2);
                        return numTwos <= 1 && !hasThreesOrMore;
                    } else {
                        return typeFrequencies.every((count) => count === 1);
                    }
                });

                if (validCombos.length > 0) {
                    maxValidCombos = validCombos;
                } else {
                    currentSize--;
                }
            }

            setValidCombos(maxValidCombos);
        };

        buildValidCombos();
    }, [
        trainerOneTeam,
        trainerTwoTeam,
        flyerTypeOverrides,
        ruleBreakingOption,
        focusPair,
        localTrainerOneTeam,
        localTrainerTwoTeam
    ]);




    //Build Flying pairs
    useEffect(() => {

        const newFlyingMonEntries = [];

        localTrainerOneTeam.forEach((id1, index) => {
            const id2 = localTrainerTwoTeam[index];
            const mon1 = Pokedex[id1];
            const mon2 = Pokedex[id2];

            const isMon1Flying = mon1?.typeOne === 'Flying' || mon1?.typeTwo === 'Flying';
            const isMon2Flying = mon2?.typeOne === 'Flying' || mon2?.typeTwo === 'Flying';

            if (isMon1Flying) {
                newFlyingMonEntries.push({
                    index,
                    flyingMon: id1,
                    partnerMon: id2,
                    focus: 't1', // Trainer 1 is the flyer
                });
            }

            if (isMon2Flying) {
                newFlyingMonEntries.push({
                    index,
                    flyingMon: id2,
                    partnerMon: id1,
                    focus: 't2', // Trainer 2 is the flyer
                });
            }
        });

        setFlyingTypePairs(newFlyingMonEntries);
    }, [localTrainerOneTeam, localTrainerTwoTeam]);

    //Build all pairs
    useEffect(() => {
        const pairs = localTrainerOneTeam.map((mon1Id, idx) => {
            const mon2Id = localTrainerTwoTeam[idx];
            return {
                index: idx,
                label: `${Pokedex[mon1Id].name} / ${Pokedex[mon2Id].name}`,
            };
        });

        setAllPairs(pairs);
    }, [trainerOneTeam, trainerTwoTeam, localTrainerOneTeam, localTrainerTwoTeam]);

    //useEffect to make sure screen doesnt break at 0 pairs
    useEffect(() => {
        if (teamIndex >= sortedCombos.length) {
            setTeamIndex(Math.max(sortedCombos.length - 1, 0));
        }
    }, [sortedCombos]);

    //UseEffect to stop breaking on multiple pair deletes
    useEffect(() => {
        if (teamIndex >= sortedCombos.length) {
            setTeamIndex(Math.max(sortedCombos.length - 1, 0));
        }
    }, [sortedCombos]);



    const getCombinations = (arr, k) => {
        const result = [];
        const combo = [];

        const recurse = (start) => {
            if (combo.length === k) {
                result.push([...combo]);
                return;
            }
            for (let i = start; i < arr.length; i++) {
                combo.push(arr[i]);
                recurse(i + 1);
                combo.pop();
            }
        };

        recurse(0);
        return result;
    };

    //Add Pairs function
    const handleAddPairs = async () => {
        try {
            await clearSoulockeTeamsOnly(); // Clear only teams, keep settings
            router.push({
                pathname: "/soulocke",
                params: {
                    trainerOneTeam: JSON.stringify(localTrainerOneTeam),
                    trainerTwoTeam: JSON.stringify(localTrainerTwoTeam),
                },
            });
        } catch (error) {
            console.error("Error clearing Soulocke data before adding pairs:", error);
            // still route even if it fails, to avoid blocking user
            router.push({
                pathname: "/soulocke",
                params: {
                    trainerOneTeam: JSON.stringify(localTrainerOneTeam),
                    trainerTwoTeam: JSON.stringify(localTrainerTwoTeam),
                },
            });
        }
    };





    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    //                                   Resistances
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    const buildResistanceSummary = (team) => {
        const summary = {
            immune: {},
            quarter: {},
            half: {},
        };

        team.forEach((id) => {
            const mon = Pokedex[id];
            if (!mon?.resistances) return;

            Object.entries(mon.resistances).forEach(([type, value]) => {
                const key = type.toUpperCase();

                if (value === 0) {
                    summary.immune[key] = (summary.immune[key] || 0) + 1;
                } else if (value === 0.25) {
                    summary.quarter[key] = (summary.quarter[key] || 0) + 1;
                } else if (value === 0.5) {
                    summary.half[key] = (summary.half[key] || 0) + 1;
                }
            });
        });

        return summary;
    };

    const resistanceSummaryTrainer1 = buildResistanceSummary(team1);
    const resistanceSummaryTrainer2 = buildResistanceSummary(team2);


    const renderResistanceRowT2 = (summary) => {
        const categories = [
            { label: 'Immunities', key: 'immune' },
            { label: '0.25×', key: 'quarter' },
            { label: '0.5×', key: 'half' },
        ];

        const groupIntoColumns = (entries, itemsPerCol = 4) => {
            const columns = [];
            for (let i = 0; i < entries.length; i += itemsPerCol) {
                columns.push(entries.slice(i, i + itemsPerCol));
            }
            return columns;
        };

        return (
            <View style={[soulockeTBStyles.resistancesRow, { flexDirection: 'row' }]}>
                {categories.map(({ label, key }, index) => {
                    const entries = Object.entries(summary[key] || {});
                    const columns = groupIntoColumns(entries, 6);

                    // Apply flex values instead of width percentages
                    let columnStyle = {};
                    if (label === '0.5×') {
                        columnStyle = { flex: 2 };
                    } else if (label === 'Immunities') {
                        columnStyle = { flex: 1, paddingLeft: 8 }; // 👈 nudge right
                    } else {
                        columnStyle = { flex: 1 };
                    }


                    return (
                        <View key={key} style={[soulockeTBStyles.resistancesColumn, columnStyle]}>
                            <Text style={soulockeTBStyles.subHeader}>{label}</Text>
                            <View style={soulockeTBStyles.resistancesGrid}>
                                {columns.map((col, colIndex) => (
                                    <View key={colIndex} style={soulockeTBStyles.resistanceGroup}>
                                        {col.map(([type, count]) => (
                                            <View key={type} style={soulockeTBStyles.typeRow}>
                                                <TypePill type={type} />
                                                <Text style={{ marginLeft: 4 }}>x{count}</Text>
                                            </View>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        </View>
                    );
                })}
            </View>
        );
    };


    const renderResistanceRowT1 = (summary) => {
        const categories = [
            { label: '0.5×', key: 'half' },
            { label: '0.25×', key: 'quarter' },
            { label: 'Immunities', key: 'immune' },
        ];

        const groupIntoColumns = (entries, itemsPerCol = 4) => {
            const columns = [];
            for (let i = 0; i < entries.length; i += itemsPerCol) {
                columns.push(entries.slice(i, i + itemsPerCol));
            }
            return columns;
        };

        return (
            <View style={soulockeTBStyles.resistancesRow}>
                {categories.map(({ label, key }) => {
                    const entries = Object.entries(summary[key] || {});
                    const columns = groupIntoColumns(entries, 6); // Limit 5 per column

                    // Assign flex widths and optional padding for alignment
                    let columnStyle = {};
                    if (label === '0.5×') {
                        columnStyle = { flex: 2 }; // widest
                    } else if (label === 'Immunities') {
                        columnStyle = { flex: 1, paddingRight: 8 }; // 👈 nudge left slightly
                    } else {
                        columnStyle = { flex: 1 };
                    }

                    return (
                        <View key={key} style={[soulockeTBStyles.resistancesColumn, columnStyle]}>
                            <Text style={soulockeTBStyles.subHeaderTOne}>{label}</Text>
                            <View style={soulockeTBStyles.resistancesGridTOne}>
                                {columns.map((col, colIndex) => (
                                    <View key={colIndex} style={soulockeTBStyles.resistanceGroupTOne}>
                                        {col.map(([type, count]) => (
                                            <View key={type} style={soulockeTBStyles.typeRow}>
                                                <TypePill type={type} />
                                                <Text style={{ marginLeft: 4, textAlign: 'right' }}>x{count}</Text>
                                            </View>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        </View>
                    );
                })}
            </View>
        );
    };


    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    //                                   Weaknesses
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////

    const buildWeaknessSummary = (team) => {
        const summary = {
            x2: {},
            x4: {},
        };

        team.forEach((id) => {
            const mon = Pokedex[id];
            if (!mon?.weaknesses) return;

            Object.entries(mon.weaknesses).forEach(([type, value]) => {
                const key = type.toUpperCase();
                if (value === 2) {
                    summary.x2[key] = (summary.x2[key] || 0) + 1;
                } else if (value === 4) {
                    summary.x4[key] = (summary.x4[key] || 0) + 1;
                }
            });
        });

        return summary;
    };

    const weaknessSummaryTrainer1 = buildWeaknessSummary(team1);
    const weaknessSummaryTrainer2 = buildWeaknessSummary(team2);

    const renderWeaknessRowT1 = (summary, resistanceSummary) => {
        const categories = [
            { label: '4x', key: 'x4' },
            { label: '2x', key: 'x2' },

        ];

        const groupIntoColumns = (entries, itemsPerCol = 5) => {
            const columns = [];
            for (let i = 0; i < entries.length; i += itemsPerCol) {
                columns.push(entries.slice(i, i + itemsPerCol));
            }
            return columns;
        };

        return (
            <View style={soulockeTBStyles.resistancesRow}>
                {categories.map(({ label, key }) => {
                    const entries = Object.entries(summary[key] || {});
                    const columns = groupIntoColumns(entries, 6);

                    const isTwoX = label === '2x';
                    const isFourX = label === '4x';

                    return (
                        <View
                            key={key}
                            style={[
                                soulockeTBStyles.resistancesColumn,
                                isTwoX && { marginRight: 20 },
                                isFourX && { marginLeft: 40 }
                            ]}
                        >
                            <Text style={soulockeTBStyles.subHeaderTOne}>{label}</Text>
                            <View style={soulockeTBStyles.resistancesGridTOne}>
                                {columns.map((col, colIndex) => (
                                    <View key={colIndex} style={soulockeTBStyles.resistanceGroup}>
                                        {col.map(([type, count]) => {
                                            const isCovered =
                                                resistanceSummary.immune[type] ||
                                                resistanceSummary.half[type] ||
                                                resistanceSummary.quarter[type];

                                            return (
                                                <View key={type} style={soulockeTBStyles.typeRow}>
                                                    <TypePill type={type} glow={!isCovered} />
                                                    <Text style={soulockeTBStyles.weaknessCountText}>
                                                        x{count}
                                                    </Text>
                                                </View>
                                            );
                                        })}
                                    </View>
                                ))}
                            </View>
                        </View>
                    );
                })}
            </View>
        );
    };


    const renderWeaknessRowT2 = (summary, resistanceSummary) => {
        const categories = [
            { label: '2x', key: 'x2' },
            { label: '4x', key: 'x4' },
        ];

        const groupIntoColumns = (entries, itemsPerCol = 5) => {
            const columns = [];
            for (let i = 0; i < entries.length; i += itemsPerCol) {
                columns.push(entries.slice(i, i + itemsPerCol));
            }
            return columns;
        };

        return (
            <View style={soulockeTBStyles.weaknessesRowTTwo}>
                {categories.map(({ label, key }) => {
                    const entries = Object.entries(summary?.[key] || {});
                    const columns = groupIntoColumns(entries, 6); // adjust 6 to balance your rows

                    const isTwoX = label === '2x';
                    const isFourX = label === '4x';

                    return (
                        <View
                            key={key}
                            style={[
                                soulockeTBStyles.resistancesColumn,
                                isTwoX && { marginLeft: 20 },
                                isFourX && { marginRight: 40 },
                            ]}
                        >
                            <Text style={soulockeTBStyles.weaknessHeaderTTwo}>{label}</Text>
                            <View style={soulockeTBStyles.weaknessesGridTTwo}>
                                {columns.map((col, colIndex) => (
                                    <View key={colIndex} style={soulockeTBStyles.weaknessGroupTTwo}>
                                        {col.map(([type, count]) => {
                                            const isCovered =
                                                resistanceSummary?.immune?.[type] ||
                                                resistanceSummary?.half?.[type] ||
                                                resistanceSummary?.quarter?.[type];

                                            return (
                                                <View key={type} style={soulockeTBStyles.typeRow}>
                                                    <TypePill type={type} glow={!isCovered} />
                                                    <Text style={soulockeTBStyles.weaknessCountText}>
                                                        x{count}
                                                    </Text>
                                                </View>
                                            );
                                        })}
                                    </View>
                                ))}
                            </View>
                        </View>
                    );
                })}
            </View>
        );
    };


    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    //                                   Stats/Charts
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////




    const buildStatsSummary = (team, labelPrefix = '') => {
        const stats = {
            hp: 0,
            attack: 0,
            defense: 0,
            specialAttack: 0,
            specialDefense: 0,
            speed: 0,
            totalBaseStats: 0,
        };

        const chartOptions = [
            {
                label: `${labelPrefix}_Total`, // <- unique internal label
                displayLabel: 'Total',         // <- shown on the button
                stats: [],
                color: '#007AFF',
            }
        ];

        team.forEach((id, idx) => {
            const mon = Pokedex[id];
            if (!mon) return;
            stats.hp += mon.hp;
            stats.attack += mon.attack;
            stats.defense += mon.defense;
            stats.specialAttack += mon.specialAttack;
            stats.specialDefense += mon.specialDefense;
            stats.speed += mon.speed;
            stats.totalBaseStats += mon.totalBaseStats;

            chartOptions.push({
                label: `${labelPrefix}_${mon.name}`,   // unique
                displayLabel: mon.displayName || mon.name,
                stats: [mon.hp, mon.attack, mon.defense, mon.speed, mon.specialDefense, mon.specialAttack],
                color: individualColors[idx % individualColors.length],
            });
        });

        chartOptions[0].stats = [stats.hp, stats.attack, stats.defense, stats.speed, stats.specialDefense, stats.specialAttack];

        return { stats, chartOptions };
    };

    const renderStatsSection = (team, labelPrefix) => {
        const { stats, chartOptions } = buildStatsSummary(team, labelPrefix);

        const computeSelectedStats = () => {
            const selected = chartOptions.filter(o => activeCharts.includes(o.label));
            const selectedNonTotal = selected.filter(o => o.displayLabel !== 'Total');
            const isTotalIncluded = selected.some(o => o.displayLabel === 'Total');

            // Default case: only Total or nothing
            if (selectedNonTotal.length === 0) {
                return {
                    showCombined: false,
                    stats: stats,
                };
            }

            // Combine selected non-total entries
            const combinedStats = {
                hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0, totalBaseStats: 0,
            };

            selectedNonTotal.forEach(entry => {
                const [hp, atk, def, spd, spDef, spAtk] = entry.stats;
                combinedStats.hp += hp;
                combinedStats.attack += atk;
                combinedStats.defense += def;
                combinedStats.speed += spd;
                combinedStats.specialDefense += spDef;
                combinedStats.specialAttack += spAtk;
                combinedStats.totalBaseStats += hp + atk + def + spd + spDef + spAtk;
            });

            return {
                showCombined: isTotalIncluded,
                stats: combinedStats,
            };
        };

        const { showCombined, stats: displayedStats } = computeSelectedStats();

        return (
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: screenHeight * 0.025, marginLeft: screenWidth * 0.015 }}>
                {/* Radar Chart (left) */}
                <RadarChart
                    data={chartOptions.filter(o => activeCharts.includes(o.label))}
                    labels={['HP', 'ATK', 'DEF', 'SPD', 'SpD', 'SpA']}
                    size={120}
                />

                {/* Buttons + Stats Column */}
                <View style={{ flexDirection: 'row', flex: 1, marginLeft: screenWidth * 0.035 }}>
                    {/* Buttons Grid (center) */}
                    <View style={{ flex: 0.4 }}>
                        {/* Total Button */}
                        <View style={{ alignItems: 'center', marginBottom: screenHeight * 0.015 }}>
                            {chartOptions
                                .filter(o => o.displayLabel === 'Total')
                                .map((entry, index) => (
                                    <Pressable
                                        key={index}
                                        onPress={() => toggleChart(entry.label)}
                                        style={[
                                            soulockeTBStyles.chartButton,
                                            {
                                                backgroundColor: entry.color + 'cc',
                                                width: '50%',
                                            },
                                            activeCharts.includes(entry.label) && soulockeTBStyles.chartButtonActive,
                                        ]}
                                    >
                                        <Text style={soulockeTBStyles.chartButtonText}>{entry.displayLabel}</Text>
                                    </Pressable>
                                ))}
                        </View>

                        {/* Pokémon Buttons */}
                        <View style={{ flexDirection: 'column' }}>
                            {Array.from({ length: 3 }).map((_, rowIndex) => (
                                <View
                                    key={rowIndex}
                                    style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: screenHeight * 0.01 }}
                                >
                                    {[0, 1].map(colIndex => {
                                        const buttonIndex = rowIndex * 2 + colIndex;
                                        const entry = chartOptions.filter(o => o.displayLabel !== 'Total')[buttonIndex];
                                        if (!entry) return <View key={colIndex} style={{ width: '48%' }} />;
                                        return (
                                            <Pressable
                                                key={entry.label}
                                                onPress={() => toggleChart(entry.label)}
                                                style={[
                                                    soulockeTBStyles.chartButton,
                                                    {
                                                        backgroundColor: entry.color + 'cc',
                                                        width: '48%',
                                                    },
                                                    activeCharts.includes(entry.label) && soulockeTBStyles.chartButtonActive,
                                                ]}
                                            >
                                                <Text style={soulockeTBStyles.chartButtonText}>{entry.displayLabel}</Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Stat Totals (right) */}
                    <View style={{ marginLeft: screenWidth * 0.055, flex: 0.2 }}>
                        {[
                            ['HP:', displayedStats.hp],
                            ['Attack:', displayedStats.attack],
                            ['Defense:', displayedStats.defense],
                            ['Sp. Atk:', displayedStats.specialAttack],
                            ['Sp. Def:', displayedStats.specialDefense],
                            ['Speed:', displayedStats.speed],
                            ['Total:', null], // We'll custom-render this row
                        ].map(([statLabel, value]) => {
                            const isTotalRow = statLabel === 'Total:';
                            let displayValue = value;

                            if (isTotalRow) {
                                const selected = chartOptions.filter(o => activeCharts.includes(o.label));
                                const totalIncluded = selected.some(o => o.displayLabel === 'Total');
                                const nonTotalSelected = selected.filter(o => o.displayLabel !== 'Total');

                                if (nonTotalSelected.length > 0 && totalIncluded) {
                                    displayValue = `${displayedStats.totalBaseStats} / ${stats.totalBaseStats}`;
                                } else if (nonTotalSelected.length > 0) {
                                    displayValue = displayedStats.totalBaseStats;
                                } else {
                                    displayValue = stats.totalBaseStats;
                                }
                            }

                            return (
                                <View
                                    key={statLabel}
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginBottom: 4,
                                        width: 140,
                                    }}
                                >
                                    <Text
                                        style={[soulockeTBStyles.statLabel, { textAlign: 'left', flex: 1, fontSize: 16 }]}
                                    >
                                        {statLabel}
                                    </Text>
                                    <Text
                                        style={[
                                            soulockeTBStyles.statValue,
                                            isTotalRow && soulockeTBStyles.statValueBold,
                                            { textAlign: 'right', width: 80 },
                                        ]}
                                    >
                                        {displayValue}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                </View>
            </View>
        );
    };


    const renderStatsSectionTTwo = (team, labelPrefix) => {
        const { stats: totalStats, chartOptions } = buildStatsSummary(team, labelPrefix);

        const computeSelectedStats = () => {
            const selected = chartOptions.filter(o => activeCharts.includes(o.label));
            const selectedNonTotal = selected.filter(o => o.displayLabel !== 'Total');
            const isTotalIncluded = selected.some(o => o.displayLabel === 'Total');

            // Only total or nothing
            if (selectedNonTotal.length === 0) {
                return {
                    showCombined: false,
                    stats: totalStats,
                    label: 'Total',
                };
            }

            // Combine selected
            const combinedStats = {
                hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0, totalBaseStats: 0,
            };

            selectedNonTotal.forEach(entry => {
                const [hp, atk, def, spd, spDef, spAtk] = entry.stats;
                combinedStats.hp += hp;
                combinedStats.attack += atk;
                combinedStats.defense += def;
                combinedStats.speed += spd;
                combinedStats.specialDefense += spDef;
                combinedStats.specialAttack += spAtk;
                combinedStats.totalBaseStats += hp + atk + def + spd + spDef + spAtk;
            });

            return {
                showCombined: isTotalIncluded,
                stats: combinedStats,
                label: isTotalIncluded ? 'Combined / Total' : 'Combined',
            };
        };

        const { showCombined, stats: displayedStats } = computeSelectedStats();

        const getTotalDisplay = () => {
            if (!showCombined) return displayedStats.totalBaseStats;
            return `${displayedStats.totalBaseStats} / ${totalStats.totalBaseStats}`;
        };

        return (
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: screenHeight * 0.025, marginLeft: screenWidth * 0.015 }}>
                {/* Stat Totals (left) */}
                <View style={soulockeTBStyles.statSectionTTwo}>
                    {[
                        ['HP:', displayedStats.hp],
                        ['Attack:', displayedStats.attack],
                        ['Defense:', displayedStats.defense],
                        ['Sp. Atk:', displayedStats.specialAttack],
                        ['Sp. Def:', displayedStats.specialDefense],
                        ['Speed:', displayedStats.speed],
                        ['Total:', getTotalDisplay()],
                    ].map(([label, value]) => (
                        <View
                            key={label}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginBottom: 4,
                                width: 140,
                            }}
                        >
                            <Text style={[soulockeTBStyles.statLabel, { textAlign: 'left', flex: 1, fontSize: 16 }]}>
                                {label}
                            </Text>
                            <Text
                                style={[
                                    soulockeTBStyles.statValue,
                                    label === 'Total:' && soulockeTBStyles.statValueBold,
                                    {
                                        textAlign: 'right',
                                        minWidth: 80,
                                        flexShrink: 0,
                                        flexWrap: 'nowrap',
                                    },
                                ]}
                            >
                                {value}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Buttons Grid (center) */}
                <View style={{ flex: 0.4 }}>
                    {/* Total Button */}
                    <View style={{ alignItems: 'center', marginBottom: screenHeight * 0.015 }}>
                        {chartOptions
                            .filter(o => o.displayLabel === 'Total')
                            .map((entry, index) => (
                                <Pressable
                                    key={index}
                                    onPress={() => toggleChart(entry.label)}
                                    style={[
                                        soulockeTBStyles.chartButton,
                                        {
                                            backgroundColor: entry.color + 'cc',
                                            width: '50%',
                                        },
                                        activeCharts.includes(entry.label) && soulockeTBStyles.chartButtonActive,
                                    ]}
                                >
                                    <Text style={soulockeTBStyles.chartButtonText}>{entry.displayLabel}</Text>
                                </Pressable>
                            ))}
                    </View>

                    {/* Pokémon Buttons in Grid */}
                    <View style={{ flexDirection: 'column' }}>
                        {Array.from({ length: 3 }).map((_, rowIndex) => (
                            <View
                                key={rowIndex}
                                style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: screenHeight * 0.010 }}
                            >
                                {[0, 1].map(colIndex => {
                                    const buttonIndex = rowIndex * 2 + colIndex;
                                    const entry = chartOptions.filter(o => o.displayLabel !== 'Total')[buttonIndex];
                                    if (!entry) return <View key={colIndex} style={{ width: '48%' }} />;
                                    return (
                                        <Pressable
                                            key={entry.label}
                                            onPress={() => toggleChart(entry.label)}
                                            style={[
                                                soulockeTBStyles.chartButton,
                                                {
                                                    backgroundColor: entry.color + 'cc',
                                                    width: '48%',
                                                },
                                                activeCharts.includes(entry.label) && soulockeTBStyles.chartButtonActive,
                                            ]}
                                        >
                                            <Text style={soulockeTBStyles.chartButtonText}>{entry.displayLabel}</Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        ))}
                    </View>
                </View>

                {/* Radar Chart (right) */}
                <View style={{ width: 140, paddingLeft: 12, alignItems: 'flex-start' }}>
                    <RadarChart
                        data={chartOptions.filter(o => activeCharts.includes(o.label))}
                        labels={['HP', 'ATK', 'DEF', 'SPD', 'SpD', 'SpA']}
                        size={120}
                    />
                </View>
            </View>
        );
    };



    const toggleChart = (key) => {
        setActiveCharts(prev =>
            prev.includes(key)
                ? prev.filter(k => k !== key)
                : [...prev, key]
        );
    };

    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    //                                   Sorts
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////

    function sortCombosByOption(combos, trainerOneTeam, trainerTwoTeam, sortOption) {
        const getStatTotal = (team, key) =>
            team.reduce((sum, id) => sum + (Pokedex[id]?.[key] || 0), 0);

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

        const getTrainerScoreDragunknight = (team) => {
            let resistScore = 0;
            let weaknessPenalty = 0;
            let offenseScore = 0;
            let defenseScore = 0;
            let hpScore = 0;
            let speedScore = 0;
            let baseStatBonus = 0;

            team.forEach(id => {
                const mon = Pokedex[id];
                if (!mon) return;

                // Resistances
                Object.values(mon.resistances || {}).forEach(val => {
                    if (val === 0) resistScore += 5;
                    else if (val === 0.25) resistScore += 2;
                    else if (val === 0.5) resistScore += 1;
                });

                // Weaknesses
                Object.values(mon.weaknesses || {}).forEach(val => {
                    if (val === 4) weaknessPenalty += 4;
                    else if (val === 2) weaknessPenalty += 1;
                });

                // Offensive Stat Scaling
                const atk = mon.attack;
                const spAtk = mon.specialAttack;

                if (atk > spAtk) {
                    offenseScore += atk * 1.3 + spAtk * 0.55;
                } else if (spAtk > atk) {
                    offenseScore += spAtk * 1.3 + atk * 0.55;
                } else {
                    offenseScore += atk * 1.1 + spAtk * 1.1;
                }

                // Defense Score
                defenseScore += (mon.defense + mon.specialDefense) * 1.5;

                // HP and Speed Separated
                hpScore += mon.hp * 0.7;       // You can adjust this if desired
                speedScore += mon.speed * 1.2;

                // Base Stat Bonus
                const total = mon.totalBaseStats;
                if (total >= 600) baseStatBonus += 50;
                else if (total >= 550) baseStatBonus += 30;
                else if (total >= 500) baseStatBonus += 10;
                else if (total >= 300 && total <= 330) baseStatBonus -= 10;
                else if (total >= 251 && total <= 299) baseStatBonus -= 20;
                else if (total >= 225 && total <= 250) baseStatBonus -= 25;
                else if (total >= 200 && total <= 224) baseStatBonus -= 40;
                else if (total < 200) baseStatBonus -= 75;
            });

            return (
                resistScore +
                offenseScore +
                defenseScore +
                hpScore +
                speedScore +
                baseStatBonus -
                weaknessPenalty
            );
        };


        const getAverageScore = (combo, key) => {
            const t1 = combo.map(i => trainerOneTeam[i]);
            const t2 = combo.map(i => trainerTwoTeam[i]);

            if (key === 'resist') {
                return getResistanceScore(t1) + getResistanceScore(t2);
            } else if (key === 'weak') {
                return getWeaknessScore(t1) + getWeaknessScore(t2);
            } else if (key === 'dragunknight') {
                const score1 = getTrainerScoreDragunknight(t1);
                const score2 = getTrainerScoreDragunknight(t2);
                const imbalancePenalty = Math.abs(score1 - score2) * 0.75;
                return score1 + score2 - imbalancePenalty;
            } else {
                const validKeys = {
                    total: 'totalBaseStats',
                    attack: 'attack',
                    spatk: 'specialAttack',
                    defense: 'defense',
                    spdef: 'specialDefense',
                    speed: 'speed'
                };
                const statKey = validKeys[key];
                if (!statKey) return 0;
                return getStatTotal(t1, statKey) + getStatTotal(t2, statKey);
            }
        };

        if (sortOption === 'none') return combos;

        const isAscending = sortOption === 'weak';

        return [...combos].sort((a, b) => {
            const aScore = getAverageScore(a, sortOption);
            const bScore = getAverageScore(b, sortOption);
            return isAscending ? aScore - bScore : bScore - aScore;
        });
    }





    useEffect(() => {
        setTeamIndex(0);
    }, [sortOption, focusPair, ruleBreakingOption, flyerTypeOverrides]);



    return (
        <View style={soulockeTBStyles.overallContainer}>
            {sortedCombos.length > 0 && (
                <View style={soulockeTBStyles.banner}>
                    {teamIndex > 0 ? (
                        <Pressable onPress={() => setTeamIndex((prev) => prev - 1)}>
                            <Text style={soulockeTBStyles.navButton}>← Previous Team</Text>
                        </Pressable>
                    ) : (
                        <View style={soulockeTBStyles.placeholder} />
                    )}

                    <Text style={soulockeTBStyles.teamTitle}>
                        Team {teamIndex + 1} of {sortedCombos.length}
                    </Text>

                    {teamIndex < sortedCombos.length - 1 ? (
                        <Pressable onPress={() => setTeamIndex((prev) => prev + 1)}>
                            <Text style={soulockeTBStyles.navButton}>Next Team →</Text>
                        </Pressable>
                    ) : (
                        <View style={soulockeTBStyles.placeholder} />
                    )}
                </View>
            )}

            {/* Options Bar */}
            <View style={soulockeTBStyles.optionsBarContainer}>
                <Pressable
                    onPress={async () => {
                        try {
                            await clearSoulockeData(); // 🧹 Clear saved data
                            router.push('/');          // 🏠 Then go home
                        } catch (err) {
                            console.error("Failed to clear saved data:", err);
                        }
                    }}
                    style={soulockeTBStyles.optionsButton}
                >
                    <Text style={soulockeTBStyles.optionsButtonText}>Return to Home</Text>
                </Pressable>

                <Pressable
                    onPress={() => {
                        // When opening modal, preload saved flyer edits
                        setTempOverrides(flyerTypeOverrides);
                        setShowFlyerModal(true);
                    }}
                    style={soulockeTBStyles.optionsButton}
                >
                    <Text style={soulockeTBStyles.optionsButtonText}>Flyer Edits</Text>
                </Pressable>


                <Pressable
                    onPress={handleAddPairs}
                    style={soulockeTBStyles.optionsButton}
                >
                    <Text style={soulockeTBStyles.optionsButtonText}>Add Pairs</Text>
                </Pressable>

                <Pressable
                    onPress={() => setShowRemovePairs(true)}
                    style={soulockeTBStyles.optionsButton}
                >
                    <Text style={soulockeTBStyles.optionsButtonText}>Remove Pairs</Text>
                </Pressable>

                <View style={soulockeTBStyles.pickerWrapper}>
                    <Text style={soulockeTBStyles.pickerLabel}>Rule Breaking Pair</Text>
                    <Picker
                        selectedValue={ruleBreakingOption}
                        onValueChange={(itemValue) => setRuleBreakingOption(itemValue)}
                        style={soulockeTBStyles.picker}
                        dropdownIconColor="#333"
                    >
                        <Picker.Item label="No" value="no" />
                        <Picker.Item label="Yes" value="yes" />
                    </Picker>
                </View>

                <View >
                    <Text >Focus</Text>
                    <Picker
                        selectedValue={focusPair}
                        onValueChange={(itemValue) => {
                            setFocusPair(itemValue === "none" ? null : Number(itemValue));
                        }}
                        dropdownIconColor="#333"
                    >
                        <Picker.Item label="None" value="none" />
                        {allPairs.map(({ index, label }) => (
                            <Picker.Item key={index} label={label} value={index.toString()} />
                        ))}
                    </Picker>

                </View>
                <View>
                    <Text>Sort By</Text>
                    <Picker
                        selectedValue={sortOption}
                        onValueChange={(itemValue) => setSortOption(itemValue)}
                        dropdownIconColor="#333"
                    >
                        <Picker.Item label="None" value="none" />
                        <Picker.Item label="Total" value="total" />
                        <Picker.Item label="Attack" value="attack" />
                        <Picker.Item label="Sp. Atk" value="spatk" />
                        <Picker.Item label="Defense" value="defense" />
                        <Picker.Item label="Sp. Def" value="spdef" />
                        <Picker.Item label="Speed" value="speed" />
                        <Picker.Item label="Resistances" value="resist" />
                        <Picker.Item label="Weaknesses" value="weak" />
                        <Picker.Item label="Dragunknight Formula" value="dragunknight" />
                    </Picker>
                </View>
            </View>



            {/* Flyer Edits Modal */}
            {showFlyerModal && (
                <View style={soulockeTBStyles.modalOverlay}>
                    <View style={soulockeTBStyles.flyerModal}>
                        <Text style={soulockeTBStyles.flyerTitle}>Flying-Type Pairs</Text>

                        {/* Header Row */}
                        <View style={soulockeTBStyles.pairHeaderRow}>
                            <Text style={soulockeTBStyles.pairHeaderText}>Trainer 1</Text>
                            <Text style={soulockeTBStyles.pairHeaderText}>Trainer 2</Text>
                            <Text style={soulockeTBStyles.pairHeaderTextRight}>
                                Swap Primary &{'\n'}Secondary Typing
                            </Text>
                        </View>

                        {/* Scrollable List of Pairs */}
                        <ScrollView
                            style={soulockeTBStyles.scrollList}
                            contentContainerStyle={{ paddingBottom: 12 }}
                        >
                            {flyingTypePairs.map(({ index, flyingMon, partnerMon, focus }) => {
                                const key = `${focus === 't1' ? 'T1' : 'T2'}-${index}`;
                                const isFocusT1 = focus === 't1';
                                const mon1 = Pokedex[isFocusT1 ? flyingMon : partnerMon];
                                const mon2 = Pokedex[isFocusT1 ? partnerMon : flyingMon];

                                const isToggled = tempOverrides[key] || false;

                                return (
                                    <View key={key} style={soulockeTBStyles.flyerRow}>
                                        <View style={soulockeTBStyles.spritePairBox}>
                                            <Text style={soulockeTBStyles.chainOverlay}>🔗</Text>
                                            <View style={soulockeTBStyles.spritePair}>
                                                {/* Trainer 1 Side */}
                                                {isFocusT1 ? (
                                                    <View style={soulockeTBStyles.glowFrame}>
                                                        <Image source={spriteMap[mon1.spriteId]} style={soulockeTBStyles.sprite} />
                                                        <Text style={soulockeTBStyles.monLabelInsideGlow}>{mon1.displayName ?? mon1.name}</Text>
                                                    </View>
                                                ) : (
                                                    <View style={soulockeTBStyles.spriteWithLabel}>
                                                        <Image source={spriteMap[mon1.spriteId]} style={soulockeTBStyles.sprite} />
                                                        <Text style={soulockeTBStyles.monLabel}>{mon1.displayName ?? mon1.name}</Text>
                                                    </View>
                                                )}

                                                <View style={soulockeTBStyles.fullVerticalDivider} />

                                                {/* Trainer 2 Side */}
                                                {!isFocusT1 ? (
                                                    <View style={soulockeTBStyles.glowFrame}>
                                                        <Image source={spriteMap[mon2.spriteId]} style={soulockeTBStyles.sprite} />
                                                        <Text style={[soulockeTBStyles.monLabel, soulockeTBStyles.monLabelInsideGlow]}>{mon2.displayName ?? mon2.name}</Text>
                                                    </View>
                                                ) : (
                                                    <View style={soulockeTBStyles.spriteWithLabel}>
                                                        <Image source={spriteMap[mon2.spriteId]} style={soulockeTBStyles.sprite} />
                                                        <Text style={soulockeTBStyles.monLabel}>{mon2.displayName ?? mon2.name}</Text>
                                                    </View>
                                                )}
                                            </View>
                                        </View>

                                        {/* Toggle Switch */}
                                        <View style={soulockeTBStyles.toggleContainer}>
                                            <Switch
                                                value={isToggled}
                                                onValueChange={(newVal) =>
                                                    setTempOverrides((prev) => ({
                                                        ...prev,
                                                        [key]: newVal,
                                                    }))
                                                }
                                            />
                                        </View>
                                    </View>
                                );
                            })}
                        </ScrollView>

                        {/* Modal Action Buttons */}
                        <View style={soulockeTBStyles.modalButtonRow}>
                            <Pressable
                                onPress={() => {
                                    setShowFlyerModal(false);
                                    setTempOverrides({}); // discard changes
                                }}
                                style={soulockeTBStyles.cancelButton}
                            >
                                <Text style={soulockeTBStyles.modalButtonText}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                onPress={async () => {
                                    try {
                                        // Update state immediately
                                        setFlyerTypeOverrides(tempOverrides);
                                        setShowFlyerModal(false);

                                        // Load current save data to merge with
                                        const currentData = await loadSoulockeData();

                                        // Merge flyer edits with rest of save
                                        const updatedData = {
                                            ...currentData,
                                            flyerEdits: tempOverrides,
                                        };

                                        await saveSoulockeData(updatedData);
                                        console.log("Saved flyer edits to storage.");
                                    } catch (err) {
                                        console.error("Error saving flyer edits:", err);
                                    }
                                }}
                                style={soulockeTBStyles.applyButton}
                            >
                                <Text style={soulockeTBStyles.modalButtonText}>Apply</Text>
                            </Pressable>

                        </View>
                    </View>
                </View>
            )}

            {showRemovePairs && (
                <View style={soulockeTBStyles.modalOverlay}>
                    <View style={soulockeTBStyles.flyerModal}>
                        <Text style={soulockeTBStyles.flyerTitle}>Remove Pairs</Text>

                        {/* Header Row */}
                        <View style={soulockeTBStyles.pairHeaderRow}>
                            <Text style={soulockeTBStyles.pairHeaderText}>Trainer 1</Text>
                            <Text style={soulockeTBStyles.pairHeaderText}>Trainer 2</Text>
                            <Text style={soulockeTBStyles.pairHeaderTextRight}>Remove</Text>
                        </View>

                        {/* Toggle Pairs List */}
                        <ScrollView
                            style={soulockeTBStyles.scrollList}
                            contentContainerStyle={{ paddingBottom: 12 }}
                        >
                            {allPairs.map(({ index, label }) => {
                                const mon1 = Pokedex[localTrainerOneTeam[index]];
                                const mon2 = Pokedex[localTrainerTwoTeam[index]];
                                const key = `PAIR-${index}`;
                                const isMarked = tempRemovedPairs[key] || false;

                                return (
                                    <View key={key} style={soulockeTBStyles.flyerRow}>
                                        <View style={soulockeTBStyles.spritePairBox}>
                                            <View style={soulockeTBStyles.spritePair}>
                                                {/* Trainer 1 */}
                                                <View style={soulockeTBStyles.spriteWithLabel}>
                                                    <Image source={spriteMap[mon1.spriteId]} style={soulockeTBStyles.sprite} />
                                                    <Text style={soulockeTBStyles.monLabel}>{mon1.displayName ?? mon1.name}</Text>
                                                </View>

                                                <View style={soulockeTBStyles.fullVerticalDivider} />

                                                {/* Trainer 2 */}
                                                <View style={soulockeTBStyles.spriteWithLabel}>
                                                    <Image source={spriteMap[mon2.spriteId]} style={soulockeTBStyles.sprite} />
                                                    <Text style={soulockeTBStyles.monLabel}>{mon2.displayName ?? mon2.name}</Text>
                                                </View>
                                            </View>
                                        </View>

                                        {/* Toggle Switch */}
                                        <View style={soulockeTBStyles.toggleContainer}>
                                            <Switch
                                                value={isMarked}
                                                onValueChange={(newVal) =>
                                                    setTempRemovedPairs(prev => ({
                                                        ...prev,
                                                        [key]: newVal
                                                    }))
                                                }
                                            />
                                        </View>
                                    </View>
                                );
                            })}
                        </ScrollView>

                        {/* Modal Buttons */}
                        <View style={soulockeTBStyles.modalButtonRow}>
                            <Pressable
                                onPress={() => {
                                    setShowRemovePairs(false);
                                    setTempRemovedPairs({});
                                }}
                                style={soulockeTBStyles.cancelButton}
                            >
                                <Text style={soulockeTBStyles.modalButtonText}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => {
                                    const indicesToRemove = Object.keys(tempRemovedPairs)
                                        .filter(k => tempRemovedPairs[k])
                                        .map(k => parseInt(k.replace('PAIR-', '')));

                                    const filteredT1 = localTrainerOneTeam.filter((_, i) => !indicesToRemove.includes(i));
                                    const filteredT2 = localTrainerTwoTeam.filter((_, i) => !indicesToRemove.includes(i));

                                    setLocalTrainerOneTeam(filteredT1);
                                    setLocalTrainerTwoTeam(filteredT2);

                                    saveSoulockeData({
                                        trainer1Team: filteredT1,
                                        trainer2Team: filteredT2,
                                    });

                                    setShowRemovePairs(false);
                                    setTempRemovedPairs({});
                                }}


                                style={soulockeTBStyles.applyButton}
                            >
                                <Text style={soulockeTBStyles.modalButtonText}>Apply</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            )}






            {/* Bottom Grid Area */}
            {(!sortedCombos.length || !sortedCombos[safeTeamIndex]?.length) ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: '#444' }}>
                        No Valid Team Combinations Available
                    </Text>
                </View>
            ) : (
                <ScrollView
                    style={soulockeTBStyles.scrollWrapper}
                    contentContainerStyle={soulockeTBStyles.scrollContentContainer}
                >
                    <View style={soulockeTBStyles.labelWrapper}>
                        {/* Floating Labels */}
                        <View style={soulockeTBStyles.trainer1Label}>
                            <Text style={soulockeTBStyles.trainerLabelText}>Trainer 1</Text>
                        </View>
                        <View style={soulockeTBStyles.trainer2Label}>
                            <Text style={soulockeTBStyles.trainerLabelText}>Trainer 2</Text>
                        </View>

                        {/* Main Row Section */}
                        <ScrollView horizontal>
                            <View style={soulockeTBStyles.rowSection}>
                                {/* Trainer 1 Column */}
                                <View style={soulockeTBStyles.trainerColumn}>
                                    <Text style={soulockeTBStyles.sectionHeader}>Resistances</Text>
                                    <View style={soulockeTBStyles.placeholderBox}>
                                        {renderResistanceRowT1(resistanceSummaryTrainer1)}
                                    </View>
                                    <Text style={soulockeTBStyles.sectionHeader}>Stats</Text>
                                    <View style={soulockeTBStyles.placeholderBox}>
                                        {renderStatsSection(team1, 'T1')}
                                    </View>
                                    <Text style={soulockeTBStyles.sectionHeader}>Weaknesses</Text>
                                    <View style={soulockeTBStyles.placeholderBox}>
                                        {renderWeaknessRowT1(weaknessSummaryTrainer1, resistanceSummaryTrainer1)}
                                    </View>
                                </View>

                                {/* Sprites Column */}
                                <View style={soulockeTBStyles.spriteColumn}>
                                    {team1.map((id1, index) => {
                                        const id2 = team2[index];
                                        const mon1 = Pokedex[id1];
                                        const mon2 = Pokedex[id2];

                                        return (
                                            <View key={index} style={soulockeTBStyles.spritePairBox}>
                                                <Text style={soulockeTBStyles.chainOverlay}>🔗</Text>
                                                <View style={soulockeTBStyles.spritePair}>
                                                    {/* Trainer 1 */}
                                                    <TouchableOpacity
                                                        style={soulockeTBStyles.spriteWithLabel}
                                                        onPress={() => setSelectedPokemon(mon1)}
                                                    >
                                                        <Image
                                                            source={spriteMap[mon1.spriteId]}
                                                            style={soulockeTBStyles.sprite}
                                                        />
                                                        <Text style={soulockeTBStyles.monLabel}>
                                                            {mon1.displayName ?? mon1.name}
                                                        </Text>
                                                    </TouchableOpacity>

                                                    <View style={soulockeTBStyles.fullVerticalDivider} />

                                                    {/* Trainer 2 */}
                                                    <TouchableOpacity
                                                        style={soulockeTBStyles.spriteWithLabel}
                                                        onPress={() => setSelectedPokemon(mon2)}
                                                    >
                                                        <Image
                                                            source={spriteMap[mon2.spriteId]}
                                                            style={soulockeTBStyles.sprite}
                                                        />
                                                        <Text style={soulockeTBStyles.monLabel}>
                                                            {mon2.displayName ?? mon2.name}
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>


                                {/* Trainer 2 Column */}
                                <View style={soulockeTBStyles.trainerColumn}>
                                    <Text style={soulockeTBStyles.sectionHeader}>Resistances</Text>
                                    <View style={soulockeTBStyles.placeholderBox}>
                                        {renderResistanceRowT2(resistanceSummaryTrainer2)}
                                    </View>
                                    <Text style={soulockeTBStyles.sectionHeader}>Stats</Text>
                                    <View style={soulockeTBStyles.placeholderBox}>
                                        {renderStatsSectionTTwo(team2, 'T2')}
                                    </View>
                                    <Text style={soulockeTBStyles.sectionHeader}>Weaknesses</Text>
                                    <View style={soulockeTBStyles.placeholderBox}>
                                        {renderWeaknessRowT2(weaknessSummaryTrainer2, resistanceSummaryTrainer2)}
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </ScrollView>
            )}

            {/* Pokémon Detail Modal */}
            <PokemonDetailModal
                visible={!!selectedPokemon}
                onClose={() => setSelectedPokemon(null)}
                pokemon={selectedPokemon}
            />

        </View>
    );



};

export default soulockeTeamBuilder;