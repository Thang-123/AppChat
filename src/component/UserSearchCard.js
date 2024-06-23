import React from 'react';
import { Link } from 'react-router-dom';

const UserSearchCard = ({ user, onUserClick }) => {

    const handleClick = () => {
        onUserClick(user);
    };
    return (
        <div onClick={handleClick} className={`user-search-card`}>
            <div className="user-card">
                <div className="user-avatar">
                    {/*<img src={user.avatar} alt={`${user.name}'s avatar`} />*/}
                </div>
                <div className="user-info">
                    <h5 className="user-name">{user.name}</h5>
                    <p className="user-email">{user.email}</p>
                </div>
            </div>
        </div>
    );
};

export default UserSearchCard;
