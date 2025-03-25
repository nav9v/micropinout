import { useState } from 'react';

// Simple mock implementation without AsyncStorage
export const useFavoritePinouts = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Check if a pinout is favorite
  const isFavorite = (id: string): boolean => {
    return favorites.includes(id);
  };
  
  // Add a pinout to favorites
  const addFavorite = async (id: string) => {
    setFavorites(prev => [...prev, id]);
  };
  
  // Remove a pinout from favorites
  const removeFavorite = async (id: string) => {
    setFavorites(prev => prev.filter(fav => fav !== id));
  };
  
  return { favorites, isFavorite, addFavorite, removeFavorite };
};
