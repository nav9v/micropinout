import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import InteractivePinout from '../components/pinouts/InteractivePinout';
import PinDetailAnimation from '../components/pinouts/PinDetailAnimation';
import IconButton from '../components/common/IconButton';
import { useFavoritePinouts } from '../utils/storage';

type PinDefinition = {
    number: number;
    x: number;
    y: number;
    name: string;
    function: string;
};

type PinoutDetailScreenProps = {
    route: RouteProp<RootStackParamList, 'PinoutDetail'>;
};

export default function PinoutDetailScreen({ route }: PinoutDetailScreenProps) {
    const { pinoutId } = route.params;
    const pinouts = useSelector((state: RootState) => state.pinouts.list);
    const pinout = pinouts.find((p) => p.id === pinoutId);
    const { width } = useWindowDimensions();
    const [selectedPin, setSelectedPin] = useState<PinDefinition | null>(null);
    const { isFavorite, addFavorite, removeFavorite } = useFavoritePinouts();

    const isFav = pinout ? isFavorite(pinout.id) : false;

    // Create dummy pin positions for demo
    const createDummyPins = (): PinDefinition[] => {
        if (!pinout || !pinout.pins) return [];

        const pins: PinDefinition[] = [];
        const boardWidth = width - 40;
        const boardHeight = 300;

        // Create a grid layout
        pinout.pins.forEach((pin, index) => {
            const row = Math.floor(index / 10);
            const col = index % 10;

            pins.push({
                ...pin,
                x: 20 + col * (boardWidth / 10) + 15,
                y: 20 + row * 40 + 15
            });
        });

        return pins;
    };

    const handlePinSelect = (pin: PinDefinition) => {
        setSelectedPin(pin);
    };

    const handleCloseDetails = () => {
        setSelectedPin(null);
    };

    const toggleFavorite = () => {
        if (!pinout) return;

        if (isFav) {
            removeFavorite(pinout.id);
        } else {
            addFavorite(pinout.id);
        }
    };

    if (!pinout) {
        return (
            <View style={styles.centered}>
                <Text>Pinout not found!</Text>
            </View>
        );
    }

    const pinData = createDummyPins();

    return (
        <GestureHandlerRootView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.title}>{pinout.name}</Text>
                    <IconButton
                        type="material"
                        name={isFav ? "favorite" : "favorite-border"}
                        size={24}
                        color={isFav ? "#f44336" : "#000"}
                        onPress={toggleFavorite}
                        style={styles.favoriteButton}
                    />
                    <Text style={styles.description}>{pinout.description}</Text>
                </View>

                <View style={styles.pinoutSection}>
                    <Text style={styles.sectionTitle}>Pin Configuration</Text>
                    <View style={styles.pinoutContainer}>
                        <InteractivePinout
                            width={width - 32}
                            height={350}
                            pins={pinData}
                            onPinSelect={handlePinSelect}
                        />
                    </View>

                    <Text style={styles.instructions}>
                        Pinch to zoom and drag to pan. Tap on a pin to see details.
                    </Text>
                </View>
            </ScrollView>

            {selectedPin && (
                <PinDetailAnimation
                    pin={selectedPin}
                    onClose={handleCloseDetails}
                />
            )}
            
            <ScrollView style={styles.container}>
                <Text style={styles.title}>{pinout.name} Pinout</Text>
                
                {/* Placeholder for image - replace with actual image component */}
                <View style={styles.imageContainer}>
                    <Text style={styles.imagePlaceholder}>Pinout Diagram</Text>
                    {/* <Image 
                    source={require(`../assets/images/${pinout.id}.png`)} 
                    style={styles.image} 
                    resizeMode="contain"
                    /> */}
                </View>
                
                <View style={styles.pinList}>
                    <Text style={styles.sectionTitle}>Pin Descriptions:</Text>
                    {pinout.pins.map((pin) => (
                    <View key={pin.number} style={styles.pinItem}>
                        <Text style={styles.pinNumber}>Pin {pin.number}</Text>
                        <Text style={styles.pinName}>{pin.name}</Text>
                        <Text style={styles.pinDescription}>{pin.function}</Text>
                    </View>
                    ))}
                </View>
            </ScrollView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 16,
        position: 'relative',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginRight: 40,
    },
    favoriteButton: {
        position: 'absolute',
        top: 16,
        right: 16,
    },
    description: {
        fontSize: 16,
        color: '#666',
        marginTop: 8,
    },
    pinoutSection: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    pinoutContainer: {
        height: 350,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        overflow: 'hidden',
    },
    instructions: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginTop: 8,
    },
    imageContainer: {
        height: 200,
        backgroundColor: '#e1e1e1',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderRadius: 8,
    },
    imagePlaceholder: {
        fontSize: 16,
        color: '#555',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    pinList: {
        marginTop: 10,
    },
    pinItem: {
        padding: 12,
        backgroundColor: '#f5f5f5',
        marginBottom: 8,
        borderRadius: 6,
    },
    pinNumber: {
        fontWeight: 'bold',
    },
    pinName: {
        color: '#0066cc',
        marginTop: 4,
    },
    pinDescription: {
        marginTop: 4,
        color: '#444',
    },
});
