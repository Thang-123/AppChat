import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MessagePage.css';

const MessagePage = ({ messages, onSendMessage }) => {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim() !== '') {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <div className="message-page d-flex flex-column">

            <div className="messages flex-grow-1 p-3 overflow-auto">

                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sent ? 'sent text-right' : 'received text-left'} p-2 my-2`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="message-input-container input-group p-3 border-top">
                <input
                    type="text"
                    className="form-control"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                />
                <div className="input-group-append">
                    <button onClick={handleSend} className="btn btn-primary">Send</button>
                </div>
            </div>
        </div>
    );
};

export default MessagePage;
