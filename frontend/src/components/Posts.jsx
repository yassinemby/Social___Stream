import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faHeartBroken, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import "./c-s/Posts.css"

export default function Posts() {
  const [data, setData] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [showComments, setShowComments] = useState({}); // Track visibility of comments for each post

  const pending = () => {
    toast.info("Loading", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  };

  const fetchPosts = async () => {
    const t = pending();
    try {
      const res = await axios.get("/api/myposts", { withCredentials: true });
      toast.dismiss(t);
      setData(res.data.posts);
      const initialShowComments = res.data.posts.reduce((acc, post) => {
        acc[post._id] = false;
        return acc;
      }, {});
      setShowComments(initialShowComments);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLikeToggle = async (id, isLiked) => {
    try {
      const endpoint = isLiked ? `/api/unlike/${id}` : `/api/like/${id}`;
      const response = await axios.patch(endpoint, {}, { withCredentials: true });

      if (response.status === 200) {
        toast.success(isLiked ? "Unliked" : "Liked", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });

        setData(prevData =>
          prevData.map(post =>
            post._id === id
              ? {
                  ...post,
                  likes: isLiked ? post.likes - 1 : post.likes + 1,
                  isLiked: !isLiked,
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCommentSubmit = async (postId) => {
    try {
      const response = await axios.post(
        `/api/comment/${postId}`,
        { comment: commentInput },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setCommentInput('');
        fetchPosts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleComments = (postId) => {
    setShowComments(prevState => ({
      ...prevState,
      [postId]: !prevState[postId]
    }));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="postsContainer">
       <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      /> 
      <div className="postsGrid">
        {data.map((post) => (
          <div className="singlePost" key={post._id}>
            <div className="postHeader">
              <div className="postUser">
                <img src={post.user.profilepic.url} alt="Profile" />
                <span>{post.user.fullname}</span>
              </div>
              <span className="postDate">{new Date(post.date).toDateString()}</span>
            </div>
            <div className="postContent">
              <p>{post.title}</p>
              <p>{post.body}</p>
              <img src={post.images.url} alt="Post" />
            </div>
            <div className="postFooter">
              <div className="postLikes">
                <FontAwesomeIcon
                  icon={post.isLiked ? faHeartBroken : faHeart}
                  onClick={() => handleLikeToggle(post._id, post.isLiked)}
                  style={{ cursor: 'pointer', color: post.isLiked ? 'red' : 'gray' }}
                />
                <span>{post.likes}</span>
              </div>
              <div className="postComments">
                <span>Comments</span>
                <button className="toggleCommentsButton" onClick={() => toggleComments(post._id)}>
                  <FontAwesomeIcon icon={showComments[post._id] ? faChevronUp : faChevronDown} />
                </button>
                {showComments[post._id] && (
                  <div className="commentsSection">
                    {post.comments.map((comment, idx) => (
                      <div key={idx} className="singleComment">
                        <div className="commentUser">
                          <img src={comment.user.profilepic.url} alt="Profile" />
                          <span>{comment.user.fullname}</span>
                        </div>
                        <p>{comment.body}</p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="commentInputSection">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Add a comment..."
                  />
                  <button onClick={() => handleCommentSubmit(post._id)}>Submit</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
