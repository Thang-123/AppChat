import React, { useEffect } from 'react';
import './Chat.css';

const Toast = ({ title, message, type, duration, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={`toast-container ${type === 'success' ? 'toast-success' : 'toast-error'}`}>
            <div className="toast-title text-center">{title}</div>
            <div className="toast-message text-center">{message}</div>
        </div>
    );
};

export default Toast;
