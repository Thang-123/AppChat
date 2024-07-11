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
    FaVideo
} from 'react-icons/fa';
import { HiDotsVertical } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import { IoMdSend } from 'react-icons/io';
import './Chat.css';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { firestore } from '../firebaseconfig';
import { doc,getDoc } from 'firebase/firestore';
import EmojiPicker from "./EmojiPicker";
import {useSelector} from "react-redux";
const MessageComponent = ({ isActive,selectedUser, onClose , messages, onSendMessage}) => {
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
                const avatarRef = ref(storage, `avatars/${member}`);


                try {
                    const downloadURL = await getDownloadURL(avatarRef);
                    avatarUrls[member] = downloadURL;
                } catch (error) {

                    console.error(`Avatar for ${member} does not exist.`);
                    avatarUrls[member] = '';
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
        setActiveIcon(prev => (prev === icon ? null : icon));
        if (icon === 'info'){
            setOpenInfo(prev => !prev);
        }
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
                    <button className="btn btn-link text-dark p-2">
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

                    <button className="btn btn-link text-dark p-2"
                            onClick={() => handleMoreInfo('info')}
                            active={activeIcon === 'info' ? "true" : "false"}
                            title="Informations">
                        <HiDotsVertical size={20}/>
                    </button>

                </div>
            </header>

            {/*{openInfo &&*/}
            {/*    <div className="container">*/}
            {/*        <h1>User Information</h1>*/}
            {/*        <div className="user-info">*/}
            {/*            <label htmlFor="userId">User ID:</label>*/}
            {/*            <input type="text" id="userId" name="userId" readOnly/>*/}

            {/*            <label htmlFor="userName">Username:</label>*/}
            {/*            <input type="text" id="userName" name="userName" readOnly/>*/}

            {/*            <label htmlFor="userEmail">Email:</label>*/}
            {/*            <input type="email" id="userEmail" name="userEmail" readOnly/>*/}
            {/*        </div>*/}

            {/*        <h1>Group Information</h1>*/}
            {/*        <div className="group-info">*/}
            {/*            <label htmlFor="groupId">Group ID:</label>*/}
            {/*            <input type="text" id="groupId" name="groupId" readOnly/>*/}

            {/*            <label htmlFor="groupName">Group Name:</label>*/}
            {/*            <input type="text" id="groupName" name="groupName" readOnly/>*/}

            {/*            <label htmlFor="groupDescription">Group Description:</label>*/}
            {/*            <textarea id="groupDescription" name="groupDescription" readOnly></textarea>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*}*/}

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
                            <div className="message-content" >
                                {msg.sentByCurrentUser && <p className="mb-0">{msg.name}</p>}
                                <div
                                    className={`p-2 rounded ${msg.sentByCurrentUser ? 'received-message bg-secondary text-white' : 'sent-message bg-primary text-white'}`}
                                >
                                    <p className="mb-1 text-center text-white"style={{wordBreak: 'break-word', overflowWrap: 'anywhere'}} >{msg.mes}</p>
                                    {/* {msg.imageUrl && <img src={msg.imageUrl} alt="Sent" className="img-fluid" />} */}
                                    {/* {msg.videoUrl && <video src={msg.videoUrl} className="img-fluid" controls />} */}
                                    {/* <p className="text-right small text-muted"> */}
                                    {/*     {new Date(msg.createAt).toLocaleString()} */}
                                    {/* </p> */}
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
