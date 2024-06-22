import React, { useState } from 'react';
import styled from 'styled-components';
import Picker from '@emoji-mart/react';
import { IoMdSend } from 'react-icons/io';
import { BsEmojiSmileFill } from 'react-icons/bs';
import { BiX } from 'react-icons/bi';

function ChatInput({ handleSendMsg }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState('');

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emoji) => {
    setMsg((prevMsg) => prevMsg + emoji.native);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg('');
    }
  };

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && (
            <StyledPicker>
              <div className="emoji-picker-header">
                <BiX onClick={handleEmojiPickerhideShow} className="close-icon" />
              </div>
              <Picker onEmojiSelect={handleEmojiClick} theme="dark" />
            </StyledPicker>
          )}
        </div>
      </div>
      <form className="input-container" onSubmit={sendChat}>
        <input
          type="text"
          placeholder="Type a message..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

export default ChatInput;

const Container = styled.div`
  display: grid;
  grid-template-columns: 5% 95%;
  align-items: center;
  background-color: #080420;
  padding: 0 2rem;
  padding-bottom: 0.3rem;

  .button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    gap: 1rem;
    position: relative;

    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }
    }
  }

  .input-container {
    display: flex;
    align-items: center;
    width: 100%;
    background-color: #ffffff34;
    border-radius: 2rem;
    padding: 0.5rem 1rem;

    input {
      width: 90%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &:focus {
        outline: none;
      }
    }

    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      cursor: pointer;

      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`;

const StyledPicker = styled.div`
  position: absolute;
  top: -350px;
  background-color: #080420 !important;
  box-shadow: 0 5px 10px #9e9e9e !important;
  border-color: #080420 !important;
  z-index: 10;

  .emoji-picker-header {
    display: flex;
    justify-content: flex-end;
    padding: 0.5rem;
    background-color: #080420;
    
    .close-icon {
      font-size: 1.5rem;
      color: white;
      cursor: pointer;
    }
  }
`;
