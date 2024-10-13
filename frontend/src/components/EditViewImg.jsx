import React, { useState } from 'react';
import Viewimg from '../pages/Viewimg';
import '../components/c-s/EditViewImg.css';
import Editimg from "../components/Editimg";

export default function EditViewImg({ closeViewim, pic }) {
  const [imgClicked, setImgClicked] = useState(false);
  const [editClicked, setEditClicked] = useState(false);

  const handleClose = (e) => {
    // If the user clicks on the background (not the content), close the view
    if (e.target.classList.contains('editviewimg')) {
      closeViewim(); // Call the function to close the view
    }
  };

  const closeView3 = () => {
    setImgClicked(false);
  };

  const closeView4 = () => {
    setEditClicked(false);
  };

  return (
    <div className='editviewimg' onClick={handleClose}>
      <div className='content'>
        <a onClick={() => setEditClicked(true)}>Edit your image</a>
        <a onClick={() => setImgClicked(true)}>View your image</a>
      </div>

      {imgClicked && <Viewimg pic={pic} closeView3={closeView3} />}
      {editClicked &&  <Editimg closeView4={closeView4} />}
    </div>
  );
}
