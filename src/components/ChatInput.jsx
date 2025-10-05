import React, { useState } from 'react';
import '../css/style.css';
import { getCurrentSessionId, getUserId } from '../utils/session';

function ChatInput({ onSendMessage }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const sessionId = getCurrentSessionId(); // ใช้ session ID ปัจจุบัน
    const userId = getUserId(); // ดึง user ID

    // เพิ่มข้อความของ user ทันที
    onSendMessage(userMessage, null, false);
    
    // แสดง loading state
    setIsLoading(true);
    onSendMessage(null, null, true); // เพิ่ม loading message

    setInput('');

    try {
      const response = await fetch('https://n8n.r0und.xyz/webhook/9a9a560b-1ae9-4bcf-a3ce-3aac8b635830', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          sessionId: sessionId,  // ส่ง sessionId ไปให้ Zep ใน n8n
          userId: userId         // ส่ง userId ไปด้วย (ถ้า n8n ต้องการ)
        }),
      });

      const data = await response.json();
      
      // ลบ loading message และเพิ่ง response จริง
      let aiResponse = '';
      
      if (data.output) {
        aiResponse = data.output;
      } else if (Array.isArray(data) && data[0]?.output) {
        aiResponse = data[0].output;
      } else {
        aiResponse = JSON.stringify(data, null, 2);
      }

      onSendMessage(null, aiResponse, false);
      
    } catch (error) {
      console.error('เกิดข้อผิดพลาด:', error);
      onSendMessage(null, 'ขอโทษค่ะ เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง', false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input">
      <textarea
        id="userInput"
        placeholder="พิมพ์คำถามของคุณ..."
        rows="1"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
      ></textarea>
      <button onClick={handleSend} disabled={isLoading}>
        <i className={isLoading ? "fa-solid fa-circle-notch fa-spin" : "fa-solid fa-paper-plane"}></i>
      </button>
    </div>
  );
}

export default ChatInput;