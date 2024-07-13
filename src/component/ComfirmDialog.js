import React from 'react';
import styled from 'styled-components';

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const DialogContainer = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  width: 400px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
`;

const DialogTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
`;

const DialogMessage = styled.p`
  font-size: 1rem;
  margin-bottom: 2rem;
  color: #555;
`;

const DialogButtons = styled.div`
  display: flex;
  justify-content: space-around;
`;

const DialogButton = styled.button`
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:first-child {
    background-color: #ff4d4d;
    color: white;

    &:hover {
      background-color: #ff1a1a;
    }
  }

  &:last-child {
    background-color: #ccc;
    color: #333;

    &:hover {
      background-color: #999;
    }
  }
`;

const ConfirmationDialog = ({ message, onConfirm, onCancel }) => {
    return (
        <DialogOverlay>
            <DialogContainer>
                <DialogMessage>{message}</DialogMessage>
                <DialogButtons>
                    <DialogButton onClick={onConfirm}>Yes</DialogButton>
                    <DialogButton onClick={onCancel}>No</DialogButton>
                </DialogButtons>
            </DialogContainer>
        </DialogOverlay>
    );
};

export default ConfirmationDialog;
