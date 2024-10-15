import React, { useState, useEffect, Suspense, lazy } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "../styles/Coms.css";
import { useNavigate } from 'react-router-dom';
const Lottie = lazy(() => import('lottie-react')); // Lazy load Lottie
import loadingAnimation from "../assets/loading.json";
import Input from "./Input";

export default function Coms({ user, post, handleCommentAdded, closeViewC }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [boxclicked, setboxclicked] = useState(false);
    const [message, setMessage] = useState("");


    // Handle new comment submission
    const handleComment = async () => {
        try {
            const newComment = {
                body: message,
                user: {
                    _id: user._id,
                    profilepic: user.profilepic,
                    fullname: user.fullname
                },
                post: post,
                date: new Date()
            };

            setData((prevData) => [...prevData, newComment]); // Optimistically update UI
            await axios.post("/api/coms/" + post, { body: message }, { withCredentials: true });
            setMessage('');
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

    const closeView = () => {
        setboxclicked(false);
      };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className='coms' onClick={(e) => e.target.classList.contains('coms') && closeViewC()}>
            <div className='box' onClick={() => setboxclicked(true)}>
                {loading ? (
                    <div className="loader">
                        <Suspense fallback={<div>Loading animation...</div>}>
                            <Lottie animationData={loadingAnimation} loop />
                        </Suspense>
                    </div>
                ) : (
                    data.map((comment, index) => (
                        <div className='post' key={index} >
                            <img src={comment.user.profilepic.url} alt="User Profile" onClick={() => navigate(`/DisplayProfile/${comment.user._id}`)}/>
                            <div>
                                <h5>{comment.user.fullname}</h5>
                                <h3>{new Date(comment.date).toLocaleString()}</h3>
                                <div className='body'>{comment.body}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
           <ToastContainer />
 
            {boxclicked && 
          <Input 
            handleSubmit={handleComment} 
            message={message} 
            setMessage={setMessage}
            closeView={closeView}
          />
        } 
        </div>
    );
}
