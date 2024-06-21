import React, { useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import Loading from './Loading';
import UserSearchCard from './UserSearchCard';
import { useSelector } from "react-redux";

const SearchUser = ({ onClose }) => {
    const [search, setSearch] = useState('');
    const users = useSelector((state) => state.chat.users);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setSearch(e.target.value);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Search User</h5>
                        <button type="button" className="close" onClick={onClose}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {/* Input search user */}
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search user by name, email..."
                                onChange={handleInputChange}
                                value={search}
                            />
                            <div className="input-group-append">
                                <span className="input-group-text">
                                    <IoSearchOutline size={25} />
                                </span>
                            </div>
                        </div>

                        {/* Display search user */}
                        <div>
                            {filteredUsers.length === 0 && !loading && (
                                <p className="text-center text-muted">No user found!</p>
                            )}

                            {loading && <Loading />}

                            {filteredUsers.length !== 0 && !loading && (
                                filteredUsers.map((user, index) => (
                                    <UserSearchCard key={index} user={user} onClose={onClose} />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchUser;
