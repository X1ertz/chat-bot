export const formatMessage = (text) => {
  if (!text) return '';
  
  // แปลง markdown-style formatting
  let formatted = text
    // Bold text (**text** หรือ *text*)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<strong>$1</strong>')
    // Bullet points
    .replace(/^\*\s+(.+)$/gm, '• $1')
    // Line breaks
    .replace(/\\n/g, '\n');
  
  return formatted;
};