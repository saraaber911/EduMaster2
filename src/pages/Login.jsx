import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GiGraduateCap } from "react-icons/gi";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await login({ email, password });
    setSubmitting(false);
    if (result.ok) {
      navigate('/');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--primary-bg)]">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 w-[420px] shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-gray-50 bg-[var(--primary)] p-3 w-15 h-15 flex items-center justify-center rounded-lg">
            <GiGraduateCap className="text-white w-10 h-10" />
          </div>
          <div className="text-lg font-bold">EduMaster</div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
        <p className="text-sm text-gray-500 mb-6">Log in to continue your learning journey</p>

        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input className="mt-1 mb-4 w-full p-3 rounded-xl bg-gray-100" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" />

        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input type="password" className="mt-1 mb-4 w-full p-3 rounded-xl bg-gray-100" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" />

        {error && <div className="text-red-600 mb-3">{error}</div>}

        <div className="flex items-center justify-between">
          <a className="text-blue-500 text-sm" href="/forget">Forgot password?</a>
          <button className="w-30 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-blue-400 to-blue-500 shadow-md hover:from-blue-500 hover:to-blue-600 transition" disabled={submitting}>{submitting ? 'Logging...' : 'Login'}</button>
        </div>

        <div className="text-center text-sm text-gray-500 mt-6">New here? <a className="text-blue-500" href="/signup">Create an account</a></div>
      </form>
    </div>
  );
}
