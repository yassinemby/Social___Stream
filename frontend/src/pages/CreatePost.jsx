import React, { useState } from "react";
import axios from "axios";
import { Image } from "cloudinary-react";
import Nav from "../components/Nav";
import "../styles/create.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreatePost() {
  const [description, setDescription] = useState("");
  const [img, setImg] = useState("");
  const [file, setFile] = useState("");
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const toastSuccess = () =>
    toast.success("Post created successfully", {
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

  const pending = () =>
    toast.info("Creating post...", {
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

  const toastError = () =>
    toast.error("Something went wrong", {
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

  const preview = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImg(reader.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", img);
    formData.append("description", description);
    formData.append("title", title);
    pending();
    
    try {
      const result = await axios.post("/api/create", formData, {
        withCredentials: true,
      });
      if (result.status === 200) {
        toastSuccess();
        setTimeout(() => navigate("/home"), 3000);
      } else {
        toastError();
      }
    } catch (error) {
      toastError();
    }
  };

  const uploadImage = (e) => {
    const file = e.target.files[0];
    setFile(file);
    if (file) preview(file);
  };

  return (
    <>
      <div className="create">
        <form onSubmit={handleSubmit}>
          <h1>Create Post</h1>
          <label htmlFor="title"> Title :</label>
          <input
            type="text"
            name="title"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <label htmlFor="description"> Description :</label>
          <input
            type="text"
            name="description"
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <label htmlFor="image" className="custom-file-upload">
            <input type="file" name="image" onChange={uploadImage} />
            Choose Image
          </label>
          {img && (
            <div className="image-preview">
              <img src={img} alt="Preview" />
            </div>
          )}
          <button type="submit">Upload</button>
        </form>
      </div>

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
      <Nav />
    </>
  );
}
