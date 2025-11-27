
import React, { useState } from 'react';
import { User, TimelineEvent, Announcement, Notification } from '../types';
import { mockStudents, professorSubmissions } from '../data';

interface ProfessorDashboardProps {
  user: User;
  onNavigateToGrading: () => void;
  onNavigateToCourseDetail: () => void;
  onCreateAnnouncement: (title: string, content: string) => void;
  notifications: Notification[];
}

const ProfessorDashboard: React.FC<ProfessorDashboardProps> = ({ user, onNavigateToGrading, onNavigateToCourseDetail, onCreateAnnouncement, notifications }) => {
  const pendingGradingCount = professorSubmissions.filter(s => s.status === 'submitted').length;
  const averageGrade = professorSubmissions
    .filter(s => s.grade !== undefined)
    .reduce((acc, curr, _, arr) => acc + (curr.grade || 0) / arr.length, 0)
    .toFixed(1);

  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');

  const handleSubmitAnnouncement = (e: React.FormEvent) => {
      e.preventDefault();
      onCreateAnnouncement(annTitle, annContent);
      setShowAnnouncementModal(false);
      setAnnTitle('');
      setAnnContent('');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      
      {/* Announcement Modal */}
      {showAnnouncementModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Crear Nuevo Anuncio</h3>
                  <form onSubmit={handleSubmitAnnouncement}>
                      <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
                          <input 
                            type="text" 
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                            value={annTitle}
                            onChange={e => setAnnTitle(e.target.value)}
                            required
                          />
                      </div>
                      <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contenido</label>
                          <textarea 
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent h-32 resize-none"
                            value={annContent}
                            onChange={e => setAnnContent(e.target.value)}
                            required
                          ></textarea>
                      </div>
                      <div className="flex justify-end gap-3">
                          <button type="button" onClick={() => setShowAnnouncementModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700 transition-colors">Cancelar</button>
                          <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors">Publicar</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Bienvenido, {user.name}</h1>
          <p className="text-purple-100 max-w-xl">
            Panel de gestión docente. Revisa el progreso de tus alumnos y califica entregas pendientes.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
            <span className="material-symbols-outlined text-[200px]">history_edu</span>
        </div>
      </div>

      {/* Alerts / Notifications */}
      {notifications.length > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <div className="flex gap-3">
                  <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400">notifications_active</span>
                  <div>
                      <h4 className="font-bold text-yellow-800 dark:text-yellow-200">Actividad Reciente</h4>
                      <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                          {notifications.slice(0, 3).map(n => <li key={n.id}>{n.message}</li>)}
                      </ul>
                  </div>
              </div>
          </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full">
                <span className="material-symbols-outlined text-3xl">groups</span>
            </div>
            <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Alumnos Inscritos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockStudents.length}</p>
            </div>
        </div>
        <div 
            onClick={onNavigateToGrading}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 cursor-pointer hover:border-primary transition-colors group"
        >
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-full group-hover:bg-orange-200 transition-colors">
                <span className="material-symbols-outlined text-3xl">assignment_late</span>
            </div>
            <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Tareas por Calificar</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingGradingCount}</p>
            </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full">
                <span className="material-symbols-outlined text-3xl">analytics</span>
            </div>
            <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Promedio del Grupo</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{averageGrade}</p>
            </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-2 gap-4">
                <button onClick={onNavigateToGrading} className="p-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 flex flex-col items-center justify-center gap-2 text-center transition-colors">
                    <span className="material-symbols-outlined text-3xl text-primary">grading</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Calificar</span>
                </button>
                <button onClick={() => setShowAnnouncementModal(true)} className="p-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 flex flex-col items-center justify-center gap-2 text-center transition-colors">
                    <span className="material-symbols-outlined text-3xl text-green-600">campaign</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Crear Anuncio</span>
                </button>
                <button onClick={onNavigateToCourseDetail} className="p-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 flex flex-col items-center justify-center gap-2 text-center transition-colors">
                    <span className="material-symbols-outlined text-3xl text-orange-500">upload_file</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Subir Recurso</span>
                </button>
                <button onClick={onNavigateToCourseDetail} className="p-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 flex flex-col items-center justify-center gap-2 text-center transition-colors">
                    <span className="material-symbols-outlined text-3xl text-blue-500">add_task</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Nueva Tarea</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessorDashboard;
