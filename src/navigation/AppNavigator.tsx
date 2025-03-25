import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, RootTabParamList } from '../types/types';

import HomeScreen from '../screens/HomeScreen';
import PinoutDetailScreen from '../screens/PinoutDetailScreen';
import WikiScreen from '../screens/WikiScreen';
import SettingsScreen from '../screens/SettingsScreen';
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

// Stack navigator for Home tab
const HomeStack = () => {
    return (
        <Stack.Navigator initialRouteName="HomeScreen">
            <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{ title: 'MicroPinout' }}
            />
            <Stack.Screen
                name="PinoutDetail"
                component={PinoutDetailScreen}
                options={{ title: 'Pinout Details' }}
            />
        </Stack.Navigator>
    );
};

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Home') {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (route.name === 'Wiki') {
                            iconName = focused ? 'book' : 'book-outline';
                        } else if (route.name === 'Settings') {
                            iconName = focused ? 'settings' : 'settings-outline';
                        }

                        return <Ionicons name={iconName as any} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: '#0066cc',
                    tabBarInactiveTintColor: 'gray',
                    headerShown: false,
                })}
            >
                <Tab.Screen name="Wiki" component={WikiScreen} />
                <Tab.Screen name="Home" component={HomeStack} />
                <Tab.Screen name="Settings" component={SettingsScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
