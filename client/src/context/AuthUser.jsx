import React, { createContext, useContext } from "react";
import { fetchUser } from "../services/route";

const AuthUserContext = createContext();

export const AuthUserProvider = ({ children }) => {

  const getAuthUser = async () => {

    const key = localStorage.getItem('authkey');

    const response = await fetchUser();

    console.log("API response:", response);

    const user = response?.data.find((u) => u.email === key);

    console.log("Matched user:", user);
    // console.log(key);
    return user;
  };

  return (
    <AuthUserContext.Provider value={{ getAuthUser }}>
      {children}
    </AuthUserContext.Provider>
  );
};

export const useUser = () => useContext(AuthUserContext);