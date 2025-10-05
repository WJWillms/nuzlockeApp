import { useEffect, useRef, useState } from "react";
import { Animated, Image, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import evolutionMap from "../app/Pokedex/evolutionMap";
import spriteMap from "../app/Pokedex/spriteMap";
import styles from "../app/styles/PokemonDetailModalStyles";
import TypePill from "../components/TypePill";

const PokemonDetailModal = ({ visible, onClose, pokemon }) => {
    const [showModal, setShowModal] = useState(visible);
    const slideAnim = useRef(new Animated.Value(300)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;



    useEffect(() => {
        if (visible) {
            setShowModal(true);
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 300,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => setShowModal(false));
        }
    }, [visible]);

    // Guard against null Pokémon
    if (!pokemon) return null;
    // Recursive rendering of evolution chain
    const renderEvolutionChain = (stage) => {
        if (!stage) return null;

        if (stage.next && stage.next.length === 1) {
            const nextStage = stage.next[0];
            return (
                <View style={styles.evolutionRow}>
                    <View style={styles.evolutionStage}>
                        <Image source={spriteMap[stage.spriteId]} style={styles.evolutionImage} />
                        <Text style={styles.evolutionName}>{stage.name}</Text>
                    </View>

                    {nextStage.method && (
                        <Image
                            source={
                                evolutionMap[
                                nextStage.method === "level"
                                    ? `l${nextStage.value}`
                                    : nextStage.value?.toLowerCase()
                                ]
                            }
                            style={styles.evolutionMethod}
                            resizeMode="contain"
                        />
                    )}

                    {renderEvolutionChain(nextStage)}
                </View>
            );
        }

        if (stage.next && stage.next.length > 1) {
            return (
                <View style={styles.evolutionRowVertical}>
                    <View style={styles.evolutionStage}>
                        <Image source={spriteMap[stage.spriteId]} style={styles.evolutionImage} />
                        <Text style={styles.evolutionName}>{stage.name}</Text>
                    </View>
                    {stage.next.map((nextStage) => (
                        <View key={nextStage.id} style={styles.branchContainer}>
                            {renderEvolutionChain(nextStage)}
                        </View>
                    ))}
                </View>
            );
        }

        return (
            <View style={styles.evolutionStage}>
                <Image source={spriteMap[stage.spriteId]} style={styles.evolutionImage} />
                <Text style={styles.evolutionName}>{stage.name}</Text>
            </View>
        );
    };

    return (
        <Modal visible={showModal} transparent animationType="none">
            <View style={styles.overlay}>
                <Animated.View
                    style={[
                        styles.modalContainer,
                        { transform: [{ translateY: slideAnim }], opacity: opacityAnim },
                    ]}
                >
                    {/* Header: Pokémon name */}
                    <Text style={styles.pokemonName}>{pokemon.name}</Text>
                    <View style={styles.divider} />

                    {/* Sprite, Types, Stats */}
                    <View style={styles.headerRow}>
                        <View style={styles.spriteWrapper}>
                            <Image source={spriteMap[pokemon.spriteId]} style={styles.sprite} />
                            <View style={styles.typePillsContainer}>
                                <TypePill type={pokemon.typeOne} />
                                {pokemon.typeTwo && (
                                    <View style={styles.typeSpacing}>
                                        <TypePill type={pokemon.typeTwo} />
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Stats */}
                        <View style={styles.statSection}>
                            <View style={styles.statGrid}>
                                <View style={styles.statColumn}>
                                    <Text style={styles.statLabel}>
                                        HP: <Text style={styles.statValue}>{pokemon.hp}</Text>
                                    </Text>
                                    <Text style={styles.statLabel}>
                                        Speed: <Text style={styles.statValue}>{pokemon.speed}</Text>
                                    </Text>
                                    <Text style={styles.statLabel}>
                                        Sp. Atk: <Text style={styles.statValue}>{pokemon.specialAttack}</Text>
                                    </Text>
                                </View>

                                <View style={styles.statColumn}>
                                    <Text style={styles.statLabel}>
                                        Attack: <Text style={styles.statValue}>{pokemon.attack}</Text>
                                    </Text>
                                    <Text style={styles.statLabel}>
                                        Defense: <Text style={styles.statValue}>{pokemon.defense}</Text>
                                    </Text>
                                    <Text style={styles.statLabel}>
                                        Sp. Def: <Text style={styles.statValue}>{pokemon.specialDefense}</Text>
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.totalStatsRow}>
                                <Text style={styles.totalStats}>Total: {pokemon.totalBaseStats}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Evolution Chain */}
                    {pokemon.evolutionLine && pokemon.evolutionLine.length > 0 && (
                        <>
                            <View style={styles.divider} />
                            <Text style={styles.ECSectionTitle}>Evolutionary Chain</Text>
                            <ScrollView
                                horizontal
                                style={styles.evolutionScroll}
                                contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
                                showsHorizontalScrollIndicator={false}
                            >
                                <View style={styles.evolutionScrollInner}>
                                    {renderEvolutionChain(pokemon.evolutionLine[0])}
                                </View>
                            </ScrollView>
                        </>
                    )}

                    {/* Level-Up Moves */}
                    {pokemon.levelUpMoves?.length > 0 && (
                        <>
                            <View style={styles.divider} />
                            <Text style={styles.sectionTitle}>Level-Up Moves</Text>

                            {/* Header Row (static) */}
                            <View style={styles.movesHeaderRow}>
                                <Text style={[styles.headerCell, { flex: 0.5 }]}>Lvl</Text>
                                <Text style={[styles.headerCell, { flex: 1.5 }]}>Move</Text>
                                <Text style={[styles.headerCell, { flex: 1 }]}>Type</Text>
                                <Text style={[styles.headerCell, { flex: 1 }]}>Category</Text>
                                <Text style={[styles.headerCell, { flex: 1 }]}>Power</Text>
                                <Text style={[styles.headerCell, { flex: 1 }]}>Accuracy</Text>
                                <Text style={[styles.headerCell, { flex: 0.8 }]}>PP</Text>
                                <Text style={[styles.headerCell, { flex: 1 }]}>Effect %</Text>
                            </View>

                            <ScrollView style={styles.movesScroll}>
                                {pokemon.levelUpMoves.map((move, idx) => (
                                    <View key={idx} style={styles.moveRow}>
                                        {/* Data Row */}
                                        <View style={styles.moveInfoRow}>
                                            <Text style={[styles.moveCell, { flex: 0.5 }]}>{move.level ?? "-"}</Text>
                                            <Text style={[styles.moveCell, { flex: 1.5 }]}>{move.name}</Text>
                                            <View style={[styles.moveCell, { flex: 1, alignItems: "center", justifyContent: "center" }]}>
                                                <TypePill type={move.type} />
                                            </View>
                                            <Text style={[styles.moveCell, { flex: 1 }]}>{move.category}</Text>
                                            <Text style={[styles.moveCell, { flex: 1 }]}>{move.power ?? "-"}</Text>
                                            <Text style={[styles.moveCell, { flex: 1 }]}>{move.accuracy ?? "-"}</Text>
                                            <Text style={[styles.moveCell, { flex: 0.8 }]}>{move.pp ?? "-"}</Text>
                                            <Text style={[styles.moveCell, { flex: 1 }]}>{move.effectPercent ?? "-"}</Text>
                                        </View>

                                        {/* Description under row */}
                                        <Text style={styles.moveDescription}>{move.description}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </>
                    )}

                    {/* Close button */}
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default PokemonDetailModal;
