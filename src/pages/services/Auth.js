import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Auth() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null);
    const [profilePicture, setProfilePicture] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('https://patregochat-server.onrender.com/me', {
                headers: { Authorization: token }
            }).then(response => {
                setUsername(response.data.username);
                setProfilePicture(response.data.profilePicture);
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
    };

//     return (
//         <div>
//             <h1>Auth</h1>
//             <input
//                 type="text"
//                 placeholder="Username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//             />
//             <input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//             />
//             <button onClick={handleRegister}>Register</button>
//             <button onClick={handleLogin}>Login</button>
//             <p>{message}</p>

//             {profilePicture && 
//   <div style={{
//     width: '100px', // Замените значение на требуемую ширину
//     height: '100px', // Замените значение на требуемую высоту
//     borderRadius: '50%', // Делает изображение круглым
//     overflow: 'hidden' // Обрезает изображение по границам круга
//   }}>
//     <img src={`http://localhost:4000${profilePicture}`} alt="Profile" style={{
//       width: '100%', 
//       height: '100%',
//       objectFit: 'cover' // Подгоняет изображение под размер контейнера
//     }} />
//   </div>
// }

//             <input
//                 type="file"
//                 name="image"
//                 onChange={(e) => setImage(e.target.files[0])}
//             />
//             <button onClick={handleUpload}>Upload</button>
//         </div>
//     );

if (localStorage.getItem('token')) {
    return (
        <div>
            <h1>Welcome, {username}</h1>
            {profilePicture && <img src={`https://patregochat-server.onrender.com${profilePicture}`} alt="Profile" />}
            <button onClick={logout}>Logout</button>
            <p>{message}</p>
            <input
                type="file"
                name="image"
                onChange={(e) => setImage(e.target.files[0])}
            />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
} else {
    return (
        <div>
            <h1>Auth</h1>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleRegister}>Register</button>
            <button onClick={handleLogin}>Login</button>
            <p>{message}</p>
        </div>
    );
}
}
export default Auth;
