import React from "react";
import Login from "./Login";
class NotLoggedIn extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <Login />
            </React.Fragment>
        );
    }

}

export default NotLoggedIn;