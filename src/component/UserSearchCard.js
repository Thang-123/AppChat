import React from 'react';

const UserSearchCard = ({ user, onUserClick ,isActive}) => {

    const handleClick = () => {
        onUserClick(user);
    };

    return (
        <div onClick={handleClick} className="user-search-card">
            <div className="user-card">
                <div className="user-avatar">
                    {/*<img src={user.avatar} alt={`${user.name}'s avatar`} />*/}
                </div>
                <div className="user-info">
                    <h5 className="user-name">{user.name}</h5>
                    {/*<div className={`dot ${isActive ? 'dot-active' : 'dot-inactive'}`} />*/}
                </div>
            </div>
        </div>
    );
};

export default UserSearchCard;
