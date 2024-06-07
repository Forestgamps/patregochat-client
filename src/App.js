import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';
import Home from './pages/home';
import Chat from './pages/chat';
import Auth from './pages/services/Auth';
import axios from 'axios';

const socket = io.connect('https://patregochat-server.onrender.com');

function App() {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [room, setRoom] = useState('');
  const [user, setUser] = useState(null);
//http://localhost:4000/me
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('https://patregochat-server.onrender.com/me', {
            headers: {
              'Authorization': token
            }
          });
          setUser(response.data);
        } catch (err) {
          console.error('Error fetching user:', err);
        }
      }
    };
    fetchUser();
  }, []);

  return (
    <Router>
      <div className='App'>
        <header className="App-header">
          {user ? (
            <div>
              <h1>Room "{room}"</h1>
            </div>
          ) : (
            <div>
              <a href='/reg'>Регистрация</a>
              <p>Please log in</p>
            </div>
          )}
        </header>
        <Routes>
          <Route
            path='/'
            element={
              <Home
                username={user ? user.username : username}
                setUsername={setUsername}
                room={room}
                setRoom={setRoom}
                socket={socket}
              />
            }
          />
          <Route
          
            path='/chat'
            element={<Chat username={localStorage.getItem('username')} room={room} socket={socket} profilePicture = {localStorage.getItem('profilePicture')}/>}
          />
          <Route
            path='/reg'
            element={<Auth />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
