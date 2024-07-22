import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Logo from "../assets/logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute } from "../utils/APIRoutes";


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const toastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!handleValidation()) return;

    try {
      const response = await axios.post(loginRoute, {
        email,
        password
      });
      setMessage(response.data.message);
      setError('');
      toast.success(response.data.message, toastOptions);
      localStorage.setItem("chat-app-user", JSON.stringify(response.data)); // Example: Save user data
      navigate("/");
    } catch (err) {
      setError(err.response.data.message || 'An error occurred');
      setMessage('');
      toast.error(err.response.data.message || 'An error occurred', toastOptions);
    }
  };

  const handleValidation = () => {
    if (password === "") {
      toast.error("Password is required", toastOptions);
      return false;
    } else if (email === "") {
      toast.error("Email is required", toastOptions);
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <div className="brand">
            <img src={Logo} alt="Logo" />
            <h1>ChatBox</h1>
          </div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
          <span>
            Don't Have An Account? <Link to="/register">Register</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
};

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #131324;
  padding: 2rem;

  .brand {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    margin-bottom: 2rem;

    img {
      height: 100px;
      width: 100px;
    }

    h1 {
      font-size: 2.5rem;
      color: #ffffff;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 1rem;
    padding: 2rem 3rem;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);

    input {
      background-color: transparent;
      padding: 0.75rem;
      border: 1px solid #fff;
      border-radius: 0.5rem;
      color: #fff;
      font-size: 1rem;

      &:focus {
        outline: none;
        border-color: #4e0eff;
      }
    }

    button {
      background-color: #4e0eff;
      color: #fff;
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      cursor: pointer;

      &:hover {
        background-color: #5a24ff;
      }
    }

    span {
      color: #fff;
      font-size: 0.9rem;

      a {
        color: #4e0eff;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`;

export default Login;

