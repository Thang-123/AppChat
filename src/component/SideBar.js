import React from 'react';
import './SideBar.css';

const Sidebar = ({ groups }) => {
    return (
        <div className="sidebar">
            {groups.map((group, index) => (
                <div key={index} className="group-item">
                    <img src={group.icon} alt={group.name} />
                    <div className="group-info">
                        <div className="group-name">{group.name}</div>
                        <div className="group-message">{group.message}</div>
                    </div>
                    {group.unread > 0 && <div className="unread-count">{group.unread}</div>}
                </div>
            ))}
        </div>
    );
};

export default Sidebar;
