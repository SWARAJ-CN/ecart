import {  createContext, useContext } from "react";
import toast from "react-hot-toast";
import { fetchUser } from "../services/route";



const UsersContext = createContext();

export const UserProvider = ({children}) => {

  const getAllUsers = async () => {

    try{
        const response = await fetchUser()
        return response.data;
         console.log('log from fetch user context',response.data);
    }catch(error){
        console.log(error);
    }
  };

  return (
    <UsersContext.Provider value={{getAllUsers}}>
        {children}
    </UsersContext.Provider>
  )
}

export const useUsers = () => useContext(UsersContext) 