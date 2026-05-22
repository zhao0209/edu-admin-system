import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

function Home({ userRole, username }) {
  const { t } = useLanguage();
  const isAdmin = userRole === 'ADMIN';
  const navigate = useNavigate();

  // 管理员统计数字
  const [courseCount, setCourseCount] = useState('...');
  const [studentCount, setStudentCount] = useState('...');
  const [todayCount, setTodayCount] = useState('...');
  const [pendingDocs, setPendingDocs] = useState('...');

  // 学生端数据
  const [mySchedule, setMySchedule] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    if (isAdmin) {
      fetch('http://localhost:8080/api/courses')
        .then(res => res.json())
        .then(data => setCourseCount(data.length))
        .catch(() => setCourseCount('?'));
      fetch('http://localhost:8080/api/students')
        .then(res => res.json())
        .then(data => setStudentCount(data.length))
        .catch(() => setStudentCount('?'));
      fetch('http://localhost:8080/api/schedules/today-count')
        .then(res => res.json())
        .then(data => setTodayCount(data.count))
        .catch(() => setTodayCount('?'));
      fetch('http://localhost:8080/api/documents/pending-count')
        .then(res => res.json())
        .then(data => setPendingDocs(data.count))
        .catch(() => setPendingDocs('?'));
    } else {
      fetch('http://localhost:8080/api/schedules')
        .then(res => res.json())
        .then(data => setMySchedule(data))
        .catch(() => setMySchedule([]));
      fetch('http://localhost:8080/api/documents/approved')
        .then(res => res.json())
        .then(data => setAnnouncements(data))
        .catch(() => setAnnouncements([]));
    }
  }, [isAdmin]);

  // 管理员主页
  if (isAdmin) {
    return (
      <div>
        <h2 className="page-title" style={{ marginBottom: '8px' }}>{t('home_welcome')}</h2>
        <p style={{ color: '#64748b', marginBottom: '28px', fontSize: '15px' }}>
          {t('home_subtitle')}
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gap: '20px',
          marginTop: '8px'
        }}>
          <div className="card" onClick={() => navigate('/courses')} style={{ cursor: 'pointer', gridRow: 'span 2', padding: '28px' }}>
            <div style={{ fontSize: '15px', color: '#64748b', marginBottom: '12px' }}>
              <i className="ri-book-open-line" style={{ marginRight: '8px', color: '#dc2626' }}></i>
              {t('home_total_courses')}
            </div>
            <h3 style={{ fontSize: '52px', fontWeight: '700', color: '#1e293b', lineHeight: '1' }}>{courseCount}</h3>
            <p style={{ color: '#dc2626', fontSize: '14px', marginTop: '16px', fontWeight: '500' }}>{t('home_goto_courses')}</p>
          </div>

          <div className="card">
            <div className="info-row">
              <i className="ri-team-line" style={{ color: '#dc2626' }}></i>
              <span>{t('home_total_personnel')}</span>
            </div>
            <h3 style={{ fontSize: '32px', marginTop: '8px' }}>{studentCount}</h3>
          </div>

          <div className="card">
            <div className="info-row">
              <i className="ri-calendar-check-line" style={{ color: '#dc2626' }}></i>
              <span>{t('home_today_classes')}</span>
            </div>
            <h3 style={{ fontSize: '32px', marginTop: '8px' }}>{todayCount}</h3>
          </div>

          <div className="card" style={{ gridColumn: 'span 2' }}>
            <div className="info-row">
              <i className="ri-file-text-line" style={{ color: '#dc2626' }}></i>
              <span>{t('home_pending_docs')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '8px' }}>
              <h3 style={{ fontSize: '32px', color: '#dc2626' }}>{pendingDocs}</h3>
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>{t('home_pending_hint')}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 学生主页
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 className="page-title" style={{ marginBottom: '4px' }}>
            👋 {t('student_hello')}, {username}!
          </h2>
          <p style={{ color: '#64748b', fontSize: '14px' }}>{t('student_role_text')}</p>
        </div>
        <button onClick={() => navigate('/schedule')} style={{
          padding: '10px 24px', background: '#dc2626', color: 'white',
          border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer'
        }}>
          📅 {t('view_full_schedule')}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '16px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="ri-calendar-2-line" style={{ color: '#dc2626' }}></i> {t('student_upcoming')}
          </h3>
          {mySchedule.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>{t('no_classes')}</p>
          ) : (
            <div>
              {mySchedule.slice(0, 3).map((item, idx) => (
                <div key={idx} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: idx < mySchedule.slice(0, 3).length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <p style={{ fontWeight: '600', color: '#1e293b' }}>{item.course}</p>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>{item.day} · {item.time} · {item.room}</p>
                </div>
              ))}
              <button onClick={() => navigate('/schedule')} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: '500', fontSize: '14px' }}>
                {t('view_all')} →
              </button>
            </div>
          )}
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '16px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="ri-megaphone-line" style={{ color: '#dc2626' }}></i> {t('announcements')}
          </h3>
          {announcements.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>{t('no_announcements')}</p>
          ) : (
            <div>
              {announcements.slice(0, 3).map((doc, idx) => (
                <div key={idx} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: idx < announcements.slice(0, 3).length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <p style={{ fontWeight: '600', color: '#1e293b' }}>{doc.title}</p>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>{doc.content?.substring(0, 40)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <button onClick={() => navigate('/schedule')} style={{
          flex: 1, padding: '14px', background: '#f8fafc', border: '1px solid #e2e8f0',
          borderRadius: '8px', cursor: 'pointer', textAlign: 'center', color: '#1e293b', fontWeight: '500'
        }}>
          <i className="ri-calendar-line" style={{ marginRight: '8px', color: '#dc2626' }}></i>
          {t('my_schedule')}
        </button>
        <button onClick={() => navigate('/documents')} style={{
          flex: 1, padding: '14px', background: '#f8fafc', border: '1px solid #e2e8f0',
          borderRadius: '8px', cursor: 'pointer', textAlign: 'center', color: '#1e293b', fontWeight: '500'
        }}>
          <i className="ri-file-text-line" style={{ marginRight: '8px', color: '#dc2626' }}></i>
          {t('school_docs')}
        </button>
      </div>
    </div>
  );
}

export default Home;