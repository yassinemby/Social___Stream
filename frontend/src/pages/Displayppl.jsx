import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from '../components/Nav';
import Followers from "../components/Followers";
import Viewimg from "./Viewimg";
import Lottie from "lottie-react"; 
import loadingAnimation from "../assets/loading.json"; 
import ViewPosts from './ViewPosts';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

export default function Displayppl() {
  const id = window.location.pathname.split("/")[2];
  const [pic, setPic] = useState(null);
  const [nposts, setNposts] = useState(0);
  const [nfriends, setNfriends] = useState(0);
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [imgClicked, setImgClicked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [postClicked, setPostClicked] = useState(false);
  const [online, setOnline] = useState("");
  const [error, setError] = useState(null);
  const [invitsent, setInvitsent] = useState(false);
  const [isfriend, setIsfriend] = useState(false);
  const [isme, setIsme] = useState(false);
  const [mssg, setMssg] = useState("");

  const handleFollowers = () => {
    if (isfriend || isme) {
      setIsActive(true);  
    } else if (invitsent) {
      toast.info("Invite sent. Wait for the user to accept.");  // Show info toast if invite is sent
    } else {
      toast.error("You need to be friends to view followers.");  
    }
  };
  
  const handlePosts = () => {
    if (isfriend || isme) {
      setPostClicked(true);  
    } else if (invitsent) {
      toast.info("Invite sent. Wait for the user to accept.");  // Show info toast if invite is sent
    } else {
      toast.error("You need to be friends to view posts.");  
    }
  };
  
  const closeView = () => {
    setImgClicked(false);
    setIsActive(false);
    setPostClicked(false);
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/profile/${id}`, { withCredentials: true });
      setIsfriend(res.data.isFriend);
      setPic(res.data.pic);
      setNposts(res.data.nposts);
      setNfriends(res.data.nfriends);
      setName(res.data.name);
      setIsme(res.data.isme);
      setInvitsent(res.data.friendrequest);
      setOnline(res.data.s === "online" ? "online" : "offline"); 
    } catch (err) {
      console.error(err);
      setError("Failed to load profile data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      const res = await axios.post(`/api/followuser/${id}`, { follow: true }, { withCredentials: true });
      if (res.status === 200) {
        setMssg(res.data.message);
        setIsfriend(false); // Set isfriend to false initially when following
        setInvitsent(true); // Set invite sent to true
        toast.success("Invite sent. Awaiting acceptance."); 
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to send follow request."); 
    }
  };

  const handleUnfollow = async () => {
    try {
      const res = await axios.patch(`/api/Unfollowuser/${id}`, { unfollow: true }, { withCredentials: true });
      if (res.status === 200) {
        setMssg(res.data.message);
        setIsfriend(false);
        setInvitsent(false); // Reset invite state when unfollowing
        toast.success("You have unfollowed this user."); 
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to unfollow the user."); 
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  return (
    <div className="profile">
      <ToastContainer />
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <Lottie animationData={loadingAnimation} loop />
        </div>
      ) : (
        <div className="pic-name">
          {isActive ? (
            <Followers id={id} closeView={closeView} />
          ) : postClicked ? (
            <ViewPosts idu={id} closeView={closeView} />
          ) : (
            <div className="color">
              <div className={online === "online" ? "online-indicator" : "offline-indicator"}></div>
              {pic ? (
                <img src={pic} alt="Profile" className="profile-pic" onClick={() => setImgClicked(true)} />
              ) : (
                <div className="profile-pic-placeholder">No image available</div>
              )}
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

          {!isme && !invitsent ? (
            isfriend ? (
              <button onClick={handleUnfollow}>Unfollow</button>
            ) : (
              <button onClick={handleFollow}>Follow</button>
            )
          ) : invitsent ? (
            <h4>Invite Sent</h4>
          ) : null}

          {mssg && <p className="follow-message">{mssg}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>
      )}

      {imgClicked && <Viewimg pic={pic} closeView={closeView} />}
      <Nav />
    </div>
  );
}
