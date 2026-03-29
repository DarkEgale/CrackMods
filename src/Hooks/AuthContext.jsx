import { useState, useContext, createContext, useEffect } from "react";
import { userLogin } from '../API/loginAPI.js';
import { registerUser } from "../API/registerAPI.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  

  const login = async (credentials) => {
    try {
      const data = await userLogin(credentials);
      if (data?.user) {
        setUser(data.user);
        return { success: true,user:data.user };
        console.log(data.user)
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const data = await registerUser(userData);
      if (data?.user) {
        setUser(data.user);
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
    } catch (err) {
      console.error("Logout failed");
    }
  };

  const authInfo = { user, loading, login, register, logout };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);