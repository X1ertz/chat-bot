import React, { useState } from 'react';
import '../css/style.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="navbar">
      <div className="menu-toggle" onClick={toggleMenu}>
        <i className="fa-solid fa-bars"></i>
      </div>
      <ul className={`menu-items ${isMenuOpen ? 'show' : ''}`} id="mobileMenu">
        <li><a href="#"><i className="fa-solid fa-comment"></i> แชท</a></li>
        <li><a href="#"><i className="fa-solid fa-tag"></i> คำถามที่พบบ่อย</a></li>
        <li><a href="#"><i className="fa-solid fa-gear"></i> ตั้งค่า</a></li>
        <li><a href="#"><i className="fa-solid fa-circle-user"></i> ชื่อผู้ใช้</a></li>
      </ul>
    </div>
  );
}

export default Navbar;