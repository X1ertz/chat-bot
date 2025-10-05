import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LeftPanel from './components/LeftPanel';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import RightPanel from './components/RightPanel';
import Footer from './components/Footer';
import { loadChatHistory, saveChatHistory, clearChatHistory, saveChatSession } from './utils/session';

import './css/style.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [currentChatSaved, setCurrentChatSaved] = useState(false);
  const [isLoadingOldChat, setIsLoadingOldChat] = useState(false);

  // โหลดประวัติแชทเมื่อ component mount
  useEffect(() => {
    const history = loadChatHistory();
    if (history.length > 0) {
      setMessages(history);
      setCurrentChatSaved(true); // ถ้าโหลดจากประวัติ ถือว่าบันทึกแล้ว
    }
  }, []);

  // บันทึกประวัติแชททุกครั้งที่ messages เปลี่ยน (ยกเว้นตอนโหลดแชทเก่า)
  useEffect(() => {
    if (messages.length > 0 && !isLoadingOldChat) {
      saveChatHistory(messages);
      
      // บันทึกเป็น session เมื่อมีข้อความจาก AI (สนทนาเสร็จ)
      const hasAiResponse = messages.some(msg => msg.sender === 'ai' && msg.type !== 'loading');
      if (hasAiResponse && !currentChatSaved) {
        const messagesWithoutLoading = messages.filter(msg => msg.type !== 'loading');
        saveChatSession(messagesWithoutLoading);
        setCurrentChatSaved(true);
      }
    }
  }, [messages, currentChatSaved, isLoadingOldChat]);

  const handleSendMessage = (userText, aiResponse, isLoading) => {
    if (isLoading) {
      // เพิ่ม loading indicator
      setMessages(prev => [...prev, { type: 'loading', sender: 'ai' }]);
    } else if (userText) {
      // เพิ่มข้อความจาก user
      setMessages(prev => [...prev, { text: userText, sender: 'user' }]);
    } else if (aiResponse) {
      // ลบ loading message และเพิ่ม AI response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.type !== 'loading');
        return [...filtered, { text: aiResponse, sender: 'ai' }];
      });
    }
  };

  // ฟังก์ชันสำหรับเริ่มแชทใหม่
  const handleNewChat = () => {
    // บันทึกแชทปัจจุบันก่อนเริ่มใหม่ (ถ้ายังไม่ได้บันทึก)
    if (messages.length > 0 && !currentChatSaved) {
      const messagesWithoutLoading = messages.filter(msg => msg.type !== 'loading');
      saveChatSession(messagesWithoutLoading);
    }
    
    clearChatHistory();
    setMessages([]);
    setCurrentChatSaved(false);
    setIsLoadingOldChat(false);
    
    // สร้าง session ใหม่
    sessionStorage.removeItem('chatSessionId');
  };

  // ฟังก์ชันสำหรับโหลดแชทจากประวัติ
  const handleLoadChat = (chatMessages, sessionId) => {
    // บันทึกแชทปัจจุบันก่อน (ถ้ายังไม่ได้บันทึก)
    if (messages.length > 0 && !currentChatSaved) {
      const messagesWithoutLoading = messages.filter(msg => msg.type !== 'loading');
      saveChatSession(messagesWithoutLoading);
    }
    
    // ตั้งค่า flag ป้องกันการบันทึกซ้ำ
    setIsLoadingOldChat(true);
    setMessages(chatMessages);
    saveChatHistory(chatMessages);
    setCurrentChatSaved(true); // แชทนี้บันทึกแล้ว ไม่ต้องบันทึกอีก
    
    // Reset flag หลังจาก 500ms
    setTimeout(() => {
      setIsLoadingOldChat(false);
    }, 500);
  };

  return (
    <div className="container">
      <Navbar />
      <LeftPanel onNewChat={handleNewChat} onLoadChat={handleLoadChat} />
      <section className="chat-window">
        <ChatWindow messages={messages} />
        <ChatInput onSendMessage={handleSendMessage} />
      </section>
      <RightPanel />
      <Footer />
    </div>
  );
}

export default App;