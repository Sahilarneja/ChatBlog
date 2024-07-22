import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { setAvatarRoute } from "../utils/APIRoutes";
import RingLoader from "react-spinners/RingLoader"; // Import RingLoader

const SetAvatar = () => {
  const navigate = useNavigate();
  const api = "https://api.multiavatar.com/45678945";
  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const user = JSON.parse(localStorage.getItem("chat-app-user"));
      if (!user || !user._id) {
        toast.error("User not found. Please log in again.", toastOptions);
        navigate("/login");
        return;
      }

      try {
        const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
          image: avatars[selectedAvatar],
        });

        console.log("Response from server:", data);

        if (data.isSet) {
          user.isAvatarImageSet = true;
          user.avatarImage = data.image;
          localStorage.setItem("chat-app-user", JSON.stringify(user));
          navigate("/");
        } else {
          toast.error("Error setting avatar. Please try again.", toastOptions);
        }
      } catch (error) {
        console.error("Error setting profile picture:", error);
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    }
  };

  useEffect(() => {
    const fetchAvatars = async () => {
      const data = [];
      const maxRetries = 5; // Maximum number of retries
      let retryDelay = 1000; // Initial retry delay in milliseconds

      for (let retry = 0; retry < maxRetries; retry++) {
        try {
          for (let i = 0; i < 4; i++) {
            const response = await axios.get(`${api}/${Math.round(Math.random() * 1000)}.svg`, { responseType: 'text' });
            data.push(response.data);
          }
          setAvatars(data);
          setLoading(false);
          return; // Exit the function if successful
        } catch (error) {
          if (error.response && error.response.status === 429) {
            // If rate-limited, wait for exponential backoff before retrying
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            retryDelay *= 2; // Double the retry delay for exponential backoff
          } else {
            // If other error occurred, handle it accordingly
            console.error('Error fetching avatars:', error);
            toast.error("Error fetching avatars. Please try again.", toastOptions);
            setLoading(false);
            return;
          }
        }
      }
      // If max retries reached without success, display error message
      console.error('Max retries exceeded while fetching avatars');
      toast.error("Error fetching avatars. Please try again later.", toastOptions);
      setLoading(false);
    };

    fetchAvatars();
  }, []);

  if (loading) {
    return (
      <LoaderContainer>
        <RingLoader color="#4e0eff" size={150} />
      </LoaderContainer>
    );
  }

  return (
    <>
      <Container>
        <div className="title-container">
          <h1>Pick an avatar as profile picture</h1>
        </div>
        <div className="avatars">
          {avatars.map((avatar, index) => (
            <div
              key={index}
              className={`avatar ${selectedAvatar === index ? "selected" : ""}`}
              onClick={() => setSelectedAvatar(index)}
            >
              <img src={`data:image/svg+xml;base64,${btoa(avatar)}`} alt="avatar" />
            </div>
          ))}
        </div>
        <button className="submit-btn" onClick={setProfilePicture}>
          Set as Profile Picture
        </button>
      </Container>
      <ToastContainer />
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #131324;
  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;
    .avatar {
      border: 0.4rem solid transparent;
      padding: 1rem;
      padding-bottom: 1.5rem;
      padding-top: 1.5rem;
      margin: auto;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #997afc;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.5rem;
    font-size: 1rem;
    text-transform: uppercase;
    transition: 0.5s ease-in-out;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #131324;
`;

export default SetAvatar;
