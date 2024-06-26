import React, { useEffect, useState, useRef } from 'react';
import {FaAngleLeft, FaImage, FaPaperclip, FaPhone, FaPlus, FaSearch, FaSmile, FaVideo} from 'react-icons/fa';
import { HiDotsVertical } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import { IoMdSend } from 'react-icons/io';
import './Chat.css';
const MessageComponent = ({ isActive,selectedUser, onClose , messages, onSendMessage, fetchLatestMessages,getRoomChatMes}) => {
    const [currentMessage, setCurrentMessage] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
    const messageContainerRef = useRef(null);

    useEffect(() => {
        const messageComponentElement = document.getElementById('messageComponent');
        if (messageComponentElement) {
            messageComponentElement.classList.add('fadeInEffect');
        }

        return () => {
            messageComponentElement.classList.remove('fadeInEffect');
        };
    }, []);

    // useEffect(() => {
    //     if (selectedUser) {
    //         if (selectedUser.type === 0) {
    //             fetchLatestMessages();
    //         } else if (selectedUser.type === 1) {
    //             getRoomChatMes();
    //         }
    //     }
    // }, [selectedUser, fetchLatestMessages,  getRoomChatMes]);

    // useEffect(() => {
    //     scrollToBottom();
    // }, [messages]);
    //
    // const scrollToBottom = () => {
    //     if (messageContainerRef.current) {
    //         messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    //     }
    // };

    const handleUploadImageVideoOpen = () => {
        setOpenImageVideoUpload(prev => !prev);
    };

    const handleUploadImage = async (e) => {
        const file = e.target.files[0];
        // Handle image upload logic
    };

    const handleClearUploadImage = () => {
        setImageUrl('');
    };

    const handleUploadVideo = async (e) => {
        const file = e.target.files[0];
        // Handle video upload logic
    };

    const handleClearUploadVideo = () => {
        setVideoUrl('');
    };

    const handleOnChange = (e) => {
        setCurrentMessage(e.target.value);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (currentMessage.trim() !== '') {
            try {
                const newMessage = {
                    id: Date.now(),
                    sentByCurrentUser: true,
                    mes: currentMessage,
                    imageUrl: imageUrl,
                    videoUrl: videoUrl,
                    createAt: new Date().toISOString()
                };

                await onSendMessage(newMessage);

                setCurrentMessage('');
                setImageUrl('');
                setVideoUrl('');

                if (typeof fetchLatestMessages === 'function') {
                    fetchLatestMessages();
                }
            } catch (error) {
                console.error('Failed to send message', error);
            }
        }
    };
    return (
    <div id ="messageComponent" className="bg-no-repeat bg-cover">
            {/* Header */}
            <header className="sticky-top bg-white d-flex justify-content-between align-items-center p-3 border-bottom">
                <div className="d-flex align-items-center gap-4">
                    <div className="d-flex align-items-center gap-2">
                        {/* Profile picture */}
                        <img src="" alt="Profile" className="rounded-circle" style={{width: '40px', height: '40px'}}/>

                        {/* User details */}
                        <div>
                            <span className="d-block font-weight-bold">{selectedUser.name}</span>
                            <div className="status-container">
                                <div className={`dot ${isActive ? 'dot-active' : 'dot-inactive'}`}/>
                                <span className="status-text mx-2">
                                    {isActive ? 'Online' : 'Offline'}
                                 </span>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                    {/* Video call icon */}
                    <button className="btn btn-link text-dark p-0">
                        <FaVideo size={20}/>
                    </button>

                    {/* Phone call icon */}
                    <button className="btn btn-link text-dark p-0">
                        <FaPhone size={20}/>
                    </button>

                    {/* Search icon */}
                    <button className="btn btn-link text-dark p-0">
                        <FaSearch size={20}/>
                    </button>

                    <button className="btn btn-link text-dark p-0" onClick={onClose}>
                        <HiDotsVertical size={20}/>
                    </button>

                </div>
            </header>

        {/* Message display */}
        <section
            id="message-container"
            ref={messageContainerRef}
                className="overflow-auto bg-light"
                style={{height: 'calc(100vh - 145px)'}}
            >
                <div className="d-flex flex-column gap-3 py-3 mx-3">
                    {messages.slice(0).reverse().map((msg, index) => (
                        <div
                            key={index}
                            className={`p-2 rounded max-w-75 ${
                                msg.sentByCurrentUser ? 'received-message' : 'sent-message'
                            }`}
                        >
                            <p className="mb-1">{msg.mes}</p>
                            {msg.imageUrl && <img src={msg.imageUrl} alt="Sent" className="img-fluid"/>}
                            {msg.videoUrl && <video src={msg.videoUrl} className="img-fluid" controls/>}
                            <p className="text-right small text-muted">
                                {new Date(msg.createAt).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Display uploaded image */}
            {imageUrl && (
                <div
                    className="position-fixed bottom-0 w-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50">
                    <div
                        className="position-absolute top-0 right-0 p-2 cursor-pointer text-danger"
                        onClick={handleClearUploadImage}
                    >
                        <IoClose size={30}/>
                    </div>
                    <div className="bg-white p-3 rounded">
                        <img src={imageUrl} alt="Uploaded" className="img-fluid"/>
                    </div>
                </div>
            )}

            {/* Display uploaded video */}
            {videoUrl && (
                <div
                    className="position-fixed bottom-0 w-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50">
                    <div
                        className="position-absolute top-0 right-0 p-2 cursor-pointer text-danger"
                        onClick={handleClearUploadVideo}
                    >
                        <IoClose size={30}/>
                    </div>
                    <div className="bg-white p-3 rounded">
                        <video src={videoUrl} className="img-fluid" controls/>
                    </div>
                </div>
            )}

            {/* Message input */}
            <footer className="chat-footer bg-white d-flex align-items-center p-2 border-top">
                {/* Attach media */}
                <div className="d-flex align-items-center pe-2">
                    <label htmlFor="upload-image" className="btn-attachment">
                        <FaPaperclip size={20}/>
                    </label>
                    <input
                        type="file"
                        id="upload-image"
                        accept="image/*"
                        className="d-none"
                        onChange={handleUploadImage}
                    />
                </div>
                {/* Emojis */}
                <div className="d-flex align-items-center ps-2">
                    <button className="btn-emoji">
                        <FaSmile size={20}/>
                    </button>
                </div>
                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="flex-grow-1 ms-2 me-2">
                    <div className="input-group w-100">
                        <input
                            type="text"
                            className="form-control rounded-input"
                            placeholder="Write a message..."
                            value={currentMessage}
                            onChange={handleOnChange}
                        />
                        <button type="submit" className="btn-send">
                            <IoMdSend size={20} />
                        </button>
                    </div>
                </form>
            </footer>
        </div>
    );
};

export default MessageComponent;
