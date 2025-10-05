import React, { useState, useEffect } from 'react';
import { getAllChatSessions, deleteChatSession, deleteAllChatSessions } from '../utils/session';
import '../css/style.css';

function LeftPanel({ onLoadChat, onNewChat }) {
  const [sessions, setSessions] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadSessions();
  }, [refreshKey]);

  const loadSessions = () => {
    const allSessions = getAllChatSessions();
    setSessions(allSessions);
  };

  const handleDeleteSession = (e, sessionId) => {
    e.stopPropagation(); // ป้องกันไม่ให้คลิกโหลดแชท
    if (window.confirm('คุณต้องการลบแชทนี้หรือไม่?')) {
      deleteChatSession(sessionId);
      setRefreshKey(prev => prev + 1); // Force refresh
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm('คุณต้องการลบประวัติแชททั้งหมดหรือไม่?')) {
      deleteAllChatSessions();
      setSessions([]);
      setRefreshKey(prev => prev + 1); // Force refresh
    }
  };

  const handleLoadChat = (session) => {
    if (onLoadChat) {
      onLoadChat(session.messages, session.id); // ส่ง session id ด้วย
    }
  };

  const handleNewChatClick = () => {
    if (onNewChat) {
      onNewChat();
      setRefreshKey(prev => prev + 1); // Refresh list
    }
  };

  // Refresh sessions เมื่อมี props เปลี่ยน
  useEffect(() => {
    loadSessions();
  }, [onLoadChat, onNewChat]);

  return (
    <aside className="left-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <p style={{ margin: 0 }}>
          <i className="fa-solid fa-clock-rotate-left"></i> ล่าสุด
        </p>
      </div>

      {/* ปุ่ม New Chat และ Delete All */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
        <button
          onClick={handleNewChatClick}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '10px',
            border: 'none',
            background: 'rgba(211, 224, 220, 0.8)',
            backdropFilter: 'blur(10px)',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            boxShadow: 'rgba(0, 0, 0, 0.3) 0px 1px 15px'
          }}
          onMouseEnter={(e) => e.target.style.background = '#D3E0DC'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(211, 224, 220, 0.8)'}
        >
          <i className="fa-solid fa-plus"></i> แชทใหม่
        </button>
        <button
          onClick={handleDeleteAll}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '10px',
            border: 'none',
            background: 'rgba(211, 117, 107, 0.8)',
            backdropFilter: 'blur(10px)',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            boxShadow: 'rgba(0, 0, 0, 0.3) 0px 1px 15px',
            color: '#fff'
          }}
          onMouseEnter={(e) => e.target.style.background = '#D3756B'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(211, 117, 107, 0.8)'}
        >
          <i className="fa-solid fa-trash"></i> ลบทั้งหมด
        </button>
      </div>

      {/* รายการประวัติแชท */}
      <ul className="chat-list" style={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto' }}>
        {sessions.length === 0 ? (
          <li style={{ textAlign: 'center', opacity: 0.6, cursor: 'default' }}>
            ยังไม่มีประวัติแชท
          </li>
        ) : (
          sessions.map((session) => (
            <li
              key={session.id}
              onClick={() => handleLoadChat(session)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative'
              }}
            >
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis',
                  fontSize: '0.95rem'
                }}>
                  💬 {session.title}
                </div>
                <div style={{ 
                  fontSize: '0.7rem', 
                  opacity: 0.7, 
                  marginTop: '4px' 
                }}>
                  {new Date(session.timestamp).toLocaleDateString('th-TH', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <button
                onClick={(e) => handleDeleteSession(e, session.id)}
                style={{
                  background: 'rgba(211, 117, 107, 0.8)',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '5px 10px',
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: '0.8rem',
                  marginLeft: '10px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#D3756B'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(211, 117, 107, 0.8)'}
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </li>
          ))
        )}
      </ul>
    </aside>
  );
}

export default LeftPanel;