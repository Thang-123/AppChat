import React, { useState, useEffect } from 'react';
import { IoMdPeople } from 'react-icons/fa';
import Loading from './Loading';
import GroupCard from './GroupSearchCard';
import { useSelector } from "react-redux";

const SearchGroup = ({ onClose, onGroupClick }) => {
    const [search, setSearch] = useState('');
    const groups = useSelector((state) => state.chat.groups); // Assuming groups data is stored in Redux state
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setSearch(e.target.value);
    };

    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(search.toLowerCase())
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
                                placeholder="Search group by name..."
                                onChange={handleInputChange}
                                value={search}
                            />
                            <button className="input-icon">
                                <IoMdPeople size={25}/>
                            </button>
                        </div>
                        <button type="button" className="close-button" onClick={onClose}>
                            &times;
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="group-list">
                            {filteredGroups.length === 0 && !loading && (
                                <p className="no-group-found">No group found!</p>
                            )}
                            {loading && <Loading/>}
                            {filteredGroups.length !== 0 && !loading && (
                                filteredGroups.map((group, index) => (
                                    <GroupCard key={index} group={group} onClose={onClose} onGroupClick={onGroupClick}/>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchGroup;
