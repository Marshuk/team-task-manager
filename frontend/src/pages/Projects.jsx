import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Folder } from 'lucide-react';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/projects');
      setProjects(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/projects', newProject);
      setShowModal(false);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating project');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Projects</h1>
          <p>Manage your team's projects</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> New Project
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {projects.map(project => (
          <Link to={`/projects/${project.id}`} key={project.id} style={{ textDecoration: 'none' }}>
            <div className="card glass-panel" style={{ transition: 'transform 0.2s', cursor: 'pointer', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '10px', borderRadius: '10px', color: 'var(--primary)' }}>
                  <Folder size={24} />
                </div>
                <h3 style={{ fontSize: '18px' }}>{project.name}</h3>
              </div>
              <p style={{ fontSize: '14px', marginBottom: '20px', minHeight: '44px' }}>
                {project.description || 'No description provided.'}
              </p>
              <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)' }}>
                <span>{project._count?.tasks || 0} tasks</span>
                <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '24px' }}>Create New Project</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Project Name</label>
                <input type="text" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="3" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})}></textarea>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '32px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
