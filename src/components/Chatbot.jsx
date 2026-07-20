import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

// The API Key is no longer needed on the client, it is secured in the backend.

const Chatbot = ({ state }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Construct context string from state
  const getContextString = () => {
    if (!state) return '';
    return `
      You are an AI assistant for Tamil's portfolio website. Your name is Xova AI.
      You answer questions about Tamil based on the following information:
      About: ${state.aboutIntro1} ${state.aboutIntro2}
      Skills: ${state.skills?.join(', ')}
      Education: ${state.education?.map(e => `${e.title} at ${e.school} (${e.year})`).join('; ')}
      Experience: ${state.experience?.map(e => `${e.title} (${e.year}): ${e.description}`).join('; ')}
      Projects: ${state.projects?.map(p => `${p.title} - ${p.description}`).join('; ')}
      
      Be polite, concise, and helpful. Do not make up information that is not in the context.
      If the user asks something completely unrelated to Tamil or the portfolio, politely guide them back.
    `;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Remove the direct OpenRouter call. The API Key check is no longer needed here.
      const chatHistory = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }));

      // Call our secure local backend API instead
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: getContextString() },
            ...chatHistory,
            { role: 'user', content: userMessage }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.choices[0].message.content;
      
      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (error) {
      console.error("Error communicating with OpenRouter API:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1000] max-md:bottom-[100px]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[340px] h-[480px] liquid-glass-card rounded-[24px] flex flex-col overflow-hidden border border-[#a855f7]/30 shadow-[0_0_30px_rgba(176,38,255,0.2)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#a855f7]/30">
              <div className="flex flex-row items-center gap-2 text-[#b026ff] drop-shadow-[0_0_8px_rgba(176,38,255,0.8)]">
                <Bot size={22} />
                <h3 className="font-semibold m-0 leading-none" style={{ margin: 0, padding: 0 }}>Xova AI</h3>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 cyber-scrollbar-y">
              {messages.length === 0 && (
                <div className="text-center text-[#b026ff] drop-shadow-[0_0_5px_rgba(176,38,255,0.6)] text-sm mt-4">
                  Hi! I'm Xova AI. Ask me anything about Tamil's skills, projects, or experience!
                </div>
              )}
              
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Bot size={16} className="text-purple-400" />
                    </div>
                  )}
                  
                  <div 
                    className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${
                      msg.role === 'user' 
                        ? 'bg-[rgba(176,38,255,0.15)] border border-[rgba(176,38,255,0.3)] backdrop-blur-md text-[#b026ff] drop-shadow-[0_0_5px_rgba(176,38,255,0.8)] rounded-br-none shadow-[0_4px_12px_rgba(176,38,255,0.2)]' 
                        : 'bg-[rgba(176,38,255,0.05)] border border-[rgba(176,38,255,0.2)] backdrop-blur-md text-[#b026ff] drop-shadow-[0_0_5px_rgba(176,38,255,0.6)] rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <User size={16} className="text-gray-300" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-2 justify-start">
                   <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Bot size={16} className="text-purple-400" />
                   </div>
                   <div className="px-4 py-2 rounded-2xl bg-white/10 text-gray-200 rounded-bl-none text-sm flex items-center gap-1">
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-[#a855f7]/30 bg-transparent">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2 relative"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 bg-[rgba(176,38,255,0.05)] border border-[rgba(176,38,255,0.2)] shadow-[inset_0_2px_6px_rgba(176,38,255,0.1)] rounded-full px-4 py-2.5 text-sm text-[#b026ff] drop-shadow-[0_0_5px_rgba(176,38,255,0.6)] focus:outline-none focus:border-[rgba(176,38,255,0.5)] focus:bg-[rgba(176,38,255,0.1)] transition-all placeholder:text-[#b026ff]/50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="!w-10 !h-10 !p-0 flex items-center justify-center rounded-full bg-gradient-to-r from-[#7c3aed] to-[#b026ff] text-white disabled:opacity-50 hover:scale-105 transition-transform"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full liquid-glass text-white flex items-center justify-center cursor-pointer transition-all"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.div>
    </div>
  );
};

export default Chatbot;
