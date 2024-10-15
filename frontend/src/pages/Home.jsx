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
import {motion} from 'framer-motion';
export default function Home() {
  const [data, setData] = useState([]);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(true);
  const [isClick, setIsClick] = useState(false);
  const [post, setPost] = useState(null); // Store full post object instead of just ID
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const postscontainer = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.3, // Increase stagger delay for smoother transition
        duration: 1.5, // Longer duration for a slower effect
        ease: "easeInOut" // Smooth easing function
      } 
    }
  };
  
  const postcont = {
    hidden: { opacity: 0, y: 50 }, // Add slight vertical translation for a smoother entrance
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 1.2, // Slow down individual post animation
        ease: "easeInOut" // Smooth easing function
      }
    }
  };
  




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
  <motion.div variants={postscontainer} initial="hidden" animate="show" className={home.posts}>
          {data.map((post) => (
            <motion.div  variants={postcont} className="bg-slate-100 px-10 py-5 mt-6 mb-24 rounded-3xl"
            key={post._id} >
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
              <div className={home.footer} >
                <div className={home.likes}>
                  <a style={{ cursor: "pointer" }} onClick={() => handleLikeToggle(post._id, post.likedby.includes(id))}>
                    <FontAwesomeIcon icon={faHeart} color={post.likedby.includes(id) ? 'red' : 'gray'} />
                  </a>
                  <span>{post.likes}</span>
                </div>
                <div className="comments">
                  
                <a style={{ cursor: "pointer", marginLeft: "5px" }} onClick={() => { setPost(post); setIsClick(true); }}><svg aria-label="Comment" class="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Comment</title><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path></svg></a>
                  <span>{post.comments.length} </span>
                </div>
                <svg 
  aria-label="Save" 
  class="x1lliihq x1n2onr6 x5n08af" 
  fill="currentColor" 
  height="45"   // Increased size from 24 to 32
  role="img" 
  viewBox="0 0 24 24" 
  width="45"    // Increased size from 24 to 32
  style={{ cursor: 'pointer', transition: 'transform 0.2s', transform: 'scale(1)', padding: '10px'}}
>
  <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polygon>
</svg>

<svg
  aria-label="Share"
  className="share-icon"
  fill="currentColor"
  height="45"  // Increased size from 24 to 32
  role="img"
  viewBox="0 0 24 24"
  width="45"   // Increased size from 24 to 32
  style={{ cursor: 'pointer', transition: 'transform 0.2s', transform: 'scale(1)', padding: '10px'}}
  onClick={() => navigate(`/chatting/${id}`)}
  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
>
  <line
    fill="none"
    stroke="currentColor"
    strokeLinejoin="round"
    strokeWidth="2"
    x1="22"
    x2="9.218"
    y1="3"
    y2="10.083"
  ></line>
  <polygon
    fill="none"
    points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
    stroke="currentColor"
    strokeLinejoin="round"
    strokeWidth="2"
  ></polygon>
</svg>

              </div>

            </motion.div>
          ))}
        </motion.div>
        {isClick && <Coms user={user} post={post._id} handleCommentAdded={handleCommentAdded} closeViewC={closeViewC} />}
        <Nav />
      </div>
    </>
  );
}