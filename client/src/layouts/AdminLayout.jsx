import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  HiViewGrid, HiCollection, HiStar, HiUser, HiMail, HiLogout, HiMenuAlt2, HiX, HiHome,
} from 'react-icons/hi';

const sidebarLinks = [
  { to: '/admin', label: 'Dashboard', icon: <HiViewGrid />, end: true },
  { to: '/admin/projects', label: 'Projects', icon: <HiCollection /> },
  { to: '/admin/reviews', label: 'Review Tokens', icon: <HiStar /> },
  { to: '/admin/profile', label: 'Profile', icon: <HiUser /> },
  { to: '/admin/messages', label: 'Messages', icon: <HiMail /> },
];

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="flex items-center justify-between" style={{ padding: '0 20px', marginBottom: 32 }}>
          <span className="gradient-text" style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
            Admin Panel
          </span>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: '1.25rem', cursor: 'pointer' }}>
            <HiX />
          </button>
        </div>

        {/* Nav Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '0 12px' }}>
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setSidebarOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 16px',
                borderRadius: 10,
                fontSize: '0.9rem',
                fontWeight: 500,
                color: isActive ? 'var(--color-accent-cyan)' : 'var(--color-text-secondary)',
                background: isActive ? 'rgba(6,182,212,0.1)' : 'transparent',
                transition: 'all 0.2s',
                textDecoration: 'none',
              })}
            >
              <span style={{ fontSize: '1.15rem' }}>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div style={{ marginTop: 'auto', padding: '24px 12px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <a
            href="/"
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderRadius: 10,
              fontSize: '0.9rem', color: 'var(--color-text-muted)', textDecoration: 'none',
            }}
          >
            <HiHome style={{ fontSize: '1.15rem' }} /> View Portfolio
          </a>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderRadius: 10,
              fontSize: '0.9rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer',
              width: '100%', textAlign: 'left',
            }}
          >
            <HiLogout style={{ fontSize: '1.15rem' }} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 35 }} className="md:hidden" />
      )}

      {/* Main Content */}
      <div className="admin-content">
        {/* Top Bar */}
        <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
          <button
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', fontSize: '1.5rem', cursor: 'pointer' }}
          >
            <HiMenuAlt2 />
          </button>
          <div className="flex items-center" style={{ gap: 12, marginLeft: 'auto' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-accent-cyan), var(--color-accent-violet))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.85rem', fontWeight: 700, color: 'white',
            }}>
              {admin?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{admin?.name || 'Admin'}</span>
          </div>
        </div>

        {/* Page Content */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
