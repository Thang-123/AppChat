import React, { useEffect, useState, useRef } from 'react';
import {
    FaAngleLeft,
    FaImage,
    FaPaperclip,
    FaPhone,
    FaPlus,
    FaSearch,
    FaSmile,
    FaUserCircle,
    FaVideo, FaWindowClose
} from 'react-icons/fa';
import {HiChevronDown, HiDotsVertical} from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import { IoMdSend } from 'react-icons/io';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { firestore } from '../firebaseconfig';
import { doc,getDoc } from 'firebase/firestore';
import EmojiPicker from "./EmojiPicker";
import {useSelector} from "react-redux";
import InfoRoom from "./InfoRoom";
const MessageComponent = ({ isActive,selectedUser, onClose , messages, onSendMessage,onUserClick, onSave, fetchMoreMessages}) => {
    const [currentMessage, setCurrentMessage] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
    const messageContainerRef = useRef(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [memberAvatars, setMemberAvatars] = useState({});
    const [activeIcon, setActiveIcon] = useState(null);
    const [openInfo, setOpenInfo] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);


    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = messageContainerRef.current.scrollTop;
            const isAtTop = currentScrollPos === 0;
            const isAtBottom =
                messageContainerRef.current.scrollHeight -
                currentScrollPos ===
                messageContainerRef.current.clientHeight;

            console.log('Current scroll position:', currentScrollPos);
            console.log('Is at top:', isAtTop);
            console.log('Is at bottom:', isAtBottom);

            if (isAtTop) {
                console.log('Scrolling to top...');
                setCurrentPage((prevPage) => prevPage + 1);
                fetchMoreMessages(currentPage + 1);
            } else if (isAtBottom) {
                console.log('Scrolling to bottom...');
                setCurrentPage((prevPage) => prevPage - 1);
                fetchMoreMessages(currentPage - 1);
            }
        };

        const messageContainer = messageContainerRef.current;
        messageContainer.addEventListener('scroll', handleScroll);

        return () => {
            messageContainer.removeEventListener('scroll', handleScroll);
        };
    }, [currentPage, fetchMoreMessages]);

    useEffect(() => {
        const messageComponentElement = document.getElementById('messageComponent');
        if (messageComponentElement) {
            messageComponentElement.classList.add('fadeInEffect');
        }

        return () => {
            messageComponentElement.classList.remove('fadeInEffect');
        };
    }, []);

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const storage = getStorage();
                const avatarRef = ref(storage, `avatars/${selectedUser.name}`);
                const downloadURL = await getDownloadURL(avatarRef);
                setAvatarUrl(downloadURL);
                console.log("avatar url:", downloadURL)
            } catch (error) {
                console.error('Error fetching avatar:', error);
                setAvatarUrl('');
            }
        };
        fetchAvatar();
    }, [selectedUser]);

    const {members} = useSelector((state) => state.chat);

    useEffect(() => {
        console.log(members)
        console.log('Current member avatars:', memberAvatars);
        fetchAvatarForMembers()
    }, [members]);

    const fetchAvatarForMembers = async () => {
        try {
            const storage = getStorage();
            const avatarUrls = {};

            await Promise.all(members.map(async member => {
                const avatarRef = ref(storage, `avatars/${member.name}`);


                try {
                    const downloadURL = await getDownloadURL(avatarRef);
                    avatarUrls[member.name] = downloadURL;
                } catch (error) {

                    console.error(`Avatar for ${member.name} does not exist.`);
                    avatarUrls[member.name] = '';
                }
            }));

            setMemberAvatars(avatarUrls);
        } catch (error) {
            console.error('Error fetching avatars:', error);
        }
    };

    // useEffect(() => {
    //     if (selectedUser) {
    //         if (selectedUser.type === 0) {
    //             fetchLatestMessages();
    //         } else if (selectedUser.type === 1) {
    //             getRoomChatMes();
    //         }
    //     }
    // }, [selectedUser, fetchLatestMessages,  getRoomChatMes]);

    useEffect(() => {
        scrollToBottom();
    }, [selectedUser]);

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
    const handleEmojiClick = (e) => {
        // Chèn emoji vào trong tin nhắn
        setCurrentMessage(currentMessage + e.emoji);
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(prev => !prev);
    };
    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (currentMessage.trim() !== '') {
            try {
                const newMessage = {
                    mes: currentMessage
                };
                onSendMessage(newMessage);
                setCurrentMessage('');

            } catch (error) {
                console.error('Failed to send message', error);
            }
        }
        scrollToBottom()
    };

    const handleMoreInfo = (icon) => {
            setOpenInfo(prev => !prev);
    };

    return (
        <div id="messageComponent" className="bg-no-repeat bg-cover">
            {/* Header */}
            <header className="sticky-top bg-white d-flex justify-content-between align-items-center p-3 border-bottom">
                <div className="d-flex align-items-center gap-4">
                    <div className="d-flex align-items-center gap-2">
                        {/* Profile picture */}
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Profile" className="rounded-circle"
                                 style={{width: '40px', height: '40px'}}/>
                        ) : (
                            <FaUserCircle size={40} className="rounded-circle"/>
                        )}
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
                    <button className="btn btn-link text-dark p-2 c">
                        <FaVideo size={20}/>
                    </button>

                    {/* Phone call icon */}
                    <button className="btn btn-link text-dark p-2">
                        <FaPhone size={20}/>
                    </button>

                    {/* Search icon */}
                    <button className="btn btn-link text-dark p-2">
                        <FaSearch size={20}/>
                    </button>
                    {/* More Icon */}
                    <button className="btn btn-link text-dark p-2"
                            onClick={() => handleMoreInfo('info')}
                            active={activeIcon === 'info' ? "true" : "false"}
                            title="Informations">
                        <HiDotsVertical size={20}/>
                    </button>
                    {/* Close Icon */}
                    <button className="btn btn-link text-dark p-2"  onClick={onClose}>
                        <IoClose size={20}/>
                    </button>
                </div>
            </header>

            {openInfo && <InfoRoom users={members} roomName={selectedUser.name} onClose={handleMoreInfo} onUserClick={onUserClick} onSave={onSave} userType={selectedUser.type} isActive={isActive}/>}


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
                            className={`d-flex ${msg.sentByCurrentUser ? 'justify-content-start' : 'justify-content-end'}`}
                            style={{maxWidth: '100%'}}
                        >
                            {msg.sentByCurrentUser && (
                                <div className="mr-2" style={{width: '40px', height: '40px'}}>
                                    {memberAvatars[msg.name] ? (
                                        <img
                                            src={memberAvatars[msg.name]}
                                            alt={`${msg.name} avatar`}
                                            className="rounded-circle"
                                            style={{width: '100%', height: '100%'}}
                                        />
                                    ) : (
                                        <FaUserCircle className="rounded-circle"
                                                      style={{width: '100%', height: '100%'}}/>
                                    )}
                                </div>
                            )}
                            <div className="message-content" style={{maxWidth: '60%'}}>
                                {msg.sentByCurrentUser && <p className="mb-0">{msg.name}</p>}
                                <div
                                    className={`p-2 rounded ${msg.sentByCurrentUser ? 'received-message bg-secondary text-white' : 'sent-message bg-primary text-white'}`}
                                    style={{
                                        wordBreak: 'break-word',
                                        overflowWrap: 'break-word',
                                        whiteSpace: 'pre-wrap',
                                        wordWrap: 'break-word'
                                    }}
                                >
                                    <p
                                        className="mb-1 text-center text-white"
                                        style={{
                                            wordBreak: 'break-word',
                                            overflowWrap: 'break-word',
                                            whiteSpace: 'pre-wrap',
                                            wordWrap: 'break-word'
                                        }}
                                    >
                                        {msg.mes}
                                    </p>
                                </div>
                            </div>
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
                <div className="d-flex align-items-center pe-2 ">
                    <button className="btn-emoji" onClick={toggleEmojiPicker}>
                        <FaSmile size={20}/>
                    </button>
                </div>
                {/*{showEmojiPicker && (*/}
                {/*    <EmojiPicker  onEmojiClick={handleEmojiClick} />*/}
                {/*)}*/}
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
                            <IoMdSend size={20}/>
                        </button>
                    </div>
                </form>
            </footer>
        </div>
    );
};

export default MessageComponent;
