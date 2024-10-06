import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import UserState from './services/UserState';
import './App.css';

function App() {
   
    return (
        <Router>
          <UserState>
            <Routes>
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<SignUp />} />
              <Route path='/chat' element={<Chat />} />
            </Routes>
          </UserState>
        </Router>
    );
}

export default App;