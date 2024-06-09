import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { allUsersRoutes } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';

const Chat = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      } else {
        setCurrentUser(JSON.parse(localStorage.getItem("chat-app-user")));
      }
    };
    fetchCurrentUser();
  }, [navigate]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const { data } = await axios.get(`${allUsersRoutes}/${currentUser._id}`);
          setContacts(data);
        } else {
          navigate("/setAvatar");
        }
      }
    };
    fetchContacts();
  }, [currentUser, navigate]);

  return (
    <Container>
      <div className='container'>
        <Contacts contacts={contacts} />
      </div>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw; /* Corrected to vw */
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;

  .container {
    height: 85vh;
    width: 85vw; /* Corrected to vw */
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    
    @media screen and (min-width: 720px) and (max-width: 1024px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat;
