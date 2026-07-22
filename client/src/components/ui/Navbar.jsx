import { useState, useEffect } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-strong' : ''
        }`}
      style={{
        padding: scrolled ? '12px 0' : '20px 0',
      }}
    >
      <div className="flex items-center justify-between" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Logo */}
        <motion.a
          href="#hero"
          onClick={(e) => { e.preventDefault(); scrollTo('#hero'); }}
          className="gradient-text"
          style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', fontWeight: 700, cursor: 'pointer' }}
          whileHover={{ scale: 1.05 }}
        >
          Portfolio
        </motion.a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center" style={{ gap: 32 }}>
          {navLinks.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
              style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer' }}
              whileHover={{ color: '#06b6d4', y: -2 }}
              transition={{ duration: 0.2 }}
            >
              {link.label}
            </motion.a>
          ))}

        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ color: 'var(--color-text-primary)', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
        >
          {mobileOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-strong md:hidden"
            style={{ margin: '12px 16px 0', borderRadius: 12, overflow: 'hidden' }}
          >
            <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                  style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', fontWeight: 500 }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
