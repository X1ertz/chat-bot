export const getSessionId = () => {
  let sessionId = sessionStorage.getItem('chatSessionId');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('chatSessionId', sessionId);
  }
  return sessionId;
};

// เก็บประวัติแชท
export const saveChatHistory = (messages) => {
  const sessionId = getSessionId();
  try {
    sessionStorage.setItem(`chat_history_${sessionId}`, JSON.stringify(messages));
  } catch (error) {
    console.error('ไม่สามารถบันทึกประวัติแชท:', error);
  }
};

// โหลดประวัติแชท
export const loadChatHistory = () => {
  const sessionId = getSessionId();
  try {
    const history = sessionStorage.getItem(`chat_history_${sessionId}`);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('ไม่สามารถโหลดประวัติแชท:', error);
    return [];
  }
};

// ลบประวัติแชท
export const clearChatHistory = () => {
  const sessionId = getSessionId();
  try {
    sessionStorage.removeItem(`chat_history_${sessionId}`);
  } catch (error) {
    console.error('ไม่สามารถลบประวัติแชท:', error);
  }
};

// ========== ฟังก์ชันจัดการ Chat Sessions ==========

// บันทึก Chat Session ใหม่
export const saveChatSession = (messages) => {
  if (messages.length === 0) return;
  
  const sessions = getAllChatSessions();
  const sessionId = 'chat_' + Date.now();
  
  // หาข้อความแรกของ user เป็นชื่อ session
  const firstUserMessage = messages.find(msg => msg.sender === 'user');
  const title = firstUserMessage ? firstUserMessage.text.substring(0, 50) : 'แชทใหม่';
  
  const newSession = {
    id: sessionId,
    title: title,
    messages: messages,
    timestamp: Date.now(),
    date: new Date().toLocaleString('th-TH')
  };
  
  sessions.unshift(newSession); // เพิ่มไว้ด้านบนสุด
  
  // เก็บแค่ 20 session ล่าสุด
  const limitedSessions = sessions.slice(0, 20);
  
  try {
    localStorage.setItem('all_chat_sessions', JSON.stringify(limitedSessions));
  } catch (error) {
    console.error('ไม่สามารถบันทึก chat session:', error);
  }
};

// โหลด Chat Sessions ทั้งหมด
export const getAllChatSessions = () => {
  try {
    const sessions = localStorage.getItem('all_chat_sessions');
    return sessions ? JSON.parse(sessions) : [];
  } catch (error) {
    console.error('ไม่สามารถโหลด chat sessions:', error);
    return [];
  }
};

// ลบ Chat Session
export const deleteChatSession = (sessionId) => {
  try {
    const sessions = getAllChatSessions();
    const filtered = sessions.filter(s => s.id !== sessionId);
    localStorage.setItem('all_chat_sessions', JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error('ไม่สามารถลบ chat session:', error);
    return getAllChatSessions();
  }
};

// ลบ Chat Sessions ทั้งหมด
export const deleteAllChatSessions = () => {
  try {
    localStorage.removeItem('all_chat_sessions');
  } catch (error) {
    console.error('ไม่สามารถลบ chat sessions ทั้งหมด:', error);
  }
};
