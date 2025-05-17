import { useAuth } from '@clerk/clerk-react';
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Chatlist from '../../components/Chatlist/Chatlist';
import './dashboardLayout.css';

const DashboardLayout: React.FC = () => {
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !userId) {
      navigate('/sign-in');
    }
  }, [isLoaded, userId, navigate]);

  return (
    <> 
      <div className="dashboardLayout">
        {userId &&
          <div className="menu">
            <Chatlist />
          </div>
        }
        <div className="content">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;