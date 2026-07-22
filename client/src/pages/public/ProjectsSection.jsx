import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaGithub, FaExternalLinkAlt, FaTimes } from 'react-icons/fa';
import api from '../../services/api';

const StarDisplay = ({ rating, size = '0.9rem' }) => (
  <div className="flex items-center" style={{ gap: 2 }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <FaStar key={star} style={{ fontSize: size, color: star <= rating ? '#fbbf24' : 'var(--color-text-muted)' }} />
    ))}
  </div>
);

const ProjectModal = ({ project, reviews, onClose }) => {
  if (!project) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 60,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-bg-card)', border: '1px solid var(--color-border-accent)',
          borderRadius: 20, maxWidth: 800, width: '100%', maxHeight: '85vh', overflow: 'auto',
        }}
      >
        {/* Header Image */}
        {project.thumbnail?.url && (
          <div style={{ position: 'relative', height: 300, overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
            <img src={project.thumbnail.url} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 50%, var(--color-bg-card))' }} />
          </div>
        )}

        <div style={{ padding: 32 }}>
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.5)',
              border: 'none', color: 'white', width: 36, height: 36, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <FaTimes />
          </button>

          {/* Title & Meta */}
          <div className="flex items-start justify-between flex-wrap" style={{ gap: 16, marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-heading)', marginBottom: 8 }}>{project.title}</h2>
              <div className="flex items-center flex-wrap" style={{ gap: 8 }}>
                <span className="badge badge-cyan">{project.category}</span>
                {project.averageRating > 0 && (
                  <div className="flex items-center" style={{ gap: 6 }}>
                    <StarDisplay rating={Math.round(project.averageRating)} />
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                      ({project.averageRating.toFixed(1)})
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex" style={{ gap: 10 }}>
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  <FaGithub /> Code
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  <span className="flex items-center" style={{ gap: 6 }}><FaExternalLinkAlt /> Live Demo</span>
                </a>
              )}
            </div>
          </div>

          {/* Description */}
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>{project.description}</p>

          {/* Tech Stack */}
          <div className="flex flex-wrap" style={{ gap: 8, marginBottom: 32 }}>
            {project.techStack?.map((tech) => (
              <span key={tech} className="badge badge-violet">{tech}</span>
            ))}
          </div>

          {/* Reviews */}
          {reviews?.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: 16, color: 'var(--color-text-primary)' }}>
                Client Reviews ({reviews.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {reviews.map((rev) => (
                  <div key={rev._id} style={{
                    background: 'var(--color-bg-secondary)', borderRadius: 12,
                    padding: 20, border: '1px solid var(--color-border-subtle)',
                  }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '0.95rem' }}>{rev.clientName}</span>
                        {rev.clientCompany && (
                          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}> · {rev.clientCompany}</span>
                        )}
                      </div>
                      <StarDisplay rating={rev.rating} size="0.85rem" />
                    </div>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{rev.review}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectReviews, setProjectReviews] = useState([]);

  useEffect(() => {
    api.get('/projects').then(({ data }) => setProjects(data)).catch(() => {});
    api.get('/projects/categories').then(({ data }) => setCategories(['All', ...data])).catch(() => setCategories(['All']));
  }, []);

  const filtered = activeCategory === 'All' ? projects : projects.filter((p) => p.category === activeCategory);

  const openProject = async (project) => {
    setSelectedProject(project);
    try {
      const { data } = await api.get(`/projects/${project._id}`);
      setProjectReviews(data.reviews || []);
    } catch {
      setProjectReviews([]);
    }
  };

  return (
    <section id="projects">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 40 }}
        >
          <h2 className="section-title">
            My <span className="gradient-text">Projects</span>
          </h2>
          <p className="section-subtitle">Showcasing my best work and client collaborations</p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap" style={{ gap: 10, marginBottom: 40 }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 20px',
                borderRadius: 20,
                border: activeCategory === cat ? 'none' : '1px solid var(--color-border-subtle)',
                background: activeCategory === cat ? 'linear-gradient(135deg, var(--color-accent-cyan), var(--color-accent-violet))' : 'transparent',
                color: activeCategory === cat ? 'white' : 'var(--color-text-secondary)',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 24 }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="project-card"
                style={{ cursor: 'pointer' }}
                onClick={() => openProject(project)}
              >
                {/* Thumbnail */}
                <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                  {project.thumbnail?.url ? (
                    <img
                      src={project.thumbnail.url}
                      alt={project.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                      onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
                      onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%',
                      background: 'linear-gradient(135deg, var(--color-bg-tertiary), var(--color-bg-card))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--color-text-muted)', fontSize: '2rem',
                    }}>
                      📁
                    </div>
                  )}
                  {project.featured && (
                    <span style={{
                      position: 'absolute', top: 12, right: 12,
                      background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                      color: '#000', padding: '4px 10px', borderRadius: 6,
                      fontSize: '0.7rem', fontWeight: 700,
                    }}>
                      FEATURED
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div style={{ padding: 20 }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: 8 }}>{project.title}</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {project.shortDescription || project.description}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap" style={{ gap: 6, marginBottom: 12 }}>
                    {project.techStack?.slice(0, 4).map((tech) => (
                      <span key={tech} className="badge badge-cyan" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>{tech}</span>
                    ))}
                    {project.techStack?.length > 4 && (
                      <span className="badge badge-violet" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>+{project.techStack.length - 4}</span>
                    )}
                  </div>

                  {/* Rating */}
                  {project.totalReviews > 0 && (
                    <div className="flex items-center" style={{ gap: 8 }}>
                      <StarDisplay rating={Math.round(project.averageRating)} size="0.8rem" />
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                        {project.averageRating.toFixed(1)} ({project.totalReviews})
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--color-text-muted)' }}>
            <p style={{ fontSize: '1.1rem' }}>No projects found in this category.</p>
          </div>
        )}
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} reviews={projectReviews} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProjectsSection;
