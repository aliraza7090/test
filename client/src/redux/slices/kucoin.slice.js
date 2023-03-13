import {createSlice} from "@reduxjs/toolkit";

const INITIAL_STATE = {
    data: {
        BTC: {
            id: "bitcoin",
            name: "Bitcoin",
            low: 0,
            high: 0,
            close: 0,
            price: 0,
            change: 0,
            volume: 0,
            bestBid: 0,
            numTrades: 0,
            averagePrice: 0,
            changePercentage: 0,
            symbol: "btc",
        },
        ETH: {
            low: 0,
            high: 0,
            close: 0,
            volume: 0,
            bestBid: 0,
            change: 0,
            numTrades: 0,
            averagePrice: 0,
            changePercentage: 0,
            name: "Ethereum",
            id: "ethereum",
            symbol: "eth",
            price: 0,
        }
    },
    balance: 0.0000
}

const kucoinSlice = createSlice({
    name: 'kucoin',
    initialState: INITIAL_STATE,
    reducers: {
        setKucoinsValues: (state, action) => {
            state.data = action.payload
        },
        clearBinanceValues: () => INITIAL_STATE,
        setBalance: (state, action) => {
            state.balance = action.payload
        }
    }
});


export const {setKucoinsValues, clearKucoinsValues, setBalance} = kucoinSlice.actions;
export default kucoinSlice.reducer;