
import React from 'react';
import { courses } from '../data';
import { User } from '../types';

interface GradesProps {
    user: User;
    onNavigateToGrading?: () => void;
}

const Grades: React.FC<GradesProps> = ({ user, onNavigateToGrading }) => {
  const isProfessor = user.userRole === 'professor';

  // --- PROFESSOR VIEW ---
  if (isProfessor) {
      // Filter courses taught by this professor (mock: assumes all for now or filter by name)
      const myCourses = courses.filter(c => c.professor === user.name);

      return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Libros de Calificaciones</h1>
                    <p className="text-gray-500 mt-2">Selecciona un curso para gestionar las notas.</p>
                </div>
                <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600">
                    <span className="material-symbols-outlined text-base align-middle mr-1">download</span> Exportar Todo
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myCourses.length > 0 ? myCourses.map(course => (
                    <div 
                        key={course.id} 
                        onClick={onNavigateToGrading}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all group"
                    >
                        <div className={`h-24 ${course.color} relative`}>
                            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-800 shadow-sm">
                                {course.code}
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">{course.name}</h3>
                            <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
                                <span>5 Alumnos</span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">assignment</span> 3 Tareas</span>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                                <span className="text-primary text-sm font-bold flex items-center gap-1">
                                    Abrir Gradebook <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </span>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-3 text-center py-10 text-gray-500">
                        No tienes cursos asignados actualmente.
                    </div>
                )}
            </div>
        </div>
      );
  }

  // --- STUDENT VIEW ---
  const totalCredits = courses.reduce((acc, c) => acc + (c.progress === 100 ? c.credits : 0), 0);
  const totalPossibleCredits = courses.reduce((acc, c) => acc + c.credits, 0);
  const creditPercentage = (totalCredits / totalPossibleCredits) * 100;

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kardex y Calificaciones</h1>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Progreso de Créditos</h3>
            <div className="relative size-32">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                    <path className="text-gray-200 dark:text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                    <path className="text-primary transition-all duration-1000" strokeDasharray={`${creditPercentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-bold">{totalCredits}</span>
                    <span className="text-xs text-gray-500">/ {totalPossibleCredits}</span>
                </div>
            </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm md:col-span-2">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Desempeño por Curso</h3>
            <div className="space-y-4">
                {courses.slice(0, 4).map(c => (
                    <div key={c.id}>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium">{c.name}</span>
                            <span>{c.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                            <div className={`h-2.5 rounded-full ${c.progress > 80 ? 'bg-green-500' : c.progress > 50 ? 'bg-blue-500' : 'bg-orange-500'}`} style={{width: `${c.progress}%`}}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Curso</th>
              <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Créditos</th>
              <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Tareas</th>
              <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Promedio</th>
              <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-10 rounded-full ${course.color}`}></div>
                    <div>
                        <span className="font-medium text-gray-900 dark:text-white block">{course.name}</span>
                        <span className="text-xs text-gray-500">{course.code}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center font-mono text-sm">{course.credits}</td>
                <td className="p-4 text-center text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex flex-col gap-1">
                        {course.modules.flatMap(m => m.resources).filter(r => r.type === 'assignment' || r.type === 'quiz').map(r => (
                            <div key={r.id} className="flex justify-between text-xs bg-gray-100 dark:bg-gray-800 p-1 rounded">
                                <span className="truncate w-24">{r.title}</span>
                                <span className="font-bold">{r.score || '-'}</span>
                            </div>
                        ))}
                        {course.modules.flatMap(m => m.resources).filter(r => r.type === 'assignment' || r.type === 'quiz').length === 0 && <span className="text-gray-400 text-xs">-</span>}
                    </div>
                </td>
                <td className="p-4 text-center">
                  <span className="font-bold text-gray-900 dark:text-white text-lg">{course.progress > 0 ? (course.progress * 0.95).toFixed(1) : '-'}</span>
                </td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${course.progress === 100 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {course.progress === 100 ? 'Completado' : 'En curso'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Grades;
