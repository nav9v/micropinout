import { configureStore } from '@reduxjs/toolkit';
import pinoutReducer from './pinoutSlice';

export const store = configureStore({
  reducer: {
    pinouts: pinoutReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;