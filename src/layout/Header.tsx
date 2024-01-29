import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css';

function Header() {
  const navigateHome = () => {
    window.location.href = "/front-end";
  };

  return (
    <header className="container py-3 text-center">
      <div className="custom-header">
        <h1 className="text-white font-weight-bold cursor-pointer" onClick={navigateHome}>
          <span className="text">SPARTA GAMECLUB</span>
        </h1>
      </div>
    </header>
  );
}

export default Header;