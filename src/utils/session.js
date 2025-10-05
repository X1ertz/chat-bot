// ========== Session Management ==========

// สร้าง Session ใหม่
export const createNewSession = () => {
  const newSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  sessionStorage.setItem('currentSessionId', newSessionId);
  return newSessionId;
};

// ตรวจสอบว่าสามารถสร้างแชทใหม่ได้หรือไม่ (จำกัด 3 แชท)
export const canCreateNewChat = (userId = null) => {
  const uid = userId || getUserId();
  const sessions = getAllUserSessions(uid);
  return sessions.length < 3;
};

// นับจำนวนแชททั้งหมดของ user
export const getChatCount = (userId = null) => {
  const uid = userId || getUserId();
  const sessions = getAllUserSessions(uid);
  return sessions.length;
};

// ดึง Session ID ปัจจุบัน (สำหรับส่งไป Zep ผ่าน n8n)
export const getCurrentSessionId = () => {
  let sessionId = sessionStorage.getItem('currentSessionId');
  if (!sessionId) {
    sessionId = createNewSession();
  }
  return sessionId;
};

// เปลี่ยน Session (เมื่อคลิกดูประวัติแชท)
export const switchToSession = (sessionId) => {
  sessionStorage.setItem('currentSessionId', sessionId);
  return sessionId;
};

// ========== User ID Management ==========

// ดึง User ID (สำหรับแยก session ตาม user ใน Zep)
export const getUserId = () => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    // สร้าง userId ใหม่ (หรือดึงจาก authentication system)
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
  }
  return userId;
};

// ========== Chat History Management (sessionStorage) ==========

// เก็บประวัติแชทปัจจุบันใน sessionStorage (สำหรับ restore เมื่อ refresh)
export const saveChatHistory = (messages) => {
  const sessionId = getCurrentSessionId();
  try {
    sessionStorage.setItem(`chat_history_${sessionId}`, JSON.stringify(messages));
  } catch (error) {
    console.error('ไม่สามารถบันทึกประวัติแชท:', error);
  }
};

// โหลดประวัติแชทปัจจุบัน
export const loadChatHistory = () => {
  const sessionId = getCurrentSessionId();
  try {
    const history = sessionStorage.getItem(`chat_history_${sessionId}`);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('ไม่สามารถโหลดประวัติแชท:', error);
    return [];
  }
};

// ลบประวัติแชทปัจจุบัน
export const clearChatHistory = () => {
  const sessionId = getCurrentSessionId();
  try {
    sessionStorage.removeItem(`chat_history_${sessionId}`);
  } catch (error) {
    console.error('ไม่สามารถลบประวัติแชท:', error);
  }
};

// ========== Chat Sessions Management (localStorage) ==========

// บันทึก Chat Session ลง localStorage (สำหรับแสดงรายการประวัติ)
export const saveChatSession = (messages, userId = null) => {
  if (messages.length === 0) return;
  
  const uid = userId || getUserId();
  const sessionId = getCurrentSessionId();
  const sessions = getAllUserSessions(uid);
  
  // หาข้อความแรกของ user เป็นชื่อ session
  const firstUserMessage = messages.find(msg => msg.sender === 'user');
  const title = firstUserMessage ? firstUserMessage.text.substring(0, 50) : 'แชทใหม่';
  
  const sessionData = {
    id: sessionId,
    title: title,
    messages: messages,
    timestamp: Date.now(),
    date: new Date().toLocaleString('th-TH'),
    userId: uid
  };
  
  // ตรวจสอบว่ามี session นี้อยู่แล้วหรือไม่
  const existingIndex = sessions.findIndex(s => s.id === sessionId);
  
  if (existingIndex >= 0) {
    // อัพเดท session เดิม
    sessions[existingIndex] = sessionData;
  } else {
    // เพิ่ม session ใหม่ไว้ด้านบนสุด
    sessions.unshift(sessionData);
  }
  
  // 🔥 จำกัดแค่ 3 session ล่าสุดต่อ user
  const limitedSessions = sessions.slice(0, 3);
  
  try {
    localStorage.setItem(`chat_sessions_${uid}`, JSON.stringify(limitedSessions));
  } catch (error) {
    console.error('ไม่สามารถบันทึก chat session:', error);
  }
};

// โหลด Chat Sessions ทั้งหมดของ User
export const getAllUserSessions = (userId = null) => {
  const uid = userId || getUserId();
  try {
    const sessions = localStorage.getItem(`chat_sessions_${uid}`);
    return sessions ? JSON.parse(sessions) : [];
  } catch (error) {
    console.error('ไม่สามารถโหลด chat sessions:', error);
    return [];
  }
};

// โหลดข้อความจาก Session ID (จาก localStorage)
export const loadSessionMessages = (sessionId, userId = null) => {
  const uid = userId || getUserId();
  const sessions = getAllUserSessions(uid);
  const session = sessions.find(s => s.id === sessionId);
  return session ? session.messages : [];
};

// ลบ Chat Session
export const deleteChatSession = (sessionId, userId = null) => {
  const uid = userId || getUserId();
  try {
    const sessions = getAllUserSessions(uid);
    const filtered = sessions.filter(s => s.id !== sessionId);
    localStorage.setItem(`chat_sessions_${uid}`, JSON.stringify(filtered));
    
    // ลบออกจาก sessionStorage ด้วย
    sessionStorage.removeItem(`chat_history_${sessionId}`);
    
    // ถ้าลบ session ที่กำลังใช้งานอยู่ ให้ clear currentSessionId ด้วย
    const currentSessionId = sessionStorage.getItem('currentSessionId');
    if (currentSessionId === sessionId) {
      sessionStorage.removeItem('currentSessionId');
    }
    
    return filtered;
  } catch (error) {
    console.error('ไม่สามารถลบ chat session:', error);
    return getAllUserSessions(uid);
  }
};

// ลบ Chat Sessions ทั้งหมด
export const deleteAllChatSessions = (userId = null) => {
  const uid = userId || getUserId();
  try {
    const sessions = getAllUserSessions(uid);
    
    // ลบทุก session จาก sessionStorage
    sessions.forEach(session => {
      sessionStorage.removeItem(`chat_history_${session.id}`);
    });
    
    // ลบ currentSessionId
    sessionStorage.removeItem('currentSessionId');
    
    // ลบจาก localStorage
    localStorage.removeItem(`chat_sessions_${uid}`);
  } catch (error) {
    console.error('ไม่สามารถลบ chat sessions ทั้งหมด:', error);
  }
};

// ========== Backward Compatibility (เก่า) ==========
// เก็บไว้เพื่อไม่ให้โค้ดเดิมเสีย

export const getSessionId = getCurrentSessionId;
export const getAllChatSessions = () => getAllUserSessions();