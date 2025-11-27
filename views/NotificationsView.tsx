
import React from 'react';
import { Notification } from '../types';

interface NotificationsViewProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkUnread: (id: string) => void;
  onMarkAllRead: () => void;
  onDelete: (id: string) => void;
  onNavigate: (notif: Notification) => void;
}

const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkRead,
  onMarkUnread,
  onMarkAllRead,
  onDelete,
  onNavigate
}) => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notificaciones</h1>
        <div className="flex gap-3">
          <button 
            onClick={onMarkAllRead}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">done_all</span>
            Marcar todas como leídas
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <span className="material-symbols-outlined text-6xl mb-4 text-gray-300">notifications_off</span>
            <p className="text-lg">No tienes notificaciones.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {notifications.map(notif => (
              <div 
                key={notif.id} 
                className={`p-6 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 group ${!notif.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
              >
                <div className="flex gap-4">
                  <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center shrink-0 
                    ${notif.type === 'warning' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' : 
                      notif.type === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 
                      'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'}`}
                  >
                    <span className="material-symbols-outlined">
                        {notif.type === 'warning' ? 'warning' : notif.type === 'success' ? 'check_circle' : 'info'}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`text-base ${!notif.read ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                        {notif.title}
                      </h3>
                      <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{notif.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 max-w-2xl">
                      {notif.message}
                    </p>
                    
                    <div className="flex gap-4 items-center">
                      <button 
                        onClick={() => onNavigate(notif)}
                        className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                      >
                        Ver detalles <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                      
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                        <button 
                          onClick={() => notif.read ? onMarkUnread(notif.id) : onMarkRead(notif.id)}
                          className="p-1 text-gray-400 hover:text-primary"
                          title={notif.read ? "Marcar como no leído" : "Marcar como leído"}
                        >
                          <span className="material-symbols-outlined text-lg">
                            {notif.read ? 'mark_email_unread' : 'drafts'}
                          </span>
                        </button>
                        <button 
                          onClick={() => onDelete(notif.id)}
                          className="p-1 text-gray-400 hover:text-red-500"
                          title="Eliminar"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsView;
