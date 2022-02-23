import React from "react";
import { getAuthenticationStatus } from "../src/Redux/auth-service";
import { Route, Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import {PROFILE_URL} from './Redux/actions/type';

const PrivateRoute = ({ component: Component, ...rest }) => {
 
  // store profile id for visit other user profile
  const dispatch = useDispatch();
  const path = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/") + 1);
  if(getAuthenticationStatus() !== true && path === '/userProfile/')
  {
    dispatch({ type: PROFILE_URL, data: window.location.pathname });
  }
 
  return (
    <Route
      {...rest}
      render={(props) =>
       
        getAuthenticationStatus() ? (
          
          <Component {...props} />
        ) : (
          <Redirect
          to={{
            pathname: "/",
          }}
        />
        )
      }
    />

  );
};

export default PrivateRoute;