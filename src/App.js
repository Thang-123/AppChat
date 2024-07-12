import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import WebSocketService from './webSocketService';
import { loginUser, logoutUser } from './pages/chatSlice';
import Toast from "./component/Toast";

const App = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loggedIn } = useSelector((state) => state.chat);
    const [showToast, setShowToast] = useState(false);
    const [toastProps, setToastProps] = useState({});

    useEffect(() => {
        WebSocketService.connect('ws://140.238.54.136:8080/chat/chat');

        WebSocketService.registerCallback('AUTH', handleAuth);

        return () => {
            WebSocketService.close();
        };
    }, []);

    const handleAuth = (data) => {
        console.log('AUTH response:', data);
        handleError(data.mes+ "Check your connection !");
    }

    const handleError = (mes) => {
        setToastProps({
            title: 'FAILED!',
            message: mes,
            type: 'error'
        });
        setShowToast(true);
    };

    const handleCloseToast = () => {
        setShowToast(false);
    };

    return (
        <div className="app">
            {showToast && <Toast {...toastProps} duration={3000} onClose={handleCloseToast} />}
            <Outlet />
        </div>
    );
};

export default App;
