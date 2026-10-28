import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { getCurrentUser } from '../api';
import type { AuthUser } from '../api';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function storedUser(): AuthUser | null {
  try {
    const value = localStorage.getItem('lexis_user');
    return value ? (JSON.parse(value) as AuthUser) : null;
  } catch {
    localStorage.removeItem('lexis_user');
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(storedUser);
  const [isLoading, setIsLoading] = useState(
    () => !!localStorage.getItem('lexis_token')
  );

  const logout = useCallback(() => {
    localStorage.removeItem('lexis_token');
    localStorage.removeItem('lexis_user');
    setUser(null);
    setIsLoading(false);
  }, []);

  const login = useCallback((token: string, nextUser: AuthUser) => {
    localStorage.setItem('lexis_token', token);
    localStorage.setItem('lexis_user', JSON.stringify(nextUser));
    setUser(nextUser);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('lexis_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    getCurrentUser()
      .then((currentUser) => {
        localStorage.setItem('lexis_user', JSON.stringify(currentUser));
        setUser(currentUser);
      })
      .catch(logout)
      .finally(() => setIsLoading(false));
  }, [logout]);

  useEffect(() => {
    window.addEventListener('lexis:unauthorized', logout);
    return () => window.removeEventListener('lexis:unauthorized', logout);
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin' || user?.role === 'superadmin',
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
