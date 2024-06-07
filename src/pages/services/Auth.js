import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';

function Auth() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null);
    const [profilePicture, setProfilePicture] = useState('');
    const [roomName, setRoomName] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('https://patregochat-server.onrender.com/me', {
                headers: { Authorization: token }
            }).then(response => {
                setUsername(response.data.username);
                setProfilePicture(response.data.profilePicture);
                setRole(response.data.roles);
            }).catch(err => {
                console.log('Error fetching user data', err);
            });
        }
    }, []);

    const handleRegister = async () => {
        try {
            await axios.post('https://patregochat-server.onrender.com/register', { username, password });
            setMessage('User registered successfully');
        } catch (err) {
            setMessage('Error registering user');
        }
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('https://patregochat-server.onrender.com/login', { username, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', username);
            setMessage('User logged in successfully');
        } catch (err) {
            setMessage('Invalid username or password');
        }
    };

    const handleUpload = async () => {
        if (!image) {
            setMessage('Please select an image to upload');
            return;
        }

        const formData = new FormData();
        formData.append('image', image);

        const token = localStorage.getItem('token');
        try {
            await axios.post('https://patregochat-server.onrender.com/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': token
                },
            });
            setMessage('Image uploaded successfully');
            setProfilePicture(profilePicture);
            localStorage.setItem('profilePicture', profilePicture);
        } catch (err) {
            setMessage('Error uploading image');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setUsername('');
        setProfilePicture('');
        setRole('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          await axios.post('https://patregochat-server.onrender.com/rooms', { name: roomName });
          navigate('/');
        } catch (err) {
          console.error('Error adding room:', err);
        }
      };

    if (localStorage.getItem('token')) {
        return (
            <div className={styles.container}>
                <h1>Добро пожаловать, {username}!</h1>
                {profilePicture && <img src={`https://patregochat-server.onrender.com${profilePicture}`} alt="Profile" className={styles.profilePicture} />}
                <button onClick={logout} className={styles.button}>Выйти</button>
                <p className={styles.message}>{message}</p>
                <input
                    type="file"
                    name="image"
                    onChange={(e) => setImage(e.target.files[0])}
                    className={styles.input}
                />
                {role === 'Admin' ? (
                <form onSubmit={handleSubmit}>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Название комнаты"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        required
                    />
                    <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>
                        Add Room
                    </button>
                </form>
                ) : (<div></div>)}
                <button onClick={handleUpload} className={styles.button}>Загрузить картинку</button>
            </div>
            
        );
    } else {
        return (
            <div className={styles.container}>
                <h1>Авторизация</h1>
                <input
                    type="text"
                    placeholder="Логин"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.input}
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                />
                <button onClick={handleRegister} className={styles.button}>Зарегистрироваться</button>
                <button onClick={handleLogin} className={styles.button}>Войти</button>
                <p className={styles.message}>{message}</p>
                
            </div>
            
        );
    }
}

export default Auth;
