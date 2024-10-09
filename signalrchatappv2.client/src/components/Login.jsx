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
      <div className='input-container'>
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
      </div>
      <div className='button-container'>
        <button onClick={handleLogin}>Sign in</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
      <div className='link-container'>
        <div className="register-link" onClick={() => navigate("/signup")}>
            No account? Sign up here
        </div>
      </div>
    </div>
  );
};

export default Login;