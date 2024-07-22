import React from 'react';
import styled from 'styled-components';
import Robot from "../assets/robo.webp";

const Welcome = ({ currentUser }) => {
    return (
      <Container>
        <RobotImage src={Robot} alt="robot" />
        <WelcomeMessage>
          Welcome, <span>{currentUser.username}</span>
        </WelcomeMessage>
        <SubMessage>Please select a chat to proceed</SubMessage>
      </Container>
    );
  };

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
`;

const RobotImage = styled.img`
  width: 200px; /* Adjust size as needed */
  height: auto;
  margin-bottom: 1rem;
`;

const WelcomeMessage = styled.h1`
  font-size: 2rem;
  color: #ffffff;
  text-align: center;
  span {
    font-weight: bold;
    color: #9a86f3; /* Adjust color to your preference */
  }
`;

const SubMessage = styled.h3`
  font-size: 1.5rem;
  color: #ffffff;
  text-align: center;
  margin-top: 0.5rem;
`;

export default Welcome;
