import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppStateContext } from '../services/StateProvider';
import { loginUser } from '../services/AuthService';
import './Login.css';

const Login = () => {
  // Local state for form input
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Access state variables from the context
  const { setUser, setAuthorized, setUsername } = useContext(AppStateContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Call loginUser API logic from AuthService
    const response = await loginUser(usernameInput, passwordInput);
    if (response.ok) {
      const data = await response.json();
      const token = data.token;
      sessionStorage.setItem("jwtToken", token);

      // Update central state
      setUser({ username: usernameInput });
      setUsername(usernameInput);
      setAuthorized(true);

      navigate("/chat");
    } else {
      setErrorMessage("Invalid username or password. Please try again.");
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
          type="password"
          placeholder="Password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Login;