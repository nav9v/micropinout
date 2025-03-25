import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { BoardDefinition } from '../types/boards';
import { boardService } from '../services/boardService';

interface PinoutState {
  list: BoardDefinition[];
  categories: string[];
  manufacturers: string[];
  favoriteBoards: string[];
  recentBoards: string[];
  loading: boolean;
  error: string | null;
}

const initialState: PinoutState = {
  list: [],
  categories: [],
  manufacturers: [],
  favoriteBoards: [],
  recentBoards: [],
  loading: false,
  error: null,
};

// Async actions
export const fetchBoards = createAsyncThunk(
  'pinouts/fetchBoards',
  async () => {
    return boardService.getAllBoards();
  }
);

export const fetchFavoriteBoards = createAsyncThunk(
  'pinouts/fetchFavoriteBoards',
  async () => {
    return boardService.getFavoriteBoards();
  }
);

export const fetchRecentBoards = createAsyncThunk(
  'pinouts/fetchRecentBoards',
  async () => {
    return boardService.getRecentBoards();
  }
);

const pinoutSlice = createSlice({
  name: 'pinouts',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPinouts: (state, action: PayloadAction<BoardDefinition[]>) => {
      state.list = action.payload;
      // Extract unique categories and manufacturers
      state.categories = [...new Set(action.payload.map(board => board.category))];
      state.manufacturers = [...new Set(action.payload.map(board => board.manufacturer))];
    },
    addToFavorites: (state, action: PayloadAction<string>) => {
      if (!state.favoriteBoards.includes(action.payload)) {
        state.favoriteBoards.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.favoriteBoards = state.favoriteBoards.filter(id => id !== action.payload);
    },
    addToRecent: (state, action: PayloadAction<string>) => {
      state.recentBoards = [
        action.payload,
        ...state.recentBoards.filter(id => id !== action.payload),
      ].slice(0, 5); // Keep only 5 most recent
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.list = action.payload;
        state.categories = [...new Set(action.payload.map(board => board.category))];
        state.manufacturers = [...new Set(action.payload.map(board => board.manufacturer))];
        state.loading = false;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch boards';
      })
      .addCase(fetchFavoriteBoards.fulfilled, (state, action) => {
        state.favoriteBoards = action.payload;
      })
      .addCase(fetchRecentBoards.fulfilled, (state, action) => {
        state.recentBoards = action.payload;
      });
  },
});

export const { 
  setLoading, 
  setError, 
  setPinouts, 
  addToFavorites, 
  removeFromFavorites, 
  addToRecent 
} = pinoutSlice.actions;

export default pinoutSlice.reducer;