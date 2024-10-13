import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';   
import "../styles/Input.css";

export default function Input({ closeView, handleSubmit, message, setMessage }) {
    
    const handleClose = (e) => {
        if (e.target.classList.contains('input')) {
            closeView(); 
        }
    };

    const onSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission

        // Basic validation: prevent submission if message is empty
        if (!message.trim()) {
            return; // Optionally, you could add some feedback here
        }

        handleSubmit(e); // Call the provided submit handler
        setMessage(''); // Clear the input field after submitting
    };

    return (
        <div className="input" onClick={handleClose}>
            <form onSubmit={onSubmit} aria-label="Message form">
                <input
                    type="text"
                    placeholder="Write a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    aria-label="Message input" // Accessibility label
                    required // This ensures the input is not empty before submission
                />
                <button type="submit" aria-label="Send message">
                    <FontAwesomeIcon icon={faPaperPlane} />
                </button>
            </form>
        </div>
    );
}

// PropTypes for better type checking
Input.propTypes = {
    closeView: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
    setMessage: PropTypes.func.isRequired,
};
