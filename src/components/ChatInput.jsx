import React, { useState } from 'react';
import '../css/style.css';

function ChatInput({ onSendMessage }) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    onSendMessage(input);
    setInput('');
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
      ></textarea>
      <button onClick={handleSend}>
        <i className="fa-solid fa-paper-plane"></i>
      </button>
    </div>
  );
}

export default ChatInput;