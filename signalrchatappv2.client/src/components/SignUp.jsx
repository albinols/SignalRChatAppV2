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

    // Form validation
    if (!emailInput || !usernameInput || !passwordInput) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

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
      <div className='signup-header'>
        Chatt App Sign Up
      </div>
      <div className='input-container'>
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
      </div>
      <div className='button-container'>
        <button onClick={handleSubmit}>Sign Up</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
      <div className='link-container'>
        <div className="register-link" onClick={() => navigate("/login")}>
            Already have an account? Sign in here
        </div>
      </div>
    </div>
  );
};

export default SignUp;