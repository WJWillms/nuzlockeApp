import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, ScrollView, Text, View } from 'react-native';
import RadarChart from '../components/RadarChart';
import TypePill from '../components/TypePill';
import spriteMap from "./Pokedex/spriteMap";
import { Pokedex } from './Pokedex/sunMoonPokedex';
import soulockeTBStyles from "./styles/soulockeTBStyles";


const screenWidth = Dimensions.get('window').width;

const soulockeTeamBuilder = () => {
    const router = useRouter();
    const { trainerOneTeam, trainerTwoTeam } = useLocalSearchParams();

    const parsedTrainerOneTeam = JSON.parse(trainerOneTeam || '[]');
    const parsedTrainerTwoTeam = JSON.parse(trainerTwoTeam || '[]');

    const [teamIndex, setTeamIndex] = useState(0);
    const [validCombos, setValidCombos] = useState([]);

    const currentIndices = validCombos[teamIndex] || [];

    const team1 = currentIndices.map(i => parsedTrainerOneTeam[i]);
    const team2 = currentIndices.map(i => parsedTrainerTwoTeam[i]);

    const [activeCharts, setActiveCharts] = useState(['T1_Total', 'T2_Total']);

    const individualColors = ['#f87171', '#34d399', '#60a5fa', '#facc15', '#a78bfa', '#fb923c']; //Colors for Charts


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
                    const seenTypes = new Set();

                    for (let i = 0; i < combo.length; i++) {
                        const idx = combo[i];

                        const mon1 = Pokedex[parsedTrainerOneTeam[idx]];
                        const mon2 = Pokedex[parsedTrainerTwoTeam[idx]];

                        if (
                            seenTypes.has(mon1.typeOneId) ||
                            seenTypes.has(mon2.typeOneId)
                        ) {
                            return false;
                        }

                        seenTypes.add(mon1.typeOneId);
                        seenTypes.add(mon2.typeOneId);
                    }

                    return true;
                });

                if (validCombos.length > 0) {
                    maxValidCombos = validCombos;
                } else {
                    currentSize--; // Try smaller teams
                }
            }

            setValidCombos(maxValidCombos);
        };

        buildValidCombos();
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
            <View style={soulockeTBStyles.resistancesRow}>
                {categories.map(({ label, key }) => {
                    const entries = Object.entries(summary[key] || {});
                    const columns = groupIntoColumns(entries, 5); // Limit 4 per column

                    const isImmunities = label === 'Immunities';

                    return (
                        <View key={key} style={[
                            soulockeTBStyles.resistancesColumn,
                            isImmunities && { marginLeft: 8 }, // Add small space to the Left
                        ]}>
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
                    const columns = groupIntoColumns(entries, 5); // Limit 5 per column

                    const isImmunities = label === 'Immunities';

                    return (
                        <View key={key} style={[
                            soulockeTBStyles.resistancesColumn,
                            isImmunities && { marginRight: 8 }, // Add small space to the right
                        ]}>
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
                    const columns = groupIntoColumns(entries);

                    const isTwoX = label === '2x';
                    const isFourX = label === '4x';

                    return (
                        <View
                            key={key}
                            style={[
                                soulockeTBStyles.resistancesColumn,
                                isTwoX && { marginRight: 20 },
                                isFourX && { marginLeft: 160 }
                            ]}
                        >
                            <Text style={soulockeTBStyles.subHeader}>{label}</Text>
                            <View style={soulockeTBStyles.resistancesGrid}>
                                {columns.map((col, colIndex) => (
                                    <View key={colIndex} style={soulockeTBStyles.resistanceGroup}>
                                        {col.map(([type, count]) => {
                                            const isCovered =
                                                resistanceSummary.immune[type] ||
                                                resistanceSummary.half[type] ||
                                                resistanceSummary.quarter[type];

                                            return (
                                                <View key={type} style={soulockeTBStyles.typeRowWeak}>
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
            <View style={soulockeTBStyles.resistancesRow}>
                {categories.map(({ label, key }) => {
                    const entries = Object.entries(summary[key] || {});
                    const columns = groupIntoColumns(entries, 5); // Left-to-right for T2

                    const isTwoX = label === '2x';
                    const isFourX = label === '4x';

                    return (
                        <View
                            key={key}
                            style={[
                                soulockeTBStyles.resistancesColumn,
                                isTwoX && { marginLeft: 20 },
                                isFourX && { marginRight: 160 } // Slight nudge for 4× column
                            ]}
                        >
                            <Text style={soulockeTBStyles.subHeaderTOne}>{label}</Text>
                            <View style={soulockeTBStyles.resistancesGridTOne}>
                                {columns.map((col, colIndex) => (
                                    <View key={colIndex} style={soulockeTBStyles.resistanceGroupTOne}>
                                        {col.map(([type, count]) => {
                                            const isCovered =
                                                resistanceSummary?.immune?.[type] ||
                                                resistanceSummary?.half?.[type] ||
                                                resistanceSummary?.quarter?.[type];

                                            return (
                                                <View key={type} style={soulockeTBStyles.typeRow}>
                                                    <TypePill type={type} glow={!isCovered} />
                                                    <Text style={soulockeTBStyles.weaknessCountText}>x{count}</Text>
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
            <View style={soulockeTBStyles.placeholderBox}>
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
            </View>


        );
    };

    const renderStatsSectionTTwo = (team, labelPrefix) => {
        const { stats, chartOptions } = buildStatsSummary(team, labelPrefix);

        return (
            <View style={soulockeTBStyles.placeholderBox}>
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





    return (
        <View style={soulockeTBStyles.overallContainer}>
            {validCombos.length > 0 && (
                <View style={soulockeTBStyles.banner}>
                    {teamIndex > 0 ? (
                        <Pressable onPress={() => setTeamIndex((prev) => prev - 1)}>
                            <Text style={soulockeTBStyles.navButton}>← Previous Team</Text>
                        </Pressable>
                    ) : (
                        <View style={soulockeTBStyles.placeholder} />
                    )}

                    <Text style={soulockeTBStyles.teamTitle}>
                        Team {teamIndex + 1} of {validCombos.length}
                    </Text>

                    {teamIndex < validCombos.length - 1 ? (
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
            </View>

            {/* Bottom Grid Area */}
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
                    <View style={soulockeTBStyles.rowSection}>
                        {/* Trainer 1 Column */}
                        <View style={soulockeTBStyles.trainerColumn}>
                            <Text style={soulockeTBStyles.sectionHeader}>Resistances</Text>
                            <View style={soulockeTBStyles.placeholderBox}>
                                {renderResistanceRowT1(resistanceSummaryTrainer1)}
                            </View>
                            <Text style={soulockeTBStyles.sectionHeader}>Stats</Text>
                            <View style={soulockeTBStyles.placeholderBox} >
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
                                            <Image
                                                source={spriteMap[mon1.spriteId]}
                                                style={soulockeTBStyles.sprite}
                                            />
                                            <View style={soulockeTBStyles.fullVerticalDivider} />
                                            <Image
                                                source={spriteMap[mon2.spriteId]}
                                                style={soulockeTBStyles.sprite}
                                            />
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
                            <View style={soulockeTBStyles.placeholderBox} >
                                {renderStatsSectionTTwo(team2, 'T2')}
                            </View>
                            <Text style={soulockeTBStyles.sectionHeader}>Weaknesses</Text>
                            <View style={soulockeTBStyles.placeholderBox}>
                                {renderWeaknessRowT2(weaknessSummaryTrainer2, resistanceSummaryTrainer2)}
                            </View>
                        </View>

                    </View>
                </View>
            </ScrollView>
        </View>
    );


};

export default soulockeTeamBuilder;

