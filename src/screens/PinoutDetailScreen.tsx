import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
    Dimensions
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addToFavorites, removeFromFavorites } from '../store/pinoutSlice';
import { boardService } from '../services/boardService';
import { Ionicons } from '@expo/vector-icons';
import InteractivePinout from '../components/pinouts/InteractivePinout';
import PinDetailAnimation from '../components/pinouts/PinDetailAnimation';
import { PinDefinition, BoardDefinition } from '../types/boards';

type PinoutDetailScreenProps = {
    route: RouteProp<RootStackParamList, 'PinoutDetail'>;
    navigation: NativeStackNavigationProp<RootStackParamList, 'PinoutDetail'>;
};

export default function PinoutDetailScreen({ route, navigation }: PinoutDetailScreenProps) {
    const { pinoutId } = route.params;
    const dispatch = useDispatch();
    const { list, favoriteBoards } = useSelector((state: RootState) => state.pinouts);

    const [selectedPin, setSelectedPin] = useState<PinDefinition | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);

    // Find the board in the store
    const board = list.find(b => b.id === pinoutId);

    useEffect(() => {
        if (!board) return;

        // Set navigation title
        navigation.setOptions({
            title: board.name,
            headerRight: () => (
                <TouchableOpacity
                    onPress={handleToggleFavorite}
                    style={{ marginRight: 16 }}
                >
                    <Ionicons
                        name={isFavorite ? "heart" : "heart-outline"}
                        size={24}
                        color={isFavorite ? "#E91E63" : "#333"}
                    />
                </TouchableOpacity>
            )
        });

        // Set favorite status
        setIsFavorite(favoriteBoards.includes(pinoutId));

        // Add to recent boards
        boardService.addToRecentBoards(pinoutId);
    }, [board, pinoutId, favoriteBoards, navigation]);

    const handleToggleFavorite = () => {
        if (isFavorite) {
            dispatch(removeFromFavorites(pinoutId));
            try {
                boardService.removeFromFavorites(pinoutId);
            } catch (error) {
                console.error('Error removing from favorites:', error);
                // Optionally revert the UI state if the operation fails
                // dispatch(addToFavorites(pinoutId));
                // setIsFavorite(true);
                // return;
            }
        } else {
            dispatch(addToFavorites(pinoutId));
            boardService.addToFavorites(pinoutId);
        }
        setIsFavorite(!isFavorite);
    };

    const handlePinSelect = (pin: PinDefinition) => {
        setSelectedPin(pin);
    };

    const handlePinDetailClose = () => {
        setSelectedPin(null);
    };

    if (!board) {
        return (
            <View style={styles.centered}>
                <Text>Board not found</Text>
            </View>
        );
    }

    // Get pin colors by type
    const getPinColor = (type: string): string => {
        switch (type) {
            case 'power': return '#E53935';  // Red
            case 'ground': return '#212121'; // Black
            case 'digital': return '#1E88E5'; // Blue
            case 'analog': return '#43A047'; // Green
            case 'communication': return '#FB8C00'; // Orange
            case 'special': return '#8E24AA'; // Purple
            default: return '#757575'; // Gray
        }
    };

    // Add colors to pins based on their type
    const pinsWithColors = board.pins.map(pin => ({
        ...pin,
        color: getPinColor(pin.type)
    }));

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.manufacturer}>{board.manufacturer}</Text>
                <Text style={styles.boardName}>{board.name}</Text>
                <Text style={styles.description}>{board.description}</Text>
            </View>

            <View style={styles.specContainer}>
                <Text style={styles.sectionTitle}>Specifications</Text>
                <View style={styles.specTable}>
                    <View style={styles.specRow}>
                        <Text style={styles.specLabel}>Processor</Text>
                        <Text style={styles.specValue}>{board.specs.processor}</Text>
                    </View>
                    <View style={styles.specRow}>
                        <Text style={styles.specLabel}>Voltage</Text>
                        <Text style={styles.specValue}>{board.specs.voltage}</Text>
                    </View>
                    {board.specs.digitalPins && (
                        <View style={styles.specRow}>
                            <Text style={styles.specLabel}>Digital Pins</Text>
                            <Text style={styles.specValue}>{board.specs.digitalPins}</Text>
                        </View>
                    )}
                    {board.specs.analogInputs && (
                        <View style={styles.specRow}>
                            <Text style={styles.specLabel}>Analog Inputs</Text>
                            <Text style={styles.specValue}>{board.specs.analogInputs}</Text>
                        </View>
                    )}
                    {board.specs.clockSpeed && (
                        <View style={styles.specRow}>
                            <Text style={styles.specLabel}>Clock Speed</Text>
                            <Text style={styles.specValue}>{board.specs.clockSpeed}</Text>
                        </View>
                    )}
                    {board.specs.flash && (
                        <View style={styles.specRow}>
                            <Text style={styles.specLabel}>Flash Memory</Text>
                            <Text style={styles.specValue}>{board.specs.flash}</Text>
                        </View>
                    )}
                    {board.specs.ram && (
                        <View style={styles.specRow}>
                            <Text style={styles.specLabel}>RAM</Text>
                            <Text style={styles.specValue}>{board.specs.ram}</Text>
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.pinoutContainer}>
                <Text style={styles.sectionTitle}>Interactive Pinout</Text>
                <Text style={styles.instruction}>Tap on a pin to view details</Text>

                <View style={styles.pinLegend}>
                    {['power', 'ground', 'digital', 'analog', 'communication', 'special'].map(type => (
                        <View key={type} style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: getPinColor(type) }]} />
                            <Text style={styles.legendText}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.pinoutWrapper}>
                    <InteractivePinout
                        width={board.dimensions.width}
                        height={board.dimensions.height}
                        pins={pinsWithColors}
                        onPinSelect={handlePinSelect}
                    />
                </View>
            </View>

            <TouchableOpacity
                style={styles.documentationButton}
                onPress={() => Linking.openURL(board.documentation)}
            >
                <Ionicons name="document-text-outline" size={20} color="#FFF" />
                <Text style={styles.documentationText}>View Official Documentation</Text>
            </TouchableOpacity>

            {selectedPin && (
                <PinDetailAnimation
                    pin={selectedPin}
                    onClose={handlePinDetailClose}
                />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EAECEF',
    },
    manufacturer: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    boardName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: '#555',
        lineHeight: 22,
    },
    specContainer: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        marginTop: 12,
        borderRadius: 12,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: '#333',
    },
    specTable: {
        borderWidth: 1,
        borderColor: '#EAECEF',
        borderRadius: 8,
    },
    specRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#EAECEF',
        padding: 12,
    },
    specLabel: {
        flex: 1,
        fontSize: 14,
        color: '#555',
        fontWeight: '500',
    },
    specValue: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    pinoutContainer: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        marginTop: 12,
        borderRadius: 12,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 16,
    },
    instruction: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
        fontStyle: 'italic',
    },
    pinLegend: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
        marginBottom: 8,
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 4,
    },
    legendText: {
        fontSize: 12,
        color: '#555',
    },
    pinoutWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
    },
    documentationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4A80F0',
        marginHorizontal: 16,
        marginBottom: 24,
        padding: 14,
        borderRadius: 12,
    },
    documentationText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
    },
});