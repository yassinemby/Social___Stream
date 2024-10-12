import React, { useState, useEffect, Suspense, lazy } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "../styles/Coms.css";
import { useNavigate } from 'react-router-dom';
const Lottie = lazy(() => import('lottie-react')); // Lazy load Lottie
import loadingAnimation from "../assets/loading.json";

export default function Coms({ user, post, handleCommentAdded, closeView }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [commentInput, setCommentInput] = useState('');
    const navigate = useNavigate();

    // Handle new comment submission
    const handleComment = async () => {
        try {
            const newComment = {
                body: commentInput,
                user: {
                    _id: user._id,
                    profilepic: user.profilepic,
                    fullname: user.fullname
                },
                post: post,
                date: new Date()
            };

            setData((prevData) => [...prevData, newComment]); // Optimistically update UI
            await axios.post("/api/coms/" + post, { body: commentInput }, { withCredentials: true });
            setCommentInput('');
            handleCommentAdded(post); // Notify parent to refresh comments
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit your comment.");
        }
    };

    // Fetch existing comments for the post
    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/coms/" + post, { withCredentials: true });
            setData(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch comments.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className='coms' onClick={(e) => e.target.classList.contains('coms') && closeView()}>
            <div className='box'>
                {loading ? (
                    <div className="loader">
                        <Suspense fallback={<div>Loading animation...</div>}>
                            <Lottie animationData={loadingAnimation} loop />
                        </Suspense>
                    </div>
                ) : (
                    data.map((comment, index) => (
                        <div className='post' key={index} onClick={() => navigate(`/DisplayProfile/${comment.user._id}`)}>
                            <img src={comment.user.profilepic.url} alt="User Profile"/>
                            <div>
                                <h5>{comment.user.fullname}</h5>
                                <h3>{new Date(comment.date).toLocaleString()}</h3>
                                <div className='body'>{comment.body}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className='input'>
                <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    aria-label="Comment input"
                />
                <button onClick={handleComment} aria-label="Submit comment">Comment</button>
            </div>
            <ToastContainer />
        </div>
    );
}
