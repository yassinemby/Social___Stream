import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/ViewPosts.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Coms from './Coms';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';

export default function ViewPosts({idu, closeView }) {
    const postId = window.location.pathname.split("/").pop(); // Get the post ID from the URL
    const [posts, setPosts] = useState({}); // Initialize as an object for a single post
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState("");
    const [user, setUser] = useState(null);
    const [isClick, setIsClick] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null); // Changed to store selected post

    const navigate = useNavigate();

    // Function to handle liking/unliking a post
    const handleLikeToggle = async (postId, isLiked) => {
        const endpoint = isLiked ? `/api/unlike/${postId}` : `/api/like/${postId}`;
        console.log(`Liking post with ID: ${postId}, Liked: ${!isLiked}`);
        try {
            const res = await axios.patch(endpoint, { id }, { withCredentials: true });
            console.log('Response:', res.data); // Log response data
            if (res.status === 200) {
                // Update the single post state
                setPosts(prevPost => ({
                    ...prevPost,
                    likes: res.data.likes,
                    likedby: res.data.likedby
                }));
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to toggle like");
        }
    };

    // Function to fetch a single post
    const fetchPosts = async () => {
        try {
            const res = await axios.get("/api/viewonepost/" + postId, { withCredentials: true });
            if (res.status === 200) {
                console.log(res.data);
                setPosts(res.data); // Set the state to the fetched post object
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

    // Function to get user ID
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

    // Handle close action
    const handleClose = (e) => {
        if (e.target.classList.contains('viewposts')) {
            closeView(); // Call the function to close the view
        }
    };

    // Loading state
    if (loading) {
        return <div>Loading...</div>; // You can replace this with your loading animation
    }

    const navig = (puid) => {
        closeView();
    };

    return (
        <>
        <div className='viewposts' onClick={handleClose}>
            <ToastContainer />
            <div className="posts">
                <div className="post">
                    <div className="info">
                        <div className="user">
                            {posts.user && posts.user.profilepic && <img src={posts.user.profilepic.url} alt="Profile" />}
                            <span onClick={() => navig(posts.user ? posts.user._id : '')}>{posts.user ? posts.user.fullname : ''}</span>
                        </div>
                        <span className="date">{new Date(posts.date).toDateString()}</span>
                    </div>
                    <div className="content">
                        <p>{posts.title}</p>
                        <p>{posts.body}</p>
                        {posts.images && <img id='image' src={posts.images.url} alt="Post" />}
                    </div>
                    <div className="footer">
                        <div className="likes">
                            <a onClick={() => handleLikeToggle(posts._id, posts.likedby && posts.likedby.includes(id))}>
                                <FontAwesomeIcon icon={faHeart} color={posts.likedby && posts.likedby.includes(id) ? 'red' : 'gray'} />
                            </a>
                            <span>{posts.likes}</span>
                        </div>
                        <div className="comments">
                            <span>{posts.comments ? posts.comments.length : 0} </span>
                            <a style={{ cursor: "pointer", marginLeft: "5px" }} onClick={() => { setSelectedPost(posts._id); setIsClick(true); }}>Comments</a>
                        </div>
                    </div>
                </div>
            </div>
            {isClick && selectedPost && <Coms user={user} post={selectedPost} handleCommentAdded={fetchPosts} closeViewC={() => setIsClick(false)} />}
        </div>
        <Nav/>
        </>
    );
}
