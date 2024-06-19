import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { IoChatbubbleEllipses } from 'react-icons/io5';
import { FaUserPlus } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';
import { FiArrowUpLeft } from 'react-icons/fi';
import Avatar from './Avatar';
import SearchUser from "./SearchUser";
import WebSocketService from "../webSocketService";
import { logoutUser, setUsers } from "../pages/chatSlice";
import { useDispatch, useSelector } from "react-redux";

const Sidebar = () => {
    const dispatch = useDispatch();
    const [openSearchUser, setOpenSearchUser] = useState(false);
    const users = useSelector((state) => state.chat.users);
    useEffect(() => {
        WebSocketService.registerCallback('LOGOUT', (data) => {
            handleLogoutResponse(data);
        });
        WebSocketService.registerCallback('GET_USER_LIST', (data) => {
            handleUserListResponse(data);
        });

        // Lấy danh sách người dùng khi component được mount
        handleGetUserList();

        return () => {
            // Cleanup code if necessary
        };
    }, []);

    function handleLogoutResponse(data) {
        if (!data) {
            console.log('Invalid response data received');
            return;
        }
        if (data.status === 'success') {
            dispatch(logoutUser());
        } else {
            const errorMessage = data.message || 'Logout failed';
            console.log(errorMessage);
        }
    }

    function handleUserListResponse(data) {
        if (!data || data.status !== 'success') {
            console.log('Failed to fetch user list');
            return;
        }

        const userList = data.data || [];
        dispatch(setUsers(userList));
        console.log(userList);
    }

    const handleGetUserList = () => {
        WebSocketService.sendMessage({
            action: 'onchat',
            data: {
                event: 'GET_USER_LIST',
            }
        });
    };

    const handleToggleShowSearchUser = () => {
        setOpenSearchUser(prev => !prev);
        console.log("button clicked");
    };

    function handleLogout() {
        WebSocketService.sendMessage({
            "action": "onchat",
            "data": {
                "event": "LOGOUT"
            }
        })
    }

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-3 bg-slate-100 rounded-start rounded-bottom py-5 text-slate-600 d-flex flex-column justify-content-between'>
                    <div>
                        <NavLink to="/" className='nav-link w-100 h-12 flex justify-center items-center cursor-pointer hover-bg-slate-200 rounded' title='Chat'>
                            <IoChatbubbleEllipses size={20} />
                        </NavLink>
                        <div className='w-100 h-12 flex justify-center items-center cursor-pointer hover-bg-slate-200 rounded' title='Add Friend' onClick={handleToggleShowSearchUser}>
                            <FaUserPlus size={20} />
                        </div>
                    </div>
                    <div className='d-flex flex-column align-items-center'>
                        <button title='Logout' className='w-100 h-12 flex justify-center items-center cursor-pointer hover-bg-slate-200 rounded' onClick={handleLogout}>
                            <BiLogOut size={20} />
                        </button>
                    </div>
                </div>

                <div className='col-9'>
                    <div className='row'>
                        <div className='col-12'>
                            <div className='h-16 d-flex align-items-center'>
                                <h2 className='text-xl font-bold p-4 text-slate-800'>Message</h2>
                            </div>
                            <div className='bg-slate-200 p-[0.5px]'></div>
                        </div>

                        <div className='col-12 h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar'>
                            {users.length === 0 && (
                                <div className='mt-12 text-center'>
                                    <div className='flex justify-center items-center my-4 text-slate-500'>
                                        <FiArrowUpLeft size={50} />
                                    </div>
                                    <p className='text-lg text-slate-400'>Explore users to start a conversation with.</p>
                                </div>
                            )}

                            {/* Display list of users */}
                            {users.map((user, index) => (
                                <NavLink key={index} to={`/user/${user.name}`} className='nav-link flex align-items-center gap-2 py-3 px-2 border hover-border-primary rounded hover-bg-slate-100 cursor-pointer'>
                                    <div>
                                        {/*<Avatar width={40} height={40} name={user.name} />*/}
                                    </div>
                                    <div>
                                        <h3 className='text-truncate font-semibold text-base'>{user.name}</h3>
                                        <div className='text-slate-500 text-xs d-flex align-items-center gap-1'>
                                            <div className='d-flex align-items-center gap-1'>
                                                <p className='text-truncate'>{user.actionTime}</p>
                                            </div>
                                        </div>
                                    </div>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Search user */}
            {openSearchUser && <SearchUser onClose={handleToggleShowSearchUser} />}
        </div>
    );
};

export default Sidebar;
