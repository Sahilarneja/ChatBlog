import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Logo from '../assets/logo.jpg';

const Contacts = ({ contacts, currentUser, changeChat }) => {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    if (currentUser) {
      setCurrentUserImage(currentUser.avatarImage);
      setCurrentUserName(currentUser.username);
    }
  }, [currentUser]);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  const createSVGMarkup = (svgString) => {
    return { __html: svgString };
  };

  return (
    <>
      {currentUserImage && currentUserName && (
        <Container>
          <Brand>
            <img src={Logo} alt="Logo" />
            <h1>Instachat</h1>
          </Brand>
          <ContactsList>
            {contacts.map((contact, index) => (
              <Contact
                key={index}
                className={index === currentSelected ? 'selected' : ''}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <Avatar>
                  <div dangerouslySetInnerHTML={createSVGMarkup(contact.avatarImage)} />
                </Avatar>
                <Username>
                  <h3>{contact.username}</h3>
                </Username>
              </Contact>
            ))}
          </ContactsList>
          <CurrentUser>
            <Avatar>
              <div dangerouslySetInnerHTML={createSVGMarkup(currentUserImage)} />
            </Avatar>
            <Username>
              <h3>{currentUserName}</h3>
            </Username>
          </CurrentUser>
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100%;
  background-color: #080420;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  img {
    height: 2rem;
  }
  h1 {
    color: white;
    text-transform: uppercase;
  }
`;

const ContactsList = styled.div`
  overflow-y: auto;
  padding: 0 1rem;
  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-track {
    background: #0d0d30;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #9a86f3;
    border-radius: 10px;
    border: 2px solid #0d0d30;
  }
`;

const Contact = styled.div`
  background-color: #ffffff39;
  min-height: 5rem;
  cursor: pointer;
  border-radius: 0.2rem;
  padding: 0.4rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  transition: 0.5s ease-in-out;
  margin-bottom: 0.8rem;
  &:last-child {
    margin-bottom: 0;
  }
  &.selected {
    background-color: #9a86f3;
  }
`;

const Avatar = styled.div`
  width: 3rem;
  height: 3rem;
  div {
    width: 100%;
    height: 100%;
    svg {
      width: 100%;
      height: 100%;
    }
  }
`;

const Username = styled.div`
  flex: 1;
  h3 {
    color: white;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const CurrentUser = styled.div`
  background-color: #0d0d30;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
`;

export default Contacts;
