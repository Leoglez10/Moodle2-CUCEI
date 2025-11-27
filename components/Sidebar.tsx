
import React from 'react';
import { ViewName } from '../types';

interface SidebarProps {
  currentView: ViewName;
  setView: (view: ViewName) => void;
  isMobileOpen: boolean;
  closeMobile: () => void;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isMobileOpen, closeMobile, onLogout }) => {
  
  const navItems: { id: ViewName; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Inicio', icon: 'home' },
    { id: 'courses', label: 'Mis Cursos', icon: 'school' },
    { id: 'calendar', label: 'Calendario', icon: 'calendar_month' },
    { id: 'grades', label: 'Calificaciones', icon: 'grade' },
    { id: 'files', label: 'Archivos', icon: 'folder' },
  ];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-200 ease-in-out
    lg:translate-x-0 lg:static lg:inset-0
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={closeMobile}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="flex items-center gap-3 p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold text-xl">
            M
          </div>
          <span className="font-bold text-xl text-gray-800 dark:text-white tracking-tight">Moodle2</span>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id);
                closeMobile();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === item.id
                  ? 'bg-primary text-white shadow-md shadow-primary/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 dark:border-gray-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
