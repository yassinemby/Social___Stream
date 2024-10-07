import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/Register.css";

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState(null);
    const [imgPreview, setImgPreview] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('file', image);

        try {
            const res = await axios.post('/api/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Correct content type for FormData
                }
            });
            if (res.status === 200) {
                alert(res.data.message);
                navigate('/login');
            }
        } catch (err) {
            alert(err.response?.data?.message || "Registration failed. Please try again.");
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
        <div className='register'>
            <form onSubmit={handleSubmit}>
                <h1>Register</h1>
                <label>Profile Picture</label>
                <input type="file" onChange={handleImageUpload} />
                {imgPreview && <img src={imgPreview} alt="Profile Preview" />}
                <label>Username</label>
                <input type="text" onChange={(e) => setUsername(e.target.value)} />
                <label>Email</label>
                <input type="text" onChange={(e) => setEmail(e.target.value)} />
                <label>Password</label>
                <input type="password" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Register</button>
            </form>
            <Link to="/login"><h4>Already have an account? Login</h4></Link>
        </div>
    );
}
