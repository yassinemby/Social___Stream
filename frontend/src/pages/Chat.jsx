import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import "../styles/chat.css";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/loading.json";
import Nav from "../components/Nav";
import { formatDistanceToNow, isValid } from "date-fns";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sent, setsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState({});
  const [shouldScroll, setShouldScroll] = useState(true); // State to track if we should scroll down
  const messagesEndRef = useRef(null); // Ref for the end of the messages list
  const navigate = useNavigate();
  const id = window.location.pathname.split("/")[2];

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
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setsent(true);
    if (message !== "") {
      const newMessage = {
        receiver: id,
        text: message,
      };

      // Optimistically add the message
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "you", message: message, createdAt: new Date() },
      ]);

      try {
        const response = await axios.post("/api/chat", newMessage, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setMessage("");
          fetchMessages(); // This will fetch the updated list of messages
        }
      } catch (error) {
        console.error(error);
        // Handle message send failure, e.g., by reverting the optimistic update
        setMessages((prevMessages) => prevMessages.slice(0, -1)); // Remove last optimistic message
      } finally {
        setsent(false);
      }
    }
  };

  const handleclick = () => {
    navigate(`/DisplayProfile/${id}`);
  };

  useEffect(() => {
    fetchMessages();
    const intervalId = setInterval(fetchMessages, 3000); // Fetch messages every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [id]);

  // Auto-scroll to the bottom when messages change or when component mounts
  useEffect(() => {
    if (shouldScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, shouldScroll]); // Depend on messages and shouldScroll

  // Refactored status check and date formatting
  const isOnline = user.status === "online";

  // Check if lastActive is valid and exists before formatting
  const lastActiveDate = new Date(user.lastActive);
  const isValidLastActive = isValid(lastActiveDate);
  const lastActiveFormatted = isValidLastActive
    ? formatDistanceToNow(lastActiveDate, { addSuffix: true })
    : "unknown";

  return (
    <>
      <div className="chat">
        <div className="chat-user" onClick={handleclick}>
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
              : `Offline since ${
                  isValidLastActive ? lastActiveFormatted : "unknown"
                }`}
          </span>
        </div>

        <div className="messages" onScroll={(e) => {
          const { scrollTop, scrollHeight, clientHeight } = e.target;
          setShouldScroll(scrollTop + clientHeight >= scrollHeight); // Check if user scrolled to the bottom
        }}>
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
{/*           {loading && (
            <div className="loading">
              <Lottie animationData={loadingAnimation} loop />
            </div>
          )} */}
          {error && <div className="error">{error}</div>}
          <div ref={messagesEndRef} /> {/* Ref to the end of the message list for scrolling */}
        </div>

        <div className="input">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Write a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">
              <FontAwesomeIcon icon="fas fa-paper-plane" />
            </button>
          </form>
        </div>
      </div>
      <Nav></Nav>
    </>
  );
}
