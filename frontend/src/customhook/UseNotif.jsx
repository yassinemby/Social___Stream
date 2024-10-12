import React, { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';  
//https://social-stream-nf3v.onrender.com
// Initialize socket outside component to reuse connection across components
const socket = io("https://social-stream-nf3v.onrender.com", { transports: ["websocket", "polling"] });

export default function UseNotif({ id, user }) {
    const roomIdRef = useRef(id); // Keep track of the current room
    const navigate = useNavigate(); // Create navigate function

    useEffect(() => {
        // Function to emit 'join' event
        const joinRoom = () => {
            if (roomIdRef.current !== id) {
                socket.emit('leave', { room: roomIdRef.current, user: user });
                roomIdRef.current = id; // Update the current room reference
            }
            socket.emit('join', { room: id, user: user });
            console.log(`Joined room ${id}`);
        };

        // Join the room when the component mounts
        joinRoom();

        // Set up the message listener
        const handleMessage = (msg) => {
            if (msg && msg.text) {
                console.log("Received message:", msg);
                toast.success(msg.text, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                    onClick: () => navigate('/notifications')  // Navigate on toast click
                });
            } else {
                console.warn("Received message without text:", msg);
            }
        };

        // Set up the chat listener
        const handleChat = ({ text, receiver }) => {
            if (text && receiver) {
                console.log("Received chat message:", { text, receiver });
                toast.info(text, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                    onClick: () => navigate(`/chatting/${receiver}`)  // Redirect to the chat page on toast click
                });
            } else {
                console.warn("Received chat message without text or receiver:", { text, receiver });
            }
        };

        // Listen for 'message' and 'chat' events from the server
        socket.on('message', handleMessage);
        socket.on('chat', handleChat);

        // Rejoin the room on reconnection
        socket.on('reconnect', () => {
            console.log('Reconnected, joining room again...');
            joinRoom(); // Rejoin the room after reconnecting
        });

        // Check if the socket is connected periodically
        const interval = setInterval(() => {
            if (!socket.connected) {
                console.log('Socket disconnected, attempting to reconnect...');
                socket.connect(); // Attempt to reconnect if disconnected
            }
        }, 5000); // Check every 5 seconds

        // Cleanup function to remove the listeners when unmounted
        return () => {
            socket.off('message', handleMessage);
            socket.off('chat', handleChat); // Remove chat listener
            socket.off('reconnect');
            clearInterval(interval);
        };
    }, [id, user, navigate]); // Dependency array includes `navigate`

    return (
        <div>
            <ToastContainer />
        </div>
    );
}
