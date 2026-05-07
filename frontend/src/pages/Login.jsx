import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="glass-panel auth-container animate-fade-in">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ color: 'var(--primary)', marginBottom: '8px' }}>Welcome Back</h1>
          <p>Log in to manage your team's tasks</p>
        </div>
        
        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="name@company.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
            <LogIn size={18} /> Sign In
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
