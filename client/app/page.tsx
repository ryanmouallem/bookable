'use client';

import { useState } from 'react';
import Login from './components/Login';
import { Appointment } from './types';
import Signup from './components/Signup';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [showSignup, setShowSignup] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
  <div>
    {isLoggedIn ? (
      <div>
        <h1>Dashboard</h1>
        <p>You're logged in!</p>
      </div>
    ) : showSignup ? (
      <Signup 
        onSignupSuccess={handleLoginSuccess} 
        onShowLogin={() => setShowSignup(false)} 
      />
    ) : (
      <Login 
        onLoginSuccess={handleLoginSuccess}
        onShowSignup={() => setShowSignup(true)}
      />
    )}
  </div>
);
}
