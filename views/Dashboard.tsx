
import React from 'react';
import { courses, timelineEvents } from '../data';
import { Course, TimelineEvent, User, Announcement, Notification } from '../types';
import ProfessorDashboard from './ProfessorDashboard';

interface DashboardProps {
  user: User;
  onCourseSelect: (course: Course) => void;
  onEventSelect: (event: TimelineEvent) => void;
  onDateSelect: (date: string) => void;
  onNavigateToGrading?: () => void;
  onNavigateToCourseDetail?: () => void;
  onCreateAnnouncement?: (t: string, c: string) => void;
  announcements?: Announcement[];
  notifications?: Notification[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, onCourseSelect, onEventSelect, onDateSelect, onNavigateToGrading, onNavigateToCourseDetail, onCreateAnnouncement, announcements, notifications }) => {
  
  if (user.userRole === 'professor') {
      return <ProfessorDashboard 
        user={user} 
        onNavigateToGrading={onNavigateToGrading || (() => {})} 
        onNavigateToCourseDetail={onNavigateToCourseDetail || (() => {})}
        onCreateAnnouncement={onCreateAnnouncement || (() => {})}
        notifications={notifications || []}
      />;
  }

  const activeCourses = courses.filter(c => c.status === 'En progreso');
  const upcomingEvents = timelineEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">¡Hola, {user.name.split(' ')[0]}! 👋</h1>
          <p className="text-blue-100 max-w-xl">
            Tienes {upcomingEvents.length} actividades pendientes para esta semana. 
            Continúa donde lo dejaste en "{activeCourses[0]?.name || 'tus cursos'}".
          </p>
          <div className="mt-6 flex gap-3">
             <button 
                onClick={() => onDateSelect(new Date().toISOString().split('T')[0])}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
             >
                <span className="material-symbols-outlined text-sm">calendar_month</span> Ver Agenda
             </button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
            <span className="material-symbols-outlined text-[200px]">school</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Courses */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Announcements */}
          {announcements && announcements.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm mb-6">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">campaign</span> Anuncios Recientes
                  </h2>
                  <div className="space-y-4">
                      {announcements.map(ann => (
                          <div key={ann.id} className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border-l-4 border-primary">
                              <h3 className="font-bold text-gray-800 dark:text-white">{ann.title}</h3>
                              <p className="text-xs text-primary font-medium mb-2">{ann.courseName} • {ann.author} • {ann.date}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{ann.content}</p>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          <div className="flex justify-between items-center">
             <h2 className="text-xl font-bold text-gray-900 dark:text-white">Mis Cursos Activos</h2>
             <button onClick={() => onCourseSelect(activeCourses[0])} className="text-primary text-sm font-medium hover:underline">Ver todos</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {activeCourses.slice(0, 4).map(course => (
                <div 
                    key={course.id} 
                    onClick={() => onCourseSelect(course)}
                    className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 rounded-lg ${course.color} flex items-center justify-center text-white font-bold text-xs`}>
                            {course.code}
                        </div>
                        <span className="text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded-full">{course.progress}%</span>
                    </div>
                    <h3 className="font-bold text-gray-800 dark:text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors">{course.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{course.professor}</p>
                    
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                </div>
             ))}
          </div>
        </div>

        {/* Right Column: Timeline */}
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Próximas Entregas</h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
                        <div key={event.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer" onClick={() => onEventSelect(event)}>
                            <div className="flex gap-3">
                                <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg border shrink-0 ${
                                    event.urgent ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800' : 'bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                                }`}>
                                    <span className="text-xs font-bold uppercase">{new Date(event.date).toLocaleDateString('es-ES', { month: 'short' }).replace('.', '')}</span>
                                    <span className="text-lg font-bold">{new Date(event.date).getDate()}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className={`font-bold text-sm truncate ${event.urgent ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'}`}>{event.title}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{event.course}</p>
                                    <div className="mt-1 flex items-center gap-1">
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                            event.type === 'assignment' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-purple-50 border-purple-100 text-purple-600'
                                        }`}>
                                            {event.type === 'assignment' ? 'Tarea' : 'Examen'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="p-6 text-center text-gray-500 text-sm">
                            No hay eventos próximos.
                        </div>
                    )}
                </div>
                <button onClick={() => onDateSelect(new Date().toISOString().split('T')[0])} className="w-full py-3 text-center text-sm font-medium text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-t border-gray-100 dark:border-gray-700">
                    Ver calendario completo
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
