import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
// Custom storage to bypass Vite CJS/ESM interop issues with redux-persist
const storage = {
  getItem: (key) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key, item) => {
    localStorage.setItem(key, item);
    return Promise.resolve();
  },
  removeItem: (key) => {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};
import { 
  persistReducer, 
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER, 
  persistStore
} from "redux-persist";
import authReducer from './features/auth/authSlice';

const persistConfig = {
  key: 'auth',
  storage
}

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: persistedAuthReducer
  },
  middleware: (getDefaultMiddlewares) => getDefaultMiddlewares({
    serializableCheck: {
      ignoredActions: [FLUSH,
        REHYDRATE,
        PAUSE,
        PERSIST,
        PURGE,
        REGISTER]
    }
  }).concat(baseApi.middleware)
})

export const persistor = persistStore(store);
