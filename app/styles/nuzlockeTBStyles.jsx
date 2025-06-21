import { Dimensions, StyleSheet } from 'react-native';

const screenWidth = Dimensions.get('window').width;

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
      },
      

});

export default nuzlockeStyles;
