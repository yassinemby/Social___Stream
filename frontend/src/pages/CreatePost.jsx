import React, { useState } from "react";
import axios from "axios";
import { Image } from "cloudinary-react";
import Nav from "../components/Nav";
import "../styles/create.css"
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreatePost() {
  const [description, setdescription] = useState("");
  const [img, setimg] = useState("");
  const [file, setfile] = useState("");
  const [title, settitle] = useState("");
  const navigate=useNavigate();
  const toastsuccess = () =>
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
  const pending= ()=>toast.info('Creating post...', {
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
    const toasterror = () =>toast.error('Something went wrong', {
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
      setimg(reader.result);
    };
  };
  const handlesubmit = async (e) => {
      e.preventDefault()
      const formData= new FormData();
      formData.append("image",img);
      formData.append("description",description);
      formData.append("title",title);
      pending();
      const result =await axios.post("/api/create",formData,{withCredentials:true});
      if(result.status===200){
        toastsuccess();
        setTimeout(()=>navigate("/home"),3000)
      
      }
      else{
        toasterror();
      }
     
  };
  const UploadImage = (e) => {
    const file = e.target.files[0];
    setfile(file);
    console.log(file);
    preview(file);
  };
  return (
    <>
      <div className="create">
      <form
          onSubmit={(e) => {
            handlesubmit(e);
          }}
        >
          <h1>Create Post</h1>
          <label htmlFor="title"> Title :</label>
          <input type="text" name="title"  onChange={(e)=>settitle(e.target.value)}/>
          <label htmlFor="description"> Description :</label>
          <input type="text" name="description"  onChange={(e)=>setdescription(e.target.value)}/>
          <label htmlFor="image"> Image :</label>
          <input type="file" name="image" onChange={UploadImage} />
          <button type="submit"> Upload </button>
        </form>
      </div>
      <img src={img} alt="no img" style={{ width: "100px", height: "100px" }} />
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
transition= {Bounce}
/>

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
transition= {Bounce}
/>
      <Nav />
    </>
  );
}
