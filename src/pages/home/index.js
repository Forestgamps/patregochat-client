import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = ({ username, setUsername, room, setRoom, socket }) => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:4000/rooms');
        setRooms(response.data);
      } catch (err) {
        console.error('Error fetching rooms:', err);
      }
    };

    fetchRooms();

    const storedUsername = localStorage.getItem('username');
    const storedRoom = localStorage.getItem('room');
    if (storedUsername) setUsername(storedUsername);
    if (storedRoom) setRoom(storedRoom);
  }, [setUsername, setRoom]);

  const joinRoom = () => {
    if (room && username) {
      localStorage.setItem('username', username);
      localStorage.setItem('room', room);
      navigate('/chat', { replace: true });
    }
  };

  return (
    <div className={styles.container}>
      <h1>patregoCHAT ver. 1.27</h1>
      <div className={styles.formContainer}>
        <h1>{`Чат рабочей организации`}</h1>
        {/* <input
          className={styles.input}
          type="text"
          placeholder="Username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /> */}
        <select
          className={styles.input}
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        >
          <option value="">-- Выберите Чат --</option>
          {rooms.map((room) => (
            <option key={room._id} value={room.name}>
              {room.name}
            </option>
          ))}
        </select>
        <button
          className="btn btn-secondary"
          style={{ width: '100%' }}
          onClick={joinRoom}
        >
          Присоединиться
        </button>
      </div>
    </div>
  );
};

export default Home;
