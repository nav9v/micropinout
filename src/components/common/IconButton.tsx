import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

type IconButtonProps = {
    type: 'material' | 'ionicons';
    name: string;
    size: number;
    color: string;
    onPress: () => void;
    style?: ViewStyle;
};

export default function IconButton({
    type,
    name,
    size,
    color,
    onPress,
    style
}: IconButtonProps) {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
            {type === 'material' ? (
                <MaterialIcons name={name as any} size={size} color={color} />
            ) : (
                <Ionicons name={name as any} size={size} color={color} />
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
