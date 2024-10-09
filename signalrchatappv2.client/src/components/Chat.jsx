import React, { useContext, useEffect, useRef } from 'react';
import { AppStateContext } from '../services/StateProvider';
import * as signalR from '@microsoft/signalr';
import DOMPurify from 'dompurify';
import './Chat.css';

// Access state variables from the context
const Chat = () => {
  const {
    message,
    setMessage,
    messages,
    setMessages,
    connection,
    setConnection,
    username,
    setUsername,
    authorized,
    setAuthorized,
  } = useContext(AppStateContext); 

  const connectionRef = useRef(null);
  const chatWindowRef = useRef(null);

  // Function to generate differnet colors for usernames
  const getUsernameColor = (userName) => {
    let hash = 0;
    for (let i = 0; i < userName.length; i++) {
      hash = userName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 50%)`;
    return color;
  };

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");

    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }

    // Create conncection to the chathub
    if (token && !connectionRef.current) {
      const decodedJwt = JSON.parse(atob(token.split(".")[1]));
      setUsername(decodedJwt.unique_name);
      setAuthorized(true);

      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7128/chathub", { accessTokenFactory: () => token })
        .withAutomaticReconnect()
        .build();

      connectionRef.current = newConnection;
      setConnection(newConnection);

      newConnection
        .start()
        .then(() => {
          console.log("Connected to the hub.");

          newConnection.on("ReceiveMessage", (userName, message, timestamp) => {
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                user: userName,
                message: DOMPurify.sanitize(message, { ALLOWED_TAGS: ["b"] }),
                timestamp,
              },
            ]);
          });
        })
        .catch((err) => console.error("Connection error:", err));
    }

    return () => {
      if (connectionRef.current) {
        connectionRef.current
          .stop()
          .then(() => console.log("SignalR connection stopped"));
        connectionRef.current = null;
      }
    };
  }, [setMessages, setUsername, setAuthorized, setConnection]);

  const sendMessage = async () => {
    if (connection && message.trim()) {
      try {
        await connection.send("SendMessage", message);
        setMessage("");
      } catch (err) {
        console.error("Failed to send message:", err);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && message.trim()) {
      sendMessage();
    }
  };

  const logOut = () => {
    if (connection) {
      connection.stop().then(() => {
        sessionStorage.removeItem("jwtToken");
        window.location.href = "/login";
      });
    }
  };

  if (!authorized) {
    return <p>You are not authorized! ⛔</p>;
  }

  return (
    <div className="chat-container">
      <div className="header">
        <div className="header-message">Welcome {username}</div>
        <button onClick={logOut}>Log out</button>
      </div>

      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <span className="username" style={{ color: getUsernameColor(msg.user) }}>
              {msg.user}:
            </span>
            <span className="message-content">
              {msg.message}
            </span>
          </div>
        ))}
      </div>

      <div className="message-container">
        <input
          className='message-input'
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write message..."
        />
        <button onClick={sendMessage} disabled={!message.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;