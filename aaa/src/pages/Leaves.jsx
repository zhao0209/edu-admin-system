import { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

function Leaves({ userRole, username }) {
  const { t } = useLanguage();
  const isAdmin = userRole === 'ADMIN';
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ course: '', date: '', reason: '' });

  const API = 'http://localhost:8080/api/leaves';

  const fetchLeaves = () => {
    setLoading(true);
    setError(null);
    fetch(API)
      .then(res => res.ok ? res.json() : Promise.reject('Ошибка'))
      .then(data => { setLeaves(data); setLoading(false); })
      .catch(err => { setError(err.message || err); setLoading(false); });
  };

  useEffect(() => { fetchLeaves(); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // 关键：把当前登录的用户名作为 student 字段发给后端
      body: JSON.stringify({ ...form, student: username })
    })
      .then(res => res.ok ? res.json() : Promise.reject('Ошибка'))
      .then(() => { setShowForm(false); setForm({ course: '', date: '', reason: '' }); fetchLeaves(); })
      .catch(err => alert('Ошибка: ' + err));
  };

  const handleApprove = (id, action) => {
    fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    })
      .then(res => res.ok ? fetchLeaves() : Promise.reject('Ошибка'))
      .catch(err => alert('Ошибка: ' + err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Удалить?')) {
      fetch(`${API}/${id}`, { method: 'DELETE' })
        .then(res => res.ok ? fetchLeaves() : Promise.reject('Ошибка'))
        .catch(err => alert('Ошибка удаления: ' + err));
    }
  };

  // 学生只看到自己的请假，管理员看到全部
  const filteredLeaves = isAdmin
    ? leaves
    : leaves.filter(l => l.student === username);

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>{t('loading')}</p></div>;
  if (error) return <div className="error-container"><i className="ri-error-warning-line error-icon"></i><p>{t('error_prefix')} {error}</p><button onClick={fetchLeaves}>{t('retry')}</button></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 className="page-title" style={{ margin: 0 }}>📝 {t('leave_title')}</h2>
          <span style={{ color: '#94a3b8', fontSize: '13px' }}>{t('leave_total')} {filteredLeaves.length}</span>
        </div>
      </div>

      {showForm && !isAdmin && (
        <form onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: 20, borderRadius: 10, marginBottom: 20, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label>{t('schedule_course')}</label>
            <input value={form.course} onChange={e => setForm({...form, course: e.target.value})}
              style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', width: 200 }} required />
          </div>
          <div>
            <label>{t('leave_date')}</label>
            <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})}
              style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} required />
          </div>
          <div>
            <label>{t('leave_reason')}</label>
            <input value={form.reason} onChange={e => setForm({...form, reason: e.target.value})}
              style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', width: 200 }} required />
          </div>
          <button type="submit" style={{ padding: '8px 20px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 6 }}>{t('add')}</button>
        </form>
      )}

      <div className="card-grid">
        {filteredLeaves.map(leave => (
          <div className="card" key={leave.id}>
            <p style={{ fontWeight: '600', marginBottom: '4px' }}>{leave.course}</p>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              {leave.student} · {leave.date}
            </p>
            <p style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>{t('leave_reason_short')}: {leave.reason}</p>
            <div className="info-row" style={{ marginTop: '8px' }}>
              <i className="ri-information-line"></i>
              <span style={{
                color: leave.status === 'одобрено' ? '#16a34a' : leave.status === 'отклонено' ? '#dc2626' : '#f59e0b',
                fontWeight: '500'
              }}>
                {leave.status === 'на рассмотрении' ? t('leave_pending')
                  : leave.status === 'одобрено' ? t('leave_approved')
                  : t('leave_rejected')}
              </span>
            </div>
            {isAdmin && leave.status === 'на рассмотрении' && (
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <button onClick={() => handleApprove(leave.id, 'одобрить')} style={{ padding: '4px 12px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>✅ {t('leave_approve')}</button>
                <button onClick={() => handleApprove(leave.id, 'отклонить')} style={{ padding: '4px 12px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>❌ {t('leave_reject')}</button>
              </div>
            )}
            {isAdmin && leave.status !== 'на рассмотрении' && (
              <button onClick={() => handleDelete(leave.id)} style={{ marginTop: 8, padding: '2px 8px', background: '#94a3b8', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>🗑️ {t('delete')}</button>
            )}
          </div>
        ))}
        {!isAdmin && (
          <div className="card" onClick={() => setShowForm(true)}
            style={{ border: '2px dashed #cbd5e1', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: '#dc2626', fontWeight: '500', minHeight: '120px', display: 'flex', flexDirection: 'column', gap: '6px', background: '#f8fafc' }}>
            <span style={{ fontSize: '28px', lineHeight: '1' }}>+</span>
            <span>{t('leave_apply')}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaves;