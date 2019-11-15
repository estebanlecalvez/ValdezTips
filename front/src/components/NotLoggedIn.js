import React from "react";
import Login from "./Login";
import Register from "./Register";
class NotLoggedIn extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { isLoginForm } = this.props;
        return (
            <React.Fragment>
                {
                    isLoginForm ?
                        <Login />
                        :
                        <Register />
                }
            </React.Fragment>

        );
    }

}

export default NotLoggedIn;