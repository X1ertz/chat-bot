function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    if (message === '') return;

    const chatWindow = document.getElementById('chatWindow');
    const placeholder = document.getElementById('chatPlaceholder');

    // Hide the placeholder if it exists
    if (placeholder && !placeholder.classList.contains('fade-out')) {
        placeholder.classList.add('fade-out');
    }

    // Create a new user message element
    const userMessage = document.createElement('div');
    userMessage.classList.add('message', 'chat-user', 'fade-in');
    userMessage.textContent = message;
    chatWindow.appendChild(userMessage);

    // Create a placeholder for AI response
    setTimeout(() => {
        const aiMessage = document.createElement('div');
        aiMessage.classList.add('message', 'chat-ai', 'fade-in');
        aiMessage.textContent = 'สวัสดีครับ ต้องการให้ช่วยเรื่องอะไรครับ?';
        chatWindow.appendChild(aiMessage);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }, 500);

    input.value = '';
    chatWindow.scrollTop = chatWindow.scrollHeight;
}