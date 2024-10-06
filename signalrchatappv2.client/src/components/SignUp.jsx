import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserStateContext } from '../services/UserState';
import './SignUp.css';

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { signup } = useContext(UserStateContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signup(email, username, password);
      if (response.ok) {
        navigate("/login");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Registration failed");
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <div className="container">
        <div>
          <input
            type="text"
            placeholder="Användarnamn"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSubmit}>Registrera</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="login-link" onClick={() => navigate("/login")}>
            Har du redan ett konto? Logga in här
          </div>
        </div>
      </div>
    </>
  );

};

export default SignUp;