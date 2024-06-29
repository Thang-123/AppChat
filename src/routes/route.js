import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import Chat from "../component/Chat";
import * as PropTypes from "prop-types";
import { useSelector } from "react-redux";

class AuthLayouts extends React.Component {
    render() {
        return <div className="auth-layout">{this.props.children}</div>;
    }
}

AuthLayouts.propTypes = { children: PropTypes.node };

const Router = () => {
    const { loggedIn } = useSelector((state) => state.chat);

    const routes = createBrowserRouter([
        {
            path: "/",
            element: <App />,
            children: [
                {
                    path: "register",
                    element: <RegisterPage />
                },{
                    path: "login",
                    element:  loggedIn ? <Chat /> : <LoginPage />
                },{
                    path: "chat",
                    // element: loggedIn ? <AuthLayouts><ChatPage /></AuthLayouts> : <AuthLayouts><LoginPage /></AuthLayouts>
                    element:  loggedIn ? <Chat /> : <LoginPage />
                },
                {
                    path: "",
                    element: loggedIn ? <Chat /> : <LoginPage />,
                }
            ]
        }
    ]);

    return <RouterProvider router={routes} />;
};

export default Router;
