import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { allUsersRoutes, host } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import { io } from 'socket.io-client';

const Chat = () => {
  const socketRef = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = localStorage.getItem('chat-app-user');
        if (!user) {
          navigate('/login');
        } else {
          setCurrentUser(JSON.parse(user));
        }
      } catch (error) {
        console.error('Error fetching user from localStorage:', error);
        navigate('/login');
      }
    };
    fetchCurrentUser();
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      socketRef.current = io(host);
      socketRef.current.emit("add-user", currentUser._id);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [currentUser]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        try {
          if (currentUser.isAvatarImageSet) {
            const { data } = await axios.get(`${allUsersRoutes}/${currentUser._id}`);
            setContacts(data.users);
            setLoading(false);
          } else {
            navigate('/setAvatar');
          }
        } catch (error) {
          console.error('Error fetching contacts:', error);
        }
      }
    };
    fetchContacts();
  }, [currentUser, navigate]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  if (loading) {
    return <LoadingScreen>Loading...</LoadingScreen>;
  }

  return (
    <Container>
      <ContentContainer>
        <ContactsContainer>
          <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
        </ContactsContainer>
        <ChatArea>
          {currentChat === undefined ? (
            <Welcome currentUser={currentUser} />
          ) : (
            <ChatContainer currentUser={currentUser} currentChat={currentChat} socket={socketRef.current} />
          )}
        </ChatArea>
      </ContentContainer>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
`;

const ContentContainer = styled.div`
  height: 85vh;
  width: 85vw;
  background-color: #00000076;
  display: grid;
  grid-template-columns: 25% 75%;

  @media screen and (min-width: 720px) and (max-width: 1024px) {
    grid-template-columns: 35% 65%;
  }
`;

const ContactsContainer = styled.div`
  padding: 1rem;
`;

const ChatArea = styled.div`
  padding: 1rem;
`;

const LoadingScreen = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  color: #fff;
`;

export default Chat;
