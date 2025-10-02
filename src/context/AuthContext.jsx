// // /context/AuthContext.jsx
// import React, { createContext, useContext, useState } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null); // { role: 'admin' | 'doctor', name: '' }

//   const login = (role, userData) => {
//     setUser({ role, ...userData });
//   };

//   const logout = () => {
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { role: 'admin' | 'doctor', name: '' }

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Failed to load user from localStorage");
        localStorage.removeItem("currentUser");
      }
    }
  }, []);

  const login = (role, userData) => {
    const fullUser = { role, ...userData };
    setUser(fullUser);
    localStorage.setItem("currentUser", JSON.stringify(fullUser)); // Persist full user (incl. image)
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);