import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Nav from '../components/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import home from "../styles/Home.module.css";
import Coms from './Coms';
import { useNavigate, useLocation } from 'react-router-dom';  // Import useLocation
import Lottie from "lottie-react";
import loadingAnimation from "../assets/loading.json";
import UseNotif from '../customhook/UseNotif';
export default function Home() {
  const [data, setData] = useState([]);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(true);
  const [isClick, setIsClick] = useState(false);
  const [post, setPost] = useState(null); // Store full post object instead of just ID
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  const pending = () => toast.info("Loading", { position: "top-center", theme: "dark", transition: Bounce });

  const fetchPosts = async () => {
    const toastId = pending();
    setLoading(true);
    try {
      const res = await axios.get("/api/home", { withCredentials: true });
      toast.dismiss(toastId);
      setData(res.data.posts);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = (postId) => {
    // Update the comments count for the specific post
    setData(prevData => 
      prevData.map(post => 
        post._id === postId ? { ...post, comments: [...post.comments, {}] } : post
      )
    );
  };

  const handleLikeToggle = async (postId, isLiked) => {
    const endpoint = isLiked ? `/api/unlike/${postId}` : `/api/like/${postId}`;
    try {
      const res = await axios.patch(endpoint, { id }, { withCredentials: true });
      if (res.status === 200) {
        setData(prevData => 
          prevData.map(post =>
            post._id === postId ? { ...post, likes: res.data.likes, likedby: res.data.likedby } : post
          )
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to toggle like");
    }
  };

  const getId = async () => {
    try {
      const res = await axios.get("/api/getid", { withCredentials: true });
      setId(res.data.id);
      setUser(res.data.user);
    } catch (error) {
      console.error(error);
    }
  };

  const closeViewC = () => {
    setIsClick(false);
  };

  useEffect(() => {
    getId();
    fetchPosts();
  }, [location]);  // Re-run this effect when the location changes

  if (loading) {
    return (
      <div>
        <Lottie animationData={loadingAnimation} loop />
      </div>
    );
  }

  return (
    <>
    <UseNotif id={id} user={user} />
    <div className={home.home}>
      <ToastContainer />
      <div className={home.posts}>
        {data.map((post) => (
          <div className={home.post} key={post._id}>
            <div className={home.info}>
              <div className={home.user} onClick={() => navigate(`/DisplayProfile/${post.user._id}`)}>
                <img src={post.user.profilepic.url} alt="Profile" />
                <span>{post.user.fullname}</span>
              </div>
              <span className={home.date}>{new Date(post.date).toDateString()}</span>
            </div>
            <div className={home.content}>
              <p>{post.title}</p>
              <p>{post.body}</p>
              <img src={post.images.url} alt="Post" />
            </div>
            <div className={home.footer}>
              <div className={home.likes}>
                <a style={{ cursor: "pointer" }} onClick={() => handleLikeToggle(post._id, post.likedby.includes(id))}>
                  <FontAwesomeIcon icon={faHeart} color={post.likedby.includes(id) ? 'red' : 'gray'} />
                </a>
                <span>{post.likes}</span>
              </div>
              <div className="comments">
                <span>{post.comments.length} </span>
                <a style={{ cursor: "pointer", marginLeft: "5px" }} onClick={() => { setPost(post); setIsClick(true); }}>Comments</a>
              </div>
            </div>
          </div>
        ))}
      </div>
      {isClick && <Coms user={user} post={post._id} handleCommentAdded={handleCommentAdded} closeViewC={closeViewC} />}
      <Nav />
    </div>
    </>
  );
}