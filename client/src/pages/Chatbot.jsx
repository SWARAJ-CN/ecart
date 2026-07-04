import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User } from 'lucide-react';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your Connect Quick AI assistant. How can I help you today?", isBot: true },
  ]);

  const messagesEndRef = useRef(null);
  const VITE_COHERE_API_KEY =  import.meta.env.VITE_COHERE_API_KEY

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessageText = input;
    const userMessage = { id: Date.now(), text: userMessageText, isBot: false };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.cohere.ai/v2/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          model: 'command-r-plus-08-2024', 
          messages: [
            {
              role: 'user',
              content: userMessageText
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Robust multi-layered fallback check for Cohere V2 structure variations
      const botResponseText = 
        data.message?.content?.[0]?.text || 
        data.text || 
        (data.message?.content && typeof data.message.content === 'string' ? data.message.content : null) ||
        "I received your request but couldn't parse the display content block securely.";
     
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: botResponseText, isBot: true }
      ]);
    } catch (error) {
      console.error("Cohere API Error:", error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: "Something went wrong while connecting to the AI. Please verify your network connection.", isBot: true }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex md:py-24 sm:h-250 h-208 md:h-screen w-full items-center justify-center  bg-gray-100 text-gray-800 font-sans overflow-hidden p-0 md:p-6">
      <main className="flex-1 flex flex-col h-full container  bg-gray-50 relative md:rounded-3xl md:shadow-[10px_10px_20px_#cfcfcf,-10px_-10px_20px_#ffffff] overflow-hidden border border-gray-200/50">
        
        <header className="h-20 flex items-center justify-between px-6 shrink-0 bg-gray-50 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] border-b border-gray-200/80 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-base font-bold text-gray-800 tracking-tight">Connect Quick Assistant</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_#10b981] ${isLoading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                <span className="text-xs text-gray-500 font-medium">{isLoading ? 'Thinking...' : 'Online'}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 [&::-webkit-scrollbar]:hidden">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-4 ${msg.isBot ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                  msg.isBot 
                    ? 'bg-white text-blue-600 shadow-[4px_4px_8px_#e0e0e0,-4px_-4px_8px_#ffffff] border border-gray-100' 
                    : 'bg-blue-600 text-white shadow-[4px_4px_10px_rgba(37,99,235,0.3)]'
                }`}>
                  {msg.isBot ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>

                <div className={`flex flex-col max-w-[80%] sm:max-w-[72%] gap-2 ${msg.isBot ? 'items-start' : 'items-end'}`}>
                  <div className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed tracking-wide font-normal whitespace-pre-wrap transition-all ${
                    msg.isBot 
                      ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100 shadow-[6px_6px_12px_#e6e6e6,-6px_-6px_12px_#ffffff]' 
                      : 'bg-blue-50 text-blue-950 rounded-tr-none border border-blue-100 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.02),4px_4px_8px_#e6e6e6]'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium px-2">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-white text-blue-600 border border-gray-100 shadow-[4px_4px_8px_#e0e0e0,-4px_-4px_8px_#ffffff]">
                  <Bot className="w-5 h-5 animate-spin" />
                </div>
                <div className="bg-white text-gray-400 rounded-2xl rounded-tl-none border border-gray-100 px-5 py-3.5 text-sm shadow-[6px_6px_12px_#e6e6e6,-6px_-6px_12px_#ffffff]">
                  Typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <footer className="p-6 bg-gray-50 border-t border-gray-200/60 shrink-0">
          <form onSubmit={handleSend} className="max-w-3xl mx-auto relative flex items-center">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              placeholder={isLoading ? "Waiting for response..." : "Ask me anything..."}
              className="w-full bg-gray-100 text-gray-800 rounded-2xl py-4 pl-5 pr-16 text-sm outline-none transition-all placeholder:text-gray-400 border border-gray-200/30 shadow-[inset_4px_4px_8px_#e0e0e0,inset_-4px_-4px_8px_#ffffff] focus:shadow-[inset_2px_2px_4px_#d1d1d1,inset_-2px_-2px_4px_#ffffff,0_0_0_2px_rgba(37,99,235,0.15)] disabled:opacity-60"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2.5 p-2.5 rounded-xl bg-white text-blue-600 hover:text-blue-700 disabled:opacity-40 transition-all cursor-pointer shadow-[3px_3px_6px_#cacaca,-3px_-3px_6px_#ffffff] active:shadow-[inset_2px_2px_5px_#cacaca,inset_-2px_-2px_5px_#ffffff] border border-gray-100"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </footer>
      </main>
    </div>
  );
};

export default Chatbot;