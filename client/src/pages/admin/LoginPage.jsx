import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { HiLockClosed } from 'react-icons/hi';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill all fields'); return; }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--color-bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.08), transparent 60%)',
    }}>
      <Toaster position="top-center" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-strong"
        style={{ maxWidth: 420, width: '100%', borderRadius: 20, padding: 40 }}
      >
        <div className="flex flex-col items-center" style={{ gap: 8, marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: 'linear-gradient(135deg, var(--color-accent-cyan), var(--color-accent-violet))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8,
          }}>
            <HiLockClosed style={{ fontSize: '1.5rem', color: 'white' }} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>Admin Login</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="admin@portfolio.com"
              required
            />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
