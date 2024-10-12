import React, { useState } from 'react';
import Viewimg from '../pages/Viewimg';
import '../components/c-s/EditViewImg.css';
import Editimg from "../components/Editimg";

export default function EditViewImg({ closeView, pic }) {
  const [imgClicked, setImgClicked] = useState(false);
  const [editClicked, setEditClicked] = useState(false);

  const handleClose = (e) => {
    // If the user clicks on the background (not the content), close the view
    if (e.target.classList.contains('editviewimg')) {
      closeView(); // Call the function to close the view
    }
  };

  const handleEdit = () => {
    console.log('edit');
    // Your edit functionality here
  };

  const handleImg = () => {
    console.log('img');
  };

  return (
    <div className='editviewimg' onClick={handleClose}>
      <div className='content'>
        <a onClick={() => setEditClicked(true)}>Edit your image</a>
        <a onClick={() => setImgClicked(true)}>View your image</a>
      </div>

      {imgClicked && <Viewimg pic={pic} closeView={closeView} />}
      {editClicked &&  <Editimg closeView={closeView} />}
    </div>
  );
}
