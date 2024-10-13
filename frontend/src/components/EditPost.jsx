import React, { useState } from 'react';
import '../components/c-s/EditPost.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';

export default function EditPost({ closeView2, post }) {
  const [description, setdescription] = useState("");
  const [img, setimg] = useState(null);
  const [file, setfile] = useState(null);
  const [title, settitle] = useState("");
  const navigate = useNavigate();

  const preview = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setimg(reader.result);
    };
  };

  const UploadImage = (e) => {
    const file = e.target.files[0];
    setfile(file);
    preview(file);
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Only append fields if they have been changed by the user
    if (title.trim() !== "") {
      formData.append("title", title);
    }
    if (description.trim() !== "") {
      formData.append("description", description);
    }
    if (file) {
      formData.append("oldimage", post.images.public_id);
      formData.append("image", img);
    }

    if (formData.has("title") || formData.has("description") || formData.has("image")) {
      try {
        toast.info("Updating post...", { autoClose: 2000, transition: Bounce });
        const result = await axios.patch("/api/edit/" + post._id, formData, { withCredentials: true });
        if (result.status === 200) {
          toast.success("Post updated successfully!", { autoClose: 2000 });
          setTimeout(() => navigate("/home"), 3000);
        }
      } catch (error) {
        toast.error("Error updating post!");
      }
    } else {
      toast.warning("No changes detected!", { autoClose: 2000 });
    }
  };

  const handleClose = (e) => {
    if (e.target.classList.contains('editpost')) {
      closeView2(); // Call the function to close the view
    }
  };

  return (
    <div className="editpost" onClick={handleClose}>
      <form
        onSubmit={handlesubmit}
      >
        <h1>Edit Post</h1>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          name="title"
          placeholder={post.title}
          onChange={(e) => settitle(e.target.value)}
        />

        <label htmlFor="description">Description:</label>
        <input
          type="text"
          name="description"
          placeholder={post.body}
          style={{ color: "black" }}
          onChange={(e) => setdescription(e.target.value)}
        />

        <label htmlFor="image">Image:</label>
        <input type="file" name="image" onChange={UploadImage} />

        <button type="submit">Update</button>
      </form>

      {img && (
        <img src={img} alt="Selected" style={{ width: "100px", height: "100px" }} />
      )}

      <ToastContainer />
    </div>
  );
}
