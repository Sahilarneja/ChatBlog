import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Logout from "./Logout";
import ChatInput from "../components/ChatInput";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import { io } from "socket.io-client";

function ChatContainer({ currentChat, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");
    socketRef.current.emit("add-user", currentUser._id);

    socketRef.current.on("msg-recieve", (msg) => {
      setArrivalMessage({ fromSelf: false, message: msg });
    });

    return () => {
      socketRef.current.off("msg-recieve");
      socketRef.current.disconnect();
    };
  }, [currentUser._id]);

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
      await axios.post(sendMessageRoute, {
        from: currentUser._id,
        to: currentChat._id,
        message: msg,
      });

      socketRef.current.emit("send-msg", {
        from: currentUser._id,
        to: currentChat._id,
        msg: msg,
      });

      setMessages((prevMessages) => [...prevMessages, { fromSelf: true, message: msg }]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prevMessages) => [...prevMessages, arrivalMessage]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const createSVGMarkup = (svgString) => ({ __html: svgString });

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
                <MessageContent fromSelf={message.fromSelf}>
                  <p>{message.message}</p>
                </MessageContent>
              </Message>
            ))}
            <div ref={scrollRef}></div>
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
