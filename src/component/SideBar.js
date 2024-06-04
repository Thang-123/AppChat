import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { IoChatbubbleEllipses } from 'react-icons/io5';
import { FaUserPlus, FaImage, FaVideo } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';
import { FiArrowUpLeft } from 'react-icons/fi';
import Avatar from './Avatar';

const Sidebar = () => {

    const [editUserOpen,setEditUserOpen] = useState(false)
    const [allUser,setAllUser] = useState([])
    const [openSearchUser,setOpenSearchUser] = useState(false)

    function handleLogout() {

    }

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-3 bg-slate-100 rounded-start rounded-bottom py-5 text-slate-600 d-flex flex-column justify-content-between'>
                    <div>
                        <NavLink to="/" className='nav-link w-100 h-12 flex justify-center items-center cursor-pointer hover-bg-slate-200 rounded' title='Chat'>
                            <IoChatbubbleEllipses size={20}/>
                        </NavLink>
                        <div className='w-100 h-12 flex justify-center items-center cursor-pointer hover-bg-slate-200 rounded' title='Add Friend' onClick={() => setOpenSearchUser(true)}>
                            <FaUserPlus size={20}/>
                        </div>
                    </div>
                    <div className='d-flex flex-column align-items-center'>
                        {/*<button className='mx-auto' title={user?.name} onClick={() => setEditUserOpen(true)}>*/}
                            {/*<Avatar width={40} height={40} name={user?.name} imageUrl={user?.profile_pic} userId={user?._id}/>*/}
                        {/*</button>*/}
                        <button title='Logout' className='w-100 h-12 flex justify-center items-center cursor-pointer hover-bg-slate-200 rounded' onClick={handleLogout}>
                            <BiLogOut size={20}/>
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
                            {allUser.length === 0 && (
                                <div className='mt-12 text-center'>
                                    <div className='flex justify-center items-center my-4 text-slate-500'>
                                        <FiArrowUpLeft size={50}/>
                                    </div>
                                    <p className='text-lg text-slate-400'>Explore users to start a conversation with.</p>
                                </div>
                            )}

                            {/*{allUser.map((conv, index) => (*/}
                            {/*    <NavLink to={"/" + conv?.userDetails?._id} key={conv?._id} className='nav-link flex align-items-center gap-2 py-3 px-2 border hover-border-primary rounded hover-bg-slate-100 cursor-pointer'>*/}
                            {/*        <div>*/}
                            {/*            <Avatar imageUrl={conv?.userDetails?.profile_pic} name={conv?.userDetails?.name} width={40} height={40}/>*/}
                            {/*        </div>*/}
                            {/*        <div>*/}
                            {/*            <h3 className='text-truncate font-semibold text-base'>{conv?.userDetails?.name}</h3>*/}
                            {/*            <div className='text-slate-500 text-xs d-flex align-items-center gap-1'>*/}
                            {/*                <div className='d-flex align-items-center gap-1'>*/}
                            {/*                    {conv?.lastMsg?.imageUrl && (*/}
                            {/*                        <div className='d-flex align-items-center gap-1'>*/}
                            {/*                            <span><FaImage/></span>*/}
                            {/*                            {!conv?.lastMsg?.text && <span>Image</span>}*/}
                            {/*                        </div>*/}
                            {/*                    )}*/}
                            {/*                    {conv?.lastMsg?.videoUrl && (*/}
                            {/*                        <div className='d-flex align-items-center gap-1'>*/}
                            {/*                            <span><FaVideo/></span>*/}
                            {/*                            {!conv?.lastMsg?.text && <span>Video</span>}*/}
                            {/*                        </div>*/}
                            {/*                    )}*/}
                            {/*                </div>*/}
                            {/*                <p className='text-truncate'>{conv?.lastMsg?.text}</p>*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*        {Boolean(conv?.unseenMsg) && (*/}
                            {/*            <p className='text-xs w-6 h-6 d-flex justify-content-center align-items-center ml-auto p-1 bg-primary text-white font-semibold rounded-full'>{conv?.unseenMsg}</p>*/}
                            {/*        )}*/}
                            {/*    </NavLink>*/}
                            {/*))}*/}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit user details */}
            {/*{editUserOpen && <EditUserDetails onClose={() => setEditUserOpen(false)} user={user}/>}*/}

            {/* Search user */}
            {/*{openSearchUser && <SearchUser onClose={() => setOpenSearchUser(false)}/>}*/}
        </div>
    );
};

export default Sidebar;
