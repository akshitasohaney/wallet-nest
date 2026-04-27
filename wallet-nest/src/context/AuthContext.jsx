import { useState } from 'react';
import { AuthContext } from './AuthCtx';
import { loginRequest, signupRequest, updateProfileRequest } from '../services/authService';

const USERS_KEY = 'wallet-users';
const SESSION_KEY = 'wallet-session';
const TOKEN_KEY = 'wallet-token';
const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/notionists/svg?seed=WalletNest&backgroundColor=10b981';

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(readUsers);
  const [authLoading, setAuthLoading] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');

  const signup = async ({ name, email, password }) => {
    setAuthLoading(true);
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();
    try {
      const response = await signupRequest({ name: normalizedName, email: normalizedEmail, password });
      const session = response?.user || response;
      const receivedToken = response?.token || '';
      if (receivedToken) {
        setToken(receivedToken);
        localStorage.setItem(TOKEN_KEY, receivedToken);
      }
      setUser(session);
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return { ok: true };
    } catch {
      if (users.some((entry) => entry.email === normalizedEmail)) {
        return { ok: false, message: 'Email is already registered.' };
      }

      const avatar = `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(normalizedName || normalizedEmail)}&backgroundColor=10b981`;
      const newUser = { id: Date.now(), name: normalizedName, email: normalizedEmail, password, avatar };
      const nextUsers = [...users, newUser];
      setUsers(nextUsers);
      localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));

      const session = { id: newUser.id, name: newUser.name, email: newUser.email, avatar: newUser.avatar };
      setUser(session);
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return { ok: true };
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async ({ email, password }) => {
    setAuthLoading(true);
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const response = await loginRequest({ email: normalizedEmail, password });
      const session = response?.user || response;
      const receivedToken = response?.token || '';
      if (receivedToken) {
        setToken(receivedToken);
        localStorage.setItem(TOKEN_KEY, receivedToken);
      }
      setUser(session);
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return { ok: true };
    } catch {
      const existing = users.find((entry) => entry.email === normalizedEmail && entry.password === password);
      if (!existing) {
        return { ok: false, message: 'Invalid email or password.' };
      }
      const session = { id: existing.id, name: existing.name, email: existing.email, avatar: existing.avatar || DEFAULT_AVATAR };
      setUser(session);
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return { ok: true };
    } finally {
      setAuthLoading(false);
    }
  };

  const updateProfile = async ({ name, avatar }) => {
    if (!user) return { ok: false, message: 'No active session.' };
    const normalizedName = name.trim();
    if (!normalizedName) return { ok: false, message: 'Name cannot be empty.' };
    setAuthLoading(true);
    try {
      const response = await updateProfileRequest({ name: normalizedName, avatar: avatar || DEFAULT_AVATAR }, token);
      const nextSession = response?.user || { ...user, name: normalizedName, avatar: avatar || DEFAULT_AVATAR };
      setUser(nextSession);
      localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
      return { ok: true };
    } catch {
      const nextUsers = users.map((entry) =>
        entry.id === user.id ? { ...entry, name: normalizedName, avatar: avatar || DEFAULT_AVATAR } : entry,
      );
      setUsers(nextUsers);
      localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));

      const nextSession = { ...user, name: normalizedName, avatar: avatar || DEFAULT_AVATAR };
      setUser(nextSession);
      localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
      return { ok: true };
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user),
    authLoading,
    signup,
    login,
    updateProfile,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
