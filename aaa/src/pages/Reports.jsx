import { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

function Reports() {
  const { t } = useLanguage();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    type: 'академическая',
    recipient: '',   // 呈报对象
    content: ''       // 报告正文（可包含数字，但需用语句描述）
  });

  const API = 'http://localhost:8080/api/reports';

  const fetchReports = () => {
    setLoading(true);
    setError(null);
    fetch(API)
      .then(res => res.ok ? res.json() : Promise.reject('Ошибка сервера'))
      .then(data => { setReports(data); setLoading(false); })
      .catch(err => { setError(err.message || err); setLoading(false); });
  };

  useEffect(() => { fetchReports(); }, []);

  const resetForm = () => {
    setForm({ name: '', type: 'академическая', recipient: '', content: '' });
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 构建正式报告内容：敬词 + 正文
    let finalContent = form.content;
    if (form.recipient) {
      const prefix = t('report_greeting_prefix') + form.recipient + ':\n\n';
      if (!finalContent.startsWith(prefix)) {
        finalContent = prefix + finalContent;
      }
    }
    const payload = {
      name: form.name,
      type: form.type,
      recipient: form.recipient,
      data: finalContent   // 后端 data 字段保存完整内容
    };

    const url = editId ? `${API}/${editId}` : API;
    const method = editId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.ok ? res.json() : Promise.reject('Ошибка сохранения'))
      .then(() => { resetForm(); fetchReports(); })
      .catch(err => alert(t('save_error') + ' ' + err));
  };

  const handleDelete = (id) => {
    if (window.confirm(t('report_delete_confirm'))) {
      fetch(`${API}/${id}`, { method: 'DELETE' })
        .then(res => res.ok ? fetchReports() : Promise.reject('Ошибка удаления'))
        .catch(err => alert(t('delete_error') + ' ' + err));
    }
  };

  const handleEdit = (rep) => {
    setForm({
      name: rep.name,
      type: rep.type,
      recipient: rep.recipient || '',
      content: rep.data || ''
    });
    setEditId(rep.id);
    setShowForm(true);
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>{t('loading')}</p></div>;
  if (error) return (
    <div className="error-container">
      <i className="ri-error-warning-line error-icon"></i>
      <p>{t('error_prefix')} {error}</p>
      <button onClick={fetchReports}>{t('retry')}</button>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 className="page-title" style={{ margin: 0 }}>{t('reports_title')}</h2>
          <span style={{ color: '#94a3b8', fontSize: '13px' }}>{t('reports_total')} {reports.length}</span>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: 20, borderRadius: 10, marginBottom: 20, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label>{t('report_name')}</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              placeholder={t('report_name_placeholder')}
              style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', width: 220 }} required />
          </div>
          <div>
            <label>{t('report_type')}</label>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
              style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}>
              <option value="академическая">{t('type_academic')}</option>
              <option value="посещаемость">{t('type_attendance')}</option>
              <option value="ресурс">{t('type_resource')}</option>
            </select>
          </div>
          <div>
            <label>{t('report_recipient')}</label>
            <select value={form.recipient} onChange={e => setForm({...form, recipient: e.target.value})}
              style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', width: 200 }}>
              <option value="">{t('report_recipient_select')}</option>
              <option value={t('report_recipient_rector')}>{t('report_recipient_rector')}</option>
              <option value={t('report_recipient_dean')}>{t('report_recipient_dean')}</option>
              <option value={t('report_recipient_academic')}>{t('report_recipient_academic')}</option>
              <option value={t('report_recipient_hr')}>{t('report_recipient_hr')}</option>
            </select>
          </div>
          <div style={{ width: '100%', marginTop: '10px' }}>
            <label>{t('report_content')}</label>
            <textarea
              value={form.content}
              onChange={e => setForm({...form, content: e.target.value})}
              placeholder={t('report_content_placeholder')}
              rows={6}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 6,
                border: '1px solid #cbd5e1', fontFamily: 'inherit', fontSize: '14px',
                resize: 'vertical', lineHeight: '1.6'
              }}
              required
            />
            <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
              {t('report_content_hint')}
            </p>
          </div>
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ padding: '8px 20px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
              {editId ? t('update') : t('add')}
            </button>
            <button type="button" onClick={resetForm} style={{ padding: '8px 20px', background: '#94a3b8', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>{t('cancel')}</button>
          </div>
        </form>
      )}

      <div className="card-grid">
        {reports.map(rep => (
          <div className="card" key={rep.id} style={{ padding: '20px' }}>
            <div style={{ marginBottom: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>{rep.name}</h3>
              <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                <span style={{ background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>
                  {rep.type}
                </span>
                {rep.recipient && (
                  <span style={{ background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                    📩 {rep.recipient}
                  </span>
                )}
              </div>
            </div>
            <p style={{ color: '#334155', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap', margin: '8px 0' }}>
              {rep.data?.substring(0, 120)}{rep.data?.length > 120 ? '...' : ''}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                {rep.createTime?.substring(0, 10) || ''}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleEdit(rep)} style={{ padding: '4px 12px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '13px' }}>
                  ✏️ {t('edit')}
                </button>
                <button onClick={() => handleDelete(rep.id)} style={{ padding: '4px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '13px' }}>
                  🗑️ {t('delete')}
                </button>
              </div>
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
          <span>{t('add_report')}</span>
        </div>
      </div>
    </div>
  );
}

export default Reports;