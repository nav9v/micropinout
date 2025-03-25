import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types'; 
import { RootState } from '../store';
import { setPinouts, setLoading } from '../store/pinoutSlice';
import { Ionicons } from '@expo/vector-icons';

// Sample data with proper structure including pins array
const samplePinouts = [
    {
        id: '1',
        name: 'Arduino Uno',
        description: 'Standard Arduino board',
        pins: [
            { number: 1, name: 'Reset', function: 'Reset the microcontroller' },
            { number: 2, name: '3.3V', function: '3.3V output' },
            { number: 3, name: '5V', function: '5V output' },
            { number: 4, name: 'GND', function: 'Ground' },
            { number: 5, name: 'GND', function: 'Ground' },
            { number: 6, name: 'Vin', function: 'Input voltage' },
            { number: 7, name: 'A0', function: 'Analog input 0' },
            { number: 8, name: 'A1', function: 'Analog input 1' }
        ]
    },
    {
        id: '2',
        name: 'Raspberry Pi 4',
        description: '40-pin GPIO header',
        pins: [
            { number: 1, name: '3.3V', function: '3.3V output' },
            { number: 2, name: '5V', function: '5V output' },
            { number: 3, name: 'GPIO 2', function: 'I2C1 SDA' },
            { number: 4, name: '5V', function: '5V output' },
            { number: 5, name: 'GPIO 3', function: 'I2C1 SCL' },
            { number: 6, name: 'GND', function: 'Ground' },
            { number: 7, name: 'GPIO 4', function: 'GPCLK0' },
            { number: 8, name: 'GPIO 14', function: 'UART0 TXD' }
        ]
    },
    {
        id: '3',
        name: 'ESP32',
        description: 'WiFi & Bluetooth enabled microcontroller',
        pins: [
            { number: 1, name: '3V3', function: '3.3V output' },
            { number: 2, name: 'EN', function: 'Enable (reset)' },
            { number: 3, name: 'VP', function: 'Analog input' },
            { number: 4, name: 'VN', function: 'Analog input' },
            { number: 5, name: 'GPIO34', function: 'Input only' },
            { number: 6, name: 'GPIO35', function: 'Input only' },
            { number: 7, name: 'GPIO32', function: 'Digital I/O' },
            { number: 8, name: 'GPIO33', function: 'Digital I/O' }
        ]
    },
];

type HomeScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
    const dispatch = useDispatch();
    const { list, loading, error } = useSelector((state: RootState) => state.pinouts);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        // Simulate data fetching
        dispatch(setLoading(true));

        // In a real app, fetch from an API
        setTimeout(() => {
            dispatch(setPinouts(samplePinouts));
        }, 1000);
    }, [dispatch]);

    if (loading) {
        return (
            <View style={styles.centered}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>Error: {error}</Text>
            </View>
        );
    }

    const filteredList = list.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={24} color="#866" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search microcontrollers..."
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>
            <Text style={styles.title}>Select a Microcontroller</Text>
            <FlatList
                data={filteredList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => navigation.navigate('PinoutDetail', { pinoutId: item.id })}
                    >
                        <Text style={styles.itemTitle}>{item.name}</Text>
                        <Text>{item.description}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        borderRadius: 25,
        paddingHorizontal: 15,
        marginBottom: 16,
        height: 50,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 50,
        fontSize: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    item: {
        backgroundColor: '#f9f9f9',
        padding: 20,
        borderRadius: 8,
        marginBottom: 12,
        elevation: 2,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    itemText: {
        fontSize: 16,
        fontWeight: '500',
    },
});
