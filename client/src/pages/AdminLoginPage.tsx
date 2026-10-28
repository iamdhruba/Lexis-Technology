import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginAccount } from '../api';
import AuthShell from '../components/auth/AuthShell';
import PasswordField from '../components/auth/PasswordField';
import { useAuth } from '../context/AuthContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin' : '/', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const data = await loginAccount(email.trim(), password);
      login(data.token, data.user);
      navigate(
        data.user.role === 'admin' || data.user.role === 'superadmin'
          ? '/admin'
          : '/'
      );
    } catch (requestError) {
      setError(
        axios.isAxiosError(requestError)
          ? requestError.response?.data?.error || 'Login failed.'
          : 'Login failed.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell title="Login" subtitle="Enter your account details to continue.">
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
            placeholder="you@example.com"
            className="w-full border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            required
          />
        </label>

        <PasswordField
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          placeholder="Enter your password"
        />

        <div className="flex items-center justify-between gap-4 text-sm">
          <Link
            to="/forgot-password"
            className="font-semibold text-blue-700 hover:text-blue-900"
          >
            Forgot password?
          </Link>
          <Link
            to="/signup"
            className="font-semibold text-blue-700 hover:text-blue-900"
          >
            Create account
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </AuthShell>
  );
}
