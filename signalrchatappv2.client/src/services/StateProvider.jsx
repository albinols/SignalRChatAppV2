import React, { createContext, useState } from 'react';

// Create the context
export const AppStateContext = createContext();

// StateProvider that holds all the state variables
const StateProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [connection, setConnection] = useState(null);
  const [username, setUsername] = useState("");
  const [authorized, setAuthorized] = useState(false);

  // Provide all the state variables and setters to the components
  return (
    <AppStateContext.Provider
      value={{
        user,
        setUser,
        messages,
        setMessages,
        message,
        setMessage,
        connection,
        setConnection,
        username,
        setUsername,
        authorized,
        setAuthorized,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export default StateProvider;