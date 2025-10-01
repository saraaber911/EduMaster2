import React, { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';

// changed: use React.createContext() to avoid issues with the named import
// export const AuthContext = React.createContext();
import { AuthContext } from './context';
export { AuthContext};


export function AuthProvider({ children }) {
  // ...existing code...
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // restore auth from localStorage
    const stored = localStorage.getItem('edu_auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user || null);
        setToken(parsed.token || null);
      } catch (e) {
        console.warn('Failed to parse stored auth', e);
      }
    }
    setLoading(false);
  }, []);

  const login = async ({ email, password }) => {
    // ...existing code...
    const url =  'https://edu-master-psi.vercel.app/auth/login';
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        // try to parse JSON error, fallback to text/status
        const text = await res.text();
        let msg;
        try {
          const json = JSON.parse(text);
          msg = json.message || JSON.stringify(json);
        } catch {
          msg = text || res.statusText;
        }
        throw new Error(msg);
      }
      const data = await res.json();
      // Expecting { token, user }
      setToken(data.token);
      setUser(data.user || { email });
      localStorage.setItem('edu_auth', JSON.stringify({ token: data.token, user: data.user || { email } }));
      return { ok: true };
    } catch (err) {
      console.error('Login failed', err);
      return { ok: false, error: err?.message || 'Unknown error' };
    }
  };

  const logout = () => {
    // ...existing code...
    setToken(null);
    setUser(null);
    localStorage.removeItem('edu_auth');
    try {
      if (typeof navigate === 'function') navigate('/auth/login');
    } catch (e) {
      console.warn('Navigation on logout failed', e);
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
