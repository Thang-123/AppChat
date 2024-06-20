import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        users: [],
        messages: [],
        loggedIn: false,
        reLoginCode: null,
        currentUser: null,
        currentMessage: { text: '', imageUrl: '', videoUrl: '' },
        loading: false,
    },
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        registerUser: (state, action) => {
            state.users.push(action.payload.user);
        },
        loginUser: (state, action) => {
            state.currentUser = action.payload.user;
            state.reLoginCode = action.payload.reLoginCode;
            state.loggedIn = true;
        },
        logoutUser: (state) => {
            state.currentUser = null;
            state.loggedIn = false;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        setMessage: (state, action) => {
            state.currentMessage = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const {
    setMessage,
    setLoading,
    setUsers,
    setMessages,
    registerUser,
    loginUser,
    logoutUser,
    addMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
