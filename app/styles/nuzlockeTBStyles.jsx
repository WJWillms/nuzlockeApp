import { Dimensions, StyleSheet } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const nuzlockeStyles = StyleSheet.create({
    banner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#f0f0f0',
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },

    navButton: {
        fontSize: 16,
        color: '#2563eb',
    },

    teamTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },

    placeholder: {
        width: 100, // Approx width of nav button to keep center aligned
    },
    teamContainer: {
        flexDirection: 'row',
        justifyContent: 'center',        // Center the whole row
        flexWrap: 'nowrap',              // Force one line
        gap: 12,                         // Optional, RN 0.71+ (or use marginRight below)
        marginTop: 20,
    },

    pokemonSlot: {
        width: 180,                       // Doubled size
        alignItems: 'center',
        padding: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 12,
        backgroundColor: '#f9f9f9',
        marginHorizontal: 6,             // space between boxes (fallback for gap)
    },

    sprite: {
        width: 110,
        height: 110,
        resizeMode: 'contain',
        marginBottom: 6,
    },

    name: {
        fontSize: 13,
        textAlign: 'center',
    },
    typeIconRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
        marginBottom: 12,
        paddingHorizontal: 12,
    },

    typeIcon: {
        width: 32,
        height: 32,
        resizeMode: 'contain',
        marginHorizontal: 4,
    },
    resistancesSection: {
        marginTop: 20,
        paddingHorizontal: 16,
    },

    sectionHeader: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },

    subHeader: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 12,
        marginBottom: 6,
    },

    resistRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },

    resistEntry: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
        marginBottom: 6,
    },

    typeIconSmall: {
        width: 48,
        height: 48,
        marginRight: 2,
        resizeMode: 'contain',
    },
    bottomSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        marginTop: 24,
        gap: 12,
    },

    column: {
        flex: 1,
        padding: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        minHeight: screenHeight - 300,
    },

    statText: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 2,
        color: '#333',
    },
    statsTotalsContainer: {
        marginTop: 10,
        alignItems: 'center',
    },

    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 300, // adjust if needed
        marginVertical: 2,
    },

    statLabel: {
        flex: 1,
        textAlign: 'left',
        fontSize: 16,
        color: '#333',
    },

    statValue: {
        flex: 1,
        textAlign: 'right',
        fontSize: 16,
        color: '#333',
    },

    statValueBold: {
        fontWeight: 'bold',
    },
    chartWithButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    chartButtonContainer: {
        marginLeft: 16,
        justifyContent: 'center',
    },

    chartButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },

    chartButtonActive: {
        borderWidth: 2,
        borderColor: '#333',
    },

    chartButtonText: {
        color: '#fff',
        fontWeight: '600',
        textAlign: 'center',
    },



});

export default nuzlockeStyles;
