import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/Register.css";

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState(null);
    const [imgPreview, setImgPreview] = useState(null);
    const navigate = useNavigate();

    // Toast notifications
    const toastSuccess = () =>
        toast.success("Account created successfully", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            theme: "dark",
            transition: Bounce,
        });
    const toastPending = () =>
        toast.info("Creating account...", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            theme: "dark",
            transition: Bounce,
        });
    const toastError = () =>
        toast.error("Something went wrong", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            theme: "dark",
            transition: Bounce,
        });

    // Image preview
    const previewImage = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImgPreview(reader.result);
        };
    };

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setImage(file);
        previewImage(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) {
            toastError("Please upload a profile picture.");
            return;
        }

        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('file', imgPreview);

       // console.log(formData);
        toastPending();  // Displaying pending toast

        try {
            const res = await axios.post('/api/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (res.status === 200) {
                toastSuccess();
                setTimeout(() => navigate('/login'), 3000);
            } else {
                toastError();
            }
        } catch (err) {
            toastError(err.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div className='register'>
            <form onSubmit={handleSubmit}>
                <h1>Register</h1>
                <label>Profile Picture</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} required />
                {imgPreview && <img src={imgPreview} alt="Profile Preview" style={{ width: "100px", height: "100px" }} />}
                
                <label>Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                
                <button type="submit">Register</button>
            </form>

            {/* Toast Notifications */}
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                theme="dark"
                transition={Bounce}
            />
        </div>
    );
}
