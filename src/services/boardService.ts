import { boardsData } from '../data/boardsData';
import { BoardDefinition } from '../types/boards';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITE_BOARDS_KEY = 'favorite_boards';
const RECENT_BOARDS_KEY = 'recent_boards';

export const boardService = {
    getAllBoards: (): BoardDefinition[] => {
        return boardsData;
    },

    getBoardById: (id: string): BoardDefinition | undefined => {
        return boardsData.find(board => board.id === id);
    },

    getBoardsByCategory: (category: string): BoardDefinition[] => {
        return boardsData.filter(board => board.category === category);
    },

    getBoardsByManufacturer: (manufacturer: string): BoardDefinition[] => {
        return boardsData.filter(board => board.manufacturer === manufacturer);
    },

    searchBoards: (query: string): BoardDefinition[] => {
        const lowerQuery = query.toLowerCase();
        return boardsData.filter(board =>
            board.name.toLowerCase().includes(lowerQuery) ||
            board.description.toLowerCase().includes(lowerQuery) ||
            board.manufacturer.toLowerCase().includes(lowerQuery)
        );
    },

    // Favorite boards management
    getFavoriteBoards: async (): Promise<string[]> => {
        try {
            const favorites = await AsyncStorage.getItem(FAVORITE_BOARDS_KEY);
            return favorites ? JSON.parse(favorites) : [];
        } catch (error) {
            console.error('Error getting favorite boards', error);
            return [];
        }
    },

    addToFavorites: async (boardId: string): Promise<void> => {
        try {
            const favorites = await boardService.getFavoriteBoards();
            if (!favorites.includes(boardId)) {
                await AsyncStorage.setItem(FAVORITE_BOARDS_KEY, JSON.stringify([...favorites, boardId]));
            }
        } catch (error) {
            console.error('Error adding to favorites', error);
        }
    },

    // Recently viewed boards
    addToRecentBoards: async (boardId: string): Promise<void> => {
        try {
            const recents = await boardService.getRecentBoards();
            const updatedRecents = [
                boardId,
                ...recents.filter(id => id !== boardId)
            ].slice(0, 5); // Keep only last 5 viewed boards

            await AsyncStorage.setItem(RECENT_BOARDS_KEY, JSON.stringify(updatedRecents));
        } catch (error) {
            console.error('Error adding to recent boards', error);
        }
    },

    getRecentBoards: async (): Promise<string[]> => {
        try {
            const recents = await AsyncStorage.getItem(RECENT_BOARDS_KEY);
            return recents ? JSON.parse(recents) : [];
        } catch (error) {
            console.error('Error getting recent boards', error);
            return [];
        }
    }
};