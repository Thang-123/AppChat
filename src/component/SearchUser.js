import React, { useEffect, useState } from 'react';
import { IoSearchOutline, IoClose } from 'react-icons/io5';
import Loading from './Loading';
import UserSearchCard from './UserSearchCard';
import WebSocketService from '../webSocketService';

const SearchUser = ({ onClose }) => {
    const [searchUser, setSearchUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        WebSocketService.registerCallback('', (data) =>{

        });

        return () => {
            // WebSocketService.close();
        };
    }, []);



    const handleSearchUser = () => {

    };

    useEffect(() => {
        if (search.trim() !== '') {
            handleSearchUser();
        } else {
            setSearchUser([]);
        }
    }, [search]);

    const handleInputChange = (e) => {
        setSearch(e.target.value);
    };

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
                            {searchUser.length === 0 && !loading && (
                                <p className="text-center text-muted">No user found!</p>
                            )}

                            {loading && <Loading />}

                            {searchUser.length !== 0 && !loading && (
                                searchUser.map((user, index) => (
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
