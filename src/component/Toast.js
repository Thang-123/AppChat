import React, {useEffect} from 'react';
import {FaCheckCircle, FaExclamationCircle} from "react-icons/fa";


const Toast = ({title, message, type, duration, onClose}) => {

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const IconComponent = type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />;

    return (
        <div className={`toast-container animated-element ${type === 'success' ? 'toast-success' : 'toast-error'}`}>
            <div className="toast-icon">{IconComponent}</div>
            <div className="toast-body">
                <div className="toast-title">{title}</div>
                <div className="toast-message">{message}</div>
            </div>
        </div>
    );
};

export default Toast;
