import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Image,
    ScrollView
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';
import { RootState } from '../store';
import { fetchBoards, fetchFavoriteBoards, fetchRecentBoards, addToRecent } from '../store/pinoutSlice';
import { Ionicons } from '@expo/vector-icons';
import { BoardDefinition } from '../types/boards';
import IconButton from '../components/common/IconButton';

type HomeScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
    const dispatch = useDispatch();
    const {
        list,
        categories,
        favoriteBoards,
        recentBoards,
        loading,
        error
    } = useSelector((state: RootState) => state.pinouts);

    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        // Fetch all required data with error handling
        const fetchData = async () => {
            try {
                await Promise.all([
                    dispatch(fetchBoards()),
                    dispatch(fetchFavoriteBoards()),
                    dispatch(fetchRecentBoards())
                ]);
            } catch (error) {
                console.error('Error fetching data:', error);
                // You might want to dispatch an error action here
            }
        };
        
        fetchData();
    }, [dispatch]);

    const handleBoardPress = (boardId: string) => {
        dispatch(addToRecent(boardId));
        navigation.navigate('PinoutDetail', { pinoutId: boardId });
    };

    if (loading && list.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error && list.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>Error: {error}</Text>
            </View>
        );
    }

    // Filter boards based on search and category
    const filteredBoards = list.filter(board => {
        const matchesSearch = board.name.toLowerCase().includes(searchText.toLowerCase()) ||
            board.description.toLowerCase().includes(searchText.toLowerCase()) ||
            board.manufacturer.toLowerCase().includes(searchText.toLowerCase());

        const matchesCategory = selectedCategory ? board.category === selectedCategory : true;

        return matchesSearch && matchesCategory;
    });

    // Get favorite boards objects
    const favoriteBoardObjects = list.filter(board => favoriteBoards.includes(board.id));

    // Get recent boards objects in order
    const recentBoardObjects = recentBoards
        .map(id => list.find(board => board.id === id))
        .filter(board => board !== undefined) as BoardDefinition[];

    const renderBoardCard = ({ item }: { item: BoardDefinition }) => (
        <TouchableOpacity
            style={styles.boardCard}
            onPress={() => handleBoardPress(item.id)}
        >
            <Image
                source={item.image}
                style={styles.boardImage}
                resizeMode="contain"
            />
            <View style={styles.boardInfo}>
                <Text style={styles.boardName}>{item.name}</Text>
                <Text style={styles.manufacturer}>{item.manufacturer}</Text>
                <Text style={styles.description} numberOfLines={2}>
                    {item.description}
                </Text>
                <View style={styles.specsContainer}>
                    <Text style={styles.spec}>
                        <Ionicons name="hardware-chip-outline" size={12} /> {item.specs.processor}
                    </Text>
                    <Text style={styles.spec}>
                        <Ionicons name="flash-outline" size={12} /> {item.specs.voltage}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderCategoryButton = (category: string) => (
        <TouchableOpacity
            key={category}
            style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategory
            ]}
            onPress={() => setSelectedCategory(selectedCategory === category ? null : category)}
        >
            <Text style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText
            ]}>
                {category}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={24} color="#866" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search boards by name, manufacturer..."
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholderTextColor="#999"
                />
                {searchText ? (
                    <TouchableOpacity onPress={() => setSearchText('')}>
                        <Ionicons name="close-circle" size={24} color="#866" />
                    </TouchableOpacity>
                ) : null}
            </View>

            {/* Categories */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesContainer}
            >
                {categories.map(renderCategoryButton)}
            </ScrollView>

            <ScrollView style={styles.content}>
                {/* Recent boards section */}
                {recentBoardObjects.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Recently Viewed</Text>
                        <FlatList
                            horizontal
                            data={recentBoardObjects}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.recentCard}
                                    onPress={() => handleBoardPress(item.id)}
                                >
                                    <Image source={item.image} style={styles.recentImage} />
                                    <Text style={styles.recentName} numberOfLines={1}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={item => `recent-${item.id}`}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                )}

                {/* Favorite boards section */}
                {favoriteBoardObjects.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Favorites</Text>
                        <FlatList
                            data={favoriteBoardObjects}
                            renderItem={renderBoardCard}
                            keyExtractor={item => `favorite-${item.id}`}
                            horizontal={false}
                            scrollEnabled={false}
                        />
                    </View>
                )}

                {/* All boards section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        {selectedCategory ? `${selectedCategory} Boards` : 'All Boards'}
                    </Text>
                    <FlatList
                        data={filteredBoards}
                        renderItem={renderBoardCard}
                        keyExtractor={item => `all-${item.id}`}
                        horizontal={false}
                        scrollEnabled={false}
                    />
                </View>
            </ScrollView>
        </View>
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        margin: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    categoriesContainer: {
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        marginRight: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    selectedCategory: {
        backgroundColor: '#4A80F0',
    },
    categoryText: {
        color: '#555',
        fontWeight: '500',
    },
    selectedCategoryText: {
        color: '#FFFFFF',
    },
    content: {
        flex: 1,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginHorizontal: 16,
        marginBottom: 12,
        color: '#333',
    },
    boardCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    boardImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        backgroundColor: '#F0F2F5',
    },
    boardInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    boardName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    manufacturer: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#777',
        marginBottom: 8,
    },
    specsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    spec: {
        fontSize: 12,
        color: '#555',
        backgroundColor: '#F0F2F5',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 8,
        marginBottom: 4,
    },
    recentCard: {
        width: 100,
        marginRight: 12,
        marginLeft: 4,
        alignItems: 'center',
    },
    recentImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#F0F2F5',
    },
    recentName: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 4,
        color: '#555',
    },
});