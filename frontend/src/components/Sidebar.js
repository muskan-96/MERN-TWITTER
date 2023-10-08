import React, { useState } from 'react';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faHome, faUser, faSignOutAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';

function Sidebar(props) {
  const [activeLink, setActiveLink] = useState('home');

  const handleClick = (link) => {
    setActiveLink(link);
  };

  return (
    <div className="sidebar">
      <div className={`icon ${activeLink === 'messages' ? 'active' : ''}`} onClick={() => handleClick('messages')}>
        <span className="message-dot"></span>
        <FontAwesomeIcon icon={faEnvelope} className="fa-fw fa-square" />
        <span>Messages</span>
      </div>

      <div className={`icon ${activeLink === 'home' ? 'active' : ''}`} onClick={() => handleClick('home')}>
        <FontAwesomeIcon icon={faHome} />
        <span>Home</span>
      </div>

      <div className={`icon ${activeLink === 'profile' ? 'active' : ''}`} onClick={() => handleClick('profile')}>
        <FontAwesomeIcon icon={faUser} />
        <span>Profile</span>
      </div>

      <div className="icon" onClick={() => handleClick('logout')}>
        <FontAwesomeIcon icon={faSignOutAlt} />
        <span>Logout</span>
      </div>

      <div className="bottom">
        <div className="avatar">
          <FontAwesomeIcon icon={faUserCircle} />
        </div>
        <span>John Doe</span>
      </div>
    </div>
  );
}

export default Sidebar;
