import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type PinDefinition = {
    number: number;
    x: number;
    y: number;
    name: string;
    function: string;
};

type PinDetailAnimationProps = {
    pin: PinDefinition;
    onClose: () => void;
};

export default function PinDetailAnimation({ pin, onClose }: PinDetailAnimationProps) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={true}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Pressable style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color="black" />
                    </Pressable>
                    <Text style={styles.pinNumber}>Pin #{pin.number}</Text>
                    <Text style={styles.pinName}>{pin.name}</Text>
                    <Text style={styles.pinFunction}>{pin.function}</Text>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButton: {
        position: 'absolute',
        right: 10,
        top: 10,
        padding: 10,
    },
    pinNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    pinName: {
        fontSize: 16,
        marginBottom: 5,
    },
    pinFunction: {
        fontSize: 14,
        color: '#666',
    },
});
