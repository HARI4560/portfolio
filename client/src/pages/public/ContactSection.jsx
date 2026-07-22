import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ContactSection = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get('/profile').then(({ data }) => setProfile(data)).catch(() => { });
  }, []);


  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill all required fields');
      return;
    }
    setSending(true);
    try {
      await api.post('/contact', form);
      toast.success('Message sent successfully!');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const activeSocialLinks = [
    { icon: <FaGithub />, label: 'GitHub', href: profile?.socialLinks?.github || '#', color: '#fff' },
    { icon: <FaLinkedin />, label: 'LinkedIn', href: profile?.socialLinks?.linkedin || '#', color: '#0077b5' },
    { icon: <FaWhatsapp />, label: 'WhatsApp', href: profile?.socialLinks?.whatsapp || 'https://wa.me/+919334015962', color: '#1da1f2' },
    { icon: <FaEnvelope />, label: 'Email', href: profile?.socialLinks?.email ? `mailto:${profile.socialLinks.email}` : '#', color: '#06b6d4' },
  ].filter(link => link.href && link.href !== '#');

  return (
    <section id="contact" style={{ background: 'var(--color-bg-secondary)' }}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 60 }}
        >
          <h2 className="section-title">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="section-subtitle">Have a project in mind? Let&apos;s work together.</p>
        </motion.div>

        <div className="grid md:grid-cols-5" style={{ gap: 48 }}>
          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-3"
            style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
          >
            <div className="grid sm:grid-cols-2" style={{ gap: 20 }}>
              <div>
                <label className="form-label">Name *</label>
                <input name="name" value={form.name} onChange={handleChange} className="form-input" placeholder="Your name" required />
              </div>
              <div>
                <label className="form-label">Email *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className="form-input" placeholder="your@email.com" required />
              </div>
            </div>
            <div>
              <label className="form-label">Subject</label>
              <input name="subject" value={form.subject} onChange={handleChange} className="form-input" placeholder="Project inquiry" />
            </div>
            <div>
              <label className="form-label">Message *</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                className="form-input"
                placeholder="Tell me about your project..."
                rows={6}
                required
                style={{ resize: 'vertical' }}
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={sending}
              style={{ alignSelf: 'flex-start', opacity: sending ? 0.7 : 1 }}
            >
              <span className="flex items-center" style={{ gap: 8 }}>
                <FaPaperPlane /> {sending ? 'Sending...' : 'Send Message'}
              </span>
            </button>
          </motion.form>

          {/* Social / Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-2"
          >
            <div className="glass" style={{ borderRadius: 16, padding: 32 }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: 24, fontFamily: 'var(--font-heading)' }}>Connect with me</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {activeSocialLinks.length > 0 ? activeSocialLinks.map((link) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                    style={{
                      gap: 14, padding: '12px 16px', borderRadius: 10,
                      border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-secondary)',
                      transition: 'all 0.3s',
                    }}
                    whileHover={{ borderColor: link.color, x: 4, color: link.color }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>{link.icon}</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{link.label}</span>
                  </motion.a>
                )) : <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>No social links added yet.</p>}
              </div>

              {/* Decorative element */}
              <div style={{
                marginTop: 32, padding: 20, borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(139,92,246,0.1))',
                border: '1px solid rgba(6,182,212,0.15)',
              }}>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, textAlign: 'center' }}>
                  💡 Open for freelance projects and full-time opportunities
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
