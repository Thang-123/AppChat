import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import { IoChatbubbleEllipses } from 'react-icons/io5';
import {FaUserCircle, FaUserFriends, FaUsers} from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';
import { FiArrowUpLeft, FiSettings } from 'react-icons/fi';
import InfiniteScroll from "react-infinite-scroll-component";
import SearchUser from "./SearchUser";
import { ListGroup } from "react-bootstrap";
import UserSearchCard from "./UserSearchCard";
import {useSelector} from "react-redux";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { firestore } from '../firebaseconfig';
import { doc, setDoc } from 'firebase/firestore';
import Modal from 'react-bootstrap/Modal';
import SearchGroup from "./SearchGroup";
import GroupSearchCard from "./GroupSearchCard"; // Import Modal from react-bootstrap
import {GrGroup} from "react-icons/gr";
const StyledIconContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 4rem;
`;

const StyledIcon = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 3rem;
    height: 3rem;
    cursor: pointer;
    border-radius: 0.375rem;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #cbd5e0;
    }

    ${(props) =>
            props.active === "true" &&
            `
        background-color: #a3bffa;
    `}
`;

const Divider = styled.hr`
    width: 100%;
    border: none;
    border-top: 2px solid #279d90;
    margin: 3rem 0;
`;

const SidebarContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 6rem;
    background-color: #e2e8f0;
    height: 100vh;
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 0.5rem 1rem;
    border: 1px solid #cbd5e0;
    border-radius: 0.375rem;
    margin-bottom: 1rem;
    font-size: 1rem;
`;

const UserListContainer = styled.div`
    height: calc(100vh - 65px);
    padding: 1rem;
    background-color: #f8f9fa;
`;

const GroupListContainer = styled.div`
    height: calc(100vh - 65px);
    padding: 1rem;
    background-color: #f8f9fa;
`;

const SearchInputContainer = styled.div`
    width: 100%;
    padding: 0.5rem 1rem;
    border: 1px solid #cbd5e0;
    border-radius: 0.375rem;
    margin-bottom: 1rem;
    font-size: 1rem;
    cursor: pointer;
