import React, {useEffect, useState} from 'react';
import {FaUserCircle} from "react-icons/fa";
import {getDownloadURL, getStorage, ref} from "firebase/storage";

const UserSearchCard = ({ user, onUserClick , newMessage}) => {
    const [clicked, setClicked] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState('');
    const handleClick = () => {
        onUserClick(user);
        setClicked(true);
    };
    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const storage = getStorage();
                const avatarRef = ref(storage, `avatars/${user.name}`);
                const downloadURL = await getDownloadURL(avatarRef);
                setAvatarUrl(downloadURL);
                console.log("avatar url:", downloadURL)
            } catch (error) {
                console.error('Error fetching avatar:', error);
                setAvatarUrl('');
            }
        };

        fetchAvatar();
    }, []);
    return (
        <div onClick={handleClick}
             className={`user-search-card ${newMessage ? 'has-message' : ''} ${clicked ? 'clicked' : ''}`}>
            <div className={`user-card ${newMessage ? 'has-message' : ''} ${clicked ? 'clicked' : ''}`}>
                <div className="user-avatar">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="Profile" className="rounded-circle" style={{ width: '40px', height: '40px' }} />
                    ) : (
                        <FaUserCircle size={40} className="rounded-circle" />
                    )}
                </div>
                <div className="user-info">
                    <h5 className="user-name">{user.name}</h5>
                    {newMessage && <p className="user-message">{newMessage}</p>}
                </div>
            </div>
        </div>

    );
};

export default UserSearchCard;
