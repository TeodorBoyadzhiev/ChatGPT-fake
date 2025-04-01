import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import './rootLayout.css';


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const RootLayout = () => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <div className="rootLayout">
          <header>
              <Link to="/" className="logo">
                  <img src="/logo.png" alt="" />
                  <span>ChatGPT(fake)</span>
              </Link>
              <div className="user">User</div>
              <SignedIn>
                <UserButton />
              </SignedIn>
          </header>
          <main>
              <Outlet />
          </main>
      </div>
    </ClerkProvider>
  );
};

export default RootLayout;