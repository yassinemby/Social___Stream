import React from 'react';
import "../styles/Viewimg.css"

export default function Viewimg({ pic, closeView3 }) {
  const handleClose = (e) => {
    // If the user clicks on the background (not the image), close the view
    if (e.target.classList.contains('viewimg')) {
      closeView3(); // Call the function to close the view
    }
  };

  return (
    <div className='viewimg' onClick={handleClose}>
      <img src={pic} alt="Profile" />
    </div>
  );
}
