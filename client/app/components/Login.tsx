'use client';

import { useState } from 'react';
import { LoginFormData } from '../types';

interface LoginProps {
  onLoginSuccess: () => void;
  onShowSignup: () => void; // ← Add this
}

export default function Login({ onLoginSuccess, onShowSignup }: LoginProps) {
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const handleFormChange = (field: string, value: string) => {
    setLoginForm({
      ...loginForm,
      [field]: value,
    });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });

      const data = await response.json();

      localStorage.setItem('token', data.token);

      onLoginSuccess();
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Login to Bookable
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) => handleFormChange('email', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => handleFormChange('password', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Login
          </button>
          <p className="text-center text-sm text-gray-600 mt-2">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onShowSignup}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
