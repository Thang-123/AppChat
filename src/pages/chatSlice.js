import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        users: [],
        groups: [],
        members: [],
        messages: [],
        loggedIn: false,
        reLoginCode: null,
        currentUser: null,
        currentMessage: { text: '', imageUrl: '', videoUrl: '' },
        loading: false,
        loggedInUser: null,

    },
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload;
        },

        setGroups: (state, action) => {
            state.groups = action.payload;
        },
        setMember: (state, action) => {
            state.members = action.payload;
        },
        // setMessages(state, action) {
        //     state.messages = action.payload.map(msg => ({
        //         ...msg,
        //         sentByCurrentUser: msg.to !== state.loggedInUser.name
        //     }));
        // },

        setMessages(state, action) {
            state.messages = action.payload
        },
        registerUser: (state, action) => {
            state.users.push(action.payload.user);
        },
        loginUser: (state, action) => {
            state.currentUser = action.payload.user;
            state.reLoginCode = action.payload.reLoginCode;
            state.loggedIn = true;
            // state.loggedInUser= action.payload.user;
        },
        setLoggedInUser: (state, action) => {
            state.loggedInUser = action.payload;
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
    setMember,
    setLoggedInUser,
    setMessage,
    setLoading,
    setUsers,
    setGroups,
    setMessages,
    registerUser,
    loginUser,
    logoutUser,
    addMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
