import { FaGithub, FaLinkedin, FaTwitter, FaHeart, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      borderTop: '1px solid var(--color-border-subtle)',
      background: 'var(--color-bg-secondary)',
      padding: '40px 24px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        {/* Social Links */}
        <div className="flex items-center" style={{ gap: 20 }}>
          {[
            { icon: <FaGithub />, href: 'https://github.com/HARI4560' },
            { icon: <FaLinkedin />, href: 'https://www.linkedin.com/in/harish-kumar-4b12b2246' },
            { icon: <FaInstagram />, href: 'https://www.instagram.com/unknown.rob0' },
          ].map((social, i) => (
            <a
              key={i}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--color-text-muted)',
                fontSize: '1.25rem',
                transition: 'color 0.3s, transform 0.3s',
              }}
              onMouseEnter={(e) => { e.target.style.color = '#06b6d4'; e.target.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={(e) => { e.target.style.color = 'var(--color-text-muted)'; e.target.style.transform = 'translateY(0)'; }}
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
          © {year} Harish. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
