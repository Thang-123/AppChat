import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from './chatSlice';
import { useNavigate, Link } from 'react-router-dom';
import WebSocketService from '../webSocketService';

const RegisterPage = () => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        WebSocketService.registerCallback('REGISTER', (data) =>{
            console.log('Register Response:' +data)
            handleServerResponse(data)
        });

        return () => {
            // WebSocketService.close();
        };
    }, []);

    const handleServerResponse = (data) => {
        if (!data) {
            console.error('Invalid response data received');
            setFeedbackMessage('Unexpected response from server');
            return;
        }

        if (data.status === 'success') {
            dispatch(registerUser({ user: username }));
            navigate('/login');
        } else {
            const errorMessage = data.message || 'Registration failed';
            setFeedbackMessage(errorMessage);
        }
    };


    const handleRegister = () => {
        WebSocketService.sendMessage({
            action: 'onchat',
            data: {
                event: 'REGISTER',
                data: {
                    user: username,
                    pass: password
                }
            }
        });
    };

    return (
        <div className="container">
            <div className="card-body">
                <div className="sign-up">
                    <h2 className="title-text">Sign Up</h2>
                    <p className="text-text">Create your account</p>
                </div>

                <div className="form-input">
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Username"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="form-input">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="button" onClick={handleRegister} className="btn btn-primary w-100">Register</button>

                {feedbackMessage && (
                    <div className="alert alert-danger" role="alert">
                        {feedbackMessage}
                    </div>
                )}


                <p className="text-center">Already have an account? <Link to="/login" className="text-primary">Sign In</Link></p>
            </div>
        </div>
    );
};

export default RegisterPage;
