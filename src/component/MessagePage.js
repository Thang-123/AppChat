import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MessagePage.css';
import { FaAngleLeft, FaImage, FaPlus, FaVideo } from "react-icons/fa";
import { Link } from "react-router-dom";
import { HiDotsVertical } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";

const MessagePage = ({ messages, onSendMessage,upLoadFile }) => {
    const [loading, setLoading] = useState(false);
    const [allMessage, setAllMessage] = useState(messages || []);
    const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
    const [message, setMessage] = useState({ text: '', imageUrl: '', videoUrl: '' });
    const currentMessage = useRef(null);

    useEffect(() => {
        if (currentMessage.current) {
            currentMessage.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [allMessage]);

    const handleUploadImageVideoOpen = () => {
        setOpenImageVideoUpload(prev => !prev);
    };

    const handleUploadImage = async (e) => {
        // const file = e.target.files[0];
        //
        // setLoading(true);
        // const uploadPhoto = await uploadFile(file); // Add your uploadFile function
        // setLoading(false);
        // setOpenImageVideoUpload(false);
        //
        // setMessage(prev => ({
        //     ...prev,
        //     imageUrl: uploadPhoto.url
        // }));
    };

    const handleClearUploadImage = () => {
        setMessage(prev => ({
            ...prev,
            imageUrl: ''
        }));
    };

    const handleUploadVideo = async (e) => {
        // const file = e.target.files[0];
        //
        // setLoading(true);
        // const uploadPhoto = await uploadFile(file); // Add your uploadFile function
        // setLoading(false);
        // setOpenImageVideoUpload(false);
        //
        // setMessage(prev => ({
        //     ...prev,
        //     videoUrl: uploadPhoto.url
        // }));
    };

    const handleClearUploadVideo = () => {
        setMessage(prev => ({
            ...prev,
            videoUrl: ''
        }));
    };

    const handleOnChange = (e) => {
        const { value } = e.target;
        setMessage(prev => ({
            ...prev,
            text: value
        }));
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.text || message.imageUrl || message.videoUrl) {
            onSendMessage(message);
            setMessage({ text: '', imageUrl: '', videoUrl: '' });
        }
    };

    return (
        <div className="bg-no-repeat bg-cover">
            <header className="sticky-top bg-white d-flex justify-content-between align-items-center p-3 border-bottom">
                <div className="d-flex align-items-center gap-4">
                    <Link to="/" className="d-lg-none">
                        <FaAngleLeft size={25} />
                    </Link>
                    <div>
                        {/* <Avatar
                            width={50}
                            height={50}
                            imageUrl={dataUser?.profile_pic}
                            name={dataUser?.name}
                            userId={dataUser?._id}
                        /> */}
                    </div>
                    {/* <div>
                        <h3 className="font-weight-semibold h5 my-0 text-truncate">{dataUser?.name}</h3>
                        <p className="my-0 small">
                            {dataUser?.online ? <span className="text-primary">online</span> : <span className="text-muted">offline</span>}
                        </p>
                    </div> */}
                </div>
                <div>
                    <button className="btn btn-link text-dark p-0">
                        <HiDotsVertical />
                    </button>
                </div>
            </header>

            {/* Show all messages */}
            <section className="overflow-auto bg-light" style={{ height: 'calc(100vh - 128px)' }}>
                {/*<div className="d-flex flex-column gap-2 py-2 mx-2" ref={currentMessage}>*/}
                {/*    {allMessage.map((msg, index) => (*/}
                {/*        <div key={index} className={`p-2 rounded max-w-75 ${user._id === msg?.msgByUserId ? 'ml-auto bg-info' : 'bg-white'}`}>*/}
                {/*            <div className="w-100 position-relative">*/}
                {/*                {msg?.imageUrl && <img src={msg.imageUrl} className="w-100 h-auto object-fit-contain" alt="Message" />}*/}
                {/*                {msg?.videoUrl && <video src={msg.videoUrl} className="w-100 h-auto object-fit-contain" controls />}*/}
                {/*            </div>*/}
                {/*            <p className="mb-1">{msg.text}</p>*/}
                {/*            <p className="text-right small text-muted">{moment(msg.createdAt).format('hh:mm')}</p>*/}
                {/*        </div>*/}
                {/*    ))}*/}
                {/*</div>*/}

                {/* Upload Image display */}
                {message.imageUrl && (
                    <div className="position-fixed bottom-0 w-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50">
                        <div className="position-absolute top-0 right-0 p-2 cursor-pointer text-danger" onClick={handleClearUploadImage}>
                            <IoClose size={30} />
                        </div>
                        <div className="bg-white p-3 rounded">
                            <img src={message.imageUrl} alt="uploadImage" className="img-fluid" />
                        </div>
                    </div>
                )}

                {/* Upload Video display */}
                {message.videoUrl && (
                    <div className="position-fixed bottom-0 w-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50">
                        <div className="position-absolute top-0 right-0 p-2 cursor-pointer text-danger" onClick={handleClearUploadVideo}>
                            <IoClose size={30} />
                        </div>
                        <div className="bg-white p-3 rounded">
                            <video src={message.videoUrl} className="img-fluid" controls muted autoPlay />
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="position-fixed bottom-0 w-100 d-flex justify-content-center align-items-center">
                        {/*<Loading />*/}
                    </div>
                )}
            </section>

            {/* Send message */}
            <section className="bg-white d-flex align-items-center p-3 border-top">
                <div className="position-relative">
                    <button onClick={handleUploadImageVideoOpen} className="btn btn-light rounded-circle">
                        <FaPlus size={20} />
                    </button>

                    {/* Video and image upload */}
                    {openImageVideoUpload && (
                        <div className="position-absolute bottom-100 bg-white shadow rounded p-2">
                            <form>
                                <label htmlFor="uploadImage" className="d-flex align-items-center p-2 cursor-pointer">
                                    <div className="text-primary mr-2">
                                        <FaImage size={18} />
                                    </div>
                                    <p className="mb-0">Image</p>
                                </label>
                                <label htmlFor="uploadVideo" className="d-flex align-items-center p-2 cursor-pointer">
                                    <div className="text-purple mr-2">
                                        <FaVideo size={18} />
                                    </div>
                                    <p className="mb-0">Video</p>
                                </label>

                                <input type="file" id="uploadImage" onChange={handleUploadImage} className="d-none" />
                                <input type="file" id="uploadVideo" onChange={handleUploadVideo} className="d-none" />
                            </form>
                        </div>
                    )}
                </div>

                {/* Input box */}
                <form className="flex-grow-1 d-flex align-items-center gap-2 ml-2" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        placeholder="Type here message..."
                        className="form-control flex-grow-1"
                        value={message.text}
                        onChange={handleOnChange}
                    />
                    <button className="btn btn-link text-primary p-0">
                        <IoMdSend size={28} />
                    </button>
                </form>
            </section>
        </div>
    );
};

export default MessagePage;
