import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/tasks');
        setTasks(res.data);
      } catch (error) {
        console.error('Error fetching tasks', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'DONE').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    overdue: tasks.filter(t => {
      if (!t.dueDate || t.status === 'DONE') return false;
      return new Date(t.dueDate) < new Date();
    }).length,
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Welcome back, {user?.name.split(' ')[0]} 👋</h1>
        <p>Here is what's happening with your projects today.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '12px' }}>
            <CheckCircle size={32} />
          </div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.completed} / {stats.total}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Tasks Completed</div>
          </div>
        </div>
        <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '16px', background: 'rgba(234, 179, 8, 0.1)', color: 'var(--warning)', borderRadius: '12px' }}>
            <Clock size={32} />
          </div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.inProgress}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>In Progress</div>
          </div>
        </div>
        <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '12px' }}>
            <AlertCircle size={32} />
          </div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.overdue}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Overdue Tasks</div>
          </div>
        </div>
      </div>

      <h2 style={{ marginBottom: '16px', fontSize: '20px' }}>Your Recent Tasks</h2>
      <div className="card glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(15, 23, 42, 0.4)', borderBottom: '1px solid var(--glass-border)' }}>
              <th style={{ padding: '16px' }}>Task</th>
              <th style={{ padding: '16px' }}>Project</th>
              <th style={{ padding: '16px' }}>Status</th>
              <th style={{ padding: '16px' }}>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {tasks.slice(0, 5).map(task => (
              <tr key={task.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '16px', fontWeight: '500' }}>{task.title}</td>
                <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{task.project?.name || 'N/A'}</td>
                <td style={{ padding: '16px' }}>
                  <span className={`badge ${task.status}`}>{task.status.replace('_', ' ')}</span>
                </td>
                <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '14px' }}>
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr><td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>No tasks found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
