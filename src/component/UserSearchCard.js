import React from 'react';
import { Link } from 'react-router-dom';

const UserSearchCard = ({ user, onClose }) => {
    return (
        <Link to={`/${user._id}`} onClick={onClose} className="card-link">
            <div className="card border border-2 border-transparent hover-border-primary rounded-lg p-3">
                <div className="card-body">
                    <h5 className="card-title fw-bold text-truncate mb-1">{user.name}</h5>
                    <p className="card-text text-muted text-truncate mb-1">{user.email}</p>
                </div>
            </div>
        </Link>
    );
};

export default UserSearchCard;
