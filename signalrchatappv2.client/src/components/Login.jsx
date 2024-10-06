import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserStateContext } from '../services/UserState';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useContext(UserStateContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      navigate("/chat");
    } else {
      setErrorMessage("Invalid username or password. Please try again.");
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
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Logga in</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="register-link" onClick={() => navigate("/signup")}>
            Har du inget konto? Registrera dig här
          </div>
        </div>
      </div>
    </>
  );

};

export default Login;