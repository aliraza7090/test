import {combineReducers, configureStore} from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage/session'

import userReducer from 'redux/slices/user.slice'
import kucoinReducer from 'redux/slices/kucoin.slice'
import binanceReducer from 'redux/slices/binance.slice'
import {persistReducer} from "redux-persist";

/*const initialState = localStorage.getItem("persist:storage")
    ? JSON.parse(localStorage.getItem("persist:storage"))
    : null*/

const reducers = combineReducers({
    user: userReducer,
    binance: binanceReducer,
    kucoin: kucoinReducer
})

const persistConfig = {
    key: 'storage',
    storage,
    whitelist: ['user']
}

const persistedReducer = persistReducer(persistConfig, reducers);

export default configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
    // preloadedState: initialState
});
