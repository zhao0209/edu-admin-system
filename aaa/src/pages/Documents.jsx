import { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

function Documents({ userRole }) {
  const { t } = useLanguage();
  const isAdmin = userRole === 'ADMIN';
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    content: '',
    status: 'черновик',
    greeting: ''
  });

  const API = isAdmin
    ? 'http://localhost:8080/api/documents'
    : 'http://localhost:8080/api/documents/approved';

  const fetchDocs = () => {
    setLoading(true);
    setError(null);
    fetch(API)
      .then(res => res.ok ? res.json() : Promise.reject('Ошибка сервера'))
      .then(data => { setDocs(data); setLoading(false); })
      .catch(err => { setError(err.message || err); setLoading(false); });
  };

  useEffect(() => { fetchDocs(); }, [isAdmin]);

  const resetForm = () => {
    setForm({ title: '', content: '', status: 'черновик', greeting: '' });
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 拼接敬语到标题
    const finalTitle = form.greeting ? form.greeting + ' ' + form.title : form.title;
    const payload = { ...form, title: finalTitle };
    delete payload.greeting;

    const url = editId
      ? `http://localhost:8080/api/documents/${editId}`
      : 'http://localhost:8080/api/documents';
    const method = editId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.ok ? res.json() : Promise.reject('Ошибка сохранения'))
      .then(() => { resetForm(); fetchDocs(); })
      .catch(err => alert(t('save_error') + ' ' + err));
  };

  const handleDelete = (id) => {
    if (window.confirm(t('doc_delete_confirm'))) {
      fetch(`http://localhost:8080/api/documents/${id}`, { method: 'DELETE' })
        .then(res => res.ok ? fetchDocs() : Promise.reject('Ошибка удаления'))
        .catch(err => alert(t('delete_error') + ' ' + err));
    }
  };

  const handleEdit = (doc) => {
    // 尝试从标题中分离敬语（简化处理，取第一个空格前为敬语）
    const parts = doc.title.split(' ');
    let greeting = '';
    let title = doc.title;
    if (parts.length > 1 && ['Уважаемый', 'Уважаемая', 'Дорогой', 'Дорогая'].includes(parts[0])) {
      greeting = parts[0];
      title = parts.slice(1).join(' ');
    }
    setForm({ title, content: doc.content, status: doc.status, greeting });
    setEditId(doc.id);
    setShowForm(true);
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>{t('loading')}</p></div>;
  if (error) return <div className="error-container"><i className="ri-error-warning-line error-icon"></i><p>{t('error_prefix')} {error}</p><button onClick={fetchDocs}>{t('retry')}</button></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 className="page-title" style={{ margin: 0 }}>{t('docs_title')}</h2>
          <span style={{ color: '#94a3b8', fontSize: '13px' }}>
            {isAdmin ? t('docs_total') + ' ' + docs.length : t('announcements')}
          </span>
        </div>
      </div>

      {showForm && isAdmin && (
        <form onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: 20, borderRadius: 10, marginBottom: 20, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label>Обращение</label>
            <select value={form.greeting} onChange={e => setForm({...form, greeting: e.target.value})}
              style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}>
              <option value="">Без обращения</option>
              <option value="Уважаемый">Уважаемый</option>
              <option value="Уважаемая">Уважаемая</option>
              <option value="Дорогой">Дорогой</option>
              <option value="Дорогая">Дорогая</option>
            </select>
          </div>
          <div>
            <label>{t('doc_title')}</label>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', width: 200 }} required />
          </div>
          <div>
            <label>{t('doc_content')}</label>
            <input value={form.content} onChange={e => setForm({...form, content: e.target.value})}
              style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', width: 300 }} required />
          </div>
          <div>
            <label>{t('doc_status')}</label>
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
              style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}>
              <option value="черновик">{t('status_draft')}</option>
              <option value="на согласовании">{t('status_review')}</option>
              <option value="утверждён">{t('status_approved')}</option>
              <option value="архив">{t('status_archive')}</option>
            </select>
          </div>
          <button type="submit" style={{ padding: '8px 20px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            {editId ? t('update') : t('add')}
          </button>
          <button type="button" onClick={resetForm} style={{ padding: '8px 20px', background: '#94a3b8', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>{t('cancel')}</button>
        </form>
      )}

      <div className="card-grid">
        {docs.map(doc => (
          <div className="card" key={doc.id}>
            <h3>{doc.title}</h3>
            <p style={{ color: '#475569', margin: '4px 0' }}>{doc.content}</p>
            <div className="info-row">
              <i className="ri-flag-line"></i>
              <span>{doc.status}</span>
            </div>
            {isAdmin && (
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <button onClick={() => handleEdit(doc)} style={{ padding: '4px 12px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>✏️ {t('edit')}</button>
                <button onClick={() => handleDelete(doc.id)} style={{ padding: '4px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>🗑️ {t('delete')}</button>
              </div>
            )}
          </div>
        ))}
        {isAdmin && (
          <div className="card" onClick={() => { resetForm(); setShowForm(true); }}
            style={{
              border: '2px dashed #cbd5e1', justifyContent: 'center', alignItems: 'center',
              cursor: 'pointer', color: '#dc2626', fontWeight: '500', minHeight: '120px',
              display: 'flex', flexDirection: 'column', gap: '6px', background: '#f8fafc'
            }}>
            <span style={{ fontSize: '28px', lineHeight: '1' }}>+</span>
            <span>{t('add_doc')}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Documents;