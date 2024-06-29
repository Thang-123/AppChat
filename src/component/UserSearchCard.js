import React, {useState} from 'react';
import {FaUserCircle} from "react-icons/fa";

const UserSearchCard = ({ user, onUserClick , newMessage}) => {
    const [clicked, setClicked] = useState(false);
    const handleClick = () => {
        onUserClick(user);
        setClicked(true);
    };

    return (
        <div onClick={handleClick}
             className={`user-search-card ${newMessage ? 'has-message' : ''} ${clicked ? 'clicked' : ''}`}>
            <div className={`user-card ${newMessage ? 'has-message' : ''} ${clicked ? 'clicked' : ''}`}>
                <div className="user-avatar">
                    {/* <img src={user.avatar} alt={`${user.name}'s avatar`} /> */}
                    <FaUserCircle size={40} className="rounded-circle" />
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
