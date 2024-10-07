import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faPlusSquare, faUser, faEnvelope, faSignOutAlt, faCog, faHome ,faSearch} from '@fortawesome/free-solid-svg-icons';
import "../styles/Nav.css";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function Nav() {
  const navigate = useNavigate();
  const handlelogout=async() => {
    try {
      const response =await axios.get('/api/logout', { withCredentials: true });
       if (response.status === 200) {
         navigate('/login');
       }
   }
   catch (err) {
       console.error(err);
   }
   }
  return (
    <div className="nav">
      <ul>
        <li>
        <Link to="/profile"><FontAwesomeIcon icon={faUser} /></Link>
        </li>
        <li>
         <Link to="/notifications"><FontAwesomeIcon icon={faBell} /></Link>
        </li>
        <li>
         <Link  to="/create"><FontAwesomeIcon icon={faPlusSquare} /></Link>
        </li>
        <li>
       <Link to="/home"><FontAwesomeIcon icon={faHome} /></Link>
        </li>
        <Link to="/friends"><FontAwesomeIcon icon={faEnvelope} /></Link>
        <li>
        <a href="/Search">
            <FontAwesomeIcon icon={faSearch} />
          </a>
        </li>
        <li>
        <Link onClick={handlelogout}><FontAwesomeIcon icon={faSignOutAlt} /></Link>
        </li>
      </ul>
    </div>
  );
}
