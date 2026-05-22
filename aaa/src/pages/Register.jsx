import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

function Register() {
  const { t, toggleLanguage } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (password !== confirmPassword) {
      setMessage(t('register_password_mismatch'));
      setIsError(true);
      return;
    }

    fetch('http://localhost:8080/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.message.includes('успешн') || data.message.includes('成功')) {
          setMessage(t('register_success'));
          setIsError(false);
          setTimeout(() => navigate('/login'), 1500);
        } else {
          setMessage(data.message || t('register_network_error'));
          setIsError(true);
        }
      })
      .catch(() => {
        setMessage(t('register_network_error'));
        setIsError(true);
      });
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'inherit' }}>
      <div style={{
        width: '42%',
        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        color: 'white', padding: '0 40px'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '360px' }}>
          <div style={{ fontSize: '48px', marginBottom: '24px' }}>📝</div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>{t('register_title')}</h1>
          <p style={{ fontSize: '15px', lineHeight: '1.7', opacity: '0.85', fontWeight: '300', whiteSpace: 'pre-line' }}>
            {t('register_subtitle')}
          </p>
        </div>
      </div>

      <div style={{
        flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center',
        background: '#fafbfc', padding: '20px'
      }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '8px', color: '#1e293b' }}>
            {t('register_heading')}
          </h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '32px' }}>
            {t('register_prompt')}
          </p>

          {message && (
            <div style={{
              background: isError ? '#fef2f2' : '#f0fdf4',
              color: isError ? '#dc2626' : '#16a34a',
              padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px'
            }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#334155', fontSize: '14px' }}>
                {t('register_username')}
              </label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                placeholder={t('login_username_placeholder')}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px',
                  fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} required />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#334155', fontSize: '14px' }}>
                {t('register_password')}
              </label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder={t('register_password_placeholder')}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px',
                  fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} required />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#334155', fontSize: '14px' }}>
                {t('register_confirm_password')}
              </label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                placeholder={t('register_confirm_placeholder')}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px',
                  fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} required />
            </div>
            <button type="submit" style={{
              width: '100%', padding: '11px', background: '#dc2626', color: 'white',
              border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer',
              transition: 'background 0.2s'
            }}
              onMouseEnter={(e) => e.target.style.background = '#b91c1c'}
              onMouseLeave={(e) => e.target.style.background = '#dc2626'}>
              {t('register_button')}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748b' }}>
            {t('register_has_account')}{' '}
            <Link to="/login" style={{ color: '#dc2626', textDecoration: 'none', fontWeight: '500' }}>
              {t('register_login_link')}
            </Link>
          </p>

          {/* 语言切换按钮 */}
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button onClick={toggleLanguage} style={{
              background: 'none', border: '1px solid #cbd5e1', borderRadius: '6px',
              padding: '6px 16px', cursor: 'pointer', color: '#dc2626', fontSize: '14px'
            }}>
              <i className="ri-global-line"></i> {t('lang_switch')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;