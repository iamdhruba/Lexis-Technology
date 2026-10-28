import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupAccount } from '../api';
import AuthShell from '../components/auth/AuthShell';
import PasswordField from '../components/auth/PasswordField';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await signupAccount(name.trim(), email.trim(), password);
      login(data.token, data.user);
      navigate('/');
    } catch (requestError) {
      setError(
        axios.isAxiosError(requestError)
          ? requestError.response?.data?.error || 'Account creation failed.'
          : 'Account creation failed.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create account"
      subtitle="Register securely with your email address."
    >
      {error && (
        <div
          role="alert"
          className="mb-5 border-l-4 border-red-600 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-700">
            Full name
          </span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            required
          />
        </label>
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
        <PasswordField
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          minLength={8}
          helperText="At least 8 characters with uppercase, lowercase, and a number."
        />
        <PasswordField
          label="Confirm password"
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
          {isLoading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-600">
        Already registered?{' '}
        <Link to="/login" className="font-semibold text-blue-700">
          Login
        </Link>
      </p>
    </AuthShell>
  );
}
