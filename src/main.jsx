import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Dashboard from './routes/dashboard/Dashboard';
import ChatPage from './routes/chatPage/ChatPage';
import Homepage from './routes/landingPage/LandingPage';

let router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/dashboard",
    children: [
      {path: "/dashboard", element: <Dashboard />}, 
      {path: "/dashboard/chats/:id", element: <ChatPage />}
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
