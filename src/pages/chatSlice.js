// src/chatSlice.js
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
            state.loggedIn = true;
            state.reLoginCode = action.payload.reLoginCode;
        },
        logoutUser: (state) => {
            state.user = null;
            state.loggedIn = false;
            state.reLoginCode = null;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload.message);
        },
        setMessages: (state, action) => {
            state.messages = action.payload.messages;
        },
    },
});

export const {
    registerUser,
    loginUser,
    logoutUser,
    addMessage,
    setMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
