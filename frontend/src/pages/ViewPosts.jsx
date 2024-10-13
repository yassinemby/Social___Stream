import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/ViewPosts.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Coms from './Coms';
import { useNavigate } from 'react-router-dom';
import EditPost from "../components/EditPost"
import DeletePost from "../components/DeletePost"
import { Bounce } from "react-toastify"; // Import Bounce for transitions

export default function ViewPosts({idu, closeView ,fromprofile}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState("");
  const [user, setUser] = useState(null);
  const [isClick, setIsClick] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null); // Changed to store selected post
  const [editclicked, setEditclicked] = useState(false);
  const [deleteclicked, setDeleteclicked] = useState(false);

  const navigate = useNavigate();

  const handleLikeToggle = async (postId, isLiked) => {
    const endpoint = isLiked ? `/api/unlike/${postId}` : `/api/like/${postId}`;
    try {
      const res = await axios.patch(endpoint, { id }, { withCredentials: true });
      if (res.status === 200) {
        setPosts(prevPosts => 
          prevPosts.map(post =>
            post._id === postId ? { ...post, likes: res.data.likes, likedby: res.data.likedby } : post
          )
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to toggle like");
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get("/api/viewmyposts/"+idu, { withCredentials: true });
      if (res.status === 200) {
        setPosts(res.data);
      } else {
        console.error("Error fetching posts:", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
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

  useEffect(() => {
    getId();
    fetchPosts();
  }, []);

  const handleClose = (e) => {
    if (e.target.classList.contains('viewposts')) {
      closeView(); // Call the function to close the view
    }
  };


  const closeView2 = () => {
    setEditclicked(false);
  };

  const closeView3 = () => {
    setDeleteclicked(false);
  };


  const handleedit = (post) => {
    console.log('edit',post);
    setSelectedPost(post);
    setEditclicked(true);
    // Your edit functionality here
  };

  const handledelete = (post) => {
    console.log('delete',post);
    setSelectedPost(post);
    setDeleteclicked(true);
    // Your delete functionality here
  };

  


  if (loading) {
    return <div>Loading...</div>; // You can replace this with your loading animation
  }

  const navig = (puid) => {
    closeView();
  };

  return (
    <div className='viewposts' onClick={handleClose}>
      <ToastContainer />
      <div className="posts">
        {posts.map((post) => (
          <div className="post" key={post._id}>
            <div className="info">
              {fromprofile&&
                 <div className="ed">
                 <button onClick={() => handleedit(post)}>Edit</button>
                 <button onClick={() => handledelete(post)} style={{backgroundColor:"red"}}>Delete</button>
               </div>
              }
             
              <div className="user" >
                {post.user.profilepic && <img src={post.user.profilepic.url} alt="Profile" />}
                <span onClick={() => navig(post.user._id)}>{post.user.fullname}</span>
              </div>
              <span className="date">{new Date(post.date).toDateString()}</span>
            </div>
            <div className="content">
              <p>{post.title}</p>
              <p>{post.body}</p>
              {post.images && <img id='image' src={post.images.url} alt="Post" />}
            </div>
            <div className="footer">
              <div className="likes">
                <a onClick={() => handleLikeToggle(post._id, post.likedby.includes(id))}>
                  <FontAwesomeIcon icon={faHeart} color={post.likedby.includes(id) ? 'red' : 'gray'} />
                </a>
                <span>{post.likes}</span>
              </div>
              <div className="comments">
                <span>{post.comments.length} </span>
                <a  style={{ cursor: "pointer" ,marginLeft:"5px"}} onClick={() => { setSelectedPost(post._id); setIsClick(true); }}>Comments</a>
              </div>
            </div>
          </div>
        ))}
      </div>
      {isClick && selectedPost && <Coms user={user} post={selectedPost} handleCommentAdded={fetchPosts} closeViewC={() => setIsClick(false)} />}
      { editclicked && <EditPost post={selectedPost} closeView2={closeView2} />}
    { deleteclicked && <DeletePost post={selectedPost} closeView3={closeView3} />}


    </div>
  );
}
