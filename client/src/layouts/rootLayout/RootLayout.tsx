import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import {
  ClerkProvider,
  SignedIn,
  UserButton,
} from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './rootLayout.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const queryClient = new QueryClient();

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

const RootLayout: React.FC = () => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <QueryClientProvider client={queryClient}>
        <div className="rootLayout">
          <header>
            <Link to="/" className="logo">
              <img src="/logo.png" alt="Logo" />
              <span>ChatGPT(fake)</span>
            </Link>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          <main>
            <Outlet />
          </main>
        </div>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default RootLayout;