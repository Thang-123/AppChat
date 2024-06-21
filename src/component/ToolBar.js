import React from 'react';

import { IoChatbubbleEllipses } from 'react-icons/io5';
import { FaUserPlus } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';

import styled, { css } from 'styled-components';

const StyledToolbar = styled.div`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: -3.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    opacity: ${(props) => (props.show ? '1' : '0')};
    transition: opacity 0.3s ease;

    ${(props) =>
            !props.show &&
            css`
            opacity: 0;
        `}
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
            props.active &&
            `
        background-color: #a3bffa;
    `}
`;

const Toolbar = ({ show, activeIcon, handleIconClick, onLogout }) => {
    return (
        <StyledToolbar className={`toolbar ${show ? 'active' : ''}`} show={show}>
            <StyledIcon
                onClick={() => handleIconClick('chat')}
                active={activeIcon === 'chat'}
                title='Chat'
            >
                <IoChatbubbleEllipses className='text-gray-600' size={20} />
            </StyledIcon>
            <StyledIcon
                onClick={() => handleIconClick('addFriend')}
                active={activeIcon === 'addFriend'}
                title='Add Friend'
            >
                <FaUserPlus className='text-gray-600' size={20} />
            </StyledIcon>
            <StyledIcon>
                <div className='d-flex flex-column align-items-center'>
                    <button
                        title='Logout'
                        className='w-100 h-12 flex justify-center items-center cursor-pointer hover-bg-slate-200 rounded'
                        onClick={onLogout}
                    >
                        <BiLogOut size={30} />
                    </button>
                </div>
            </StyledIcon>
        </StyledToolbar>
    );
};

export default Toolbar;
