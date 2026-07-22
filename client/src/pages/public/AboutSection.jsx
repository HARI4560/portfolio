import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const categoryColors = {
  Frontend: '#06b6d4',
  Backend: '#8b5cf6',
  Database: '#10b981',
  Language: '#ec4899',
  Tools: '#fbbf24',
  General: '#64748b',
};

const formatDate = (date) => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${month}/${year}`;
};

const AboutSection = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get('/profile').then(({ data }) => setProfile(data)).catch(() => { });
  }, []);

  if (!profile) return null;

  const skillsByCategory = profile.skills?.reduce((acc, skill) => {
    const cat = skill.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {}) || {};

  return (
    <section id="about" style={{ background: 'var(--color-bg-secondary)' }}>
      <div className="section-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 60 }}
        >
          <h2 className="section-title">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="section-subtitle">{profile.heroSubtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-2" style={{ gap: 60 }}>
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: 32 }}>
              {profile.bio}
            </p>

            {/* Experience Timeline */}
            {profile.experience?.length > 0 && (
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 24, color: 'var(--color-text-primary)' }}>
                  Experience
                </h3>
                <div style={{ borderLeft: '2px solid var(--color-border-subtle)', paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {profile.experience.map((exp, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      style={{ position: 'relative' }}
                    >
                      {/* Dot */}
                      <div style={{
                        position: 'absolute', left: -31, top: 6, width: 12, height: 12, borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--color-accent-cyan), var(--color-accent-violet))',
                        boxShadow: '0 0 10px rgba(6,182,212,0.4)',
                      }} />
                      <h4 style={{ color: 'var(--color-text-primary)', fontSize: '1rem', fontWeight: 600 }}>{exp.role}</h4>
                      <p style={{ color: 'var(--color-accent-cyan)', fontSize: '0.85rem', marginBottom: 4 }}>{exp.company}</p>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                        {exp.from && formatDate(exp.from)} — {exp.current ? 'Present' : exp.to && formatDate(exp.to)}
                      </p>
                      {exp.description && (
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: 8, lineHeight: 1.6 }}>{exp.description}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 style={{ fontSize: '1.25rem', marginBottom: 24, color: 'var(--color-text-primary)' }}>
              Skills & Technologies
            </h3>

            {Object.entries(skillsByCategory).map(([category, skills]) => (
              <div key={category} style={{ marginBottom: 28 }}>
                <div className="flex items-center" style={{ gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: categoryColors[category] || '#64748b' }} />
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {category}
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {skills.map((skill, i) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      whileHover={{ scale: 1.05, y: -2, borderColor: categoryColors[category] || '#06b6d4', color: 'var(--color-text-primary)' }}
                      style={{
                        padding: '8px 18px',
                        background: 'var(--color-bg-primary)',
                        border: '1px solid var(--color-border-subtle)',
                        borderRadius: '100px',
                        color: 'var(--color-text-secondary)',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        cursor: 'default',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div style={{ 
                        width: 6, height: 6, borderRadius: '50%', 
                        background: categoryColors[category] || '#06b6d4',
                        boxShadow: `0 0 8px ${categoryColors[category] || '#06b6d4'}`
                      }} />
                      {skill.name}
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}

            {/* Education */}
            {profile.education?.length > 0 && (
              <div style={{ marginTop: 36 }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 16, color: 'var(--color-text-primary)' }}>
                  Education
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {profile.education.map((edu, i) => (
                    <div key={i} className="admin-card" style={{ padding: 16 }}>
                      <h4 style={{ color: 'var(--color-text-primary)', fontSize: '0.95rem', fontWeight: 600 }}>{edu.degree}</h4>
                      <p style={{ color: 'var(--color-accent-cyan)', fontSize: '0.85rem' }}>{edu.institution}</p>
                      {edu.year && <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{edu.year}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
