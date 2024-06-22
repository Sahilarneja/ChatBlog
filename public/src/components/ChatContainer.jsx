import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logout from "./Logout";
import ChatInput from "../components/ChatInput";
import axios from "axios";
import { addMessageRoute, getAllMessageRoute } from "../utils/APIRoutes";

function ChatContainer({ currentChat, currentUser }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.post(getAllMessageRoute, {
          from: currentUser._id,
          to: currentChat._id,
        });
        setMessages(response.data.messages); // Assuming response.data has 'messages' array
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    if (currentChat) {
      fetchMessages();
    }
  }, [currentChat, currentUser._id]);

  const createSVGMarkup = (svgString) => ({ __html: svgString });

  const handleSendMsg = async (msg) => {
    try {
      const response = await axios.post(addMessageRoute, {
        from: currentUser._id,
        to: currentChat._id,
        message: msg,
      });
      console.log('Message sent successfully:', response.data);
      // Update messages state with new message if needed
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <>
      {currentChat && (
        <Container>
          <ChatHeader>
            <UserDetails>
              <Avatar>
                <AvatarImage dangerouslySetInnerHTML={createSVGMarkup(currentChat.avatarImage)} />
              </Avatar>
              <Username>{currentChat.username}</Username>
            </UserDetails>
            <Logout />
          </ChatHeader>
          <ChatMessages>
            {messages.map((message, index) => (
              <Message key={index} fromSelf={message.fromSelf}>
                <MessageContent>{message.message}</MessageContent>
              </Message>
            ))}
          </ChatMessages>
          <ChatInputContainer>
            <ChatInput handleSendMsg={handleSendMsg} />
          </ChatInputContainer>
        </Container>
      )}
    </>
  );
}

export default ChatContainer;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #131324;
  border-bottom: 1px solid #ddd;
`;

const UserDetails = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.div`
  margin-right: 1rem;
`;

const AvatarImage = styled.div`
  width: 40px;
  height: 40px;
  svg {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`;

const Username = styled.h3`
  color: white;
  margin: 0;
`;

const ChatMessages = styled.div`
  flex-grow: 1;
  padding: 1rem;
  background-color: #131324;
  overflow-y: auto;
  color: white;
`;

const Message = styled.div`
  display: flex;
  justify-content: ${(props) => (props.fromSelf ? "flex-end" : "flex-start")};
  margin-bottom: 0.5rem;
`;

const MessageContent = styled.div`
  padding: 0.8rem;
  background-color: ${(props) => (props.fromSelf ? "#2a2f32" : "#3d3d4e")};
  color: white;
  border-radius: 8px;
  max-width: 75%;
`;

const ChatInputContainer = styled.div`
  padding: 1rem;
  background-color: #2a2f32;
  border-top: 1px solid #ddd;
`;
