import { configureStore } from '@reduxjs/toolkit';
import homeStateReducer from './slices/homeState';

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
const store = configureStore({
  reducer: {
    homeState: homeStateReducer,
  },
});

export { store };
