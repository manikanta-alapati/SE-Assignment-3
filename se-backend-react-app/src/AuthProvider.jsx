import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Auth = React.createContext({
  isLoggedIn: false,
  user: null,
  logout: () => {},
  login: async () => {},
  signUp: async () => {},
});

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("jwt_token")
  );
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const previousPath = location.state?.fromPath || "/";

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios({
          url: "/user/profile",
          baseURL: process.env.REACT_APP_BACKEND_DOMAIN,
          method: "get",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
          responseType: "json",
        });
        setUser(response.data);
      } catch (e) {}
    };
    if (isLoggedIn) {
      getUserInfo();
    } else {
      setUser(null);
    }
  }, [isLoggedIn]);

  const value = useMemo(
    () => ({
      isLoggedIn,
      user,
      login: async ({ email, password }) => {
        const response = await axios({
          url: "/users/login",
          baseURL: process.env.REACT_APP_BACKEND_DOMAIN,
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
          data: {
            email,
            password,
          },
          responseType: "json",
        });
        setIsLoggedIn(true);
        localStorage.setItem("jwt_token", response.data.jwt_token);
        navigate(previousPath, { replace: true });
      },
      logout: () => {
        setIsLoggedIn(false);
        localStorage.removeItem("jwt_token");
        navigate("/login", { replace: true });
      },
      signUp: async ({ name, email, password }) => {
        const response = await axios({
          url: "/users/signup",
          baseURL: process.env.REACT_APP_BACKEND_DOMAIN,
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
          data: {
            name,
            email,
            password,
          },
          responseType: "json",
        });
        setIsLoggedIn(true);
        localStorage.setItem("jwt_token", response.data.jwt_token);
        navigate(previousPath, { replace: true });
      },
    }),
    [isLoggedIn, navigate, previousPath, user]
  );

  return <Auth.Provider value={value}>{children}</Auth.Provider>;
};

export const useAuth = () => useContext(Auth);

export default AuthProvider;
