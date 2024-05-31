import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        user: null,
        messages: [],
        loggedIn: false,
        reLoginCode: null,
    },
    reducers: {
        registerUser: (state, action) => {
            state.user = action.payload.user;
        },
        loginUser: (state, action) => {
            state.user = action.payload.user;
            state.reLoginCode = action.payload.reLoginCode;
            state.loggedIn = true;
        },
        logoutUser: (state) => {
            state.user = null;
            state.loggedIn = false;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },

    },
});

export const { registerUser, loginUser, logoutUser, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
