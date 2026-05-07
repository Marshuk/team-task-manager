import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Plus, Calendar, User, Trash2 } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', assigneeId: '' });

  const fetchData = async () => {
    try {
      const [projRes, usersRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/projects/${id}`),
        axios.get('http://localhost:5000/api/users')
      ]);
      setProject(projRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tasks', { ...newTask, projectId: id });
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', dueDate: '', assigneeId: '' });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating task');
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { status: newStatus });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting task');
    }
  };

  if (loading) return <div>Loading project details...</div>;
  if (!project) return <div>Project not found</div>;

  const tasksTodo = project.tasks.filter(t => t.status === 'TODO');
  const tasksInProgress = project.tasks.filter(t => t.status === 'IN_PROGRESS');
  const tasksDone = project.tasks.filter(t => t.status === 'DONE');

  const renderTaskCard = (task) => (
    <div key={task.id} className="card glass-panel" style={{ padding: '16px', marginBottom: '16px', borderLeft: `4px solid ${task.status === 'DONE' ? 'var(--success)' : task.status === 'IN_PROGRESS' ? 'var(--warning)' : 'var(--text-muted)'}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <h4 style={{ fontSize: '15px', fontWeight: '600' }}>{task.title}</h4>
        {user.role === 'ADMIN' && (
          <button onClick={() => handleDeleteTask(task.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }}>
            <Trash2 size={14} />
          </button>
        )}
      </div>
      <p style={{ fontSize: '13px', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{task.description}</p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={12} /> {task.assignee?.name || 'Unassigned'}</div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <select 
          className="badge" 
          value={task.status} 
          onChange={(e) => updateTaskStatus(task.id, e.target.value)}
          disabled={user.role !== 'ADMIN' && task.assignee?.id !== user.id}
          style={{ width: '100%', padding: '6px', background: 'var(--surface)', border: '1px solid var(--glass-border)', color: 'var(--text-main)' }}
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <button onClick={() => navigate('/projects')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '16px', fontSize: '14px' }}>
          <ArrowLeft size={16} /> Back to Projects
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>{project.name}</h1>
            <p>{project.description}</p>
          </div>
          {user?.role === 'ADMIN' && (
            <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}>
              <Plus size={18} /> Add Task
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '16px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--text-muted)' }}></span> To Do ({tasksTodo.length})
          </h3>
          {tasksTodo.map(renderTaskCard)}
        </div>
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '16px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--warning)' }}></span> In Progress ({tasksInProgress.length})
          </h3>
          {tasksInProgress.map(renderTaskCard)}
        </div>
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '16px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)' }}></span> Done ({tasksDone.length})
          </h3>
          {tasksDone.map(renderTaskCard)}
        </div>
      </div>

      {showTaskModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '24px' }}>Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label>Task Title</label>
                <input type="text" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="3" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})}></textarea>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Due Date</label>
                  <input type="date" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Assign To</label>
                  <select value={newTask.assigneeId} onChange={e => setNewTask({...newTask, assigneeId: e.target.value})}>
                    <option value="">Unassigned</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '32px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
