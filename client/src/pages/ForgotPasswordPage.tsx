import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../api';
import AuthShell from '../components/auth/AuthShell';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    try {
      setMessage(await requestPasswordReset(email.trim()));
    } catch (requestError) {
      setError(
        axios.isAxiosError(requestError)
          ? requestError.response?.data?.error ||
              'The reset email could not be sent.'
          : 'The reset email could not be sent.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Forgot password"
      subtitle="Enter your email and we will send a one-hour reset link."
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
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-700">
            Email address
          </span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            required
          />
        </label>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-900 disabled:opacity-60"
        >
          {isLoading ? 'Sending...' : 'Send reset link'}
        </button>
      </form>
      <p className="mt-5 text-center text-sm">
        <Link to="/login" className="font-semibold text-blue-700">
          Back to login
        </Link>
      </p>
    </AuthShell>
  );
}
