import React from 'react';
import "./Header.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = ({ onJoinRoom, onCreateRoom }) => (
    <header className="app-header d-flex align-items-center justify-content-between p-3 border-bottom bg-white">
        <div className="d-flex align-items-center w-100">
            <div className="logo mr-3">
                <img src="" alt="Logo" />
            </div>
            <div className="search-bar flex-grow-1 d-flex mr-3">
                <input type="text" className="form-control" placeholder="Search..." />
                <button className="btn btn-primary ml-2" onClick={onJoinRoom}>Join Room</button>
                <button className="btn btn-secondary ml-2" onClick={onCreateRoom}>Create Room</button>
            </div>
            <div className="ml-auto user-profile">
                <img src="" alt="Profile" className="rounded-circle" />
            </div>
        </div>
    </header>
);

export default Header;
