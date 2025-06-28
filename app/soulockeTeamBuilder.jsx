import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import RadarChart from '../components/RadarChart';
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

    const [teamIndex, setTeamIndex] = useState(0);
    const [validCombos, setValidCombos] = useState([]);
    const [sortOption, setSortOption] = useState('none');

    // Inside your component function, near the top (before using team1/team2)
    const sortedCombos = sortCombosByOption(
        validCombos,
        parsedTrainerOneTeam,
        parsedTrainerTwoTeam,
        sortOption
    );

    // Then use sortedCombos to get current indices:
    const currentIndices = sortedCombos[teamIndex] || [];

    const team1 = currentIndices.map(i => parsedTrainerOneTeam[i]);
    const team2 = currentIndices.map(i => parsedTrainerTwoTeam[i]);


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










    // You now have Trainer 1 and 2's Pokémon IDs for this combo


    useEffect(() => {
        const buildValidCombos = () => {
            const totalCount = parsedTrainerOneTeam.length;
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

                        const mon1Id = parsedTrainerOneTeam[idx];
                        const mon2Id = parsedTrainerTwoTeam[idx];

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
        focusPair
    ]);




    //Build Flying pairs
    useEffect(() => {

        const newFlyingMonEntries = [];

        parsedTrainerOneTeam.forEach((id1, index) => {
            const id2 = parsedTrainerTwoTeam[index];
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
    }, []);


    useEffect(() => {
        const pairs = parsedTrainerOneTeam.map((mon1Id, idx) => {
            const mon2Id = parsedTrainerTwoTeam[idx];
            return {
                index: idx,
                label: `${Pokedex[mon1Id].name} / ${Pokedex[mon2Id].name}`,
            };
        });

        setAllPairs(pairs);
    }, [trainerOneTeam, trainerTwoTeam]);

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
                displayLabel: mon.name,
                stats: [mon.hp, mon.attack, mon.defense, mon.speed, mon.specialDefense, mon.specialAttack],
                color: individualColors[idx % individualColors.length],
            });
        });

        chartOptions[0].stats = [stats.hp, stats.attack, stats.defense, stats.speed, stats.specialDefense, stats.specialAttack];

        return { stats, chartOptions };
    };

    const renderStatsSection = (team, labelPrefix) => {
        const { stats, chartOptions } = buildStatsSummary(team, labelPrefix);

        return (
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 30, marginLeft: 20 }}>

                {/* Radar Chart (left) */}
                <RadarChart
                    data={chartOptions.filter(o => activeCharts.includes(o.label))}
                    labels={['HP', 'ATK', 'DEF', 'SPD', 'SpD', 'SpA']}
                    size={120}
                />

                {/* Buttons + Stats Column */}
                <View style={{ flexDirection: 'row', flex: 1, marginLeft: 62 }}>

                    {/* Buttons Grid (center) */}
                    {/* Buttons Grid (center) */}
                    <View style={{ flex: 0.4 }}>

                        {/* Total Button (own centered row) */}
                        <View style={{ alignItems: 'center', marginBottom: 12 }}>
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
                            {
                                // Group into rows of 2
                                Array.from({ length: 3 }).map((_, rowIndex) => (
                                    <View
                                        key={rowIndex}
                                        style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}
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
                                ))
                            }
                        </View>
                    </View>



                    {/* Stat Totals (right of buttons) */}
                    <View style={{ marginLeft: 140, flex: 0.2 }}>
                        {[
                            ['HP:', stats.hp],
                            ['Attack:', stats.attack],
                            ['Defense:', stats.defense],
                            ['Sp. Atk:', stats.specialAttack],
                            ['Sp. Def:', stats.specialDefense],
                            ['Speed:', stats.speed],
                            ['Total:', stats.totalBaseStats],
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
                                        { textAlign: 'right', width: 40 },
                                    ]}
                                >
                                    {value}
                                </Text>
                            </View>
                        ))}
                    </View>


                </View>
            </View>



        );
    };

    const renderStatsSectionTTwo = (team, labelPrefix) => {
        const { stats, chartOptions } = buildStatsSummary(team, labelPrefix);

        return (
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 30, marginLeft: 20 }}>

                {/* Stat Totals (left) */}
                <View style={{ marginLeft: 92, marginRight: 92, flex: 0.3 }}>
                    {[
                        ['HP:', stats.hp],
                        ['Attack:', stats.attack],
                        ['Defense:', stats.defense],
                        ['Sp. Atk:', stats.specialAttack],
                        ['Sp. Def:', stats.specialDefense],
                        ['Speed:', stats.speed],
                        ['Total:', stats.totalBaseStats],
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
                                    { textAlign: 'right', width: 40 },
                                ]}
                            >
                                {value}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Buttons Grid (center) */}
                {/* Buttons Grid (center) */}
                <View style={{ flex: 0.4 }}>

                    {/* Total Button (own centered row) */}
                    <View style={{ alignItems: 'center', marginBottom: 12 }}>
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
                        {
                            // Group into rows of 2
                            Array.from({ length: 3 }).map((_, rowIndex) => (
                                <View
                                    key={rowIndex}
                                    style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}
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
                            ))
                        }
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
            let attackScore = 0;
            let defenseScore = 0;
            let speedHpScore = 0;
            let baseStatBonus = 0;

            team.forEach(id => {
                const mon = Pokedex[id];
                if (!mon) return;

                Object.values(mon.resistances || {}).forEach(val => {
                    if (val === 0) resistScore += 5;
                    else if (val === 0.25) resistScore += 2;
                    else if (val === 0.5) resistScore += 1;
                });

                Object.values(mon.weaknesses || {}).forEach(val => {
                    if (val === 4) weaknessPenalty += 4;
                    else if (val === 2) weaknessPenalty += 1;
                });

                attackScore += (mon.attack + mon.specialAttack) * 0.5;
                defenseScore += (mon.defense + mon.specialDefense) * 0.75;
                speedHpScore += mon.speed * 0.1 + mon.hp;

                const total = mon.totalBaseStats;
                if (total >= 600) baseStatBonus += 35;
                else if (total >= 550) baseStatBonus += 22;
                else if (total >= 500) baseStatBonus += 10;
            });

            return (
                resistScore +
                attackScore +
                defenseScore +
                speedHpScore +
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
                    onPress={() => router.push('/')}
                    style={soulockeTBStyles.optionsButton}
                >
                    <Text style={soulockeTBStyles.optionsButtonText}>Return to Home</Text>
                </Pressable>

                <Pressable
                    onPress={() => setShowFlyerModal(true)}
                    style={soulockeTBStyles.optionsButton}
                >
                    <Text style={soulockeTBStyles.optionsButtonText}>Flyer Edits</Text>
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
                                                        <Text style={soulockeTBStyles.monLabelInsideGlow}>{mon1.name}</Text>
                                                    </View>
                                                ) : (
                                                    <View style={soulockeTBStyles.spriteWithLabel}>
                                                        <Image source={spriteMap[mon1.spriteId]} style={soulockeTBStyles.sprite} />
                                                        <Text style={soulockeTBStyles.monLabel}>{mon1.name}</Text>
                                                    </View>
                                                )}

                                                <View style={soulockeTBStyles.fullVerticalDivider} />

                                                {/* Trainer 2 Side */}
                                                {!isFocusT1 ? (
                                                    <View style={soulockeTBStyles.glowFrame}>
                                                        <Image source={spriteMap[mon2.spriteId]} style={soulockeTBStyles.sprite} />
                                                        <Text style={[soulockeTBStyles.monLabel, soulockeTBStyles.monLabelInsideGlow]}>{mon2.name}</Text>
                                                    </View>
                                                ) : (
                                                    <View style={soulockeTBStyles.spriteWithLabel}>
                                                        <Image source={spriteMap[mon2.spriteId]} style={soulockeTBStyles.sprite} />
                                                        <Text style={soulockeTBStyles.monLabel}>{mon2.name}</Text>
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
                                onPress={() => {
                                    setFlyerTypeOverrides(tempOverrides); // save changes
                                    setShowFlyerModal(false);
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
            {sortedCombos.length === 0 ? (
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
                                                    <View style={soulockeTBStyles.spriteWithLabel}>
                                                        <Image
                                                            source={spriteMap[mon1.spriteId]}
                                                            style={soulockeTBStyles.sprite}
                                                        />
                                                        <Text style={soulockeTBStyles.monLabel}>{mon1.name}</Text>
                                                    </View>



                                                    <View style={soulockeTBStyles.fullVerticalDivider} />

                                                    {/* Trainer 2 */}
                                                    <View style={soulockeTBStyles.spriteWithLabel}>
                                                        <Image
                                                            source={spriteMap[mon2.spriteId]}
                                                            style={soulockeTBStyles.sprite}
                                                        />
                                                        <Text style={soulockeTBStyles.monLabel}>{mon2.name}</Text>
                                                    </View>

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
        </View>
    );



};

export default soulockeTeamBuilder;