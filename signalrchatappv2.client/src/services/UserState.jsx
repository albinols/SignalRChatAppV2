import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const UserStateContext = createContext();

const UserState = ({ children }) => {
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  const login = async (userName, password) => {
    const response = await fetch("https://localhost:7128/api/Auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, password }),
    });

    if (response.ok) {
      const data = await response.json();
      const token = data.token;

      sessionStorage.setItem("jwtToken", token);

      setUser(userName);
      navigate("/chat");
      return true;
    } else {
      console.error("Login failed with status:", response.status);
      return false;
    }
  };

  const signup = async (email, userName, password) => {
    const response = await fetch("https://localhost:7128/api/Auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, userName, password }),
    });

    if (response.ok) {
      navigate("/login");
    }
  };

  return (
    <UserStateContext.Provider value={{ user, login, signup }}>
      {children}
    </UserStateContext.Provider>
  );
};

export default UserState;