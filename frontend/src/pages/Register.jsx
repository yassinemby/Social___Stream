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
            theme: "colored",
            transition: Bounce,
            toastStyle: {
                backgroundColor: "#4caf50", // Green for success
                color: "#fff",
                fontSize: "14px",
                borderRadius: "8px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                padding: "10px",
            },
        });

    const toastPending = () =>
        toast.info("Creating account...", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            theme: "colored",
            transition: Bounce,
            toastStyle: {
                backgroundColor: "#ffa500", // Orange for pending info
                color: "#fff",
                fontSize: "14px",
                borderRadius: "8px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                padding: "10px",
            },
        });

    const toastError = (message = "Something went wrong") =>
        toast.error(message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            theme: "colored",
            transition: Bounce,
            toastStyle: {
                backgroundColor: "#f44336", // Red for error
                color: "#fff",
                fontSize: "14px",
                borderRadius: "8px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                padding: "10px",
            },
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
                
                {/* Custom File Upload */}
                <label className="custom-file-upload">
                    <input type="file" accept="image/*" onChange={handleImageUpload} required />
                    Upload Profile Picture
                </label>
                {imgPreview && <img src={imgPreview} alt="Profile Preview" className="profile-preview" />}
                
                <label>Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                
                <button type="submit">Register</button>
            </form>

            <a href="/login"><h4>Already have an account? Login</h4></a>

            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                theme="colored"
                transition={Bounce}
                closeButton={({ closeToast }) => (
                    <button
                        onClick={closeToast}
                        style={{
                            fontSize: "10px",
                            backgroundColor: "transparent",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                            width: "20px",
                        }}
                    >
                        ✖
                    </button>
                )}
            />
        </div>
    );
}
