import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LeftPanel from './components/LeftPanel';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import RightPanel from './components/RightPanel';
import Footer from './components/Footer';

import './css/style.css';

function App() {
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (messageText) => {
    if (messageText.trim() === '') return;

    const newUserMessage = { text: messageText, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);

    setTimeout(() => {
      const aiResponse = { text: 'สวัสดีครับ ต้องการให้ช่วยเรื่องอะไรครับ?', sender: 'ai' };
      setMessages(prevMessages => [...prevMessages, aiResponse]);
    }, 1000);
  };

  return (
    <div className="container">
      <Navbar />
      <LeftPanel />
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