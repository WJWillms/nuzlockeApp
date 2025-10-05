import { Dimensions, StyleSheet } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "#eee",
        borderRadius: 12,
        padding: 16,
        width: Math.min(screenWidth * 0.95, 1000),  // slightly wider
        maxHeight: "95%",                             // taller
    },

    headerRow: {
        flexDirection: "row",
        marginBottom: screenHeight * 0.004,
    },
    sprite: {
        width: screenWidth * 0.07,
        height: screenHeight * 0.12,
        marginRight: 1,
        //marginBottom: screenWidth * 0.005,
    },
    typeContainer: {
        justifyContent: "flex-start",
    },
    typeSpacing: {
        marginTop: 4,
    },
    statBlock: {
        marginLeft: 16,
    },
    ECSectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: screenHeight * 0.005,
    },

    evolutionScroll: {
        marginTop: screenHeight * 0.0,
        marginBottom: screenHeight * 0.0,
    },
    evolutionScrollContent: {
        flexGrow: 1,           // allow content to grow to fill ScrollView width
        justifyContent: "center", // center horizontally if not scrollable
        alignItems: "center",   // center vertically
    },
    evolutionScrollInner: {
        flexDirection: "row",        // keep the chain horizontal
        justifyContent: "center",    // center if space available
        alignItems: "center",
        width: "100%",               // make it as wide as the ScrollView
    },
    evolutionRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    evolutionRowVertical: {
        flexDirection: "column",
        alignItems: "center",
    },
    branchContainer: {
        marginTop: 12,
    },
    evolutionStage: {
        alignItems: "center",
        marginHorizontal: 8,
    },
    evolutionImage: {
        width: screenWidth * 0.06,
        height: screenWidth * 0.06,
    },
    evolutionName: {
        fontSize: 12,
        textAlign: "center",
        marginBottom: screenHeight * 0.025,
    },
    evolutionMethod: {
        width: 80,
        height: 80,
        marginHorizontal: 8,
    },
    movesScroll: {
        marginTop: 12,
        maxHeight: screenHeight * 0.35,
    },
    moveRow: {
        marginBottom: 12,
    },
    moveInfoRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        marginBottom: 2,
    },
    moveLevel: { width: 28 },
    moveName: { width: 100 },
    moveCategory: { width: 60 },
    movePower: { width: 40 },
    moveAccuracy: { width: 40 },
    movePP: { width: 40 },
    moveEffect: { width: 40 },
    moveDescription: {
        fontSize: 12,
        color: "#555",
        marginTop: 2,
    },
    closeButton: {
        marginTop: 12,
        alignSelf: "center",
        backgroundColor: "#333",
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 6,
    },
    closeButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    pokemonName: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 8,
    },
    divider: {
        height: 2,
        backgroundColor: "#aaa",
        marginBottom: screenHeight * 0.005,
    },

    spriteWrapper: {
        borderWidth: 2,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingVertical: screenHeight * 0.01, // smaller top/bottom padding
        paddingHorizontal: screenWidth * 0.01, // keep side padding
        //marginRight: 12,
        alignItems: "center", // center sprite + type pills
        justifyContent: "center",
    },
    typeWrapper: {
        justifyContent: "center",
    },
    statSection: {
        flex: 1,
        marginLeft: 12,
    },
    statGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    statColumn: {
        alignItems: "center",
        flex: 1,
    },
    totalStats: {
        fontWeight: "bold",
        fontSize: 20,
        marginTop: 4,
    },
    totalStatsRow: {
        alignItems: "center",
        marginTop: 6,
    },
    statLabel: {
        fontWeight: "bold",
        fontSize: 18,
        marginBottom: 4,
    },
    statValue: {
        fontWeight: "normal",
        fontSize: 18,
    },
    typePillsContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    typeSpacing: {
        marginLeft: screenWidth * 0.005,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 8,
    },

    movesHeaderRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        backgroundColor: "#f9f9f9",
        borderBottomColor: "#ccc",
        paddingVertical: 4,
        marginBottom: 4,
    },

    headerCell: {
        fontSize: 12,
        fontWeight: "700",
        textAlign: "center",
        paddingVertical: 4,
        borderRightWidth: 1,
        borderColor: "#ccc",
    },

    moveRow: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#ccc",
        marginBottom: 4,
    },

    moveInfoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 2,
    },
    moveCell: {
        fontSize: 12,
        textAlign: "center",
        paddingVertical: 4,
        borderRightWidth: 1,
        borderColor: "#ccc",
    },

    moveDescription: {
        fontSize: 11,
        fontStyle: "italic",
        padding: 6,
    },

});

export default styles;
