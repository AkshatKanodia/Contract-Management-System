import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import contractReducer from './features/contracts/contractSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    contracts: contractReducer,
  },
});
