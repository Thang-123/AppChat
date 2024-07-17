import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import { IoChatbubbleEllipses } from 'react-icons/io5';
import {FaPlus, FaUserCircle, FaUserFriends, FaUsers} from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';
import { FiArrowUpLeft, FiSettings } from 'react-icons/fi';
import InfiniteScroll from "react-infinite-scroll-component";
import SearchUser from "./SearchUser";
import UserSearchCard from "./UserSearchCard";
import { ListGroup } from "react-bootstrap";
import {useSelector} from "react-redux";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { firestore } from '../firebaseconfig';
import { doc, setDoc } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import {GrGroup} from "react-icons/gr";
import ConfirmationDialog from "./ComfirmDialog";
const DropdownMenu = styled.div`
    position: absolute;
    top: 4rem;
    left: 0;
    background: white;
    border: 1px solid #ccc;
    border-radius: 0.375rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    width: 150px;

    & > div {
        padding: 0.5rem 1rem;
        cursor: pointer;

        &:hover {
            background: #f1f1f1;
        }
    }
`;
const StyledAvatar = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
    cursor: pointer;
    img {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
    }
`;
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


const Sidebar = ({ newMessage, onUserClick, onLogout, users, groups, onCreateRoom, onJoinRoom, onSave,sendMes}) => {
    const {loggedInUser} = useSelector((state) => state.chat);
    const [openSearchUser, setOpenSearchUser] = useState(false);
    const [openSearchGroup, setOpenSearchGroup] = useState(false);
    const [openChat, setOpenChat] = useState(true);
    const [openSetting, setOpenSetting] = useState(false);
    const [openGroup, setOpenGroup] = useState(false);
    const [displayedUsers, setDisplayedUsers] = useState(users.slice(0, 10));
    const [hasMore, setHasMore] = useState(users.length > 10);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeIcon, setActiveIcon] = useState('chat');
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(null);
    const [name, setName] = useState(loggedInUser);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
    const [showJoinGroupModal, setShowJoinGroupModal] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [groupImage, setGroupImage] = useState(null);
    const [groupImagePreview, setGroupImagePreview] = useState(null);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [userName, setUserName] = useState('');
    const [showNewMessageModal, setShowNewMessageModal] = useState(false);
    const handleLogoutClick = () => {
        setShowConfirmationDialog(true);
    };

    const handleConfirmLogout = () => {
        setShowConfirmationDialog(false);
        onLogout()
        console.log('User logged out');
    };

    const handleCancelLogout = () => {
        setShowConfirmationDialog(false);
    };
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
                onSave('Success!', 'Profile saved successfully.', 'success', 3000)
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
        setGroupImagePreview("");
        setName("")
    };

    const handleOpenNewMessageModal = () => {
        setShowNewMessageModal(true);
    };

    const handleCloseNewMessageModal = () => {
        setShowNewMessageModal(false);
        setUserName("")
    };

    const handleUserNameChange = (e) => {
        setUserName(e.target.value);
    };
    const handleSendHello = () => {
        sendMes("Hello", userName)
        setShowNewMessageModal(false)
    }
    const handleOpenJoinGroupModal = () => {
        setShowJoinGroupModal(true);
    };

    const handleCloseJoinGroupModal = () => {
        setShowJoinGroupModal(false);
        setGroupName("")
    };

    const handleGroupNameChange = (e) => {
        setGroupName(e.target.value);
    };

    const handleGroupImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setGroupImage(file);
                setGroupImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitAvatarGroup = () => {
        if (groupImage) {
            const storage = getStorage();
            const storageRef = ref(storage, `avatars/${groupName}`);
            uploadBytesResumable(storageRef, groupImage).then((snapshot) => {
                console.log('File uploaded successfully');
            }).catch((error) => {
                console.error('Error uploading file: ', error);
            });
        }
    };

    const handleCreateGroup = () => {
        onCreateRoom(groupName)
        handleCloseCreateGroupModal();
        handleSubmitAvatarGroup();
    };

    const handleJoinGroup = () => {
        onJoinRoom(groupName)
        handleCloseJoinGroupModal();
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
    const handleAvatarClick = () => {
        setShowDropdown(prev => !prev);
    };

    const handleProfileClick = () => {
        setShowDropdown(false);
         setOpenSetting(true)
        setOpenChat(false)
        setOpenGroup(false)
        setActiveIcon('settings');
    };
    return (
        <div className="d-flex">
            <SidebarContainer>
                <StyledAvatar onClick={handleAvatarClick}>
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar"  />
                    ) : (
                        <FaUserCircle size={24} />
                    )}
                    {showDropdown && (
                        <DropdownMenu>
                            <div onClick={handleProfileClick}>Profile</div>
                            <div onClick={handleLogoutClick}>Logout</div>
                        </DropdownMenu>
                    )}
                </StyledAvatar>
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
                    <StyledIcon onClick={handleLogoutClick} title="Logout">
                        <BiLogOut size={24} />
                    </StyledIcon>
                    {showConfirmationDialog && (
                        <ConfirmationDialog
                            message="Are you sure you want to logout?"
                            onConfirm={handleConfirmLogout}
                            onCancel={handleCancelLogout}
                        />
                    )}
                </StyledIconContainer>
            </SidebarContainer>
            {openChat &&
                <div className="flex-grow-1">
                    <div className="bg-slate-100 p-4">
                        <h2 className="text-xl font-bold">CHATS</h2>
                        <hr/>
                        <SearchInputContainer onClick={handleToggleShowSearchUser}>
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                style={{border: 'none', width: '100%'}}
                                readOnly
                            />
                        </SearchInputContainer>
                        <div className="d-flex justify-content-center gap-1">

                            <button className="btn btn-link text-dark p-2" onClick={handleOpenNewMessageModal}>
                                <FaPlus  className="me-2"/>
                                New Message
                            </button>
                            <Modal show={showNewMessageModal} onHide={handleCloseNewMessageModal}>
                                <Modal.Header closeButton>
                                    <Modal.Title>New Message</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <form>
                                        <div className="mb-3">
                                            <label htmlFor="groupName" className="form-label">Send To:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="uName"
                                                value={userName}
                                                onChange={handleUserNameChange}
                                            />
                                        </div>
                                    </form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <button variant="secondary" onClick={handleCloseNewMessageModal}>
                                        Cancel
                                    </button>
                                    <button variant="primary" onClick={handleSendHello}>
                                        Send Hello
                                    </button>
                                </Modal.Footer>
                            </Modal>
                        </div>

                    </div>
                    <div className='col-12 custom-scrollbar' style={{height: 'calc(85vh - 55px)'}}>
                        <UserListContainer>
                            {users.length === 0 && (
                                <div className="text-center">
                                    <FiArrowUpLeft size={24} className="text-gray-500"/>
                                    <p className="text-gray mt-2">Explore users to start</p>
                                </div>
                            )}
                            <InfiniteScroll
                                dataLength={users.length}
                                // next={fetchMoreData}
                                // hasMore={hasMore}
                                // loader={<h4>Loading...</h4>}
                            >
                                <div>
                                    {users.map((user, index) => (
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


                    {openSearchUser &&
                        <SearchUser users={users} onClose={handleToggleShowSearchUser} onUserClick={onUserClick}/>}
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
                        <div className="d-flex align-items-center gap-1">
                            <button className="btn btn-link text-dark p-2" onClick={handleOpenCreateGroupModal}>
                                Create Group
                            </button>

                            <Modal show={showCreateGroupModal} onHide={handleCloseCreateGroupModal}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Create Group</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="mb-3">
                                        <label htmlFor="groupName" className="form-label">Group Name</label>
                                        <input type="text" className="form-control" id="groupName" value={groupName}
                                               onChange={handleGroupNameChange}/>
                                    </div>
                                    <div className="d-flex flex-column align-items-center mb-3">
                                        <label htmlFor="groupImage" className="form-label">Group Image</label>
                                        {groupImagePreview ? (
                                            <img
                                                src={groupImagePreview}
                                                alt="Group Preview"
                                                className={"rounded-circle"}
                                                style={{width: '100px', height: '100px', objectFit: 'cover'}}
                                                onClick={() => document.getElementById('groupImageInput').click()}
                                            />
                                        ) : (
                                            <FaUserCircle
                                                size={100}
                                                onClick={() => document.getElementById('groupImageInput').click()}
                                            />
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id="groupImageInput"
                                            style={{display: 'none'}}
                                            onChange={handleGroupImageChange}
                                        />
                                    </div>
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

                            <button className="btn btn-link text-dark p-2" onClick={handleOpenJoinGroupModal}>
                                 Join Group
                            </button>
                            <Modal show={showJoinGroupModal} onHide={handleCloseJoinGroupModal}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Join Group</Modal.Title>
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
                                    </form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <button variant="secondary" onClick={handleCloseJoinGroupModal}>
                                        Cancel
                                    </button>
                                    <button variant="primary" onClick={handleJoinGroup}>
                                        Join
                                    </button>
                                </Modal.Footer>
                            </Modal>
                        </div>

                        {openSearchGroup && <SearchUser users = {groups} onClose={handleToggleShowSearchGroup} onUserClick={onUserClick} />}
                    </div>


                    <div className='col-12 custom-scrollbar' style={{height: 'calc(85vh - 55px)'}}>
                        <GroupListContainer>
                            {groups.length ===0 && users.length === 0 && (
                                <div className="text-center mt-4">
                                    <FiArrowUpLeft size={24} className="text-gray-500"/>
                                    <p className="text-gray-500 mt-2">Explore room to start</p>
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
                                        <UserSearchCard
                                            key={index}
                                            user={group}
                                            onUserClick={() => onUserClick(group)}
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
                                    <div className="user-avatar">
                                        {preview ? (
                                            <img
                                                src={preview}
                                                alt="Avatar Preview"
                                                className="rounded-circle"
                                                style={{width: '80px', height: '80px'}}
                                            />
                                        ) : avatarUrl ? (
                                            <img
                                                src={avatarUrl}
                                                alt="Profile"
                                                className="rounded-circle"
                                                style={{width: '80px', height: '80px'}}
                                            />
                                        ) : (
                                            <FaUserCircle size={80} className="rounded-circle"/>
                                        )}
                                    </div>
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
                                    className="block w-full p-2 border border-gray-300 rounded-md text-center"
                                    placeholder="Enter your name"
                                />
                            </div>

                            {/*<div className="my-4">*/}
                            {/*    <input*/}
                            {/*        id="phone"*/}
                            {/*        type="text"*/}
                            {/*        value={phone}*/}
                            {/*        onChange={(e) => setPhone(e.target.value)}*/}
                            {/*        className="block w-full p-2 border border-gray-300 rounded-md text-center"*/}
                            {/*        placeholder="Enter your phone number"*/}
                            {/*    />*/}
                            {/*</div>*/}
                            {/*<div className="my-4">*/}
                            {/*    <select*/}
                            {/*        id="gender"*/}
                            {/*        value={gender}*/}
                            {/*        onChange={(e) => setGender(e.target.value)}*/}
                            {/*        className="block w-full p-2 border border-gray-300 rounded-md text-center"*/}
                            {/*    >*/}
                            {/*        <option value="">Select gender</option>*/}
                            {/*        <option value="male">Male</option>*/}
                            {/*        <option value="female">Female</option>*/}
                            {/*        <option value="other">Other</option>*/}
                            {/*    </select>*/}
                            {/*</div>*/}
                            {/*<div className="my-4">*/}
                            {/*    <input*/}
                            {/*        id="birthdate"*/}
                            {/*        type="date"*/}
                            {/*        value={birthdate}*/}
                            {/*        onChange={(e) => setBirthdate(e.target.value)}*/}
                            {/*        className="block w-full p-2 border border-gray-300 rounded-md text-center"*/}
                            {/*        placeholder="Enter your birthdate"*/}
                            {/*    />*/}
                            {/*</div>*/}

                            <div style={{ textAlign: 'right' }}>
                                <button
                                    type="submit"
                                    className="mt-4 px-4 py-2 bg-blue-500 text-secondary rounded hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            }

        </div>
    );
};

export default Sidebar;
