import { Dimensions, StyleSheet } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const soulockeTBStyles = StyleSheet.create({
    overallContainer: {
        flex: 1,
    },

    banner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#ddd',
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
        width: 100,
    },

    optionsBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        paddingHorizontal: 12,
        backgroundColor: '#f2f2f2',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        gap: 12,
        width: '100%',
    },

    optionsButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 8,
    },

    optionsButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    scrollWrapper: {
        flex: 1,
        height: screenHeight,
        paddingTop: 0,
    },

    scrollContentContainer: {
        flexGrow: 1,
    },

    rowsWrapper: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
    },

    rowSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },

    trainerColumn: {
        flex: 1.75,            // more space than sprite column
        paddingHorizontal: 6,
    },

    spriteColumn: {
        flex: 0.5,             // less space than trainers
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 0,  // prevent bleeding
    },

    spritePairBox: {
        borderWidth: 2,
        borderColor: '#aaa',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 1,
        marginVertical: 4,
        backgroundColor: '#f9f9f9',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },

    spritePair: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        height: 100,
    },

    sprite: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },

    fullVerticalDivider: {
        width: 2,
        height: '100%',
        backgroundColor: '#444',
        marginHorizontal: 6,
    },

    chainOverlay: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [
            { translateX: -16 },
            { translateY: -12 },
        ],
        zIndex: 2,
        fontSize: 18,
        backgroundColor: '#f9f9f9',
        paddingHorizontal: 2,
    },

    sectionHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 2,
        marginTop: 2,
    },

    placeholderBox: {
        height: 230,                // taller than before
        width: '100%',              // fill the column without overflowing
        backgroundColor: '#eee',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 4,
        alignSelf: 'stretch',
    },
    trainerWithLabel: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
    },

    trainerWithLabelRight: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
        justifyContent: 'flex-end',
    },

    trainerLabelBox: {
        backgroundColor: '#e0e7ff', // subtle light bluish background
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 10,
        marginRight: 8,
        marginTop: 4,
        alignSelf: 'flex-start',
        elevation: 1, // subtle shadow for android
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },

    trainerLabelBoxRight: {
        backgroundColor: '#e0e7ff',
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 10,
        marginLeft: 8,
        marginTop: 4,
        alignSelf: 'flex-start',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },

    trainerLabelText: {
        fontWeight: '600',
        fontSize: 14,
        color: '#334155', // a subtle darkish blue/gray
    },

    labelWrapper: {
        position: 'relative',
    },

    trainer1Label: {
        position: 'absolute',
        top: 4,
        left: 20, // Adjust based on your padding
        backgroundColor: '#e0e7ff',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 6,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        zIndex: 10,
    },

    trainer2Label: {
        position: 'absolute',
        top: 4,
        right: 20, // Adjust based on your padding
        backgroundColor: '#e0e7ff',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 6,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        zIndex: 10,
    },

    trainerLabelText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
    },

    resistancesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 0,
        //marginTop: 4,
        marginBottom: 12,
    },

    resistancesColumn: {
        flex: 1,
        marginTop: 8
    },

    resistancesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    resistancesGridTOne: {
        flexDirection: 'row-reverse',
        flexWrap: 'wrap',
        gap: 8,
    },

    resistanceGroup: {
        flexDirection: 'column',
        gap: 6,
    },

    resistanceGroupTOne: {
        flexDirection: 'column',
        gap: 6,
        alignItems: 'flex-end'
    },

    typeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Pushes count to the right
        marginBottom: 4,
        width: '100%',
    },

    typeRowTOne: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end', // Push everything to the right
        marginBottom: 4,
        gap: 4, // Optional: adds spacing between pill and count
    },

    subHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 6,
        color: '#444',
    },
    subHeaderTOne: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 6,
        color: '#444',
        textAlign: 'right',
    },

    typeRowWeak: {
        flexDirection: 'row',
        justifyContent: 'space-between', // ensures pill + count are spaced cleanly
        alignItems: 'center',
        width: '100%',
        marginBottom: 6,
    },
    weaknessCountText: {
        minWidth: 30,
        textAlign: 'right',
    },

    chartButton: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 8,
        minWidth: 70,
        alignItems: 'center',
    },

    chartButtonText: {
        fontSize: 12,
        color: 'white',
        fontWeight: '500',
    },

    chartButtonActive: {
        borderWidth: 2,
        borderColor: '#333',
    },

    statLabel: {
        fontSize: 12,
        color: '#444',
    },

    statValue: {
        fontSize: 12,
        fontWeight: 'bold',
    },

    statValueBold: {
        fontSize: 13,
        color: '#007AFF',
    },




});

export default soulockeTBStyles;
