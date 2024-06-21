import React, { useEffect, useState, useRef } from 'react';
import { FaAngleLeft, FaImage, FaPlus, FaVideo } from 'react-icons/fa';
import { HiDotsVertical } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import { IoMdSend } from 'react-icons/io';
import { Link } from 'react-router-dom';
import './Chat.css';
const MessageComponent = ({ messages, onSendMessage, fetchLatestMessages }) => {
    const [currentMessage, setCurrentMessage] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
    const messageContainerRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    };

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

                // Fetch latest messages after sending a message
                if (typeof fetchLatestMessages === 'function') {
                    fetchLatestMessages();
                }
            } catch (error) {
                console.error('Failed to send message', error);
            }
        }
    };

    return (
        <div className="bg-no-repeat bg-cover">
            {/* Header */}
            <header className="sticky-top bg-white d-flex justify-content-between align-items-center p-3 border-bottom">
                <div className="d-flex align-items-center gap-4">
                    <Link to="/" className="d-lg-none">
                        <FaAngleLeft size={25} />
                    </Link>
                    <div>
                        {/* Avatar and user details */}
                    </div>
                </div>
                <div>
                    <button className="btn btn-link text-dark p-0">
                        <HiDotsVertical />
                    </button>
                </div>
            </header>

            {/* Message display */}
            <section
                id="message-container"
                ref={messageContainerRef}
                className="overflow-auto bg-light"
                style={{ height: 'calc(100vh - 128px)' }}
            >
                <div className="d-flex flex-column gap-2 py-2 mx-2">
                    {messages.slice(0).reverse().map((msg, index) => (
                        <div
                            key={index}
                            className={`p-2 rounded max-w-75 ${
                                msg.sentByCurrentUser ? 'received-message' : 'sent-message'
                            }`}
                        >
                            <p className="mb-1">{msg.mes}</p>
                            {msg.imageUrl && <img src={msg.imageUrl} alt="Sent" className="img-fluid" />}
                            {msg.videoUrl && <video src={msg.videoUrl} className="img-fluid" controls />}
                            <p className="text-right small text-muted">
                                {new Date(msg.createAt).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Display uploaded image */}
            {imageUrl && (
                <div className="position-fixed bottom-0 w-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50">
                    <div
                        className="position-absolute top-0 right-0 p-2 cursor-pointer text-danger"
                        onClick={handleClearUploadImage}
                    >
                        <IoClose size={30} />
                    </div>
                    <div className="bg-white p-3 rounded">
                        <img src={imageUrl} alt="Uploaded" className="img-fluid" />
                    </div>
                </div>
            )}

            {/* Display uploaded video */}
            {videoUrl && (
                <div className="position-fixed bottom-0 w-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50">
                    <div
                        className="position-absolute top-0 right-0 p-2 cursor-pointer text-danger"
                        onClick={handleClearUploadVideo}
                    >
                        <IoClose size={30} />
                    </div>
                    <div className="bg-white p-3 rounded">
                        <video src={videoUrl} className="img-fluid" controls />
                    </div>
                </div>
            )}

            {/* Message input */}
            <footer className="bg-white d-flex justify-content-between align-items-center p-3 border-top">
                {/* Attach media */}
                <div className="d-flex gap-3">
                    <label htmlFor="upload-image" className="btn btn-link text-primary m-0">
                        <FaImage size={20} />
                    </label>
                    <input
                        type="file"
                        id="upload-image"
                        accept="image/*"
                        className="d-none"
                        onChange={handleUploadImage}
                    />
                    <label htmlFor="upload-video" className="btn btn-link text-primary m-0">
                        <FaVideo size={20} />
                    </label>
                    <input
                        type="file"
                        id="upload-video"
                        accept="video/*"
                        className="d-none"
                        onChange={handleUploadVideo}
                    />
                </div>

                {/* Send message */}
                <form onSubmit={handleSendMessage} className="flex-grow-1 ms-3">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Type a message..."
                            value={currentMessage}
                            onChange={handleOnChange}
                        />
                        <button type="submit" className="btn btn-primary">
                            <IoMdSend size={25} />
                        </button>
                    </div>
                </form>
            </footer>
        </div>
    );
};

export default MessageComponent;
