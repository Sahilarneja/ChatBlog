import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Logo from "../assets/logo.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute } from "../utils/APIRoutes";

const Login = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { password, username } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem("chat-app-user", JSON.stringify(data.user));
        navigate("/");
      }
    }
  };

  const toastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };



  useEffect(() => {
    if (localStorage.getItem('chat-app-user')) {
      navigate('/');
    }
  }, [navigate]);

  const handleValidation = () => {
    const { password, username } = values;
    if (password === "") {
      toast.error("Password is required", toastOptions);
      return false;
    } else if (username === "") {
      toast.error("Username is required", toastOptions);
      return false;
    }
    return true;
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <>
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <div className="brand">
            <img src={Logo} alt="Logo" />
            <h1>Instachat</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
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
      border: 0.1rem solid #4e0eff;
      border-radius: 0.5rem;
      color: white;
      font-size: 1rem;
      &:focus {
        border-color: #997afc;
        outline: none;
      }
    }

    button {
      background-color: #997afc;
      color: white;
      padding: 1rem 2rem;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
      transition: 0.5s ease-in-out;
      text-transform: uppercase;

      &:hover {
        background-color: #4e0eff;
      }
    }

    span {
      color: white;
      text-align: center;
      text-transform: uppercase;

      a {
        color: #4e0eff;
        text-decoration: none;
        font-weight: bold;
      }
    }
  }
`;

export default Login;
