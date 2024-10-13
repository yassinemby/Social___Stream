import React, { useState } from 'react';
import axios from 'axios';
import '../components/c-s/EditImg.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';

export default function Editimg({ closeView4 }) {
  const [image, setImage] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClose = (e) => {
    if (e.target.classList.contains('editimg')) {
      closeView4();
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('image', imgPreview); // Ensure we append the image file

      const res = await axios.patch('/api/update', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 200) {
        toast.success('Image updated successfully.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });

        navigate('/profile');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update the image. Please try again.', {
        position: "top-right", // Ensure this is correct
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const previewImage = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImgPreview(reader.result);
    };
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
    previewImage(file);
  };

  return (
    <div className='editimg' onClick={handleClose}>
      <div className="imgupdate">
        <h1>Edit your image</h1>
        
        {/* Custom file upload area */}
        <label className="file-upload">
          <input type="file" accept="image/*" onChange={handleImageUpload} required />
          <span>{image ? 'Change Image' : 'Click or Drag to Upload Image'}</span>
        </label>
        
        {imgPreview && (
          <img src={imgPreview} alt="Profile Preview" style={{ width: '100px', height: '100px', margin: '20px 0' }} />
        )}
        
        {/* Update button: Disable and show loading state */}
        <button type="submit" onClick={handleUpdate} disabled={loading}>
          {loading ? 'Updating...' : 'Edit'}
        </button>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </div>
  );
}
