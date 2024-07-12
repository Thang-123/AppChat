import React, { useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import Loading from './Loading';
import UserSearchCard from './UserSearchCard';


const SearchUser = ({ users, onClose,onUserClick }) => {
    const [search, setSearch] = useState('');
    // const users = useSelector((state) => state.chat.users);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setSearch(e.target.value);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="modal-container">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search user by name, email..."
                                onChange={handleInputChange}
                                value={search}
                            />
                            <button className="input-icon">
                                <IoSearchOutline size={25}/>
                            </button>
                        </div>
                        <button type="button" className="close-button" onClick={onClose}>
                            &times;
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="user-list">
                            {filteredUsers.length === 0 && !loading && (
                                <p className="no-user-found">No user found!</p>
                            )}
                            {loading && <Loading/>}
                            {filteredUsers.length !== 0 && !loading && (
                                filteredUsers.map((user, index) => (
                                    <UserSearchCard key={index} user={user} onClose={onClose} onUserClick={onUserClick}/>
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
