import React, { useEffect, useRef } from 'react';
import { formatMessage } from '../utils/formatMessage';
import '../css/style.css';

function ChatWindow({ messages }) {
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <div className="window" id="chatWindow" ref={chatWindowRef}>
        {messages.length === 0 ? (
          <div className="chat-placeholder" id="chatPlaceholder">
            <img src="/images/logo_kmutnb.png" alt="Logo" className="logo" />
            <h1> ASK KMUTNB </h1>
            <p style={{ marginTop: '0.2rem', fontWeight: 500 }}>
              แชทบอทผู้ช่วยตอบทุกคำถามเกี่ยวกับการเข้าศึกษาที่ มจพ.
            </p>
            <p style={{ marginTop: '1rem', fontWeight: 400 }}>
              <b>สอบถามได้ทุกเรื่อง เช่น</b><br />
              📝 การเตรียมตัวสอบ | 🧪 ข้อมูลการสอบเข้า | 🎤 การสอบสัมภาษณ์ | 📚 คณะที่เปิดสอน<br />
              รวมถึงรายละเอียดทุนเรียนดี หอพัก และชีวิตในรั้วมหาวิทยาลัย
            </p>
            <p style={{ marginTop: '1.5rem', fontStyle: 'italic', opacity: 0.8 }}>
              เริ่มต้นพิมพ์คำถามของคุณได้เลย...
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} style={{ display: 'flex', width: '100%', justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              {message.type === 'loading' ? (
                <div className="message chat-ai fade-in" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div className="loading-dot" style={{ animationDelay: '0s' }}></div>
                    <div className="loading-dot" style={{ animationDelay: '0.2s' }}></div>
                    <div className="loading-dot" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>กำลังพิมพ์...</span>
                </div>
              ) : (
                <div
                  className={`message chat-${message.sender} fade-in`}
                  style={{ whiteSpace: 'pre-line' }}
                  dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }}
                />
              )}
            </div>
          ))
        )}
      </div>
      <style>{`
        .loading-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #1a1a1a;
          animation: bounce 1.4s infinite ease-in-out;
        }
        
        @keyframes bounce {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </>
  );
}

export default ChatWindow;