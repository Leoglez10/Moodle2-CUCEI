
import React, { useState, useEffect, useRef } from 'react';
import { Message, ChatMessage } from '../types';

interface MessagesProps {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
}

const Messages: React.FC<MessagesProps> = ({ messages, setMessages, activeChatId, setActiveChatId }) => {
  const [messageInput, setMessageInput] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeChat = messages.find(m => m.id === activeChatId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.history]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChatId) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: messageInput,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = messages.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          history: [...(chat.history || []), newMessage],
          preview: `Tú: ${messageInput}`,
          time: 'Ahora'
        };
      }
      return chat;
    });

    setMessages(updatedMessages);
    setMessageInput('');
  };

  const handleDeleteMessage = (msgId: string) => {
    if (!activeChatId) return;
    const updatedMessages = messages.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          history: chat.history.filter(h => h.id !== msgId)
        };
      }
      return chat;
    });
    setMessages(updatedMessages);
  };

  const handleCreateChat = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newChatName.trim()) return;
    
    const newChat: Message = {
        id: Date.now().toString(),
        sender: newChatName,
        avatar: `https://ui-avatars.com/api/?name=${newChatName}&background=random`,
        preview: 'Nuevo chat',
        time: 'Ahora',
        unread: false,
        history: []
    };
    setMessages([newChat, ...messages]);
    setActiveChatId(newChat.id);
    setShowNewChatModal(false);
    setNewChatName('');
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6 animate-fade-in pb-4 relative">
      
      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Nuevo Mensaje</h3>
                <form onSubmit={handleCreateChat}>
                    <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">Nombre del destinatario</label>
                    <input 
                        type="text" 
                        value={newChatName}
                        onChange={(e) => setNewChatName(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4 focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Escribe el nombre..."
                        autoFocus
                    />
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setShowNewChatModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">Crear Chat</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Chat List */}
      <div className={`w-full md:w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Mensajes</h2>
          <button onClick={() => setShowNewChatModal(true)} className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20">
            <span className="material-symbols-outlined">add_comment</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {messages.map(chat => (
            <div 
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`p-4 flex gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-50 dark:border-gray-800 ${activeChatId === chat.id ? 'bg-blue-50 dark:bg-gray-800 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
            >
              <div className="relative">
                <img src={chat.avatar} alt={chat.sender} className="w-12 h-12 rounded-full object-cover" />
                {chat.unread && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className={`text-sm font-bold truncate ${activeChatId === chat.id ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>{chat.sender}</h4>
                  <span className="text-[10px] text-gray-400">{chat.time}</span>
                </div>
                <p className={`text-xs truncate ${chat.unread ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-500 dark:text-gray-400'}`}>
                  {chat.preview}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`flex-1 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
        {activeChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
              <button onClick={() => setActiveChatId(null)} className="md:hidden p-2 hover:bg-gray-100 rounded-full">
                <span className="material-symbols-outlined text-gray-600">arrow_back</span>
              </button>
              <img src={activeChat.avatar} alt={activeChat.sender} className="w-10 h-10 rounded-full" />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{activeChat.sender}</h3>
                <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span> En línea
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-black/20">
              {activeChat.history?.map((msg) => (
                <div key={msg.id} className={`flex group ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'them' && <img src={activeChat.avatar} className="w-8 h-8 rounded-full mr-2 self-end mb-1" />}
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm relative ${
                    msg.sender === 'me' ? 'bg-primary text-white rounded-br-none' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    <span className={`text-[10px] block text-right mt-1 opacity-70`}>{msg.timestamp}</span>
                    {msg.sender === 'me' && (
                        <button 
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="absolute -left-8 top-1/2 -translate-y-1/2 p-1 text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity"
                            title="Borrar mensaje"
                        >
                            <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-b-2xl">
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Escribe un mensaje..." 
                  className="flex-1 bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-primary rounded-full py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
                />
                <button type="submit" disabled={!messageInput.trim()} className="p-2 bg-primary text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <span className="material-symbols-outlined text-6xl mb-4 opacity-50">forum</span>
            <p>Selecciona un chat</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
