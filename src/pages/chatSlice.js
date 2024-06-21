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
        loggedInUser: null,
    },
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        setMessages(state, action) {
            state.messages = action.payload.map(msg => ({
                ...msg,
                sentByCurrentUser: msg.to !== state.loggedInUser.name
            }));
        },
        // nếu tin nhắn có thong tin tên ng nhận != tên ng dùng đã đăng nhập nghĩa la
        // do la tin nhan gui di con lai la tin nhan do ng dung gui di
        registerUser: (state, action) => {
            state.users.push(action.payload.user);
        },
        loginUser: (state, action) => {
            state.currentUser = action.payload.user;
            state.reLoginCode = action.payload.reLoginCode;
            state.loggedIn = true;
            state.loggedInUser= action.payload.user;
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
