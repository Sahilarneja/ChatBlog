import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Logout from "./Logout";
import ChatInput from "../components/ChatInput";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import { io } from "socket.io-client";

function ChatContainer({ currentChat, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    const newSocket = io("https://chatblog-server.onrender.com"); // Update with your backend port
    setSocket(newSocket);

    if (currentUser && newSocket) {
      newSocket.emit("add-user", currentUser._id);
  
      const receiveMessageHandler = (msg) => {
        setMessages(prevMessages => [...prevMessages, { fromSelf: false, message: msg }]);
      };
    
      newSocket.on("msg-recieve", receiveMessageHandler);
  
      return () => {
        newSocket.off("msg-recieve", receiveMessageHandler);
        newSocket.disconnect();
      };
    }
  }, [currentUser, currentChat?._id]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (currentChat) {
        try {
          const response = await axios.post(recieveMessageRoute, {
            from: currentUser._id,
            to: currentChat._id,
          });
          setMessages(response.data.messages);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        }
      }
    };
    fetchMessages();
  }, [currentChat, currentUser._id]);

  const handleSendMsg = async (msg) => {
    try {
      // Optimistically update UI before sending message
      setMessages((prevMessages) => [...prevMessages, { fromSelf: true, message: msg }]);

      await axios.post(sendMessageRoute, {
        from: currentUser._id,
        to: currentChat._id,
        message: msg,
      });

      socket.emit("send-msg", {
        from: currentUser._id,
        to: currentChat._id,
        msg: msg,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const createSVGMarkup = (svgString) => ({ __html: svgString });

  return (
    <Container>
      {currentChat && (
        <>
          <ChatHeader>
            <UserDetails>
              <Avatar>
                <AvatarImage dangerouslySetInnerHTML={createSVGMarkup(currentChat?.avatarImage)} />
              </Avatar>
              <Username>{currentChat?.username}</Username>
            </UserDetails>
            <Logout />
          </ChatHeader>
          <ChatMessages>
            <MessagesContainer>
              {messages.map((message, index) => (
                <Message key={index} fromSelf={message.fromSelf}>
                  <MessageContent fromSelf={message.fromSelf}>
                    <p>{message.message}</p>
                  </MessageContent>
                </Message>
              ))}
              <div ref={scrollRef}></div>
            </MessagesContainer>
          </ChatMessages>
          <ChatInputContainer>
            <ChatInput handleSendMsg={handleSendMsg} />
          </ChatInputContainer>
        </>
      )}
    </Container>
  );
}

export default ChatContainer;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100vh;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #131324;
  border-bottom: 1px solid #ddd;
  flex-shrink: 0;
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

const MessagesContainer = styled.div`
  max-height: 60vh; /* Adjust the maximum height as per your design */
  overflow-y: auto;
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
  flex-shrink: 0;
`;
