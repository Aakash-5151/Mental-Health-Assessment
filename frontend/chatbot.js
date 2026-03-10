// Chatbot functionality with enhanced UI and responses
document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chatBox");
    const userMessageInput = document.getElementById("userMessage");
    const sendBtn = document.getElementById("sendBtn");
    const quickReplies = document.getElementById("quickReplies");
    const emotionDisplay = document.getElementById("emotionDisplay");

    let conversationHistory = [];
    let messageCount = 0;

    // Initialize chat
    setTimeout(() => {
        addMessage("👋 Hello! I'm MindCare AI, your emotional support companion. I'm here to listen, understand, and help you navigate your feelings. How are you doing today?", "bot");
        showQuickReplies([
            "I'm feeling a bit anxious",
            "Had a stressful day",
            "Feeling good today",
            "I need to talk about something"
        ]);
    }, 500);

    // Auto-resize textarea
    userMessageInput.addEventListener("input", function() {
        this.style.height = "auto";
        this.style.height = Math.min(this.scrollHeight, 120) + "px";
        sendBtn.disabled = this.value.trim() === "";
    });

    // Send message function
    function sendMessage(message = null) {
        const text = message || userMessageInput.value.trim();
        if (text === "") return;

        addMessage(text, "user");
        userMessageInput.value = "";
        userMessageInput.style.height = "auto";
        sendBtn.disabled = true;
        messageCount++;

        conversationHistory.push({ role: "user", content: text });

        // Hide quick replies
        hideQuickReplies();

        // Show typing indicator
        showTypingIndicator();

        fetch("http://localhost:3000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: text })
        })
        .then(res => res.json())
        .then(data => {
            hideTypingIndicator();

            // Process emotion data
            if (data.emotion && data.emotion[0]) {
                displayEmotions(data.emotion[0]);
            }

            // Generate enhanced response
            const response = generateResponse(text, data.emotion, conversationHistory);
            addMessage(response, "bot");

            conversationHistory.push({ role: "assistant", content: response });

            // Show contextual quick replies
            setTimeout(() => {
                showContextualReplies(data.emotion);
            }, 1000);
        })
        .catch(err => {
            hideTypingIndicator();
            addMessage("🤖 I'm sorry, I'm having trouble connecting right now. Please check your internet connection and try again. Remember, if you're in crisis, reach out to a human professional or call emergency services.", "bot");
            console.error("Chat error:", err);
        });
    }

    // Generate contextual responses
    function generateResponse(userMessage, emotions, history) {
        let response = "";
        const lowerMessage = userMessage.toLowerCase();

        // Get primary emotion
        let primaryEmotion = null;
        if (emotions && emotions[0]) {
            primaryEmotion = emotions[0].reduce((max, curr) =>
                curr.score > max.score ? curr : max
            );
        }

        // Handle crisis keywords
        const crisisKeywords = ["suicide", "kill myself", "end it all", "hurt myself", "die"];
        if (crisisKeywords.some(keyword => lowerMessage.includes(keyword))) {
            return "🚨 I'm really concerned about what you're saying. Your life matters, and there are people who care about you and want to help. Please reach out immediately to:\n\n• National Suicide Prevention Lifeline: 988 (US)\n• Crisis Text Line: Text HOME to 741741\n• Emergency Services: 911\n\nYou're not alone, and there is hope. Please talk to someone who can help you right now.";
        }

        // Handle gratitude
        if (lowerMessage.includes("thank") || lowerMessage.includes("thanks")) {
            return "💙 You're very welcome! I'm here whenever you need to talk. Remember, taking care of your mental health is a sign of strength, not weakness. Take care of yourself!";
        }

        // Emotion-based responses
        if (primaryEmotion) {
            const emotionResponses = {
                joy: [
                    "🌟 That's wonderful to hear! Joy is such a beautiful emotion. What brought this happiness to you today?",
                    "😊 I'm so glad you're feeling joyful! Positive emotions like this are worth savoring. What's making you smile?",
                    "🎉 Joy is contagious! It's great that you're experiencing these positive feelings. What would you like to share about what's going well?"
                ],
                sadness: [
                    "💙 I'm here with you. Sadness can be really heavy to carry. Would you like to talk about what's bringing up these feelings?",
                    "🌧️ It's okay to feel sad sometimes. All emotions are valid. I'm listening if you want to share what's on your heart.",
                    "🤗 I can sense you're going through a difficult time. Remember that it's brave of you to acknowledge these feelings. How can I support you right now?"
                ],
                anger: [
                    "🔥 Anger can be a powerful emotion that tells us something needs attention. What's been frustrating you lately?",
                    "💪 It's normal to feel angry sometimes. This emotion often points to something important. Would you like to explore what's triggering these feelings?",
                    "⚡ I hear the intensity in your words. Anger can be a signal that boundaries need setting or changes need to be made. How are you coping with this?"
                ],
                fear: [
                    "🛡️ Fear is your body's way of trying to protect you. What specifically feels scary or uncertain right now?",
                    "🌙 It's okay to feel afraid. Many people experience anxiety and worry. What would help you feel more secure in this moment?",
                    "🕯️ Fear can feel overwhelming, but you're not alone in it. What are you most worried about, and how can I help you navigate this?"
                ],
                surprise: [
                    "😲 Surprise can be exciting or unsettling! What unexpected thing happened?",
                    "🎭 Life is full of surprises, isn't it? How are you feeling about this unexpected development?",
                    "✨ Sometimes surprises bring new possibilities. What surprised you, and how are you processing it?"
                ],
                disgust: [
                    "😟 I can sense some strong feelings about something. What feels off or unpleasant to you right now?",
                    "🤔 Disgust often signals that something doesn't align with your values. Would you like to talk about what's bothering you?"
                ],
                neutral: [
                    "🤝 Thank you for sharing. Sometimes our feelings can be complex or hard to name. How are you experiencing this right now?",
                    "📝 I appreciate you opening up. What would you like to explore or understand better about how you're feeling?"
                ]
            };

            const responses = emotionResponses[primaryEmotion.label.toLowerCase()] || emotionResponses.neutral;
            response = responses[Math.floor(Math.random() * responses.length)];
        } else {
            // Generic supportive responses
            const genericResponses = [
                "🤝 Thank you for sharing that with me. How long have you been feeling this way?",
                "💭 I hear you. What do you think might help in this situation?",
                "🌱 Emotions can be complex. What are you noticing about your feelings right now?",
                "💪 You're taking an important step by acknowledging how you feel. How can I best support you?",
                "🗣️ It takes courage to express your feelings. What would you like to focus on next?"
            ];
            response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
        }

        // Add follow-up based on conversation flow
        if (messageCount === 1) {
            response += "\n\n💡 Remember, I'm here to listen without judgment. You can share as much or as little as feels right for you.";
        } else if (messageCount > 3) {
            response += "\n\n🎯 If there's a specific aspect of this you'd like to explore more deeply, I'm here to help.";
        }

        return response;
    }

    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${sender}-message`;

        const avatar = document.createElement("div");
        avatar.className = "message-avatar";

        if (sender === "user") {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            avatar.textContent = user.name ? user.name.charAt(0).toUpperCase() : "U";
        } else {
            avatar.innerHTML = "🤖";
        }

        const messageContent = document.createElement("div");
        messageContent.className = "message-content";

        // Convert line breaks and format text
        const formattedText = text.replace(/\n/g, '<br>');
        messageContent.innerHTML = formattedText;

        const timestamp = document.createElement("div");
        timestamp.className = "message-time";
        timestamp.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(timestamp);

        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement("div");
        typingDiv.className = "message bot-message typing-indicator";
        typingDiv.id = "typingIndicator";

        const avatar = document.createElement("div");
        avatar.className = "message-avatar";
        avatar.innerHTML = "🤖";

        const typingContent = document.createElement("div");
        typingContent.className = "message-content";
        typingContent.innerHTML = `
            <span>MindCare AI is thinking</span>
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;

        typingDiv.appendChild(avatar);
        typingDiv.appendChild(typingContent);
        chatBox.appendChild(typingDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById("typingIndicator");
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Display emotions
    function displayEmotions(emotions) {
        const sortedEmotions = emotions
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        const emotionIcons = {
            joy: "😊",
            sadness: "😢",
            anger: "😠",
            fear: "😨",
            surprise: "😲",
            disgust: "😖",
            neutral: "😐"
        };

        emotionDisplay.innerHTML = sortedEmotions.map(emotion => `
            <div class="emotion-item">
                <div class="emotion-icon" style="background: ${getEmotionColor(emotion.label)}">
                    ${emotionIcons[emotion.label] || "🤔"}
                </div>
                <div class="emotion-details">
                    <div class="emotion-label">${emotion.label}</div>
                    <div class="emotion-score">${(emotion.score * 100).toFixed(1)}% confidence</div>
                    <div class="emotion-progress">
                        <div class="emotion-progress-fill" style="width: ${emotion.score * 100}%"></div>
                    </div>
                </div>
            </div>
        `).join("");
    }

    // Get emotion color
    function getEmotionColor(emotion) {
        const colors = {
            joy: "linear-gradient(135deg, #FFD700, #FFA500)",
            sadness: "linear-gradient(135deg, #4682B4, #5F9EA0)",
            anger: "linear-gradient(135deg, #DC143C, #FF4500)",
            fear: "linear-gradient(135deg, #800080, #9932CC)",
            surprise: "linear-gradient(135deg, #FF69B4, #FF1493)",
            disgust: "linear-gradient(135deg, #32CD32, #228B22)",
            neutral: "linear-gradient(135deg, #A9A9A9, #808080)"
        };
        return colors[emotion] || colors.neutral;
    }

    // Show quick replies
    function showQuickReplies(replies) {
        quickReplies.innerHTML = replies.map(reply =>
            `<div class="quick-reply" data-message="${reply}">${reply}</div>`
        ).join("");

        // Add click handlers
        document.querySelectorAll(".quick-reply").forEach(reply => {
            reply.addEventListener("click", () => {
                sendMessage(reply.dataset.message);
            });
        });
    }

    // Hide quick replies
    function hideQuickReplies() {
        quickReplies.innerHTML = "";
    }

    // Show contextual replies based on emotion
    function showContextualReplies(emotions) {
        if (!emotions || !emotions[0]) return;

        const primaryEmotion = emotions[0].reduce((max, curr) =>
            curr.score > max.score ? curr : max
        );

        const contextualReplies = {
            joy: ["What's making you happy?", "Tell me more about this", "How can you hold onto this feeling?"],
            sadness: ["What would help right now?", "Have you talked to anyone about this?", "What are you grateful for today?"],
            anger: ["What's the source of this anger?", "How are you managing it?", "What needs to change?"],
            fear: ["What's scaring you most?", "What would make you feel safer?", "Have you experienced this before?"],
            surprise: ["How are you feeling about this?", "What do you make of it?", "Did you expect this?"]
        };

        const replies = contextualReplies[primaryEmotion.label.toLowerCase()] || [
            "How are you feeling about that?",
            "What would help right now?",
            "Tell me more"
        ];

        showQuickReplies(replies);
    }

    // Event listeners
    sendBtn.addEventListener("click", () => sendMessage());
    userMessageInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
});