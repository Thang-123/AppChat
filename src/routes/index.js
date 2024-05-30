import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import RegisterPage from "../pages/RegisterPage";

import Home from "../pages/Home";

import * as PropTypes from "prop-types";
import {Component} from "react";

class AuthLayouts extends Component {
    render() {
        return null;
    }
}

AuthLayouts.propTypes = {children: PropTypes.node};
const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children : [
            {
                path : "register",
                element : <AuthLayouts><RegisterPage/></AuthLayouts>
            },
            {
                path : 'email',
                // element : <AuthLayouts><CheckEmailPage/></AuthLayouts>
            },
            {
                path : 'password',
                // element : <AuthLayouts><CheckPasswordPage/></AuthLayouts>
            },
            {
                path : 'forgot-password',
                // element : <AuthLayouts><Forgotpassword/></AuthLayouts>
            },
            {
                path : "",
                element : <Home/>,
                children : [
                    {
                        path : ':userId',
                        // element : <MessagePage/>
                    }
                ]
            }
        ]
    }
])

export default router