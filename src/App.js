import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LeftPanel from './components/LeftPanel';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import RightPanel from './components/RightPanel';
import Footer from './components/Footer';
import { 
  loadChatHistory, 
  saveChatHistory, 
  clearChatHistory, 
  saveChatSession,
  createNewSession,
  switchToSession,
  getUserId,
  canCreateNewChat,
  getChatCount
} from './utils/session';

import './css/style.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoadingOldChat, setIsLoadingOldChat] = useState(false);

  // โหลดประวัติแชทเมื่อ component mount
  useEffect(() => {
    const history = loadChatHistory();
    if (history.length > 0) {
      setMessages(history);
    }
  }, []);

  // บันทึกประวัติแชททุกครั้งที่ messages เปลี่ยน
  useEffect(() => {
    if (messages.length > 0 && !isLoadingOldChat) {
      saveChatHistory(messages);
      
      // บันทึกเป็น session เมื่อมีข้อความจาก AI
      const hasAiResponse = messages.some(msg => msg.sender === 'ai' && msg.type !== 'loading');
      if (hasAiResponse) {
        const messagesWithoutLoading = messages.filter(msg => msg.type !== 'loading');
        const userId = getUserId();
        saveChatSession(messagesWithoutLoading, userId);
      }
    }
  }, [messages, isLoadingOldChat]);

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
    const userId = getUserId();
    
    // ตรวจสอบว่าสามารถสร้างแชทใหม่ได้หรือไม่
    if (!canCreateNewChat(userId)) {
      const chatCount = getChatCount(userId);
      alert(
        '⚠️ ไม่สามารถสร้างแชทใหม่ได้\n\n' +
        `คุณมีแชทครบ ${chatCount}/3 แชทแล้ว\n\n` +
        '💡 กรุณาลบแชทเก่าก่อนสร้างใหม่'
      );
      return;
    }
    
    // บันทึกแชทปัจจุบันก่อนเริ่มใหม่
    if (messages.length > 0) {
      const messagesWithoutLoading = messages.filter(msg => msg.type !== 'loading');
      saveChatSession(messagesWithoutLoading, userId);
    }
    
    // สร้าง session ใหม่
    createNewSession();
    clearChatHistory();
    setMessages([]);
    setIsLoadingOldChat(false);
  };

  // ฟังก์ชันสำหรับโหลดแชทจากประวัติ
  const handleLoadChat = (chatMessages, sessionId) => {
    // บันทึกแชทปัจจุบันก่อน
    if (messages.length > 0) {
      const messagesWithoutLoading = messages.filter(msg => msg.type !== 'loading');
      const userId = getUserId();
      saveChatSession(messagesWithoutLoading, userId);
    }
    
    // เปลี่ยนไปยัง session ที่เลือก
    switchToSession(sessionId);
    
    // โหลดข้อความ
    setIsLoadingOldChat(true);
    setMessages(chatMessages);
    saveChatHistory(chatMessages);
    
    // Reset flag
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