import React, { useState, useEffect } from "react";
import "../components/c-s/Followers.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Followers({ id, closeView }) {
  const [followers, setFollowers] = useState([]);
  const navigate = useNavigate();
  // Fetch followers based on the provided id
  const fetchFollowers = async () => {
    try {
      const response = await axios.get(`/api/followers/${id}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setFollowers(response.data);
      } else {
        console.error("Error fetching followers:", response.statusText);
      }
    } catch (err) {
      console.error("Error fetching followers:", err);
    }
  };

  // Handle click to navigate to follower's profile
  const handleClick = (followerId) => {
    navigate(`/DisplayProfile/${followerId}`);
    closeView();
  };

  // Close followers view on background click
  const handleClose = (e) => {
    if (e.target.classList.contains('fol')) {
      closeView();
    }
  };

  // Fetch followers when id changes
  useEffect(() => {
    if (id) {
      fetchFollowers();
    }
  }, [id]);

  return (
    <div className="fol" onClick={handleClose}>
      <div className="f-content">
        <h3>Followers</h3>
        {followers.length > 0 ? (
          followers.map((follower) => (
            <div
              className="follower"
              key={follower._id}
              onClick={() => handleClick(follower._id)}
            >
              <div className="colorx">
                <div className={`status-circle ${follower.status}`}>
                  <img src={follower.profilepic.url} alt="" className="profile-pic" />
                </div>
              </div>
              <h3>{follower.fullname}</h3>
            </div>
          ))
        ) : (
          <h4>No followers found.</h4> // Handle no followers case
        )}
      </div>
    </div>
  );
}
