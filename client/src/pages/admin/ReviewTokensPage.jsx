import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiPaperAirplane } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ReviewTokensPage = () => {
  const [projects, setProjects] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [form, setForm] = useState({ projectId: '', clientName: '', clientEmail: '' });
  const [sending, setSending] = useState(false);

  const fetchData = async () => {
    try {
      const [projectsRes, tokensRes] = await Promise.all([
        api.get('/projects'),
        api.get('/reviews/tokens'),
      ]);
      setProjects(projectsRes.data);
      setTokens(tokensRes.data);
    } catch (err) {
      toast.error('Failed to load data');
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSendToken = async (e) => {
    e.preventDefault();
    if (!form.projectId || !form.clientName || !form.clientEmail) {
      toast.error('All fields are required');
      return;
    }

    setSending(true);
    try {
      await api.post('/reviews/send-token', form);
      toast.success(`Review link sent to ${form.clientEmail}!`);
      setForm({ projectId: '', clientName: '', clientEmail: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send review link');
    } finally {
      setSending(false);
    }
  };

  const getStatusBadge = (token) => {
    if (token.used) return <span className="badge badge-green">✓ Used</span>;
    if (token.isExpired || new Date(token.expiresAt) < new Date()) return <span className="badge badge-red">Expired</span>;
    return <span className="badge badge-yellow">Pending</span>;
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', marginBottom: 24 }}>Review Tokens</h1>

      {/* Send Token Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="admin-card"
        style={{ marginBottom: 24 }}
      >
        <h2 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)', marginBottom: 16 }}>Send Review Request</h2>
        <form onSubmit={handleSendToken}>
          <div className="grid sm:grid-cols-1">
            <label className="form-label">Project *</label>
            <select
              value={form.projectId}
              onChange={(e) => setForm({ ...form, projectId: e.target.value })}
              className="form-input"
              required
            >
              <option value="">Select project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.title}</option>
              ))}
            </select>
          </div><br />
          <div className="grid sm:grid-cols-2" style={{ gap: 12, alignItems: 'end' }}>
            <div>
              <label className="form-label">Client Name *</label>
              <input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} className="form-input" placeholder="John Doe" required />
            </div>
            <div>
              <label className="form-label">Client Email *</label>
              <input type="email" value={form.clientEmail} onChange={(e) => setForm({ ...form, clientEmail: e.target.value })} className="form-input" placeholder="client@email.com" required />
            </div>
          </div><br />
          <div className="flex justify-end">
            <button type="submit" className="btn-primary" disabled={sending} style={{ opacity: sending ? 0.8 : 1 }}>
              <span className="flex items-center" style={{ gap: 8 }}> {sending ? 'Sending...' : 'Send'}</span>
            </button>
          </div>
        </form>
      </motion.div>

      {/* Tokens Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="admin-card" style={{ overflow: 'auto' }}>
        <h2 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)', marginBottom: 16 }}>Sent Tokens</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Email</th>
              <th>Project</th>
              <th>Status</th>
              <th>Expires</th>
              <th>Sent</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token) => (
              <tr key={token._id}>
                <td style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{token.clientName}</td>
                <td>{token.clientEmail}</td>
                <td>{token.projectId?.title || '—'}</td>
                <td>{getStatusBadge(token)}</td>
                <td>{new Date(token.expiresAt).toLocaleDateString()}</td>
                <td>{new Date(token.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {tokens.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 40 }}>No tokens sent yet.</td></tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default ReviewTokensPage;
