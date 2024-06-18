
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import WebSocketService from './webSocketService';
import { loginUser, logoutUser } from './pages/chatSlice';

const App = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loggedIn } = useSelector((state) => state.chat);

    useEffect(() => {
            WebSocketService.connect('ws://140.238.54.136:8080/chat/chat');

            WebSocketService.registerCallback('GET_PEOPLE_CHAT_MES', (data) => {
                console.log('GET_PEOPLE_CHAT_MES response:' + data);
            });
            WebSocketService.registerCallback('GET_USER_LIST', (data) => {
                console.log('GET_USER_LIST response:' + data);
            });
            WebSocketService.registerCallback('AUTH', (data) => {
                console.log('AUTH response:', data);
            });


        return () => {
            WebSocketService.close();
        };
    }, []);



    // const handleLogout = () => {
    //     dispatch(logoutUser());
    //     WebSocketService.close();
    //     navigate('/');
    // };

    return (
        <div className="app">
            <Outlet />
        </div>
    );
};

export default App;
