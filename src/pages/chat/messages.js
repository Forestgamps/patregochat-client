import styles from './styles.module.css';
import { useState, useEffect } from 'react';

const Messages = ({ socket }) => {
  const [messagesRecieved, setMessagesReceived] = useState([]);

  // Runs whenever a socket event is recieved from the server
  useEffect(() => {
    socket.on('receive_message', (data) => {
      console.log(data);
      setMessagesReceived((state) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          __createdtime__: data.__createdtime__,
          profilePicture: data.profilePicture,
        },
      ]);
    });

    socket.on('previous_messages', (messages) => {
      setMessagesReceived(messages);
    });
	// Remove event listener on component unmount
    return () => socket.off('receive_message');
  }, [socket]);

  // dd/mm/yyyy, hh:mm:ss
  function formatDateFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  return (
    <div className={styles.messagesColumn}>
      {messagesRecieved.map((msg, i) => (
        <div className={msg.username === localStorage.username ? styles.urMessage : styles.message} key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className={styles.msgMeta}>{msg.username}</span>
            <span className={styles.msgMeta}>
              {formatDateFromTimestamp(msg.__createdtime__)}
            </span>
            
            
  <div style={{
    width: '100px', // Замените значение на требуемую ширину
    height: '100px', // Замените значение на требуемую высоту
    borderRadius: '50%', // Делает изображение круглым
    overflow: 'hidden' // Обрезает изображение по границам круга
  }}>
    <img src={`https://patregochat-server.onrender.com${msg.profilePicture}`} alt="Profile" style={{
      width: '100%', 
      height: '100%',
      objectFit: 'cover' // Подгоняет изображение под размер контейнера
    }} />
  </div>




          </div>
          <p className={styles.msgText}>{msg.message}</p>
          <br />
        </div>
      ))}
    </div>
  );
};

export default Messages;