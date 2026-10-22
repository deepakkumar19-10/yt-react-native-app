import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import inventoryReducer from './slices/inventorySlice';
import cartReducer from './slices/cartSlice'; 

// 1. Root Reducer banate hain (Future me Cart ya Auth slices bhi yahi judenge)
const rootReducer = combineReducers({
  inventory: inventoryReducer,
  cart: cartReducer,
});

// 2. Persist Configuration: phone ke AsyncStorage me save karne ke liye
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

// 3. Persisted Reducer create karte hain
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Store Configure karte hain
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 5. Persistor create & export karte hain (App.jsx ke liye)
export const persistor = persistStore(store);

export default store;
