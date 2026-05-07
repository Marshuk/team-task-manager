import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut, ShieldAlert } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="sidebar">
      <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '8px', color: 'white' }}>
          <CheckSquare size={24} />
        </div>
        <h2 style={{ fontSize: '20px' }}>TaskFlow</h2>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/projects" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <FolderKanban size={20} /> Projects
        </NavLink>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--glass-border)' }}>
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>{user?.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {user?.role === 'ADMIN' && <ShieldAlert size={12} color="var(--warning)" />}
              {user?.role}
            </div>
          </div>
        </div>
        <button className="nav-link" onClick={logout} style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
