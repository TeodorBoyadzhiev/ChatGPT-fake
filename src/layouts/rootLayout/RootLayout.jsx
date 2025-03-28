import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './rootLayout.css';


const RootLayout = () => {
  return (
    <div className="rootLayout">
        <header>
            <Link to="/" className="logo">
                <img src="/logo.png" alt="" />
                <span>ChatGPT(fake)</span>
            </Link>
            <div className="user">User</div>
        </header>
        <main>
            <Outlet />
        </main>
    </div>
  );
};

export default RootLayout;