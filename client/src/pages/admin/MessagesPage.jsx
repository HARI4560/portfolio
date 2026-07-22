import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiTrash, HiEye, HiMail } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../../services/api';

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [expanded, setExpanded] = useState(null);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get('/contact');
      setMessages(data);
    } catch (err) {
      toast.error('Failed to load messages');
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/contact/${id}/read`);
      setMessages(messages.map((m) => m._id === id ? { ...m, read: true } : m));
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/contact/${id}`);
      setMessages(messages.filter((m) => m._id !== id));
      toast.success('Message deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div>
      <div className="flex items-center" style={{ gap: 12, marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>Messages</h1>
        {unreadCount > 0 && (
          <span className="badge badge-cyan">{unreadCount} unread</span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((msg) => (
          <motion.div
            key={msg._id}
            layout
            className="admin-card"
            style={{
              cursor: 'pointer',
              borderLeft: msg.read ? '' : '3px solid var(--color-accent-cyan)',
            }}
          >
            <div
              className="flex items-start justify-between"
              onClick={() => {
                setExpanded(expanded === msg._id ? null : msg._id);
                if (!msg.read) markAsRead(msg._id);
              }}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ flex: 1 }}>
                <div className="flex items-center flex-wrap" style={{ gap: 8, marginBottom: 4 }}>
                  <HiMail style={{ color: msg.read ? 'var(--color-text-muted)' : 'var(--color-accent-cyan)' }} />
                  <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '0.95rem' }}>{msg.name}</span>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>({msg.email})</span>
                  {!msg.read && <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>New</span>}
                </div>
                {msg.subject && <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{msg.subject}</p>}
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: 4 }}>
                  {expanded === msg._id ? msg.message : msg.message.length > 120 ? msg.message.slice(0, 120) + '...' : msg.message}
                </p>
              </div>

              <div className="flex items-center" style={{ gap: 8, flexShrink: 0 }}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
                <button onClick={(e) => { e.stopPropagation(); deleteMessage(msg._id); }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1rem' }}>
                  <HiTrash />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--color-text-muted)' }}>
            <HiMail style={{ fontSize: '3rem', marginBottom: 12, opacity: 0.3 }} />
            <p>No messages yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
