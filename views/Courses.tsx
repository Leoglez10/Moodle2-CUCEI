
import React, { useState } from 'react';
import { courses as initialCourses } from '../data'; 
import { Course, CourseStatus, User } from '../types';

interface CoursesProps {
  onCourseSelect: (course: Course) => void;
  coursesList?: Course[]; 
  onArchiveCourse?: (courseId: string) => void;
  onNavigateToGrading?: () => void;
  user: User; // Need to know role
}

const Courses: React.FC<CoursesProps> = ({ onCourseSelect, coursesList, onArchiveCourse, onNavigateToGrading, user }) => {
  const displayCourses = coursesList || initialCourses;
  const isProfessor = user.userRole === 'professor';
  
  const [filter, setFilter] = useState<CourseStatus | 'ALL'>('ALL');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [courseToArchive, setCourseToArchive] = useState<Course | null>(null);

  // For professors, only show courses they teach (mock logic: matching name or just specific ones)
  const myCourses = isProfessor 
    ? displayCourses.filter(c => c.professor === user.name) 
    : displayCourses;

  const activeCourses = myCourses.filter(c => !c.archived);
  const archivedCourses = myCourses.filter(c => c.archived);

  const filteredCourses = filter === 'ALL' 
    ? activeCourses 
    : activeCourses.filter(c => c.status === filter);

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const initiateArchive = (e: React.MouseEvent, course: Course) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setCourseToArchive(course);
  };

  const confirmArchive = () => {
    if (courseToArchive && onArchiveCourse) {
        onArchiveCourse(courseToArchive.id);
    }
    setCourseToArchive(null);
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      
      {/* Archive Confirmation Modal */}
      {courseToArchive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm shadow-2xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">¿Archivar curso?</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                    El curso "{courseToArchive.name}" se moverá a la sección de archivados.
                </p>
                <div className="flex justify-end gap-3">
                    <button onClick={() => setCourseToArchive(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg text-sm">Cancelar</button>
                    <button onClick={confirmArchive} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">Sí, archivar</button>
                </div>
            </div>
        </div>
      )}

      {/* Main Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{isProfessor ? 'Cursos Impartidos' : 'Mis Cursos'}</h1>
            {isProfessor && <p className="text-sm text-gray-500 mt-1">Gestiona tus grupos y materiales.</p>}
        </div>
        
        {!isProfessor && (
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg self-start">
            <button 
                onClick={() => setFilter('ALL')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'ALL' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-500 dark:text-gray-400'}`}
            >
                Todos
            </button>
            <button 
                onClick={() => setFilter(CourseStatus.IN_PROGRESS)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === CourseStatus.IN_PROGRESS ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-500 dark:text-gray-400'}`}
            >
                En Progreso
            </button>
            <button 
                onClick={() => setFilter(CourseStatus.FUTURE)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === CourseStatus.FUTURE ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-500 dark:text-gray-400'}`}
            >
                Futuros
            </button>
            </div>
        )}
        {isProfessor && (
            <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 shadow-md">
                <span className="material-symbols-outlined">add</span> Nuevo Curso
            </button>
        )}
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" onClick={() => setActiveMenuId(null)}>
            {filteredCourses.map(course => (
            <div 
                key={course.id} 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group text-left hover:-translate-y-1 relative"
            >
                <div className="cursor-pointer flex-1 flex flex-col" onClick={() => onCourseSelect(course)}>
                    <div className={`h-40 ${course.color} relative overflow-hidden w-full`}>
                        <img src={course.image} alt={course.name} className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500" />
                        {isProfessor && (
                            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">
                                Profesor Titular
                            </div>
                        )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col w-full">
                        <span className="text-xs font-bold text-primary mb-2 block bg-primary/10 w-fit px-2 py-1 rounded">{course.code}</span>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-primary transition-colors">{course.name}</h3>
                        {!isProfessor && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">person</span>
                                {course.professor}
                            </p>
                        )}
                        
                        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 w-full">
                            {isProfessor ? (
                                <div className="flex justify-between items-center gap-2">
                                    <button 
                                        className="flex-1 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-600"
                                        onClick={(e) => { e.stopPropagation(); if(onNavigateToGrading) onNavigateToGrading(); }}
                                    >
                                        Calificaciones
                                    </button>
                                    <button className="flex-1 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-600">
                                        Alumnos
                                    </button>
                                </div>
                            ) : (
                                course.status === CourseStatus.IN_PROGRESS ? (
                                <>
                                    <div className="flex justify-between text-xs mb-2">
                                    <span className="text-gray-500 dark:text-gray-400">Tu progreso</span>
                                    <span className="font-bold text-gray-700 dark:text-gray-200">{course.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mb-4">
                                    <div className="bg-primary h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                                    </div>
                                </>
                                ) : (
                                <div className="flex items-center justify-center h-full py-4 text-gray-400 text-sm italic">
                                    {course.status === CourseStatus.PAST ? 'Curso finalizado' : 'Este curso aún no comienza'}
                                </div>
                                )
                            )}
                        </div>
                    </div>
                </div>

                <div className="absolute top-4 right-4">
                    <button 
                        onClick={(e) => toggleMenu(e, course.id)}
                        className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/40 transition-colors"
                    >
                        <span className="material-symbols-outlined text-white">more_horiz</span>
                    </button>
                    {activeMenuId === course.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-20 animate-fade-in">
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">settings</span> Configuración
                            </button>
                            <button 
                                onClick={(e) => initiateArchive(e, course)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">archive</span> Archivar
                            </button>
                        </div>
                    )}
                </div>
            </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">school</span>
            <p className="text-gray-500 dark:text-gray-400 text-lg">No tienes cursos activos.</p>
        </div>
      )}

      {/* Archived Courses Section */}
      {archivedCourses.length > 0 && (
        <div className="pt-10 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined">archive</span> Cursos Archivados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 opacity-75">
                {archivedCourses.map(course => (
                    <div key={course.id} className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex gap-4 items-center cursor-pointer hover:opacity-100 transition-opacity" onClick={() => onCourseSelect(course)}>
                        <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                            <img src={course.image} className="w-full h-full object-cover grayscale" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-700 dark:text-gray-300">{course.name}</h4>
                            <p className="text-xs text-gray-500">{course.code}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
