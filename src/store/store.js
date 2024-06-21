
import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '../pages/chatSlice';

const store = configureStore({
    reducer: {
        chat: chatReducer,
    },
});

export default store;
