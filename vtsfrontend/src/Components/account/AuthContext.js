import React, { createContext, useContext, useEffect, useState } from "react";
import api from "./BaseApi";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ isAuthenticated: false, isSuperuser: false });

  useEffect(() => {
    const token = localStorage.getItem("Token");

    if (token) {
      api.get(`/accounts/whoiam/`, {
        headers: { Authorization: `Token ${token}` },
      }).then(res => {
        setAuth({
          isAuthenticated: true,
          isSuperuser: res.data.is_superuser,
        });
      }).catch(() => {
        setAuth({ isAuthenticated: false, isSuperuser: false });
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);






