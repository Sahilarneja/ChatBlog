import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Logo from "../assets/logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerRoute } from "../utils/APIRoutes";

const Register = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false); // Optional loading state

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
        setLoading(true);
        try {
            const { password, username, email } = values;
            const { data } = await axios.post(registerRoute, {
                username,
                email,
                password,
            });
            if (data.status === false) {
                toast.error(data.msg, toastOptions);
            } else if (data.status === true) {
                localStorage.setItem("chat-app-user", JSON.stringify(data.user));
                navigate("/");
            }
        } catch (error) {
            console.error("Error registering user:", error);
            if (error.response) {
                toast.error(error.response.data.msg || "An error occurred while registering. Please try again.", toastOptions);
            } else {
                toast.error("An error occurred while registering. Please try again.", toastOptions);
            }
        } finally {
            setLoading(false);
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
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error("Password and confirm password do not match!", toastOptions);
      return false;
    } else if (username.length < 3) {
      toast.error("Username must be at least 3 characters long!", toastOptions);
      return false;
    } else if (password.length < 8) {
      toast.error("Password must be at least 8 characters long!", toastOptions);
      return false;
    } else if (!email) {
      toast.error("Email is required!", toastOptions);
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) { // Check for valid email format
      toast.error("Please enter a valid email address!", toastOptions);
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
            <h1>ChatBox</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleChange}
            value={values.username}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange}
            value={values.email}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            value={values.password}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={handleChange}
            value={values.confirmPassword}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Creating User..." : "Create User"}
          </button>
          <span>
            Already Have An Account? <Link to="/login">Login</Link>
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

      &:disabled {
        background-color: #6c63ff;
        cursor: not-allowed;
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

export default Register;
