import styles from './styles.module.css';
import MessagesReceived from './messages';
import RoomAndUsersColumn from './room-and-users';
import SendMessage from './send-message';
import { useEffect } from 'react';

const Chat = ({ username, room, socket, profilePicture }) => {
  useEffect(() => {
    if (room && username) {
      console.log('Joining room:', room, 'as user:', username);
      socket.emit('join_room', { username, room, profilePicture });
    }
  }, [username, room, socket, profilePicture]);

  return (
    <div className={styles.chatContainer}>
      <RoomAndUsersColumn socket={socket} username={username} room={room} />
      <div>
        <MessagesReceived socket={socket} />
        <SendMessage socket={socket} username={username} room={room} profilePicture={profilePicture} />
      </div>
    </div>
  );
};

export default Chat;
