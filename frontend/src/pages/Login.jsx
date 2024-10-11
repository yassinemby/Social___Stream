import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import login from "../styles/Login.module.css";
import { io } from 'socket.io-client';
const socket = io(); // Connect to the socket


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Success notification
  const notifySuccess = () =>
    toast.success("Logged in successfully", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
      toastStyle: {
        backgroundColor: "#4caf50", // Green for success
        color: "#fff",
        fontSize: "14px",
        borderRadius: "8px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        padding: "10px",
        width: "90vw",
        marginRight: "10vw",
      },
    });

  // Error notification
  const notifyError = (errorMessage) =>
    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
      toastStyle: {
        backgroundColor: "#f44336", // Red for error
        color: "#fff",
        fontSize: "14px",
        borderRadius: "8px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        padding: "10px",
        width: "90vw",
        marginRight: "10vw",
      },
    });

  const handlesubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "/api/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        notifySuccess(); // Success toast
       console.log(response.data.user);
        socket.emit("login", {userid:response.data.user});
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      }
    } catch (error) {
      notifyError(error.response?.data?.message || "Login failed. Please try again.");
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <div className={login["login-container"]}>
      <h1>Login</h1>
      <form onSubmit={handlesubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          id="email"
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          id="password"
          required
        />
        <button type="submit">Login</button>

        {/* ToastContainer with modified close button size */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Bounce}
          toastStyle={{
            fontSize: "14px", // Smaller text
          }}
          progressStyle={{
            backgroundColor: "white", // Green for success
          }}
          closeButton={({ closeToast }) => (
            <button
              onClick={closeToast}
              style={{
                fontSize: "10px", // Smaller button
                backgroundColor: "transparent",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                width: "20px",
              }}
            >
              ✖
            </button>
          )}
        />
      </form>
      <Link to="/register">
        <h4>Don't have an account? Register</h4>
      </Link>
    </div>
  );
}
