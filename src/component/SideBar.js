import React, { useState } from 'react';
import styled from 'styled-components';
import { IoChatbubbleEllipses } from 'react-icons/io5';
import { FaUserPlus } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';
import { FiArrowUpLeft } from 'react-icons/fi';
import InfiniteScroll from "react-infinite-scroll-component";
import SearchUser from "./SearchUser";
import {ListGroup} from "react-bootstrap";

const StyledIconContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem; /* Điều chỉnh khoảng cách giữa các icon */
    padding-top: 3rem;
`;

const StyledIcon = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 3rem; /* Điều chỉnh kích thước icon */
    height: 3rem;
    cursor: pointer;
    border-radius: 0.375rem; /* Rounded corners */
    transition: background-color 0.3s ease; /* Hiệu ứng chuyển đổi màu nền */
    
    &:hover {
        background-color: #cbd5e0; /* Màu nền khi hover */
    }

    ${(props) =>
            props.active &&
            `
        background-color: #a3bffa; /* Màu nền khi active */
    `}
`;

const Sidebar = ({ onUserClick, onLogout, users }) => {
    const [openSearchUser, setOpenSearchUser] = useState(false);
    const [displayedUsers, setDisplayedUsers] = useState(users.slice(0, 10));
    const [hasMore, setHasMore] = useState(users.length > 10);
    const [activeIcon, setActiveIcon] = useState(null); // null, 'chat', or 'addFriend'

    const handleToggleShowSearchUser = () => {
        setOpenSearchUser(prev => !prev);
    };

    const handleIconClick = (icon) => {
        if (activeIcon === icon) {
            setActiveIcon(null); // Unselect the icon if it's already active
        } else {
            setActiveIcon(icon); // Select the clicked icon
        }
    };

    const fetchMoreData = () => {
        if (displayedUsers.length >= users.length) {
            setHasMore(false);
            return;
        }

        const nextUsers = users.slice(displayedUsers.length, displayedUsers.length + 10);
        setDisplayedUsers([...displayedUsers, ...nextUsers]);
    };

    function handleMouseEnter() {

    }

    function handleMouseLeave() {

    }

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-3 bg-secondary rounded-start rounded-bottom py-5 text-slate-600 d-flex flex-column justify-between'>
                    <StyledIconContainer>
                        <StyledIcon
                            onClick={() => handleIconClick('chat')}
                            active={activeIcon === 'chat'}
                            title='Chat'
                        >
                            <IoChatbubbleEllipses className='text-gray-600' size={30} />
                        </StyledIcon>
                        <StyledIcon
                            onClick={() => {
                                handleIconClick('addFriend');
                                handleToggleShowSearchUser();
                            }}
                            active={activeIcon === 'addFriend'}
                            title='Add Friend'
                        >
                            <FaUserPlus className='text-gray-600' size={30} />
                        </StyledIcon>

                    </StyledIconContainer>
                    <div className='mt-auto'> {/* Để đẩy Logout ra dưới cùng */}
                        <div className='d-flex flex-column align-items-center'>
                            <button title='Logout' className='w-100 h-12 flex justify-center items-center cursor-pointer hover-bg-slate-200 rounded'
                                    onClick={onLogout}>
                                <BiLogOut size={30} />
                            </button>
                        </div>
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

                        <div className='col-12 custom-scrollbar' style={{ height: 'calc(100vh - 65px)', overflowY: 'auto' }}>
                            {users.length === 0 && (
                                <div className='mt-12 text-center'>
                                    <div className='flex justify-center items-center my-4 text-slate-500'>
                                        <FiArrowUpLeft size={50} />
                                    </div>
                                    <p className='text-lg text-slate-400'>Explore users to start a conversation with.</p>
                                </div>
                            )}

                            {/* Display list of users */}
                            <div className='container mt-4'>
                                <InfiniteScroll
                                    dataLength={displayedUsers.length}
                                    next={fetchMoreData}
                                    hasMore={hasMore}
                                    loader={<h4>Loading...</h4>}
                                    scrollableTarget="scrollableDiv"
                                >
                                    <ListGroup>
                                        {displayedUsers.map((user, index) => (
                                            <div
                                                key={index}
                                                className='list-group-item list-group-item-action d-flex align-items-center gap-3 user-list-item'
                                                onClick={() => onUserClick(user)}
                                                style={{ cursor: 'pointer', borderRadius: '8px', padding: '12px', marginBottom: '8px', boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)' }}
                                            >
                                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden' }}>
                                                    {/*<img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />*/}
                                                    {/* Replace with Avatar component if available */}
                                                </div>
                                                <div className='flex-grow-1'>
                                                    <h5 className='mb-1 text-truncate' style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>{user.name}</h5>
                                                    <small className='text-muted'>{user.actionTime}</small>
                                                </div>
                                            </div>
                                        ))}
                                    </ListGroup>
                                </InfiniteScroll>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search user */}
                {openSearchUser && <SearchUser onClose={handleToggleShowSearchUser} />}
            </div>
        </div>
    );
};

export default Sidebar;
