import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Students from './pages/Students';
import Login from './pages/Login';
import Register from './pages/Register';
import Documents from './pages/Documents';
import Reports from './pages/Reports';
import Schedule from './pages/Schedule';
import Leaves from './pages/Leaves';
import { LanguageProvider, useLanguage } from './LanguageContext';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </LanguageProvider>
  );
}

function AppRoutes() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('STUDENT');
  const [username, setUsername] = useState('');

  return (
    <Routes>
      <Route path="/login" element={
        isLoggedIn ? <Navigate to="/" /> : (
          <Login onLogin={(role, name) => {
            setIsLoggedIn(true);
            setUserRole(role);
            setUsername(name);
          }} />
        )
      } />
      <Route path="/register" element={<Register />} />
      <Route path="/*" element={
        isLoggedIn ? (
          <AppLayout
            userRole={userRole}
            username={username}
            onLogout={() => setIsLoggedIn(false)}
          />
        ) : <Navigate to="/login" />
      } />
    </Routes>
  );
}

function AppLayout({ userRole, username, onLogout }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';
  const { t, toggleLanguage } = useLanguage();
  const isAdmin = userRole === 'ADMIN';

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <i className="ri-graduation-cap-fill"></i>
          <span>{t('sidebar_logo')}</span>
        </div>
        <div style={{ padding: '0 24px', marginBottom: '16px', fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>
          {isAdmin ? '👑 ' + t('role_admin') : '🎓 ' + t('role_student')}
          <br />
          <span style={{ color: '#cbd5e1', fontSize: '12px' }}>{username}</span>
        </div>
        <ul className="nav-links">
          <li><Link to="/" className={isActive('/')}><i className="ri-dashboard-line"></i> {t('menu_home')}</Link></li>
          <li><Link to="/schedule" className={isActive('/schedule')}><i className="ri-calendar-line"></i> {t('menu_schedule')}</Link></li>
          {/* 所有用户可见的请假和文档 */}
          <li><Link to="/leaves" className={isActive('/leaves')}><i className="ri-file-list-3-line"></i> {t('menu_leaves')}</Link></li>
          <li><Link to="/documents" className={isActive('/documents')}><i className="ri-file-text-line"></i> {t('menu_documents')}</Link></li>
          {isAdmin && (
            <>
              <li><Link to="/courses" className={isActive('/courses')}><i className="ri-book-open-line"></i> {t('menu_courses')}</Link></li>
              <li><Link to="/students" className={isActive('/students')}><i className="ri-team-line"></i> {t('menu_personnel')}</Link></li>
              <li><Link to="/reports" className={isActive('/reports')}><i className="ri-bar-chart-line"></i> {t('menu_reports')}</Link></li>
            </>
          )}
          <li style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button onClick={toggleLanguage} style={{
              background: 'none', border: '1px solid #cbd5e1', borderRadius: '6px',
              padding: '6px 12px', margin: '0 12px', cursor: 'pointer',
              color: '#dc2626', fontWeight: '500', fontSize: '14px',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              <i className="ri-global-line"></i> {t('lang_switch')}
            </button>
            <button onClick={onLogout} style={{
              background: 'none', border: 'none', color: '#94a3b8',
              cursor: 'pointer', fontWeight: 500, padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: '12px',
              fontSize: '15px', transition: 'color 0.2s'
            }}
              onMouseEnter={(e) => e.target.style.color = '#dc2626'}
              onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
              <i className="ri-logout-box-line"></i> {t('menu_logout')}
            </button>
          </li>
        </ul>
      </aside>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home userRole={userRole} username={username} />} />
          <Route path="/schedule" element={<Schedule userRole={userRole} />} />
          <Route path="/documents" element={<Documents userRole={userRole} />} />
          <Route path="/leaves" element={<Leaves userRole={userRole} username={username} />} />
          {isAdmin && (
            <>
              <Route path="/courses" element={<Courses />} />
              <Route path="/students" element={<Students />} />
              <Route path="/reports" element={<Reports />} />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
}

export default App;