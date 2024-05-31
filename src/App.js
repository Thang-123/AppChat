import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const App = () => {
    const { loggedIn } = useSelector((state) => state.chat);

    return (
        <div className="app">
            <Outlet />
        </div>
    );
};

export default App;
