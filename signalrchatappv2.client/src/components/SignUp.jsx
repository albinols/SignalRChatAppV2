import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppStateContext } from '../services/StateProvider';
import { signUpUser } from '../services/AuthService';
import './SignUp.css';

const SignUp = () => {
  // Local states for form input
  const [emailInput, setEmailInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Access state variables from the context
  const { setUser, setUsername } = useContext(AppStateContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call signUpUser API logic from AuthService
    const response = await signUpUser(emailInput, usernameInput, passwordInput);
    if (response.ok) {
      navigate("/login");
    } else {
      const errorData = await response.json();
      setErrorMessage(errorData.message || "Registration failed");
    }
  };

  return (
    <div className="container">
      <div>
        <input
          type="text"
          placeholder="Username"
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
        />
        <button onClick={handleSubmit}>Sign Up</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default SignUp;