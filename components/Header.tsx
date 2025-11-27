
import React, { useState, useRef, useEffect } from 'react';
import { User, Notification, Message } from '../types';
import { messages as initialMessages } from '../data';

interface HeaderProps {
  user: User;
  notifications: Notification[];
  onMenuClick: () => void;
  onAccessibilityClick: () => void;
  onNavigateToProfile: () => void;
  onNavigateToMessages: () => void;
  onNavigateToSettings: () => void;
  onNavigateToNotifications: () => void;
  onNotificationClick: (n: Notification) => void;
  onDeleteNotification: (id: string) => void; 
  onMarkAllRead: () => void;
  onMarkUnread: (id: string) => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  breadcrumbs: { label: string; isActive: boolean; onClick: () => void }[];
}

const Header: React.FC<HeaderProps> = ({ 
  user, 
  notifications,
  onMenuClick, 
  onAccessibilityClick,
  onNavigateToProfile,
  onNavigateToMessages,
  onNavigateToSettings,
  onNavigateToNotifications,
  onNotificationClick,
  onDeleteNotification,
  onMarkAllRead,
  onMarkUnread,
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
  breadcrumbs
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter(n => !n.read).length;
  const unreadMsgs = initialMessages.filter(m => m.unread).length; 

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setShowNotifications(false);
      if (msgRef.current && !msgRef.current.contains(event.target as Node)) setShowMessages(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setShowProfileMenu(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex flex-col">
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden text-gray-600 dark:text-gray-300">
            <span className="material-symbols-outlined">menu</span>
          </button>
          
          <div className="flex items-center gap-1 mr-2">
            <button 
              onClick={onGoBack} 
              disabled={!canGoBack}
              className={`p-2 rounded-full transition-colors ${canGoBack ? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200' : 'text-gray-300 dark:text-gray-700 cursor-not-allowed'}`}
              title="Atrás (Alt+Left)"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
            <button 
              onClick={onGoForward} 
              disabled={!canGoForward}
              className={`p-2 rounded-full transition-colors ${canGoForward ? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200' : 'text-gray-300 dark:text-gray-700 cursor-not-allowed'}`}
              title="Adelante (Alt+Right)"
            >
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full w-64 transition-all focus-within:ring-2 focus-within:ring-primary/50 focus-within:w-80">
            <span className="material-symbols-outlined text-gray-400 text-sm">search</span>
            <input type="text" placeholder="Buscar cursos (Alt+S)..." className="bg-transparent border-none outline-none text-sm w-full text-gray-700 dark:text-gray-200 placeholder-gray-400" />
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => { setShowNotifications(!showNotifications); setShowMessages(false); setShowProfileMenu(false); }}
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Notificaciones"
            >
              <span className="material-symbols-outlined">notifications</span>
              {unreadNotifs > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-fade-in">
                <div className="p-3 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800 dark:text-white">Notificaciones</h3>
                  <button onClick={onMarkAllRead} className="text-xs text-primary hover:underline">Marcar leídas</button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">No hay notificaciones</div>
                  ) : (
                    notifications.map(notif => (
                      <div key={notif.id} className={`p-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative group ${!notif.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                        <div 
                          className="flex gap-3 items-start cursor-pointer"
                          onClick={() => { onNotificationClick(notif); setShowNotifications(false); }}
                        >
                          <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${notif.type === 'warning' ? 'bg-orange-500' : notif.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                          <div className="flex-1 pr-6">
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{notif.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{notif.message}</p>
                            <p className="text-[10px] text-gray-400 mt-1">{notif.time}</p>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onDeleteNotification(notif.id); }}
                          className="absolute top-3 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Borrar notificación"
                        >
                          <span className="material-symbols-outlined text-base">close</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-2 text-center border-t border-gray-100 dark:border-gray-800">
                  <button onClick={() => { onNavigateToNotifications(); setShowNotifications(false); }} className="text-xs font-medium text-primary hover:underline">Ver todas</button>
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="relative" ref={msgRef}>
            <button 
              onClick={() => { setShowMessages(!showMessages); setShowNotifications(false); setShowProfileMenu(false); }}
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Mensajes"
            >
              <span className="material-symbols-outlined">chat_bubble</span>
              {unreadMsgs > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900">{unreadMsgs}</span>}
            </button>
            {showMessages && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-fade-in">
                 <div className="p-4 text-center">
                   <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Tienes mensajes sin leer</p>
                   <button 
                     onClick={() => { onNavigateToMessages(); setShowMessages(false); }}
                     className="w-full py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                   >
                     Ir a Mensajes
                   </button>
                 </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); setShowMessages(false); }}
              className="flex items-center gap-3 pl-2 border-l border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded-lg transition-colors"
              aria-label="Menú de perfil"
            >
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-gray-800 dark:text-white leading-tight">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
              </div>
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-fade-in">
                <div className="py-1">
                  <button onClick={() => { onNavigateToProfile(); setShowProfileMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">person</span> Mi Perfil
                  </button>
                  <button onClick={() => { onNavigateToSettings(); setShowProfileMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">settings</span> Configuración
                  </button>
                  <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>
                  <button className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">logout</span> Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-1.5 flex items-center text-xs overflow-x-auto">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center whitespace-nowrap">
              {index > 0 && <span className="material-symbols-outlined text-sm text-gray-400 mx-1">chevron_right</span>}
              <button 
                onClick={crumb.onClick}
                disabled={crumb.isActive}
                className={`font-medium transition-colors ${crumb.isActive ? 'text-gray-500 dark:text-gray-400 cursor-default' : 'text-primary hover:underline'}`}
              >
                {crumb.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
