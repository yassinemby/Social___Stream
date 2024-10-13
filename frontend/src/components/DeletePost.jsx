import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import "../components/c-s/DEletePost.css"

export default function DeletePost({ post, closeView3 }) {
  const navigate = useNavigate();

  // Handle the actual post deletion
  const handleDelete = async () => {
    try {
      toast.info("Deleting post...", { autoClose: 2000, transition: Bounce });
      const result = await axios.delete(`/api/delete/${post._id}`, { withCredentials: true });
      if (result.status === 200) {
        toast.success("Post deleted successfully!", { autoClose: 2000 });
        setTimeout(() => {
          navigate("/home"); // Redirect to home or any other page after deletion
        }, 3000);
      }
    } catch (error) {
      console.error("Error deleting post:", error); // Log error for debugging
      toast.error("Error deleting post! Please try again.");
    }
  };

  // Handle close action if clicked outside of the modal
  const handleClose = (e) => {
    if (e.target.classList.contains('deletepost')) {
      closeView3(); // Call the function to close the view
    }
  };

  return (
    <div className="deletepost" onClick={handleClose}>
      <div className="deletepost-content">
        <h1>Are you sure you want to delete this post?</h1>
        <p>This action cannot be undone.</p>
        <div className='buttons'> {/* Updated to wrap buttons */}
          <button onClick={handleDelete} className="delete-btn" style={{ backgroundColor: 'red' }}>Yes, Delete</button>
          <button onClick={closeView3} className="cancel-btn">Cancel</button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
