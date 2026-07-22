import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiDownload, HiCode, HiSparkles } from 'react-icons/hi';
import api from '../../services/api';

const roles = ['Full Stack Developer', 'UI/UX Enthusiast', 'Problem Solver', 'Creative Thinker'];

const HeroSection = () => {
  const [profile, setProfile] = useState(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    api.get('/profile').then(({ data }) => setProfile(data)).catch(() => { });
  }, []);

  // Typing effect
  useEffect(() => {
    const currentRole = roles[roleIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentRole.substring(0, displayText.length + 1));
        if (displayText === currentRole) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayText(currentRole.substring(0, displayText.length - 1));
        if (displayText === '') {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, isDeleting ? 50 : 100);
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex]);

  const handleDownloadResume = () => {
    if (profile?.resumeFile?.url) {
      window.open(profile.resumeFile.url, '_blank');
    }
  };

  return (
    <section id="hero" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'var(--color-bg-primary)' }}>

      {/* Dynamic Animated Background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
        {/* Subtle grid pattern for technical feel */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(var(--color-border-subtle) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.3,
        }} />

        {/* Glowing Orbs using Framer Motion */}
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', top: '10%', left: '20%', width: '40vw', height: '40vw',
            background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
            filter: 'blur(60px)', borderRadius: '50%',
          }}
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 100, 0], scale: [1, 1.5, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', bottom: '10%', right: '10%', width: '50vw', height: '50vw',
            background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
            filter: 'blur(80px)', borderRadius: '50%',
          }}
        />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto', padding: '0 24px', width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap-reverse', gap: '40px' }}>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: '700px', flex: '1 1 500px' }}>
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '8px 16px', borderRadius: '100px',
                background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.2)',
                color: 'var(--color-accent-cyan)', fontSize: '0.7rem', fontWeight: 400, letterSpacing: '0.05em',
                marginBottom: '24px'
              }}
            >
              <HiSparkles /> Available for new opportunities
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {/* Greeting */}
              <h2 style={{ color: 'var(--color-text-secondary)', fontSize: '1.25rem', fontWeight: 500, marginBottom: 12, letterSpacing: '0.05em' }}>
                Hello, I&apos;m
              </h2>

              {/* Name */}
              <h1 style={{
                fontSize: 'clamp(3rem, 8vw, 5.5rem)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 500,
                lineHeight: 1,
                marginBottom: 15,
                letterSpacing: '-0.02em'
              }}>
                <span className="gradient-text">{profile?.name || 'Your Name'}</span>
              </h1>

              {/* Typing Role */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-text-primary)',
                marginBottom: 15,
                minHeight: '3rem',
                fontWeight: 600
              }}>
                <HiCode style={{ color: 'var(--color-accent-violet)' }} />
                <div>
                  {displayText}
                  <span style={{ animation: 'typing-cursor 0.8s step-end infinite', color: 'var(--color-accent-cyan)' }}>|</span>
                </div>
              </div>

              {/* Tagline */}
              <p style={{
                color: 'var(--color-text-muted)',
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                maxWidth: 600,
                lineHeight: 1.5,
                marginBottom: 38
              }}>
                {profile?.bio || 'Passionate developer building cutting-edge web experiences with modern technologies. Focusing on performance, accessibility, and stellar UX.'}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap" style={{ gap: 20 }}>
                <a href="#projects" onClick={(e) => { e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  <button className="btn-primary" style={{ padding: '16px 36px', fontSize: '1.05rem', borderRadius: '14px' }}>
                    <span>View Projects</span>
                  </button>
                </a>
                <button className="btn-secondary" onClick={handleDownloadResume} style={{ padding: '16px 36px', fontSize: '1.05rem', borderRadius: '14px' }}>
                  <HiDownload style={{ fontSize: '1.2rem' }} /> Download Resume
                </button>
              </div>
            </motion.div>
          </div>

          {/* Profile Avatar */}
          {profile?.avatar?.url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}
            >
              <div style={{
                width: 'clamp(250px, 30vw, 400px)',
                height: 'clamp(250px, 30vw, 400px)',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '4px solid var(--color-border-subtle)',
                boxShadow: '0 0 60px rgba(6,182,212,0.15)'
              }}>
                <img
                  src={profile.avatar.url}
                  alt={profile.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </motion.div>
          )}

        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        style={{
          position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', zIndex: 2,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}
      >
        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div style={{
            width: 30, height: 46, border: '2px solid var(--color-border-subtle)', borderRadius: 20,
            display: 'flex', justifyContent: 'center', paddingTop: 8
          }}>
            <div style={{ width: 4, height: 8, background: 'var(--color-accent-cyan)', borderRadius: 4 }} />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
