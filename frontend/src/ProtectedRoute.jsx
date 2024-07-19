import React, { useContext } from "react";
import { Route } from "react-router-dom";

import NotFoundPage from "./pages/NotFoundPage";

import UserContext from "./UserContext";


 // Component representing a route which requires a user to be logged in to be accessed.

const ProtectedRoute = ({ component, exact, path, loggedOut, children }) => {
    const { currentUser } = useContext(UserContext);

    if (!!currentUser === !loggedOut)
        return <Route component={component} exact={exact} path={path}>{children}</Route>;
    
    return <NotFoundPage />;
};

ProtectedRoute.defaultProps = {
    exact: false
};

export default ProtectedRoute;