`;


const Sidebar = ({ newMessage, onUserClick, onGroupClick, onLogout, users, groups}) => {
    const {loggedInUser} = useSelector((state) => state.chat);
    const [openSearchUser, setOpenSearchUser] = useState(false);
    const [openSearchGroup, setOpenSearchGroup] = useState(false);
    const [openChat, setOpenChat] = useState(false);
    const [openSetting, setOpenSetting] = useState(false);
    const [openGroup, setOpenGroup] = useState(false);
    const [displayedUsers, setDisplayedUsers] = useState(users.slice(0, 10));
    const [hasMore, setHasMore] = useState(users.length > 10);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeIcon, setActiveIcon] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(null);
    const [name, setName] = useState(loggedInUser);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [groupImage, setGroupImage] = useState(null); // Assume groupImage is a state variable to hold the image file
    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const storage = getStorage();
                const avatarRef = ref(storage, `avatars/${loggedInUser}`);
                const downloadURL = await getDownloadURL(avatarRef);
                setAvatarUrl(downloadURL);
                console.log("avatar url:", downloadURL)
            } catch (error) {
                console.error('Error fetching avatar:', error);
                setAvatarUrl('');
            }
        };
        fetchAvatar();
    },[]);
    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(file);
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
      ;
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        if (avatar) {
            const storage = getStorage();
            const storageRef = ref(storage, `avatars/${loggedInUser}`);
            uploadBytesResumable(storageRef, avatar).then((snapshot) => {
                console.log('File uploaded successfully');
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    const userDocRef = doc(firestore, 'users', loggedInUser);
                    setDoc(userDocRef, {
                        avatarUrl: downloadURL,
                    }, { merge: true }).then(() => {
                        console.log('Profile updated successfully');
                        setAvatar(null);
                    }).catch((error) => {
                        console.error('Error updating profile: ', error);
                    });
                }).catch((error) => {
                    console.error('Error getting download URL: ', error);
                });
            }).catch((error) => {
                console.error('Error uploading file: ', error);
            });
        }
    };

    const handleToggleShowSearchUser = () => {
        setOpenSearchUser(prev => !prev);
    };

    const handleToggleShowSearchGroup= () => {
        setOpenSearchGroup(prev => !prev);
    };

    const handleOpenCreateGroupModal = () => {
        setShowCreateGroupModal(true);
    };

    const handleCloseCreateGroupModal = () => {
        setShowCreateGroupModal(false);
    };

    const handleGroupNameChange = (e) => {
        setGroupName(e.target.value);
    };

    const handleGroupImageChange = (e) => {
        setGroupImage(e.target.files[0]);
    };

    const handleCreateGroup = () => {
        // Implement logic to create the group using groupName and groupImage
        // (e.g., call an API or update state in a Redux store)
        handleCloseCreateGroupModal();
    };

    const handleIconClick = (icon) => {
        setActiveIcon(prev => (prev === icon ? null : icon));
        if (icon === 'chat') {
            setOpenChat(prev => !prev);
            setOpenSetting(false);
            setOpenGroup(false);
        }
        if (icon === 'settings') {
            setOpenSetting(prev => !prev);
            setOpenChat(false);
            setOpenGroup(false);
        }
        if (icon === 'group') {
            setOpenGroup(prev => !prev);
            setOpenChat(false);
            setOpenSetting(false);
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

    const handleSearchChange = (event) => {
        const { value } = event.target;
        setSearchTerm(value);
        const filteredUsers = users.filter(user =>
            user.name.toLowerCase().includes(value.toLowerCase())
        );
        setDisplayedUsers(filteredUsers.slice(0, 10));
        setHasMore(filteredUsers.length > 10);
    };

    return (
        <div className="d-flex">
            <SidebarContainer>
                <StyledIconContainer>
                    <StyledIcon
                        onClick={() => handleIconClick('chat')}
                        active={activeIcon === 'chat' ? "true" : "false"}
                        title="Chat"
                    >
                        <IoChatbubbleEllipses size={24} />
                    </StyledIcon>
                    <StyledIcon
                        onClick={() => {
                            handleIconClick('group');
                        }}
                        active={activeIcon === 'group' ? "true" : "false"}
                        title="Group"
                    >
                        <GrGroup size={24} />
                    </StyledIcon>
                    <Divider />
                    <StyledIcon
                        onClick={() => handleIconClick('settings')}
                        active={activeIcon === 'settings' ? "true" : "false"}
                        title="Settings"
                    >
                        <FiSettings size={24} />
                    </StyledIcon>
                </StyledIconContainer>
                <StyledIconContainer style={{ marginTop: 'auto' }}>
                    <StyledIcon onClick={onLogout} title="Logout">
                        <BiLogOut size={24} />
                    </StyledIcon>
                </StyledIconContainer>
            </SidebarContainer>
            {openChat &&
                <div className="flex-grow-1">
                    <div className="bg-slate-100 p-4">
                        <h2 className="text-xl font-bold">CHATS</h2>
                        <hr />
                        <SearchInputContainer onClick={handleToggleShowSearchUser}>
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                style={{ border: 'none', width: '100%' }}
                                readOnly
                            />
                        </SearchInputContainer>
                    </div>
                    <div className='col-12 custom-scrollbar' style={{ height: 'calc(85vh - 55px)'}}>
                        <UserListContainer>
                            {users.length === 0 && (
                                <div className="text-center mt-4">
                                    <FiArrowUpLeft size={24} className="text-gray-500" />
                                    <p className="text-gray-500 mt-2">Explore users to start a conversation with.</p>
                                </div>
                            )}
                            <InfiniteScroll
                                dataLength={users.length}
                                // next={fetchMoreData}
                                // hasMore={hasMore}
                                // loader={<h4>Loading...</h4>}
                            >
                                <div>
                                    {users.map((user,index) => (
                                        <UserSearchCard
                                            key={index}
                                            user={user}
                                            onUserClick={() => onUserClick(user)}
                                            newMessage={newMessage[user.name] || ""}
                                        />
                                    ))}
                                </div>
                            </InfiniteScroll>
                        </UserListContainer>
                    </div>


                    {openSearchUser && <SearchUser onClose={handleToggleShowSearchUser} onUserClick={onUserClick} />}
                </div>
            }

            {openGroup &&
                <div className="flex-grow-1">
                    <div className="bg-slate-100 p-4">
                        <h2 className="text-xl font-bold">GROUPS</h2>
                        <hr/>
                        <SearchInputContainer onClick={handleToggleShowSearchGroup}>
                            <input
                                type="text"
                                placeholder="Search groups..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                style={{border: 'none', width: '100%'}}
                                readOnly
                            />
                        </SearchInputContainer>
                        <div className="d-flex align-items-center gap-3">
                            <button className="btn btn-link text-dark p-2" onClick={handleOpenCreateGroupModal}>
                                <FaUsers size={20} className="me-2"/> Create Group
                            </button>

                            <Modal show={showCreateGroupModal} onHide={handleCloseCreateGroupModal}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Create Group</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <form>
                                        <div className="mb-3">
                                            <label htmlFor="groupName" className="form-label">Group Name:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="groupName"
                                                value={groupName}
                                                onChange={handleGroupNameChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="groupImage" className="form-label">Group image:</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                id="groupImage"
                                                onChange={handleGroupImageChange}
                                            />
                                        </div>
                                    </form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <button variant="secondary" onClick={handleCloseCreateGroupModal}>
                                        Cancel
                                    </button>
                                    <button variant="primary" onClick={handleCreateGroup}>
                                        Create
                                    </button>
                                </Modal.Footer>
                            </Modal>

                            <button className="btn btn-link text-dark p-2" data-bs-toggle="modal"
                                    data-bs-target="#joinGroupModal">
                                <FaUserFriends size={20} className="me-2"/> Join Group
                            </button>
                        </div>

                        {openSearchGroup && <SearchGroup onClose={handleToggleShowSearchGroup} onUserClick={onUserClick} />}
                    </div>


                    <div className='col-12 custom-scrollbar' style={{height: 'calc(85vh - 55px)'}}>
                        <GroupListContainer>
                            {users.length === 0 && (
                                <div className="text-center mt-4">
                                    <FiArrowUpLeft size={24} className="text-gray-500"/>
                                    <p className="text-gray-500 mt-2">Explore users to start a conversation with.</p>
                                </div>
                            )}
                            <InfiniteScroll
                                dataLength={users.length}
                                // next={fetchMoreData}
                                // hasMore={hasMore}
                                // loader={<h4>Loading...</h4>}
                            >
                                <div>
                                    {groups.map((group, index) => (
                                        <GroupSearchCard
                                            key={index}
                                            group={group} // Pass the group object
                                            onGroupClick={() => onGroupClick(group)} // Function to handle group click
                                        />
                                    ))}
                                </div>
                            </InfiniteScroll>
                        </GroupListContainer>
                    </div>


                    {openSearchUser && <SearchUser onClose={handleToggleShowSearchUser} onUserClick={onUserClick}/>}
                </div>
            }

            {openSetting &&
                <div className="flex-1">
                    <div className="bg-slate-100 p-4 mx-auto w-80">
                        <h2 className="text-xl font-bold">Profile</h2>
                        <form onSubmit={handleSubmit} className="mx-auto">
                            <div className="text-center my-auto">
                                <label htmlFor="avatarInput" className="cursor-pointer">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="Profile" className="rounded-circle" style={{ width: '60px', height: '60px' }} />
                                    ) : (
                                        <FaUserCircle size={40} className="rounded-circle" />
                                    )}
                                </label>
                                <input
                                    id="avatarInput"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="d-none"
                                />
                            </div>
                            <div className="my-4">
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <button
                                type="submit"
                                className="mt-4 px-4 py-2 bg-blue-500 text-secondary rounded hover:bg-blue-700 w-full"
                            >
                                Save
                            </button>
                        </form>
                    </div>
                </div>
            }

        </div>
    );
};

export default Sidebar;
