import {createSlice} from "@reduxjs/toolkit";


const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        logout: (state) => {
            state.user = null
        },
        setApiKeys: (state, action) => {
            state.user.api = action.payload;
        }
    }
})

export const {logout, setUser,setApiKeys} = userSlice.actions;
export default userSlice.reducer;
