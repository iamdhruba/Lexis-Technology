import axios from 'axios';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../api';
import AuthShell from '../components/auth/AuthShell';
import PasswordField from '../components/auth/PasswordField';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(
    token ? '' : 'This password reset link is missing its token.'
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      setMessage(await resetPassword(token, password));
      setPassword('');
      setConfirmPassword('');
    } catch (requestError) {
      setError(
        axios.isAxiosError(requestError)
          ? requestError.response?.data?.error || 'Password reset failed.'
          : 'Password reset failed.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Reset password"
      subtitle="Choose a strong new password for your account."
    >
      {message && (
        <div className="mb-5 border-l-4 border-blue-600 bg-blue-50 p-3 text-sm text-blue-800">
          {message}
        </div>
      )}
      {error && (
        <div
          role="alert"
          className="mb-5 border-l-4 border-red-600 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}
      {!message && token && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <PasswordField
            label="New password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            minLength={8}
            helperText="At least 8 characters with uppercase, lowercase, and a number."
          />
          <PasswordField
            label="Confirm new password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
            minLength={8}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-900 disabled:opacity-60"
          >
            {isLoading ? 'Resetting...' : 'Reset password'}
          </button>
        </form>
      )}
      <p className="mt-5 text-center text-sm">
        <Link to="/login" className="font-semibold text-blue-700">
          Go to login
        </Link>
      </p>
    </AuthShell>
  );
}
