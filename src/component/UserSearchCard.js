import React from 'react';
import { Link } from 'react-router-dom';

const UserSearchCard = ({ user, onClose }) => {
    return (
        <Link to={"/" + user._id} onClick={onClose} className='d-flex align-items-center gap-3 p-2 lg:p-4 border border-transparent border-b-slate-200 hover-border hover-border-primary rounded cursor-pointer text-decoration-none'>
            <div>
                <div className='fw-bold text-ellipsis overflow-hidden text-truncate' style={{ maxWidth: '200px' }}>
                    {user.name}
                </div>
                <p className='text-sm text-ellipsis overflow-hidden text-truncate' style={{ maxWidth: '200px' }}>
                    {user.email}
                </p>
            </div>
        </Link>
    );
};

export default UserSearchCard;
