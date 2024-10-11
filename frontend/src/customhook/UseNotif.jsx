// useNotif.js
import { useEffect } from 'react';
import io from 'socket.io-client';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const socket = io('http://localhost:5000'); // Connect to the Socket.IO server

const UseNotif = () => {
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    // Listen for notification events from the server
    socket.on('notification', (data) => {
      // Display the notification using react-toastify
      toast(`${data.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        onClick: () => navigate('/notifications'), // Navigate on toast click
      });
    });

    // Cleanup the socket listener on unmount
    return () => {
      socket.off('notification');
    };
  }, [navigate]);

  return (
    <>
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
        theme="dark"
        transition={Bounce}
      />
    </>
  );
};

export default UseNotif;
