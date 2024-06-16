import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { allUsersRoutes } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';

const Chat = () => {
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
          // Handle error (e.g., navigate to an error page)
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
      <div className='container'>
        <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
        <Welcome currentUser={currentUser} />
      </div>
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

  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;

    @media screen and (min-width: 720px) and (max-width: 1024px) {
      grid-template-columns: 35% 65%;
    }
  }
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
