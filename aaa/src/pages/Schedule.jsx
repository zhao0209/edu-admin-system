import { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

function Schedule({ userRole }) {
  const { t } = useLanguage();
  const isAdmin = userRole === 'ADMIN';
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    course: '',
    day: 'понедельник',
    time: '',
    room: '',
    teacher: ''
  });

  const API = 'http://localhost:8080/api/schedules';

  const fetchSchedules = () => {
    setLoading(true);
    setError(null);
    fetch(API)
      .then(res => res.ok ? res.json() : Promise.reject('Ошибка сервера'))
      .then(data => { setSchedules(data); setLoading(false); })
      .catch(err => { setError(err.message || err); setLoading(false); });
  };

  useEffect(() => { fetchSchedules(); }, []);

  const resetForm = () => {
    setForm({ course: '', day: 'понедельник', time: '', room: '', teacher: '' });
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
      .then(() => { resetForm(); fetchSchedules(); })
      .catch(err => alert(t('save_error') + ' ' + err));
  };

  const handleDelete = (id) => {
    if (window.confirm(t('schedule_delete_confirm'))) {
      fetch(`${API}/${id}`, { method: 'DELETE' })
        .then(res => res.ok ? fetchSchedules() : Promise.reject('Ошибка удаления'))
        .catch(err => alert(t('delete_error') + ' ' + err));
    }
  };

  const handleEdit = (item) => {
    setForm({
      course: item.course,
      day: item.day,
      time: item.time,
      room: item.room,
      teacher: item.teacher
    });
    setEditId(item.id);
    setShowForm(true);
  };

  const days = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница'];
  const dayLabels = {
    понедельник: 'day_monday',
    вторник: 'day_tuesday',
    среда: 'day_wednesday',
    четверг: 'day_thursday',
    пятница: 'day_friday'
  };

  const grouped = days.map(day => ({
    dayKey: day,
    label: t(dayLabels[day]),
    items: schedules.filter(s => s.day === day)
  }));

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>{t('loading')}</p></div>;
  if (error) return (
    <div className="error-container">
      <i className="ri-error-warning-line error-icon"></i>
      <p>{t('error_prefix')} {error}</p>
      <button onClick={fetchSchedules}>{t('retry')}</button>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 className="page-title" style={{ margin: 0 }}>{t('schedule_title')}</h2>
          <span style={{ color: '#94a3b8', fontSize: '13px' }}>{t('schedule_total')} {schedules.length}</span>
        </div>
      </div>

      {showForm && isAdmin && (
        <form onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: 20, borderRadius: 10, marginBottom: 20, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label>{t('schedule_course')}</label>
            <input value={form.course} onChange={e => setForm({...form, course: e.target.value})}
              style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', width: 200 }} required />
          </div>
          <div>
            <label>{t('schedule_day')}</label>
            <select value={form.day} onChange={e => setForm({...form, day: e.target.value})}
              style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}>
              {days.map(day => (
                <option key={day} value={day}>{t(dayLabels[day])}</option>
              ))}
            </select>
          </div>
          <div>
            <label>{t('schedule_time')}</label>
            <input
              type="time"
              value={form.time}
              onChange={e => setForm({...form, time: e.target.value})}
              style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', width: 160 }}
              required
            />
          </div>
          <div>
            <label>{t('schedule_room')}</label>
            <input value={form.room} onChange={e => setForm({...form, room: e.target.value})}
              style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', width: 160 }} required />
          </div>
          <div>
            <label>{t('schedule_teacher')}</label>
            <input value={form.teacher} onChange={e => setForm({...form, teacher: e.target.value})}
              style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', width: 160 }} required />
          </div>
          <button type="submit" style={{ padding: '8px 20px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            {editId ? t('update') : t('add')}
          </button>
          <button type="button" onClick={resetForm} style={{ padding: '8px 20px', background: '#94a3b8', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>{t('cancel')}</button>
        </form>
      )}

      {grouped.map(group => (
        <div key={group.dayKey} style={{ marginBottom: '28px' }}>
          <h3 style={{ color: '#dc2626', marginBottom: '12px', fontSize: '18px' }}>📅 {group.label}</h3>
          <div className="card-grid">
            {group.items.map(item => (
              <div className="card" key={item.id}>
                <h3>{item.course}</h3>
                <p className="teacher">👨‍🏫 {item.teacher}</p>
                <div className="info-row">
                  <i className="ri-time-line"></i>
                  <span>{item.time}</span>
                </div>
                <div className="info-row">
                  <i className="ri-map-pin-line"></i>
                  <span>{item.room}</span>
                </div>
                {isAdmin && (
                  <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                    <button onClick={() => handleEdit(item)} style={{ padding: '4px 12px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>✏️ {t('edit')}</button>
                    <button onClick={() => handleDelete(item.id)} style={{ padding: '4px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>🗑️ {t('delete')}</button>
                  </div>
                )}
              </div>
            ))}
            {isAdmin && (
              <div
                className="card"
                onClick={() => {
                  resetForm();
                  setForm({ ...form, day: group.dayKey });
                  setShowForm(true);
                }}
                style={{
                  border: '2px dashed #cbd5e1',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: '#dc2626',
                  fontWeight: '500',
                  minHeight: '120px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  background: '#f8fafc'
                }}
              >
                <span style={{ fontSize: '28px', lineHeight: '1' }}>+</span>
                <span>{t('add_schedule')}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Schedule;