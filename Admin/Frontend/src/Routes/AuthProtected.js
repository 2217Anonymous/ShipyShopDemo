import React, { useEffect } from "react";
import { Navigate, Route, useNavigate } from "react-router-dom";
import { setAuthorization } from "../helpers/api_helper";
import { useDispatch, useSelector } from "react-redux";
import { useProfile } from "../Components/Hooks/UserHooks";
import { logout } from "../slices/auth/login/reducer";

const AuthProtected = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userProfile, loading, token } = useProfile();
  // const { role } = useSelector(state => state.auth)
  
  useEffect(() => {
    if (userProfile && !loading && token) {
      setAuthorization(token);
    } 
    // else if (!userProfile && loading && !token) {
    //   dispatch(logout({navigate,role}))
    // }
  }, [token, userProfile, loading, dispatch]);

  /*
    Navigate is un-auth access protected routes via url
    */

  if (!userProfile && loading && !token) {
    return (
      <Navigate to={{ pathname: "/admin-login", state: { from: props.location } }} />
    );
  }

  return <>{props.children}</>;
};

const AccessRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        return (<> <Component {...props} /> </>);
      }}
    />
  );
};

export { AuthProtected, AccessRoute };