import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/friends.css";
import Nav from "./Nav";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/loading.json";
export default function Friends() {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleclick = async (id) => {
    try {
      const response = await axios.get(`/api/chat/${id}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        navigate(`/chatting/${id}`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error starting chat. Please try again.");
    }
  };

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/friends", {
        withCredentials: true,
      });
      if (response.status === 200) {
        setFriends(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load friends. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends(); // Load friends on first render
  }, []); // Empty array [] prevents useEffect from triggering multiple times

  return (
    <>
      <h2 className="title">Choose your friend</h2>

      <div className="friends">
        {loading ? (
          <div className="loading-indicator">
            {" "}
            <Lottie animationData={loadingAnimation} loop />
          </div>
        ) : friends.length === 0 ? (
          <p>No friends available.</p>
        ) : (
          friends.map((friend) => (
            <div
              className={`friend-bubble ${
                friend.status === "online" ? "online" : "offline"
              }`}
              key={friend._id}
              onClick={() => handleclick(friend._id)}
              style={{ cursor: "pointer" }}
            >
              <div
                className={`status-circle ${
                  friend.status === "online" ? "online" : "offline"
                }`}
              >
                <img
                  src={friend.profilepic?.url || "/default-profile.png"}
                  alt={friend.fullname || "Unknown User"}
                  className="friend-image"
                />
              </div>
              <div className="friend-info">
                <span className="friend-name">
                  {friend.fullname || "Unknown User"}
                </span>
                <span
                  className={`status-indicator ${
                    friend.status === "online" ? "online" : "offline"
                  }`}
                >
                  {friend.status === "online" ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      <Nav />
      <ToastContainer />
    </>
  );
}
