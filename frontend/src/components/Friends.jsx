import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/friends.css";
import Nav from "./Nav";
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import { Bounce } from "react-toastify"; // Import Bounce for transitions

export default function Friends() {
  const navigate = useNavigate();
  const location = useLocation();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClick = async (id) => {
    try {
      const response = await axios.get(`/api/chat/${id}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        navigate(`/chatting/${id}`);
      }
    } catch (error) {
      console.error("Error starting chat:", error);
      toast.error("Error starting chat. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  };

  const fetchFriends = async () => {
    setLoading(true);
    const toastId = toast.loading("Loading friends...", {
      position: "top-right",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    });

    try {
      const response = await axios.get("/api/friends", {
        withCredentials: true,
      });
      if (response.status === 200) {
        setFriends(response.data);
        toast.success("Friends loaded successfully.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce, // Keep original toast settings
        });
      }
    } catch (error) {
      console.error("Failed to load friends:", error);
      toast.error("Failed to load friends. Please refresh the page.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce, // Keep original toast settings
      });
    } finally {
      toast.dismiss(toastId); // Dismiss loading toast
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, [location]);

  return (
    <>
      <h2 className="title">Choose your friend</h2>
      <div className="friends">
        {loading ? (
          <p>Loading friends...</p> // Optional loading state message
        ) : friends.length === 0 ? (
          <p>No friends available.</p>
        ) : (
          friends.map((friend) => (
            <div
              className={`friend-bubble ${
                friend.status === "online" ? "online" : "offline"
              }`}
              key={friend._id}
              onClick={() => handleClick(friend._id)}
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
        theme="dark"
        transition={Bounce} // Keep the transition as Bounce
      />
    </>
  );
}
