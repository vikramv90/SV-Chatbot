document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const promptInput = document.getElementById('promptInput');
    const submitBtn = document.getElementById('submitBtn');
    const chatContainer = document.getElementById('chatContainer');
    const imageBtn = document.getElementById('imageBtn');
    const imageInput = document.getElementById('imageInput');
    const cameraBtn = document.getElementById('cameraBtn');
    const cameraInput = document.getElementById('cameraInput');
    const voiceBtn = document.getElementById('voiceBtn');
    const sideNavigation = document.querySelector('.sideNavigation');
    const topBarAction = document.querySelector('.topBarAction');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const newChatBtn = document.getElementById('newChatBtn');
    const chatHistoryList = document.getElementById('chatHistoryList');
    const helpBtn = document.getElementById('helpBtn');
    const activityBtn = document.getElementById('activityBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    const closeModal = document.querySelector('.close-modal');
    const voiceModal = document.getElementById('voiceModal');
    const stopVoiceBtn = document.getElementById('stopVoiceBtn');
    const voiceAnimation = document.getElementById('voiceAnimation');
    
    // API configuration
    const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyC1H3NH4_J3HUn7D12-Onyp_NNBkLJAghA";
    
    // Images
    const userImage = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    const aiImage = "https://cdn-icons-png.flaticon.com/512/4712/4712035.png";
    
    // Application state
    let currentChat = {
        id: generateChatId(),
        title: "New Chat",
        messages: []
    };
    
    let chats = [];
    let user = {
        message: null,
        file: {
            mime_type: null,
            data: null
        }
    };
    
    // Voice recognition
    let recognition = null;
    let isRecording = false;
    
    // Initialize application
    function init() {
        loadSettings();
        loadChatHistory();
        setupEventListeners();
        setupVoiceRecognition();
    }
    
    // Generate unique chat ID
    function generateChatId() {
        return Date.now().toString();
    }
    
    // Load settings from localStorage
    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem('chatSettings')) || {};
        
        // Apply theme
        if (settings.theme === 'light') {
            document.body.classList.add('light-theme');
        }
        
        // Apply font size
        if (settings.fontSize) {
            document.body.style.fontSize = `${settings.fontSize}px`;
        }
    }
    
    // Save settings to localStorage
    function saveSettings(settings) {
        localStorage.setItem('chatSettings', JSON.stringify(settings));
    }
    
    // Load chat history from localStorage
    function loadChatHistory() {
        const savedChats = localStorage.getItem('chatHistory');
        if (savedChats) {
            chats = JSON.parse(savedChats);
            renderChatHistory();
            
            // Load the first chat if available
            if (chats.length > 0) {
                loadChat(chats[0].id);
            }
        }
    }
    
    // Save chat history to localStorage
    function saveChatHistory() {
        localStorage.setItem('chatHistory', JSON.stringify(chats));
    }
    
    // Render chat history in sidebar
    function renderChatHistory() {
        if (!chatHistoryList) return;
        
        chatHistoryList.innerHTML = '';
        
        chats.forEach(chat => {
            const li = document.createElement('li');
            li.className = 'chat-history-item';
            if (chat.id === currentChat.id) {
                li.classList.add('active');
            }
            
            li.innerHTML = `
                <i class="fa-solid fa-message"></i>
                <span class="collapseText">${chat.title}</span>
            `;
            
            li.addEventListener('click', () => loadChat(chat.id));
            chatHistoryList.appendChild(li);
        });
    }
    
    // Create a new chat
    function createNewChat() {
        // Save current chat if it has messages
        if (currentChat.messages.length > 0) {
            saveCurrentChat();
        }
        
        // Create new chat
        currentChat = {
            id: generateChatId(),
            title: "New Chat",
            messages: []
        };
        
        // Clear chat container
        chatContainer.innerHTML = '';
        
        // Update chat history
        renderChatHistory();
    }
    
    // Load a specific chat
    function loadChat(chatId) {
        const chat = chats.find(c => c.id === chatId);
        if (!chat) return;
        
        currentChat = chat;
        renderChat(chat);
        renderChatHistory();
    }
    
    // Render chat messages
    function renderChat(chat) {
        chatContainer.innerHTML = '';
        
        chat.messages.forEach(message => {
            const div = document.createElement('div');
            div.className = message.role === 'user' ? 'user-chat-box' : 'ai-chat-box';
            
            if (message.role === 'user') {
                div.innerHTML = `
                    <img src="${userImage}" alt="User Avatar" id="userImage">
                    <div class="user-chat-area">
                        ${message.content}
                        ${message.image ? `<img src="${message.image}" class="chooseimg"/>` : ''}
                    </div>
                `;
            } else {
                div.innerHTML = `
                    <img src="${aiImage}" alt="AI Avatar" id="aiImage">
                    <div class="ai-chat-area">${message.content}</div>
                `;
            }
            
            chatContainer.appendChild(div);
        });
        
        // Scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    // Save current chat to history
    function saveCurrentChat() {
        // Update chat title if it's still "New Chat"
        if (currentChat.messages.length > 0 && currentChat.title === "New Chat") {
            const firstMessage = currentChat.messages[0].content;
            currentChat.title = firstMessage.length > 30 
                ? firstMessage.substring(0, 30) + '...' 
                : firstMessage;
        }
        
        // Check if chat already exists
        const existingChatIndex = chats.findIndex(c => c.id === currentChat.id);
        
        if (existingChatIndex !== -1) {
            // Update existing chat
            chats[existingChatIndex] = currentChat;
        } else {
            // Add new chat to beginning of array
            chats.unshift(currentChat);
        }
        
        // Save to localStorage
        saveChatHistory();
    }
    
    // Send user message
    async function sendMessage() {
        const message = promptInput.value.trim();
        if (!message && !user.file.data) return;
        
        user.message = message;
        
        // Create user message object
        const userMessage = {
            role: 'user',
            content: user.message,
            image: user.file.data ? `data:${user.file.mime_type};base64,${user.file.data}` : null
        };
        
        // Add to current chat
        currentChat.messages.push(userMessage);
        
        // Render user message
        renderUserMessage(userMessage);
        
        // Clear input
        promptInput.value = '';
        user.file = { mime_type: null, data: null };
        imageBtn.innerHTML = '<i class="fa-solid fa-image" style="color: white;"></i>';
        cameraBtn.innerHTML = '<i class="fa-solid fa-camera" style="color: white;"></i>';
        cameraBtn.classList.remove('active');
        
        // Generate AI response
        await generateAIResponse();
        
        // Save chat
        saveCurrentChat();
    }
    
    // Render user message in chat
    function renderUserMessage(message) {
        const div = document.createElement('div');
        div.className = 'user-chat-box';
        
        div.innerHTML = `
            <img src="${userImage}" alt="User Avatar" id="userImage">
            <div class="user-chat-area">
                ${message.content}
                ${message.image ? `<img src="${message.image}" class="chooseimg"/>` : ''}
            </div>
        `;
        
        chatContainer.appendChild(div);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    // Generate AI response
    async function generateAIResponse() {
        // Show typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-chat-box';
        typingDiv.innerHTML = `
            <img src="${aiImage}" alt="AI Avatar" id="aiImage">
            <div class="ai-chat-area">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        chatContainer.appendChild(typingDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        try {
            // Prepare request data
            const requestData = {
                contents: [{
                    parts: [
                        { text: user.message },
                        ...(user.file.data ? [{ inline_data: user.file }] : [])
                    ]
                }]
            };
            
            // Send request to API
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            const aiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
            
            // Create AI message object
            const aiMessage = {
                role: 'ai',
                content: aiResponse
            };
            
            // Add to current chat
            currentChat.messages.push(aiMessage);
            
            // Replace typing indicator with actual response
            typingDiv.innerHTML = `
                <img src="${aiImage}" alt="AI Avatar" id="aiImage">
                <div class="ai-chat-area">${aiResponse}</div>
            `;
            
        } catch (error) {
            console.error('Error:', error);
            
            // Show error message
            typingDiv.innerHTML = `
                <img src="${aiImage}" alt="AI Avatar" id="aiImage">
                <div class="ai-chat-area">Sorry, I couldn't process your request. Please try again.</div>
            `;
        } finally {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }
    
    // Handle image upload
    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64String = e.target.result.split(',')[1];
            user.file = {
                mime_type: file.type,
                data: base64String
            };
            
            // Update image button to show upload success
            if (event.target.id === 'imageInput') {
                imageBtn.innerHTML = '<i class="fa-solid fa-check" style="color: green;"></i>';
            } else if (event.target.id === 'cameraInput') {
                cameraBtn.innerHTML = '<i class="fa-solid fa-check" style="color: green;"></i>';
                cameraBtn.classList.add('active');
            }
        };
        reader.readAsDataURL(file);
    }
    
    // Setup voice recognition
    function setupVoiceRecognition() {
        try {
            recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';
            
            recognition.onstart = function() {
                isRecording = true;
                voiceModal.style.display = 'flex';
            };
            
            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                promptInput.value = transcript;
                stopVoiceRecording();
            };
            
            recognition.onerror = function(event) {
                console.error('Speech recognition error', event.error);
                stopVoiceRecording();
            };
            
            recognition.onend = function() {
                if (isRecording) {
                    recognition.start(); // Restart if still recording
                }
            };
        } catch (e) {
            console.error('Speech recognition not supported', e);
            voiceBtn.style.display = 'none';
        }
    }
    
    // Start voice recording
    function startVoiceRecording() {
        if (!recognition) {
            alert('Voice recognition not supported in your browser');
            return;
        }
        
        try {
            recognition.start();
        } catch (e) {
            console.error('Error starting voice recognition', e);
        }
    }
    
    // Stop voice recording
    function stopVoiceRecording() {
        isRecording = false;
        voiceModal.style.display = 'none';
        if (recognition) {
            recognition.stop();
        }
    }
    
    // Show modal with content
    function showModal(title, content) {
        modalTitle.textContent = title;
        modalContent.innerHTML = content;
        modal.style.display = 'block';
        
        // Setup event listeners for modal content if it's settings
        if (title === 'Settings') {
            setupSettingsModal();
        }
    }
    
    // Setup settings modal event listeners
    function setupSettingsModal() {
        // Get current settings
        const settings = JSON.parse(localStorage.getItem('chatSettings')) || {};
        
        // Theme selector
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.value = settings.theme || 'dark';
            themeSelect.addEventListener('change', function() {
                const newTheme = this.value;
                document.body.classList.toggle('light-theme', newTheme === 'light');
                
                // Save settings
                saveSettings({
                    ...settings,
                    theme: newTheme
                });
            });
        }
        
        // Font size slider
        const fontSizeSlider = document.getElementById('fontSize');
        if (fontSizeSlider) {
            fontSizeSlider.value = settings.fontSize || 16;
            document.body.style.fontSize = `${fontSizeSlider.value}px`;
            
            fontSizeSlider.addEventListener('input', function() {
                document.body.style.fontSize = `${this.value}px`;
                
                // Save settings
                saveSettings({
                    ...settings,
                    fontSize: parseInt(this.value)
                });
            });
        }
        
        // Clear history button
        const clearHistoryBtn = document.getElementById('clearHistoryBtn');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to clear all chat history? This cannot be undone.')) {
                    localStorage.removeItem('chatHistory');
                    chats = [];
                    createNewChat();
                    renderChatHistory();
                    closeModalHandler();
                }
            });
        }
    }
    
    // Close modal
    function closeModalHandler() {
        modal.style.display = 'none';
    }
    
    // Get help content for modal
    function getHelpContent() {
        return `
            <h3>How to use this chat</h3>
            <p>This is an AI-powered chat application that can help you with various tasks.</p>
            
            <h4>Features:</h4>
            <ul>
                <li>Type your message in the input field and press Enter or click the send button</li>
                <li>Click the image icon to attach an image to your message</li>
                <li>Click the camera icon to take and attach a photo</li>
                <li>Click the microphone icon to use voice input</li>
                <li>Click "New Chat" to start a fresh conversation</li>
                <li>Access your chat history from the sidebar</li>
                <li>Customize settings like theme and font size</li>
            </ul>
        `;
    }
    
    // Get settings content for modal
    function getSettingsContent() {
        const settings = JSON.parse(localStorage.getItem('chatSettings')) || {};
        
        return `
            <div class="setting-item">
                <label for="themeSelect">Theme:</label>
                <select id="themeSelect">
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                </select>
            </div>
            
            <div class="setting-item">
                <label for="fontSize">Font Size: <span id="fontSizeValue">${settings.fontSize || 16}</span>px</label>
                <input type="range" id="fontSize" min="12" max="24" value="${settings.fontSize || 16}">
            </div>
            
            <div class="setting-item">
                <button id="clearHistoryBtn" class="danger-btn">Clear All Chat History</button>
            </div>
        `;
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Submit message
        submitBtn.addEventListener('click', sendMessage);
        promptInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        // Image upload
        imageBtn.addEventListener('click', () => imageInput.click());
        imageInput.addEventListener('change', handleImageUpload);
        
        // Camera upload
        cameraBtn.addEventListener('click', () => cameraInput.click());
        cameraInput.addEventListener('change', handleImageUpload);
        
        // Voice input
        voiceBtn.addEventListener('click', startVoiceRecording);
        stopVoiceBtn.addEventListener('click', stopVoiceRecording);
        
        // Navigation toggle - Fixed version
        if (mobileNavToggle && sideNavigation && topBarAction) {
            mobileNavToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                const isActive = !sideNavigation.classList.contains('active');
                
                sideNavigation.classList.toggle('active', isActive);
                topBarAction.classList.toggle('active', isActive);
                this.classList.toggle('active', isActive);
                
                // Add/remove click outside listener
                if (isActive) {
                    document.addEventListener('click', handleClickOutside);
                } else {
                    document.removeEventListener('click', handleClickOutside);
                }
            });
        }
        
        // New chat
        newChatBtn.addEventListener('click', createNewChat);
        
        // Modal buttons
        helpBtn.addEventListener('click', () => showModal('Help', getHelpContent()));
        settingsBtn.addEventListener('click', () => showModal('Settings', getSettingsContent()));
        closeModal.addEventListener('click', closeModalHandler);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModalHandler();
            }
        });
    }
    
    // Handle click outside sidebar
    function handleClickOutside(e) {
        if (!sideNavigation.contains(e.target) && 
            e.target !== mobileNavToggle && 
            !mobileNavToggle.contains(e.target)) {
            sideNavigation.classList.remove('active');
            topBarAction.classList.remove('active');
            mobileNavToggle.classList.remove('active');
            document.removeEventListener('click', handleClickOutside);
        }
    }
    
    // Initialize the app
    init();
});