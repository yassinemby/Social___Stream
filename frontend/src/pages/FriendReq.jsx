import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Nav from '../components/Nav';
import { useNavigate } from 'react-router-dom';
import "../styles/Friendreq.css"
import Lottie from "lottie-react";
import loadingAnimation from "../assets/loading.json";
library.add(fas);

export default function FriendReq() {
  const [friend, setFriend] = useState([]); // Will hold multiple search results
  const [message, setMessage] = useState(""); // Success/error message state
  const [loading, setLoading] = useState(false); // Loading state

  const navigate = useNavigate();

  const handlechange = async (value) => {
    if (value.trim() === "") {
      setFriend([]); // Clear results if input is empty
      return;
    }
    setLoading(true); // Start loading
    try {
      const response = await axios.get(`/api/friendreq/${value}`, { withCredentials: true });
      if (response.status === 200) {
        setFriend(response.data); // Assuming response.data is an array of users
      }
    } catch (error) {
      setMessage("An error occurred while searching for friends.");
      console.error(error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleclick =  (id) => {
    console.log(id);
    navigate(`/DisplayProfile/${id}`);
  };

  return (
    <div className='friendreq'>
      <label htmlFor="search">
        <h3>Search for a friend</h3>
      </label>
      <input
        type="text"
        id="search"
        placeholder="Enter username"
        onChange={(e) => handlechange(e.target.value)}
      />

      <div className="suggestions">
        {loading ? (
                     <Lottie animationData={loadingAnimation} loop />

        ) : (
          friend.length > 0 ? (
            friend.map((user, index) => (
              <div key={index} className="suggestion" onClick={() => handleclick(user._id)}>
                <img src={user.profilepic.url} alt="" />
                <a><p>{user.fullname}</p></a>
              </div>
            ))
          ) : (
            <p>No suggestions available</p>
          )
        )}
      </div>

      <Nav />
    </div>
  );
}
