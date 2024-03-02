import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { homeStateDefault, IHomeState } from '../../settings/homeState';
import { AppState } from '../store';

const initialState = homeStateDefault;
export const homeState = createSlice({
  name: 'homeState',
  initialState,
  reducers: {
    updateUserId: (state, action: PayloadAction<string | null>) => {
      state.uid = action.payload;
    },
    updatePermission: (state, action: PayloadAction<string | null>) => {
      state.permission = action.payload;
    },
    updateUserName: (state, action: PayloadAction<string>) => {
      state.user_name = action.payload;
    },
    updateUserInfoReducer: (
      state,
      action: PayloadAction<{
        uid: string;
        permission: string;
        user_name: string;
      }>,
    ) => {
      state.uid = action.payload.uid;
      state.permission = action.payload.permission;
      state.user_name = action.payload.user_name;
    },
  },
});

export const selectUserId = (state: AppState) => state.homeState.uid;

export const getPermission = (state: AppState) => state.homeState.permission;

export const getUserName = (state: AppState) => state.homeState.user_name;
export const {
  updateUserId,
  updatePermission,
  updateUserName,
  updateUserInfoReducer,
} = homeState.actions;
export default homeState.reducer;
