<template>
  <div>
    <!-- Chatbot Container -->
    <div class="chatbot" :class="{ open: isOpen }">
      <div class="chatbot-header">
        💬 BLÜMEO Assistant
        <span class="chatbot-close" @click="closeChat">✖</span>
      </div>
      <div ref="chatBody" class="chatbot-body">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="chatbot-message"
          :class="message.type"
        >
          {{ message.text }}
        </div>
      </div>
      <div class="chatbot-input">
        <input
          v-model="currentMessage"
          type="text"
          placeholder="Ask me anything..."
          @keypress.enter="sendMessage"
        />
        <button @click="sendMessage">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>

    <!-- Toggle Button -->
    <button class="chatbot-toggle" @click="toggleChat">💬</button>
  </div>
</template>

<script>
export default {
  name: 'Chatbot',
  data() {
    return {
      isOpen: false,
      currentMessage: '',
      messages: [
        {
          type: 'bot',
          text: 'Hello and welcome to BLÜMEO 🌷 I\'m your virtual floral assistant. How can I help you today?'
        }
      ]
    };
  },
  methods: {
    toggleChat() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },

    closeChat() {
      this.isOpen = false;
    },

    sendMessage() {
      const message = this.currentMessage.trim();
      if (!message) return;

      // Add user message
      this.messages.push({
        type: 'user',
        text: message
      });

      // Clear input
      this.currentMessage = '';

      // Scroll to bottom
      this.$nextTick(() => {
        this.scrollToBottom();
      });

      // Simulate bot response
      setTimeout(() => {
        this.generateBotResponse(message);
      }, 1000);
    },

    generateBotResponse(userMessage) {
      const lowerMessage = userMessage.toLowerCase();
      let botResponse = '';

      if (lowerMessage.includes('track') || lowerMessage.includes('order') || lowerMessage.includes('status')) {
        botResponse = 'Please provide your order ID and I\'ll check your order status.';
      } else if (lowerMessage.includes('delivery')) {
        botResponse = 'Our delivery hours are from 8:00 AM to 8:00 PM daily 🚚';
      } else if (lowerMessage.includes('recommend') || lowerMessage.includes('bouquet')) {
        botResponse = 'We have beautiful bouquets starting from €29.99! Would you like to see our collection?';
      } else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        botResponse = 'Our bouquets start from around €30 💐';
      } else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
        botResponse = 'You can reach us at support@blumeo.com or call +49 123 456 789';
      } else if (lowerMessage.includes('thank')) {
        botResponse = 'It\'s been a pleasure assisting you 🌷';
      } else if (lowerMessage.includes('bye')) {
        botResponse = 'Thank you for visiting BLÜMEO 💐';
      } else {
        botResponse = 'I can help you with:\n• Order tracking\n• Bouquet recommendations\n• Delivery information\n• Pricing\n\nWhat would you like to know?';
      }

      this.messages.push({
        type: 'bot',
        text: botResponse
      });

      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },

    scrollToBottom() {
      const chatBody = this.$refs.chatBody;
      if (chatBody) {
        chatBody.scrollTop = chatBody.scrollHeight;
      }
    }
  }
};
</script>

<style scoped>
/* Chatbot Styles */
.chatbot {
  position: fixed;
  bottom: 90px;
  right: 2rem;
  width: 360px;
  max-height: 500px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(123, 104, 173, 0.3);
  display: none;
  flex-direction: column;
  z-index: 1000;
  font-family: 'Poppins', sans-serif;
}

.chatbot.open {
  display: flex;
}

.chatbot-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  border-radius: 20px 20px 0 0;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chatbot-close {
  cursor: pointer;
  font-size: 1.2rem;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.chatbot-close:hover {
  opacity: 1;
}

.chatbot-body {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  max-height: 350px;
}

.chatbot-message {
  margin-bottom: 0.8rem;
  padding: 0.8rem 1rem;
  border-radius: 15px;
  max-width: 80%;
  word-wrap: break-word;
  white-space: pre-line;
}

.chatbot-message.bot {
  background: #f0f0f0;
  margin-right: auto;
}

.chatbot-message.user {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-left: auto;
}

.chatbot-input {
  display: flex;
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
}

.chatbot-input input {
  flex: 1;
  padding: 0.6rem 1rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  font-family: 'Poppins', sans-serif;
}

.chatbot-input button {
  margin-left: 0.5rem;
  padding: 0.6rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.chatbot-input button:hover {
  transform: scale(1.1);
}

/* Toggle Button */
.chatbot-toggle {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(123, 104, 173, 0.4);
  z-index: 999;
  transition: all 0.3s;
}

.chatbot-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(123, 104, 173, 0.6);
}
</style>
