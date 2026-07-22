import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiSave, HiPlus, HiTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ProfileEditorPage = () => {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    api.get('/profile').then(({ data }) => setProfile(data)).catch(() => { });
  }, []);

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSocialChange = (field, value) => {
    setProfile({ ...profile, socialLinks: { ...profile.socialLinks, [field]: value } });
  };

  const addSkill = () => {
    setProfile({ ...profile, skills: [...(profile.skills || []), { name: '', level: 80, category: 'General' }] });
  };

  const updateSkill = (index, field, value) => {
    const updated = [...profile.skills];
    updated[index] = { ...updated[index], [field]: value };
    setProfile({ ...profile, skills: updated });
  };

  const removeSkill = (index) => {
    setProfile({ ...profile, skills: profile.skills.filter((_, i) => i !== index) });
  };

  const addExperience = () => {
    setProfile({
      ...profile,
      experience: [...(profile.experience || []), { company: '', role: '', from: '', to: '', current: false, description: '' }],
    });
  };

  const updateExperience = (index, field, value) => {
    const updated = [...profile.experience];
    updated[index] = { ...updated[index], [field]: value };
    setProfile({ ...profile, experience: updated });
  };

  const removeExperience = (index) => {
    setProfile({ ...profile, experience: profile.experience.filter((_, i) => i !== index) });
  };

  const addEducation = () => {
    setProfile({
      ...profile,
      education: [...(profile.education || []), { institution: '', degree: '', field: '', year: '' }],
    });
  };

  const updateEducation = (index, field, value) => {
    const updated = [...profile.education];
    updated[index] = { ...updated[index], [field]: value };
    setProfile({ ...profile, education: updated });
  };

  const removeEducation = (index) => {
    setProfile({ ...profile, education: profile.education.filter((_, i) => i !== index) });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('title', profile.title);
      formData.append('bio', profile.bio);
      formData.append('heroTagline', profile.heroTagline);
      formData.append('heroSubtitle', profile.heroSubtitle);
      formData.append('skills', JSON.stringify(profile.skills));
      formData.append('experience', JSON.stringify(profile.experience));
      formData.append('education', JSON.stringify(profile.education));
      formData.append('socialLinks', JSON.stringify(profile.socialLinks));

      if (resumeFile) formData.append('resume', resumeFile);
      if (avatarFile) formData.append('avatar', avatarFile);

      const { data } = await api.put('/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProfile(data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return <div style={{ color: 'var(--color-text-muted)' }}>Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>Edit Profile</h1>
        <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>
          <span className="flex items-center" style={{ gap: 6 }}><HiSave /> {saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Basic Info */}
        <div className="admin-card">
          <h2 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)', marginBottom: 16 }}>Basic Information</h2>
          <div className="grid sm:grid-cols-2" style={{ gap: 16 }}>
            <div>
              <label className="form-label">Full Name</label>
              <input value={profile.name} onChange={(e) => handleChange('name', e.target.value)} className="form-input" />
            </div>
            <div>
              <label className="form-label">Title / Role</label>
              <input value={profile.title} onChange={(e) => handleChange('title', e.target.value)} className="form-input" />
            </div>
            <div>
              <label className="form-label">Hero Tagline</label>
              <input value={profile.heroTagline} onChange={(e) => handleChange('heroTagline', e.target.value)} className="form-input" />
            </div>
            <div>
              <label className="form-label">Hero Subtitle</label>
              <input value={profile.heroSubtitle} onChange={(e) => handleChange('heroSubtitle', e.target.value)} className="form-input" />
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <label className="form-label">Bio</label>
            <textarea value={profile.bio} onChange={(e) => handleChange('bio', e.target.value)} className="form-input" rows={4} />
          </div>
        </div>

        {/* Files */}
        <div className="admin-card">
          <h2 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)', marginBottom: 16 }}>Files</h2>
          <div className="grid sm:grid-cols-2" style={{ gap: 16 }}>
            <div>
              <label className="form-label">Resume (PDF)</label>
              <input type="file" accept=".pdf" onChange={(e) => setResumeFile(e.target.files[0])} className="form-input" style={{ padding: 10 }} />
              {profile.resumeFile?.url && (
                <a href={profile.resumeFile.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent-cyan)', fontSize: '0.8rem', marginTop: 4, display: 'block' }}>
                  Current resume ↗
                </a>
              )}
            </div>
            <div>
              <label className="form-label">Avatar Image</label>
              <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files[0])} className="form-input" style={{ padding: 10 }} />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="admin-card">
          <h2 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)', marginBottom: 16 }}>Social Links</h2>
          <div className="grid sm:grid-cols-2" style={{ gap: 16 }}>
            {['github', 'linkedin', 'twitter', 'email', 'website'].map((key) => (
              <div key={key}>
                <label className="form-label" style={{ textTransform: 'capitalize' }}>{key}</label>
                <input value={profile.socialLinks?.[key] || ''} onChange={(e) => handleSocialChange(key, e.target.value)} className="form-input" />
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="admin-card">
          <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)' }}>Skills</h2>
            <button onClick={addSkill} style={{ background: 'none', border: '1px solid var(--color-accent-cyan)', color: 'var(--color-accent-cyan)', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 4 }}>
              <HiPlus /> Add
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {profile.skills?.map((skill, i) => (
              <div key={i} className="grid grid-cols-4" style={{ gap: 12, alignItems: 'end' }}>
                <div><input value={skill.name} onChange={(e) => updateSkill(i, 'name', e.target.value)} className="form-input" placeholder="Skill name" /></div>
                <div><input type="number" value={skill.level} onChange={(e) => updateSkill(i, 'level', parseInt(e.target.value))} className="form-input" min={0} max={100} /></div>
                <div><input value={skill.category} onChange={(e) => updateSkill(i, 'category', e.target.value)} className="form-input" placeholder="Category" /></div>
                <button onClick={() => removeSkill(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.1rem', height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><HiTrash /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="admin-card">
          <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)' }}>Experience</h2>
            <button onClick={addExperience} style={{ background: 'none', border: '1px solid var(--color-accent-cyan)', color: 'var(--color-accent-cyan)', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 4 }}>
              <HiPlus /> Add
            </button>
          </div>
          {profile.experience?.map((exp, i) => (
            <div key={i} style={{ padding: 16, border: '1px solid var(--color-border-subtle)', borderRadius: 10, marginBottom: 12 }}>
              <div className="grid sm:grid-cols-2" style={{ gap: 12, marginBottom: 12 }}>
                <div><label className="form-label">Company</label><input value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} className="form-input" /></div>
                <div><label className="form-label">Role</label><input value={exp.role} onChange={(e) => updateExperience(i, 'role', e.target.value)} className="form-input" /></div>
                <div><label className="form-label">From</label><input type="date" value={exp.from ? exp.from.substring(0, 10) : ''} onChange={(e) => updateExperience(i, 'from', e.target.value)} onClick={(e) => { try { e.target.showPicker(); } catch (err) {} }} className="form-input" style={{ cursor: 'pointer' }} /></div>
                <div><label className="form-label">To</label><input type="date" value={exp.to ? exp.to.substring(0, 10) : ''} onChange={(e) => updateExperience(i, 'to', e.target.value)} onClick={(e) => { try { e.target.showPicker(); } catch (err) {} }} className="form-input" disabled={exp.current} style={{ cursor: 'pointer' }} /></div>
              </div>
              <label className="flex items-center" style={{ gap: 8, marginBottom: 12 }}>
                <input type="checkbox" checked={exp.current} onChange={(e) => updateExperience(i, 'current', e.target.checked)} style={{ accentColor: 'var(--color-accent-cyan)' }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Currently working here</span>
              </label>
              <textarea value={exp.description} onChange={(e) => updateExperience(i, 'description', e.target.value)} className="form-input" placeholder="Description" rows={2} />
              <button onClick={() => removeExperience(i)} style={{ marginTop: 8, background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem' }}>Remove</button>
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="admin-card">
          <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)' }}>Education</h2>
            <button onClick={addEducation} style={{ background: 'none', border: '1px solid var(--color-accent-cyan)', color: 'var(--color-accent-cyan)', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 4 }}>
              <HiPlus /> Add
            </button>
          </div>
          {profile.education?.map((edu, i) => (
            <div key={i} className="grid grid-cols-5" style={{ gap: 12, alignItems: 'end', marginBottom: 12 }}>
              <div><input value={edu.institution} onChange={(e) => updateEducation(i, 'institution', e.target.value)} className="form-input" placeholder="Institution" /></div>
              <div><input value={edu.degree} onChange={(e) => updateEducation(i, 'degree', e.target.value)} className="form-input" placeholder="Degree" /></div>
              <div><input value={edu.field} onChange={(e) => updateEducation(i, 'field', e.target.value)} className="form-input" placeholder="Field" /></div>
              <div><input value={edu.year} onChange={(e) => updateEducation(i, 'year', e.target.value)} className="form-input" placeholder="Year" /></div>
              <button onClick={() => removeEducation(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.1rem', height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><HiTrash /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileEditorPage;
