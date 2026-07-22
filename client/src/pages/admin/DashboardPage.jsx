import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiCollection, HiStar, HiMail, HiTrendingUp } from 'react-icons/hi';
import { FaStar } from 'react-icons/fa';
import api from '../../services/api';

const StatCard = ({ icon, label, value, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="admin-card flex items-center"
    style={{ gap: 16 }}
  >
    <div style={{
      width: 48, height: 48, borderRadius: 12,
      background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1.25rem', color,
    }}>
      {icon}
    </div>
    <div>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>{label}</p>
      <p style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>{value}</p>
    </div>
  </motion.div>
);

const DashboardPage = () => {
  const [stats, setStats] = useState({ projects: 0, reviews: 0, messages: 0, avgRating: 0 });
  const [recentMessages, setRecentMessages] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, messagesRes, tokensRes] = await Promise.all([
          api.get('/projects'),
          api.get('/contact'),
          api.get('/reviews/tokens'),
        ]);

        const projects = projectsRes.data;
        const totalReviews = projects.reduce((sum, p) => sum + (p.totalReviews || 0), 0);
        const avgRating = projects.length > 0
          ? projects.reduce((sum, p) => sum + (p.averageRating || 0), 0) / projects.filter(p => p.averageRating > 0).length || 0
          : 0;

        setStats({
          projects: projects.length,
          reviews: totalReviews,
          messages: messagesRes.data.length,
          avgRating: avgRating ? avgRating.toFixed(1) : '0',
        });

        setRecentMessages(messagesRes.data.slice(0, 5));
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', marginBottom: 24 }}>Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4" style={{ gap: 16, marginBottom: 32 }}>
        <StatCard icon={<HiCollection />} label="Total Projects" value={stats.projects} color="#06b6d4" delay={0} />
        <StatCard icon={<HiStar />} label="Total Reviews" value={stats.reviews} color="#8b5cf6" delay={0.1} />
        <StatCard icon={<HiMail />} label="Messages" value={stats.messages} color="#10b981" delay={0.2} />
        <StatCard icon={<HiTrendingUp />} label="Avg Rating" value={stats.avgRating} color="#fbbf24" delay={0.3} />
      </div>

      {/* Recent Messages */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="admin-card">
        <h2 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)', marginBottom: 16 }}>Recent Messages</h2>
        {recentMessages.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>No messages yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentMessages.map((msg) => (
              <div key={msg._id} className="flex items-start justify-between" style={{
                padding: 12, borderRadius: 8, background: msg.read ? 'transparent' : 'rgba(6,182,212,0.05)',
                border: '1px solid var(--color-border-subtle)',
              }}>
                <div style={{ flex: 1 }}>
                  <div className="flex items-center" style={{ gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{msg.name}</span>
                    {!msg.read && <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>New</span>}
                  </div>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{msg.email}</p>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>
                    {msg.message.length > 100 ? msg.message.slice(0, 100) + '...' : msg.message}
                  </p>
                </div>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardPage;
