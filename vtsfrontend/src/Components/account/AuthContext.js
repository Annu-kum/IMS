import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ isAuthenticated: false, isSuperuser: false });

  useEffect(() => {
    const token = localStorage.getItem("Token");

    if (token) {
      axios.get("http://127.0.0.1:8000/accounts/whoiam/", {
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










