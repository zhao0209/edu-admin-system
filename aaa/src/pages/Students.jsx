import { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

function Students() {
  const { t } = useLanguage();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    position: '',
    location: ''
  });

  const API = 'http://localhost:8080/api/students';

  const fetchStudents = () => {
    setLoading(true);
    setError(null);
    fetch(API)
      .then(res => res.ok ? res.json() : Promise.reject('Ошибка сервера'))
      .then(data => { setStudents(data); setLoading(false); })
      .catch(err => { setError(err.message || err); setLoading(false); });
  };

  useEffect(() => { fetchStudents(); }, []);

  const resetForm = () => {
    setForm({ name: '', email: '', position: '', location: '' });
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editId ? `${API}/${editId}` : API;
    const method = editId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.ok ? res.json() : Promise.reject('Ошибка сохранения'))
      .then(() => { resetForm(); fetchStudents(); })
      .catch(err => alert(t('save_error') + ' ' + err));
  };

  const handleDelete = (id) => {
    if (window.confirm(t('person_delete_confirm'))) {
      fetch(`${API}/${id}`, { method: 'DELETE' })
        .then(res => res.ok ? fetchStudents() : Promise.reject('Ошибка удаления'))
        .catch(err => alert(t('delete_error') + ' ' + err));
    }
  };

  const handleEdit = (student) => {
    setForm({
      name: student.name,
      email: student.email,
      position: student.position || '',
      location: student.location || ''
    });
    setEditId(student.id);
    setShowForm(true);
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>{t('loading')}</p></div>;
  if (error) return (
    <div className="error-container">
      <i className="ri-error-warning-line error-icon"></i>
      <p>{t('error_prefix')} {error}</p>
      <button onClick={fetchStudents}>{t('retry')}</button>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 className="page-title" style={{ margin: 0 }}>{t('personnel_title')}</h2>
          <span style={{ color: '#94a3b8', fontSize: '13px' }}>{t('personnel_total')} {students.length}</span>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: 20, borderRadius: 10, marginBottom: 20, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label>{t('name')}</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', width: 200 }} required />
          </div>
          <div>
            <label>{t('email')}</label>
            <input value={form.email} onChange={e => setForm({...form, email: e.target.value})}
              style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', width: 200 }} required />
          </div>
          <div>
            <label>{t('position')}</label>
            <input value={form.position} onChange={e => setForm({...form, position: e.target.value})}
              placeholder={t('position_placeholder')}
              style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', width: 160 }} />
          </div>
          <div>
            <label>{t('location')}</label>
            <input value={form.location} onChange={e => setForm({...form, location: e.target.value})}
              placeholder={t('location_placeholder')}
              style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', width: 160 }} />
          </div>
          <button type="submit" style={{ padding: '8px 20px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            {editId ? t('update') : t('add')}
          </button>
          <button type="button" onClick={resetForm} style={{ padding: '8px 20px', background: '#94a3b8', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>{t('cancel')}</button>
        </form>
      )}

      <div className="card-grid">
        {students.map(student => (
          <div className="card" key={student.id}>
            <h3>{student.name}</h3>
            <div className="info-row">
              <i className="ri-mail-line"></i>
              <span>{student.email}</span>
            </div>
            {student.position && (
              <div className="info-row">
                <i className="ri-briefcase-line"></i>
                <span>{student.position}</span>
              </div>
            )}
            {student.location && (
              <div className="info-row">
                <i className="ri-map-pin-line"></i>
                <span>{student.location}</span>
              </div>
            )}
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <button onClick={() => handleEdit(student)} style={{ padding: '4px 12px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>✏️ {t('edit')}</button>
              <button onClick={() => handleDelete(student.id)} style={{ padding: '4px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>🗑️ {t('delete')}</button>
            </div>
          </div>
        ))}
        <div className="card" onClick={() => { resetForm(); setShowForm(true); }}
          style={{
            border: '2px dashed #cbd5e1', justifyContent: 'center', alignItems: 'center',
            cursor: 'pointer', color: '#dc2626', fontWeight: '500', minHeight: '120px',
            display: 'flex', flexDirection: 'column', gap: '6px', background: '#f8fafc'
          }}>
          <span style={{ fontSize: '28px', lineHeight: '1' }}>+</span>
          <span>{t('add_person')}</span>
        </div>
      </div>
    </div>
  );
}

export default Students;