import { Dimensions, StyleSheet } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = size => (screenWidth / guidelineBaseWidth) * size;
const verticalScale = size => (screenHeight / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
    size + (scale(size) - size) * factor;

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
        fontSize: moderateScale(5),
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
        minWidth: screenWidth,
        //width: '100%',
    },

    trainerColumn: {
        flex: 1.75,
        paddingHorizontal: 6,
        justifyContent: 'space-between', // Distribute placeholders evenly
        minWidth: screenWidth * 0.28,
        maxWidth: screenWidth * 0.7, //Maybe adjust this if we want to put in sideways typings
    },

    spriteColumn: {
        flex: 0.5,             // less space than trainers
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 0,  // prevent bleeding
        minWidth: screenWidth * 0.15,
        maxWidth: screenWidth * 0.25,
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
        width: Math.min(100, screenWidth * 0.25),
        height: Math.min(100, screenWidth * 0.25),
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
        fontSize: moderateScale(8),
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 1,
        marginTop: 1,
    },

    placeholderBox: {
        minHeight: screenHeight * 0.22,
        width: '100%',
        backgroundColor: '#eee',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 4,
        alignSelf: 'stretch',
        padding: 8,
        flexShrink: 1,
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
        fontSize: moderateScale(14),
        color: '#334155',
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
        marginTop: 7
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
        marginBottom: 0,
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

    modalOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    flyerModal: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        width: screenWidth > 600 ? '35%' : '90%',
        height: screenHeight > 600 ? '65%' : '80%',
        alignItems: 'center',
    },
    flyerTitle: {
        fontSize: moderateScale(18),
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalButtonRow: {
        paddingTop: 15,
        flexDirection: 'row',
        gap: 16,
    },
    cancelButton: {
        backgroundColor: '#999',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    applyButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    glowHighlight: {
        shadowColor: '#00f0ff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10, // Android shadow
        borderColor: '#00f0ff',
        borderWidth: 2,
        borderRadius: 999,
    },
    spriteFrame: {
        padding: 4,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#888',
        backgroundColor: '#fff',
    },

    glowFrame: {
        width: 120,
        height: 120, // just enough to hold sprite and name comfortably
        padding: 4,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#cc0000',
        backgroundColor: '#fff',
        shadowColor: '#cc0000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 8,
        elevation: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    monLabelInsideGlow: {
        fontSize: 12,
        color: '#cc0000',
        fontWeight: '600',
        marginTop: 2,
        textAlign: 'center',
        marginBottom: 2
    },



    pairHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 8,
        marginBottom: 6,
        width: '70%'
    },

    pairHeaderText: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14,
        color: '#444',
        paddingRight: 30
    },
    pairHeaderTextTOne: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14,
        color: '#444',
        paddingLeft: 30
    },

    pairHeaderTextRight: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14,
        color: '#444',
        paddingRight: 12,
    },

    flyerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 12,
    },

    toggleContainer: {
        paddingLeft: 12,
    },
    scrollList: {
        width: '60%',         // Stretch to fit modal width, OR override to a fixed width
        alignSelf: 'center',  // Optional, ensures full width of parent
        paddingHorizontal: 8,  // Add/remove this for spacing inside
    },
    spriteWithLabel: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4,
    },

    monLabel: {
        marginTop: 2,
        fontSize: 12,
        color: '#444',
        fontWeight: '500',
    },

    spriteWithLabel: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4,
    },

    originalMonLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
        textAlign: 'center',
    },

    typePillRow: {
        flexDirection: 'row',
        gap: 4,
        marginTop: 4,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },

    typePill: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 12,
        fontSize: 10,
        fontWeight: '600',
        color: 'white',
        overflow: 'hidden',
    },
    pillRowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 4,
        marginTop: 4,
        maxWidth: 80,
        overflow: 'hidden',
    },

    weaknessRowContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexWrap: 'nowrap',
        paddingHorizontal: 8,
        gap: 16,
    },

    weaknessColumn: {
        flexShrink: 1,
        flexGrow: 0,
        minWidth: 120,
        maxWidth: 200,
    },

    weaknessHeader: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 4,
        marginLeft: 4,
    },

    weaknessesRow: {
        flexDirection: 'row',    // Make categories sit horizontally
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexWrap: 'nowrap',      // No wrapping to next line unless you want it
    },

    weaknessColumnGroup: {
        flexDirection: 'column', // Stack contents vertically
        flexGrow: 1,             // Grow to fill available horizontal space equally
        flexBasis: '45%',        // Take up about half width per category (adjust as needed)
        marginRight: 12,
        minWidth: 140,           // Prevent from becoming too narrow
    },

    weaknessGrid: {
        flexDirection: 'column', // Stack groups vertically
    },

    weaknessGroup: {
        flexDirection: 'column',
        marginBottom: 8,
    },

    weaknessRow: {
        flexDirection: 'row',    // icon and text side by side
        alignItems: 'center',
        marginBottom: 6,
    },

    weaknessCount: {
        marginLeft: 6,
        textAlign: 'right',
        flexShrink: 0,
    },
    weaknessesGridTTwo: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start', // line up cleanly
        alignItems: 'flex-start',     // prevent vertical stretching
        gap: 8,
        width: '100%',
    },

    weaknessHeaderTTwo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 6,
        color: '#444',
        textAlign: 'left',
    },
    weaknessGroupTTwo: {
        flexDirection: 'column',
        gap: 6,
        flexShrink: 1,      // allow shrinking
        minWidth: 90,       // prevent columns from becoming too narrow
        maxWidth: 120,      // optional: help browser enforce limit
    },
    weaknessesRowTTwo: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 8,
    },














});

export default soulockeTBStyles;