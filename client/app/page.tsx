'use client';

import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Signup from './components/Signup';
import AppointmentList from './components/AppointmentList';
import AppointmentForm from './components/AppointmentForm';
import { Appointment } from './types';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchAppointments();
    }
  }, [isLoggedIn]);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch appointments');
        return;
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        const sorted = data.sort((a, b) => {
          const dateA = new Date(`${a.appointment_date} ${a.appointment_time}`);
          const dateB = new Date(`${b.appointment_date} ${b.appointment_time}`);
          return dateA.getTime() - dateB.getTime();
        });
        setAppointments(sorted);
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Appointment deleted');
      fetchAppointments();
      setDeleteConfirm(null);
    } catch (error) {
      toast.error('Failed to delete appointment');
      console.error('Failed to delete appointment:', error);
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setShowForm(true);
  };

  const handleAppointmentSaved = (isEdit: boolean) => {
    toast.success(isEdit ? 'Appointment updated' : 'Appointment created');
    fetchAppointments();
    setEditingAppointment(null);
    setShowForm(false);
  };

  const handleCancelEdit = () => {
    setEditingAppointment(null);
    setShowForm(false);
  };

  return (
    <div>
      <Toaster position="top-right" />
      {isLoggedIn ? (
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Bookable Dashboard
              </h1>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  setIsLoggedIn(false);
                  setAppointments([]);
                  setEditingAppointment(null);
                  setShowForm(false);
                  toast.success('Logged out successfully');
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>

            {deleteConfirm && (
              <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md pointer-events-auto border-2 border-gray-200">
                  <h3 className="text-xl font-bold mb-4 text-gray-900">
                    Delete Appointment?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleDelete(deleteConfirm)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowForm(!showForm)}
              className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              {showForm ? 'Hide Form' : 'Create Appointment'}
            </button>

            {showForm && (
  <div className="fixed inset-0 flex items-center justify-center z-50 p-6">
    <div 
      className="absolute inset-0 bg-gray-500 opacity-75"
      onClick={handleCancelEdit}
    ></div>
    <div className="bg-gray-50 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl">
      <AppointmentForm
        editingAppointment={editingAppointment}
        onAppointmentSaved={handleAppointmentSaved}
        onCancelEdit={handleCancelEdit}
      />
    </div>
  </div>
)}

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <AppointmentList
                appointments={appointments}
                onEdit={handleEdit}
                onDelete={(id) => setDeleteConfirm(id)}
                fetchAppointments={fetchAppointments}
              />
            )}
          </div>
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
