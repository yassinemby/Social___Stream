import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import "../styles/chat.css";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/loading.json";
import Nav from "../components/Nav";
import { formatDistanceToNow, isValid } from "date-fns";
import Input from "./Input";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sent, setsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState({});
  const [shouldScroll, setShouldScroll] = useState(true);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const id = window.location.pathname.split("/")[2];
  const [input, setInput] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/chatting/${id}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        const combinedMessages = [
          ...response.data.you,
          ...response.data.friend,
        ];
        const sortedMessages = combinedMessages.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setUser(response.data.r);
        setMessages(sortedMessages);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to fetch messages. Please try again.");
      // Optionally, reset messages or handle specific errors
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setsent(true);
    if (message.trim() !== "") {
      const newMessage = {
        receiver: id,
        text: message,
      };

      // Optimistically add the message
      const optimisticMessage = { sender: "you", message: message, createdAt: new Date() };
      setMessages((prevMessages) => [...prevMessages, optimisticMessage]);

      try {
        const response = await axios.post("/api/chat", newMessage, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setMessage("");
          fetchMessages(); // Fetch updated messages
        }
      } catch (error) {
        console.error(error);
        // Handle failure
        setMessages((prevMessages) => prevMessages.slice(0, -1)); // Remove last optimistic message
      } finally {
        setsent(false);
      }
    }
  };

  const handleClick = () => {
    navigate(`/DisplayProfile/${id}`);
  };

  const closeView = () => {
    setInput(false);
  };

  useEffect(() => {
    fetchMessages();
    const intervalId = setInterval(fetchMessages, 3000); // Fetch messages every 3 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [id]);

  useEffect(() => {
    if (shouldScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, shouldScroll]);

  const isOnline = user.status === "online";
  const lastActiveDate = new Date(user.lastActive);
  const isValidLastActive = isValid(lastActiveDate);
  const lastActiveFormatted = isValidLastActive
    ? formatDistanceToNow(lastActiveDate, { addSuffix: true })
    : "unknown";

  return (
    <>
      <div className="chat">
        <div className="chat-user" onClick={handleClick}>
          <div className="colord">
            <div className={`status-circle ${user.status}`}>
              <img
                src={user.profilepic?.url || "default-pic-url"}
                alt=""
                className="profile-pic"
              />
            </div>
          </div>
          <h3>{user.fullname}</h3>
          <span className={`status-indicator ${isOnline ? "online" : "offline"}`}>
            {isOnline
              ? "Online"
              : `Offline since ${isValidLastActive ? lastActiveFormatted : "unknown"}`}
          </span>
        </div>

        <div className="messages" 
          onClick={() => setInput(true)} 
          onScroll={(e) => {
            const { scrollTop, scrollHeight, clientHeight } = e.target;
            setShouldScroll(scrollTop + clientHeight >= scrollHeight);
          }}
        >
          <ul className="messages-list">
            {messages.map((msg, index) => (
              <li
                className={`bubble ${msg.sender === id ? "left" : "right"}`}
                key={index}
              >
                <div className="message-content">{msg.message}</div>
                <div className="message-time">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </div>
              </li>
            ))}
          </ul>
          {loading && (
            <div className="loading">
              <Lottie animationData={loadingAnimation} loop />
            </div>
          )}
          {error && <div className="error">{error}</div>}
          <div ref={messagesEndRef} /> {/* Ref to the end of the message list for scrolling */}
        </div>
        {input && 
          <Input 
            handleSubmit={handleSubmit} 
            closeView={closeView} 
            message={message} 
            setMessage={setMessage}
          />
        }  
      </div>
      <Nav />
    </>
  );
}
