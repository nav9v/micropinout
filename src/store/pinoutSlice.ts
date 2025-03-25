import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Pin = {
  number: number;
  name: string;
  function: string;
};

type Pinout = {
  id: string;
  name: string;
  description: string;
  pins: Pin[];
};

interface PinoutState {
  list: Pinout[];
  selectedPinout: Pinout | null;
  loading: boolean;
  error: string | null;
}

const initialState: PinoutState = {
  list: [],
  selectedPinout: null,
  loading: false,
  error: null,
};

const pinoutSlice = createSlice({
  name: 'pinouts',
  initialState,
  reducers: {
    setPinouts: (state, action: PayloadAction<Pinout[]>) => {
      state.list = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedPinout: (state, action: PayloadAction<Pinout>) => {
      state.selectedPinout = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setPinouts, setSelectedPinout, setLoading, setError } = pinoutSlice.actions;
export default pinoutSlice.reducer;
