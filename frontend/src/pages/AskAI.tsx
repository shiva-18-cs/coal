import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageSquare, Send, Bot, User, FileText, Sparkles, X, RotateCcw, Clock } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  sources?: any[];
  timestamp?: string;
}

const AskAI: React.FC = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeSource, setActiveSource] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "What was MCL coal production in 2024?",
    "Compare coal production across all subsidiaries in 2024",
    "What are the main topics in recent geological reports?",
    "Summarize total coal production for 2024",
    "How many differences are still pending review?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendQuestion = async (questionText: string) => {
    if (!questionText.trim()) return;

    setMessages(prev => [
      ...prev, 
      { sender: 'user', text: questionText, timestamp: new Date().toLocaleTimeString() }
    ]);
    setQuery('');
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const res = await axios.post(`${API_URL}/ai/query`, {
        question: questionText,
        user: user.full_name || 'R.K. Sharma'
      });
      
      setMessages(prev => [
        ...prev, 
        { 
          sender: 'ai', 
          text: res.data.answer,
          sources: res.data.sources,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev, 
        { 
          sender: 'ai', 
          text: "I encountered an error retrieving data from the repository. Please try rephrasing your question.",
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendQuestion(query);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto h-[calc(100vh-theme(spacing.16))] flex flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ask AI Mining Intelligence</h1>
          <p className="text-sm text-gray-500">
            Query across reports, production metrics, targets, and statutory filings with verifiable citations.
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            className="flex items-center text-xs text-gray-500 hover:text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-lg transition cursor-pointer"
          >
            <RotateCcw size={13} className="mr-1" />
            Clear Conversation
          </button>
        )}
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white rounded-2xl shadow-xs border border-gray-200 flex flex-col overflow-hidden">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 py-8">
              <div className="h-14 w-14 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center mb-4">
                <Sparkles size={28} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">How can I assist your mining report analysis?</h2>
              <p className="text-sm text-gray-500 max-w-md mb-6">
                Ask about production metrics, target variances, safety audits, or document discrepancies.
              </p>

              {/* Clickable Suggested Question Pills */}
              <div className="w-full max-w-2xl space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Suggested Queries (Click to run):
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendQuestion(q)}
                      className="px-3.5 py-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 text-left transition cursor-pointer flex items-center"
                    >
                      <Sparkles size={12} className="mr-1.5 text-blue-500 shrink-0" />
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-3xl ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                    msg.sender === 'user' ? 'bg-blue-700 text-white ml-3' : 'bg-indigo-600 text-white mr-3'
                  }`}>
                    {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  
                  <div className={`rounded-2xl p-4.5 ${
                    msg.sender === 'user' 
                      ? 'bg-blue-700 text-white' 
                      : 'bg-gray-50 text-gray-900 border border-gray-200'
                  }`}>
                    <p className="whitespace-pre-line text-sm leading-relaxed">{msg.text}</p>

                    {/* Cited Sources */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-gray-200 text-xs">
                        <p className="font-semibold uppercase tracking-wider text-gray-500 mb-2">
                          Verified Citations ({msg.sources.length})
                        </p>
                        <div className="space-y-1.5">
                          {msg.sources.map((src, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveSource(src)}
                              className="w-full text-left flex items-center justify-between bg-white p-2.5 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50/40 transition cursor-pointer"
                            >
                              <div className="flex items-center space-x-2">
                                <FileText size={14} className="text-blue-600 shrink-0" />
                                <span className="font-semibold text-gray-800">{src.document}</span>
                              </div>
                              <span className="text-blue-600 font-mono text-[11px] font-semibold">
                                {src.page || 'Page 1'} &rarr;
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className={`text-[10px] mt-2 ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex justify-start">
              <div className="flex flex-row max-w-3xl">
                <div className="shrink-0 h-8 w-8 rounded-full bg-indigo-600 text-white mr-3 flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div className="rounded-2xl p-4 bg-gray-50 text-gray-900 border border-gray-200 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={handleSend} className="flex space-x-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about CMPDI/CIL production, safety, or subsidiary reports..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl transition disabled:opacity-40 flex items-center cursor-pointer text-sm shadow-xs"
            >
              <Send size={15} className="mr-2" />
              Ask
            </button>
          </form>
        </div>
      </div>

      {/* Source Details Modal */}
      {activeSource && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-md w-full p-6">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center space-x-2">
                <FileText size={18} className="text-blue-600" />
                <h3 className="font-bold text-gray-900 text-base">Verified Document Citation</h3>
              </div>
              <button 
                onClick={() => setActiveSource(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-xs text-gray-400 font-semibold uppercase">Document Title</div>
                <div className="font-bold text-gray-900 mt-0.5">{activeSource.document}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="text-xs text-gray-400 font-semibold uppercase">Page Citation</div>
                  <div className="font-mono font-bold text-blue-700 mt-0.5">{activeSource.page || 'Page 1'}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="text-xs text-gray-400 font-semibold uppercase">Document ID</div>
                  <div className="font-mono font-bold text-gray-800 mt-0.5">{activeSource.doc_id || 'DOC-1001'}</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 text-blue-900 rounded-xl border border-blue-100 text-xs">
                Data was matched against the indexed repository during multi-document vector and entity lookup.
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setActiveSource(null)}
                className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-black transition cursor-pointer"
              >
                Close Citation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AskAI;
