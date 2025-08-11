import React, { useEffect, useRef } from 'react';
import '../css/style.css';

function ChatWindow({ messages }) {
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  return (
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
          <div key={index} className={`message chat-${message.sender} fade-in`}>
            {message.text}
          </div>
        ))
      )}
    </div>
  );
}

export default ChatWindow;