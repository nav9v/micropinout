import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function WikiScreen() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Microcontroller Wiki</Text>
                <Text style={styles.subtitle}>Coming Soon</Text>
                <Text style={styles.description}>
                    This page will contain useful information about different microcontrollers,
                    their specifications, and common uses.
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        color: '#666',
    },
    description: {
        fontSize: 16,
        color: '#444',
        textAlign: 'center',
        lineHeight: 24,
    },
});
