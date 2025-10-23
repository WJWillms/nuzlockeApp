import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Image,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import evolutionMap from "../app/Pokedex/evolutionMap";
import spriteMap from "../app/Pokedex/spriteMap";
import styles from "../app/styles/PokemonDetailModalStyles";
import TypePill from "../components/TypePill";

// 🧩 New sub-component for evolution stages with hover tooltip
const EvolutionStage = ({ stage }) => {
    const [hovered, setHovered] = useState(null);

    if (!stage) return null;

    // --- Single Evolution Chain (one next stage) ---
    if (stage.next && stage.next.length === 1) {
        const nextStage = stage.next[0];
        const key =
            nextStage.method === "level"
                ? `l${nextStage.value}`
                : nextStage.value?.toLowerCase();
        const evoData = evolutionMap[key];

        return (
            <View style={styles.evolutionRow}>
                <View style={styles.evolutionStage}>
                    <Image
                        source={spriteMap[stage.spriteId]}
                        style={styles.evolutionImage}
                    />
                    <Text style={styles.evolutionName}>{stage.name}</Text>
                </View>

                {evoData && (
                    <View style={{ alignItems: "center" }}>
                        <Pressable
                            onHoverIn={() => setHovered(key)}
                            onHoverOut={() => setHovered(null)}
                        >
                            <Image
                                source={evoData.image}
                                style={styles.evolutionMethod}
                                resizeMode="contain"
                            />
                        </Pressable>

                        {hovered === key && (
                            <View style={styles.tooltipContainer}>
                                <Text style={styles.tooltipText}>
                                    {evoData.description}
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Recursive call */}
                <EvolutionStage stage={nextStage} />
            </View>
        );
    }

    // --- Branching Evolutions (more than one next stage) ---
    if (stage.next && stage.next.length > 1) {
        return (
            <View style={styles.evolutionRowVertical}>
                <View style={styles.evolutionStage}>
                    <Image
                        source={spriteMap[stage.spriteId]}
                        style={styles.evolutionImage}
                    />
                    <Text style={styles.evolutionName}>{stage.name}</Text>
                </View>

                {stage.next.map((nextStage) => (
                    <View key={nextStage.id} style={styles.branchContainer}>
                        <EvolutionStage stage={nextStage} />
                    </View>
                ))}
            </View>
        );
    }

    // --- Final Evolution (no next) ---
    return (
        <View style={styles.evolutionStage}>
            <Image
                source={spriteMap[stage.spriteId]}
                style={styles.evolutionImage}
            />
            <Text style={styles.evolutionName}>{stage.name}</Text>
        </View>
    );
};

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

    if (!pokemon) return null;

    return (
        <Modal visible={showModal} transparent animationType="none">
            <View style={styles.overlay}>
                <Animated.View
                    style={[
                        styles.modalContainer,
                        {
                            transform: [{ translateY: slideAnim }],
                            opacity: opacityAnim,
                        },
                    ]}
                >
                    {/* Header */}
                    <Text style={styles.pokemonName}>{pokemon.name}</Text>
                    <View style={styles.divider} />

                    {/* Sprite + Stats + Weaknesses + Resistances */}
                    <View style={styles.headerRow}>
                        {/* Sprite + Types */}
                        <View style={styles.spriteAndTypesContainer}>
                            <View style={styles.spriteWrapper}>
                                <Image
                                    source={spriteMap[pokemon.spriteId]}
                                    style={styles.sprite}
                                />
                            </View>

                            {/* Types below sprite */}
                            <View style={styles.typeWrapperBelow}>
                                <View style={styles.typePillsContainer}>
                                    <TypePill type={pokemon.typeOne} />
                                    {pokemon.typeTwo && (
                                        <View style={styles.typeSpacing}>
                                            <TypePill type={pokemon.typeTwo} />
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>

                        {/* Stats + Weaknesses + Resistances */}
                        <View style={styles.rightInfoSection}>
                            {/* Stats */}
                            <View style={styles.statColumnSingle}>
                                <Text style={styles.statLabel}>
                                    HP:{" "}
                                    <Text style={styles.statValue}>
                                        {pokemon.hp}
                                    </Text>
                                </Text>
                                <Text style={styles.statLabel}>
                                    Attack:{" "}
                                    <Text style={styles.statValue}>
                                        {pokemon.attack}
                                    </Text>
                                </Text>
                                <Text style={styles.statLabel}>
                                    Defense:{" "}
                                    <Text style={styles.statValue}>
                                        {pokemon.defense}
                                    </Text>
                                </Text>
                                <Text style={styles.statLabel}>
                                    Sp. Atk:{" "}
                                    <Text style={styles.statValue}>
                                        {pokemon.specialAttack}
                                    </Text>
                                </Text>
                                <Text style={styles.statLabel}>
                                    Sp. Def:{" "}
                                    <Text style={styles.statValue}>
                                        {pokemon.specialDefense}
                                    </Text>
                                </Text>
                                <Text style={styles.statLabel}>
                                    Speed:{" "}
                                    <Text style={styles.statValue}>
                                        {pokemon.speed}
                                    </Text>
                                </Text>

                                <Text style={styles.totalStats}>
                                    Total: {pokemon.totalBaseStats}
                                </Text>
                            </View>

                            {/* Weaknesses & Resistances */}
                            <View style={styles.wrColumns}>
                                <View style={styles.wrColumn}>
                                    <Text style={styles.wrHeader}>
                                        Weaknesses
                                    </Text>
                                    <View style={styles.typeGrid}>
                                        {Object.keys(pokemon.weaknesses).map(
                                            (type, index) => (
                                                <View
                                                    key={index}
                                                    style={styles.typeCell}
                                                >
                                                    <TypePill type={type} />
                                                </View>
                                            )
                                        )}
                                    </View>
                                </View>

                                <View style={styles.wrColumn}>
                                    <Text style={styles.wrHeader}>
                                        Resistances
                                    </Text>
                                    <View style={styles.typeGrid}>
                                        {Object.keys(pokemon.resistances).map(
                                            (type, index) => (
                                                <View
                                                    key={index}
                                                    style={styles.typeCell}
                                                >
                                                    <TypePill type={type} />
                                                </View>
                                            )
                                        )}
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Evolution Chain */}
                    {pokemon.evolutionLine && pokemon.evolutionLine.length > 0 && (
                        <>
                            <Text style={styles.ECSectionTitle}>
                                Evolutionary Chain
                            </Text>
                            <ScrollView
                                horizontal
                                style={styles.evolutionScroll}
                                contentContainerStyle={{
                                    flexGrow: 1,
                                    justifyContent: "center",
                                }}
                                showsHorizontalScrollIndicator={false}
                            >
                                <View style={styles.evolutionScrollInner}>
                                    <EvolutionStage
                                        stage={pokemon.evolutionLine[0]}
                                    />
                                </View>
                            </ScrollView>
                            <View style={styles.divider} />
                        </>
                    )}

                    {/* Level-Up Moves */}
                    {pokemon.levelUpMoves?.length > 0 && (
                        <>
                            <Text style={styles.sectionTitle}>
                                Level-Up Moves
                            </Text>

                            {/* Header Row */}
                            <View style={styles.movesHeaderRow}>
                                <Text style={[styles.headerCell, { flex: 0.5 }]}>
                                    Lvl
                                </Text>
                                <Text style={[styles.headerCell, { flex: 1.5 }]}>
                                    Move
                                </Text>
                                <Text style={[styles.headerCell, { flex: 1 }]}>
                                    Type
                                </Text>
                                <Text style={[styles.headerCell, { flex: 1 }]}>
                                    Category
                                </Text>
                                <Text style={[styles.headerCell, { flex: 1 }]}>
                                    Power
                                </Text>
                                <Text style={[styles.headerCell, { flex: 1 }]}>
                                    Accuracy
                                </Text>
                                <Text style={[styles.headerCell, { flex: 0.8 }]}>
                                    PP
                                </Text>
                                <Text style={[styles.headerCell, { flex: 1 }]}>
                                    Effect %
                                </Text>
                            </View>

                            <ScrollView style={styles.movesScroll}>
                                {pokemon.levelUpMoves.map((move, idx) => (
                                    <View key={idx} style={styles.moveRow}>
                                        <View style={styles.moveInfoRow}>
                                            <Text
                                                style={[
                                                    styles.moveCell,
                                                    { flex: 0.5 },
                                                ]}
                                            >
                                                {move.level ?? "-"}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.moveCell,
                                                    { flex: 1.5 },
                                                ]}
                                            >
                                                {move.name}
                                            </Text>
                                            <View
                                                style={[
                                                    styles.moveCell,
                                                    {
                                                        flex: 1,
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                    },
                                                ]}
                                            >
                                                <TypePill type={move.type} />
                                            </View>
                                            <Text
                                                style={[
                                                    styles.moveCell,
                                                    { flex: 1 },
                                                ]}
                                            >
                                                {move.category}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.moveCell,
                                                    { flex: 1 },
                                                ]}
                                            >
                                                {move.power ?? "-"}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.moveCell,
                                                    { flex: 1 },
                                                ]}
                                            >
                                                {move.accuracy ?? "-"}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.moveCell,
                                                    { flex: 0.8 },
                                                ]}
                                            >
                                                {move.pp ?? "-"}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.moveCell,
                                                    { flex: 1 },
                                                ]}
                                            >
                                                {move.effectPercent ?? "-"}
                                            </Text>
                                        </View>

                                        <Text style={styles.moveDescription}>
                                            {move.description}
                                        </Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </>
                    )}

                    {/* Close */}
                    <TouchableOpacity
                        onPress={onClose}
                        style={styles.closeButton}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default PokemonDetailModal;
