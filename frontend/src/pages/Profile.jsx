// Profile.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Profile.css";
import Nav from "../components/Nav";
import Followers from "../components/Followers";
import Posts from "../components/Posts"; // Import the Posts component
import "../styles/status.css";
import Viewimg from "./Viewimg";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/loading.json";
import ViewPosts from "./ViewPosts";
import EditViewImg from "../components/EditViewImg";

export default function Profile() {
  const [pic, setPic] = useState(null);
  const [nposts, setNposts] = useState(0);
  const [nfriends, setNfriends] = useState(0);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [online, setOnline] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [imgClicked, setImgClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [postClicked, setPostClicked] = useState(false);
  const [user, setUser] = useState(null);


  const handleFollowers = () => {
    setIsActive(true);  // Open followers view
  };

  const handlePosts = () => {
    setPostClicked(true); // Open posts view
  };

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/profile", { withCredentials: true });
      if (res.status === 200) {
        setPic(res.data.pic);
        setNposts(res.data.nposts);
        setNfriends(res.data.nfriends);
        setName(res.data.name);
        setOnline(res.data.s === "online" ? "online" : "offline");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getId = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/getid", { withCredentials: true });
      if (res.status === 200) {
        setId(res.data.id);
        setUser(res.data.user);
      }
    } catch (err) {
      console.error("Error getting ID:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImg = () => {
    setImgClicked(true);  // Open image view
  };

  const closeView = () => {
    setImgClicked(false); // Close image view
    setIsActive(false);   // Close followers view
    setPostClicked(false); // Close posts view
  };

  useEffect(() => {
    getId();
  }, []);

  useEffect(() => {
    
      fetchProfile();
   
  }, [id]);

  return (

    <div className="profile">
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <Lottie animationData={loadingAnimation} loop />
        </div>
      ) : (
        <div className="pic-name">
          {isActive ? ( // Show Followers component if active
            <Followers id={id} closeView={closeView} />
          ) : postClicked ? ( // Show Posts component if postClicked is true
            <ViewPosts idu={id} closeView={closeView} />
          ) : (
            <div className="color">
              {online === "online" ? (
                <div className="online-indicator"></div>
              ) : (
                <div className="offline-indicator"></div>
              )}
              <img
                src={pic}
                alt="Profile"
                className="profile-pic"
                onClick={handleImg}
              />
            </div>
          )}
          <h3>{name}</h3>
          <div className="profile-info">
            <a className="p" onClick={handlePosts}>
              <h3>{nposts} posts</h3>
            </a>
            
            <a className="p" onClick={handleFollowers}>
              <h3>{nfriends} followers</h3>
            </a>
          </div>
        </div>
      )}

      {imgClicked && <EditViewImg pic={pic} closeView={closeView} />}

      <Nav />
    </div>
  );
}
