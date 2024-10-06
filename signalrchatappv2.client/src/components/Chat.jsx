import React, { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import DOMPurify from 'dompurify';
import './Chat.css';

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const connectionRef = useRef(null);
  const [username, setUsername] = useState(null);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");

    if (token && !connectionRef.current) {
      const decodedJwt = JSON.parse(atob(token.split(".")[1]));
      setUsername(decodedJwt.unique_name);
      setAuthorized(true);

      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7128/chathub", { accessTokenFactory: () => token })
        .withAutomaticReconnect()
        .build();

      connectionRef.current = newConnection;

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
  }, []);

  const sendMessage = async () => {
    if (connectionRef.current && message.trim()) {
      try {
        await connectionRef.current.send("SendMessage", message);
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
    if (connectionRef.current) {
      connectionRef.current
        .stop()
        .then(() => {
          sessionStorage.removeItem("jwtToken");
          window.location.href = "/login";
        })
        .catch((err) => console.error("Error while stopping connection:", err));
    }
  };

  if (!authorized) {
    return (
      <div>
        <p>You are not authorized! ⛔</p>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="header">
        <h2>Welcome, {username}</h2>
        <button onClick={logOut}>Log out</button>
      </div>
  
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.user}:</strong> {msg.message}
          </div>
        ))}
      </div>
  
      <div className="message-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} disabled={!message.trim()}>
          Send
        </button>
      </div>
    </div>
  );

};

export default Chat;