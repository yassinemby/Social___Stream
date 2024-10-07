import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons'; 
import "../styles/Card.css"; // Import your CSS file
import exampleImage from '../assets/me.jpeg'; // This assumes your project is configured to use absolute paths
import '../styles/Card.css'; // Import your CSS file
export default function Card() {
  return (
    <>
    <div className="card">
      <div className="card-img">
       <img src={exampleImage} alt="no img" />
      </div>
      <div className="card-description">
        <h4>Description</h4>
      </div>
      <div className="card-reactions">
        <FontAwesomeIcon icon={faHeart} /> {/* Use the correct icon variable */}
      </div>
      <div className="card-comments">
        {/* Add any additional content or comments here */}
        <h3>
          Comments
        </h3>
      </div>
    </div>

    
    </>
    
  );
}
