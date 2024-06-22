import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BiPowerOff } from 'react-icons/bi'; // Corrected import

function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <Button onClick={handleLogout}>
      <BiPowerOff />
    </Button>
  );
}

export default Logout;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background-color: #9a86f3;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  svg {
    color: #fff;
    font-size: 1.5rem;
  }
  &:hover {
    background-color: #9a899a;
  }
`;
