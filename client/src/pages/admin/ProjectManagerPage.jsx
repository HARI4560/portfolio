import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../../services/api';

const emptyForm = {
  title: '', description: '', shortDescription: '', techStack: '',
  liveUrl: '', githubUrl: '', category: '', featured: false, order: 0,
};

const ProjectManagerPage = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (err) {
      toast.error('Failed to load projects');
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setThumbnail(null);
    setImages([]);
    setShowForm(true);
  };

  const openEdit = (project) => {
    setEditing(project._id);
    setForm({
      title: project.title || '',
      description: project.description || '',
      shortDescription: project.shortDescription || '',
      techStack: project.techStack?.join(', ') || '',
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      category: project.category || '',
      featured: project.featured || false,
      order: project.order || 0,
    });
    setThumbnail(null);
    setImages([]);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category) {
      toast.error('Title, description, and category are required');
      return;
    }

    setSaving(true);
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (key === 'techStack') {
        formData.append(key, JSON.stringify(form.techStack.split(',').map((t) => t.trim()).filter(Boolean)));
      } else {
        formData.append(key, form[key]);
      }
    });

    if (thumbnail) formData.append('thumbnail', thumbnail);
    images.forEach((img) => formData.append('images', img));

    try {
      if (editing) {
        await api.put(`/projects/${editing}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Project updated!');
      } else {
        await api.post('/projects', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Project created!');
      }
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted');
      fetchProjects();
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>Projects</h1>
        <button className="btn-primary" onClick={openCreate}>
          <span className="flex items-center" style={{ gap: 6 }}><HiPlus /> Add Project</span>
        </button>
      </div>

      {/* Projects Table */}
      <div className="admin-card" style={{ overflow: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Category</th>
              <th>Rating</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id}>
                <td>
                  <div className="flex items-center" style={{ gap: 12 }}>
                    {project.thumbnail?.url && (
                      <img src={project.thumbnail.url} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                    )}
                    <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{project.title}</span>
                  </div>
                </td>
                <td><span className="badge badge-cyan">{project.category}</span></td>
                <td>{project.averageRating > 0 ? `⭐ ${project.averageRating.toFixed(1)} (${project.totalReviews})` : '—'}</td>
                <td>{project.featured ? <span className="badge badge-yellow">Yes</span> : '—'}</td>
                <td>
                  <div className="flex" style={{ gap: 8 }}>
                    <button onClick={() => openEdit(project)} style={{ background: 'none', border: 'none', color: 'var(--color-accent-cyan)', cursor: 'pointer', fontSize: '1.1rem' }}>
                      <HiPencil />
                    </button>
                    <button onClick={() => handleDelete(project._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.1rem' }}>
                      <HiTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 40 }}>No projects yet. Click "Add Project" to create one.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowForm(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border-accent)', borderRadius: 16, maxWidth: 640, width: '100%', maxHeight: '85vh', overflow: 'auto', padding: 32 }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>{editing ? 'Edit Project' : 'New Project'}</h2>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '1.25rem' }}><HiX /></button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="form-label">Title *</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="form-input" required />
                </div>
                <div>
                  <label className="form-label">Short Description</label>
                  <input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="form-input" maxLength={200} placeholder="Brief summary (max 200 chars)" />
                </div>
                <div>
                  <label className="form-label">Description *</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="form-input" rows={4} required />
                </div>
                <div className="grid sm:grid-cols-2" style={{ gap: 16 }}>
                  <div>
                    <label className="form-label">Category *</label>
                    <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="form-input" placeholder="e.g., Web App, Mobile, etc." required />
                  </div>
                  <div>
                    <label className="form-label">Tech Stack (comma-separated)</label>
                    <input value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} className="form-input" placeholder="React, Node.js, MongoDB" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2" style={{ gap: 16 }}>
                  <div>
                    <label className="form-label">Live URL</label>
                    <input value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} className="form-input" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="form-label">GitHub URL</label>
                    <input value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} className="form-input" placeholder="https://github.com/..." />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2" style={{ gap: 16 }}>
                  <div>
                    <label className="form-label">Thumbnail Image</label>
                    <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} className="form-input" style={{ padding: 10 }} />
                  </div>
                  <div>
                    <label className="form-label">Gallery Images</label>
                    <input type="file" accept="image/*" multiple onChange={(e) => setImages([...e.target.files])} className="form-input" style={{ padding: 10 }} />
                  </div>
                </div>
                <div className="flex items-center" style={{ gap: 24 }}>
                  <label className="flex items-center" style={{ gap: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} style={{ accentColor: 'var(--color-accent-cyan)' }} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Featured Project</span>
                  </label>
                  <div>
                    <label className="form-label" style={{ marginBottom: 0 }}>Order</label>
                    <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="form-input" style={{ width: 80, padding: '8px 12px' }} />
                  </div>
                </div>
                <button type="submit" className="btn-primary" disabled={saving} style={{ alignSelf: 'flex-end', opacity: saving ? 0.7 : 1 }}>
                  <span>{saving ? 'Saving...' : editing ? 'Update Project' : 'Create Project'}</span>
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectManagerPage;
