import React, { useEffect } from 'react';
import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';

const Home = ({ username, setUsername, room, setRoom, socket }) => {
  const navigate = useNavigate();

  useEffect(() => {
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
      <div className={styles.formContainer}>
        <h1>{`Чат рабочей организации`}</h1>
        <input
          className={styles.input}
          type="text"
          placeholder="Username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <select
          className={styles.input}
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        >
          <option value="">-- Select Room --</option>
          <option value="Чат 1">Чат 1</option>
          <option value="Чат 2">Чат 2</option>
          <option value="Чат 3">Чат 3</option>
          <option value="Чат 4">Чат 4</option>
        </select>
        <button
          className="btn btn-secondary"
          style={{ width: '100%' }}
          onClick={joinRoom}
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default Home;
