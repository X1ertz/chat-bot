import React from 'react';
import '../css/style.css';

function LeftPanel() {
  return (
    <aside className="left-panel">
      <p> <i className="fa-solid fa-clock-rotate-left"></i> ล่าสุด</p>
      <ul className="chat-list">
        <li>📌 ตัวอย่างประวัติแชทที่เคยสอบถาม และ การสนทนา</li>
        <li>📌 ตัวอย่างประวัติแชทที่เคยสอบถาม และ การสนทนา</li>
        <li>📌 ตัวอย่างประวัติแชทที่เคยสอบถาม และ การสนทนา</li>
      </ul>
    </aside>
  );
}

export default LeftPanel;