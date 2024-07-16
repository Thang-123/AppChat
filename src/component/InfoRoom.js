import React, {useEffect, useState} from 'react';
import UserSearchCard from './UserSearchCard';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage";
import {FaUserCircle} from "react-icons/fa";
import {doc, setDoc} from "firebase/firestore";
import {firestore} from "../firebaseconfig";
const InfoRoom = ({ users, onClose, roomName,onUserClick, onSave, userType, isActive}) => {
    const [avatarUrl, setAvatarUrl] = useState('');
    const [preview, setPreview] = useState(null);
    const [avatar, setAvatar] = useState(null);

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const storage = getStorage();
                const avatarRef = ref(storage, `avatars/${roomName}`);
                const downloadURL = await getDownloadURL(avatarRef);
                setAvatarUrl(downloadURL);
                console.log("avatar url:", downloadURL);
            } catch (error) {
                console.error('Error fetching avatar:', error);
                setAvatarUrl('');
            }
        };

        fetchAvatar();
    }, [roomName]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (avatar) {
            const storage = getStorage();
            const storageRef = ref(storage, `avatars/${roomName}`);
            uploadBytesResumable(storageRef, avatar)
                .then((snapshot) => {
                    console.log('File uploaded successfully');
                    onSave('Success!', 'Room Avatar updated successfully.', 'success', 3000);
                    getDownloadURL(snapshot.ref)
                        .then((downloadURL) => {
                            const userDocRef = doc(firestore, 'users', roomName);
                            setDoc(
                                userDocRef,
                                {
                                    avatarUrl: downloadURL,
                                },
                                { merge: true }
                            )
                                .then(() => {
                                    console.log('Room Avatar updated successfully');
                                    setAvatar(null);
                                })
                                .catch((error) => {
                                    console.error('Error updating profile: ', error);
                                });
                        })
                        .catch((error) => {
                            console.error('Error getting download URL: ', error);
                        });
                })
                .catch((error) => {
                    console.error('Error uploading file: ', error);
                });
        }
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(file);
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
    <div className="modal-container">
        <div className="modal-dialog info-room">
            <div className="modal-content">
                <div className="modal-header"
                     style={{background: '#E1EAFD'}}>
                    <h5 className="modal-title">Information</h5>
                    <button type="button" className="close-button" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit} className="mx-auto">
                        <div className="text-center">
                            <label htmlFor="avatarInput"
                                   className={`cursor-pointer ${userType !== 1 ? 'disabled' : ''}`}>
                                <div>
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Avatar Preview"
                                            className="rounded-circle"
                                            style={{width: '100px', height: '100px'}}
                                        />
                                    ) : avatarUrl ? (
                                        <img
                                            src={avatarUrl}
                                            alt="Profile"
                                            className="rounded-circle"
                                            style={{width: '100px', height: '100px'}}
                                        />
                                    ) : (
                                        <FaUserCircle size={80} className="rounded-circle"/>
                                    )}
                                </div>
                                <div className="fs-4 mt-2">{roomName}</div>
                                <div className="status-container text-center">
                                    <div className={`dot ${isActive ? 'dot-active' : 'dot-inactive'}`}/>
                                    <span className="status-text mx-2">
                                    {isActive ? 'Online' : 'Offline'}
                                    </span>
                                </div>
                            </label>
                            <input
                                id="avatarInput"
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="d-none"
                                disabled={userType !== 1}
                            />
                        </div>

                        <div style={{textAlign: 'right'}}>
                            <button
                                type="submit"
                                className="mt-3 px-4 py-2 text-secondary rounded"
                                style={{background: '#E1EAFD'}}
                                hidden={userType !== 1}
                            >
                                Save
                            </button>
                        </div>
                    </form>

                    <div className="accordion accordion-flush" id="accordionFlushExample" style={{marginTop: '15px'}}>
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed" type="button"
                                        data-bs-toggle="collapse" data-bs-target="#flush-collapseOne"
                                        aria-expanded="false" aria-controls="flush-collapseOne"
                                        style={{background: '#E1EAFD'}}>
                                    Member List
                                </button>
                            </h2>
                            <div id="flush-collapseOne"
                                 className="accordion-collapse collapse scrollbar"
                                 data-bs-parent="#accordionFlushExample">
                                <div className="accordion-body"
                                     style={{background: '#E1EAFD'}}>
                                    <div className="user-list">
                                        {users.length === 0 && <p className="no-user-found">No members found!</p>}

                                        {users.length !== 0 &&
                                            users.map((member, index) => (
                                                <UserSearchCard key={index} user={member} onClose={onClose} onUserClick={onUserClick}/>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed" type="button"
                                        data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo"
                                        aria-expanded="false" aria-controls="flush-collapseTwo"
                                        style={{background: '#E1EAFD'}}>
                                    Accordion Item #2
                                </button>
                            </h2>
                            <div id="flush-collapseTwo" className="accordion-collapse collapse"
                                 data-bs-parent="#accordionFlushExample">
                                <div className="accordion-body"
                                     style={{background: '#E1EAFD'}}>
                                    ...
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed" type="button"
                                        data-bs-toggle="collapse" data-bs-target="#flush-collapseThree"
                                        aria-expanded="false" aria-controls="flush-collapseThree"
                                        style={{background: '#E1EAFD'}}>
                                    Accordion Item #3
                                </button>
                            </h2>
                            <div id="flush-collapseThree" className="accordion-collapse collapse"
                                 data-bs-parent="#accordionFlushExample">
                                <div className="accordion-body"
                                     style={{background: '#E1EAFD'}}>
                                    ...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default InfoRoom;
