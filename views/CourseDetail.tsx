
import React, { useState, useEffect } from 'react';
import { Course, Resource, User, CourseModule } from '../types';
import { mockStudents, professorSubmissions } from '../data';

interface CourseDetailProps {
  course: Course;
  onBack: () => void;
  onResourceSelect: (resource: Resource) => void;
  onContact: (professorName: string) => void;
  user: User;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course, onBack, onResourceSelect, onContact, user }) => {
  const isProfessor = user.userRole === 'professor';
  const [activeTab, setActiveTab] = useState<'content' | 'grades' | 'participants' | 'gestion' | 'entregas' | 'alumnos'>(isProfessor ? 'gestion' : 'content');
  const [localModules, setLocalModules] = useState<CourseModule[]>(course.modules);
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [newResourceTitle, setNewResourceTitle] = useState('');
  const [newResourceType, setNewResourceType] = useState<Resource['type']>('assignment');

  // Sync if course prop updates (though usually handled by parent state, local state allows instant UI updates for demo)
  useEffect(() => {
      setLocalModules(course.modules);
  }, [course]);

  // Professor KPIs
  const totalStudents = mockStudents.length;
  const pendingGrading = professorSubmissions.filter(s => s.status === 'submitted').length;
  const avgGrade = 88.5; // Mock

  const getIconForResource = (type: string) => {
    switch (type) {
      case 'pdf': return 'picture_as_pdf';
      case 'video': return 'play_circle';
      case 'assignment': return 'assignment';
      case 'quiz': return 'quiz';
      case 'forum': return 'forum';
      case 'link': return 'link';
      case 'text': return 'edit_note';
      default: return 'description';
    }
  };

  const handleAddResource = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newResourceTitle.trim()) return;

      const newResource: Resource = {
          id: `new-r-${Date.now()}`,
          title: newResourceTitle,
          type: newResourceType,
          description: 'Recurso añadido recientemente.'
      };

      // Add to first module for demo
      const updatedModules = [...localModules];
      if (updatedModules.length > 0) {
          updatedModules[0] = {
              ...updatedModules[0],
              resources: [...updatedModules[0].resources, newResource]
          };
          setLocalModules(updatedModules);
      } else {
          // Create module if none
          setLocalModules([{ id: 'm-new', title: 'Nuevo Módulo', resources: [newResource] }]);
      }

      setShowAddResourceModal(false);
      setNewResourceTitle('');
      alert("Recurso añadido correctamente.");
  };

  const handleDeleteResource = (moduleId: string, resourceId: string) => {
      if (window.confirm("¿Estás seguro de que quieres eliminar este recurso?")) {
          const updatedModules = localModules.map(m => {
              if (m.id === moduleId) {
                  return { ...m, resources: m.resources.filter(r => r.id !== resourceId) };
              }
              return m;
          });
          setLocalModules(updatedModules);
      }
  };

  const handleToggleVisibility = (moduleId: string, resourceId: string) => {
      // Simulate toggle by alerting (visual state not fully in mock data, but logic here)
      alert("Visibilidad del recurso cambiada.");
  };

  const handleEditResource = (moduleId: string, resourceId: string) => {
      const newName = prompt("Nuevo nombre para el recurso:");
      if (newName) {
          const updatedModules = localModules.map(m => {
              if (m.id === moduleId) {
                  return {
                      ...m,
                      resources: m.resources.map(r => r.id === resourceId ? { ...r, title: newName } : r)
                  };
              }
              return m;
          });
          setLocalModules(updatedModules);
      }
  };

  const handleEditModuleTitle = (moduleId: string) => {
      const newTitle = prompt("Nuevo título del módulo:");
      if (newTitle) {
          setLocalModules(localModules.map(m => m.id === moduleId ? { ...m, title: newTitle } : m));
      }
  };

  const handleDownloadCSV = () => {
      alert("Descargando lista de alumnos en CSV...");
  };

  // --- STUDENT VIEW RENDER ---
  const renderStudentView = () => (
    <>
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <button onClick={() => setActiveTab('content')} className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'content' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}>Contenido</button>
        <button onClick={() => setActiveTab('grades')} className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'grades' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}>Calificaciones</button>
        <button onClick={() => setActiveTab('participants')} className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'participants' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}>Participantes</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'content' && (
            <div className="space-y-4">
              {course.modules.length > 0 ? course.modules.map((module) => (
                <div key={module.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <h4 className="font-bold text-gray-800 dark:text-gray-200">{module.title}</h4>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {module.resources.map((resource, idx) => (
                      <button key={idx} onClick={() => onResourceSelect(resource)} className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left group">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 
                            ${resource.type === 'video' ? 'bg-red-100 text-red-600' : 
                              resource.type === 'pdf' ? 'bg-orange-100 text-orange-600' : 
                              resource.type === 'quiz' ? 'bg-purple-100 text-purple-600' :
                              resource.type === 'link' ? 'bg-sky-100 text-sky-600' :
                              resource.type === 'text' ? 'bg-emerald-100 text-emerald-600' :
                              'bg-blue-100 text-blue-600'}`}>
                          <span className="material-symbols-outlined">{getIconForResource(resource.type)}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-primary transition-colors">{resource.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{resource.type}</p>
                        </div>
                        <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">chevron_right</span>
                      </button>
                    ))}
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 text-gray-500">
                    <span className="material-symbols-outlined text-4xl mb-2">folder_off</span>
                    <p>Este curso no tiene contenido visible por el momento.</p>
                </div>
              )}
            </div>
          )}
          {activeTab === 'grades' && (
             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-4">Desglose de Calificaciones</h3>
                <div className="space-y-2">
                    {course.modules.flatMap(m => m.resources).filter(r => r.score !== undefined || r.type === 'assignment' || r.type === 'quiz').map(r => (
                        <div key={r.id} className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <span>{r.title}</span>
                            <span className={`font-bold ${r.score !== undefined ? 'text-green-600' : 'text-gray-400'}`}>{r.score !== undefined ? `${r.score}/${r.maxScore || 100}` : 'Pendiente'}</span>
                        </div>
                    ))}
                    {course.modules.flatMap(m => m.resources).filter(r => r.score !== undefined || r.type === 'assignment' || r.type === 'quiz').length === 0 && <p className="text-gray-500 text-sm">No hay actividades calificables aún.</p>}
                </div>
             </div>
          )}
        </div>
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Instructor</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xl font-bold">{course.professor.charAt(0)}</div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{course.professor}</p>
                <button 
                    onClick={() => onContact(course.professor)}
                    className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                >
                  <span className="material-symbols-outlined text-sm">chat</span> Contactar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // --- PROFESSOR VIEW RENDER ---
  const renderProfessorView = () => (
    <>
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><span className="material-symbols-outlined">group</span></div>
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase">Alumnos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStudents}</p>
            </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-full"><span className="material-symbols-outlined">assignment_late</span></div>
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase">Por Calificar</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingGrading}</p>
            </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-full"><span className="material-symbols-outlined">analytics</span></div>
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase">Promedio</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgGrade}</p>
            </div>
        </div>
      </div>

      {/* Professor Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <button onClick={() => setActiveTab('gestion')} className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'gestion' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>Gestión</button>
        <button onClick={() => setActiveTab('entregas')} className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'entregas' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>Entregas</button>
        <button onClick={() => setActiveTab('alumnos')} className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'alumnos' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>Alumnos</button>
      </div>

      <div className="mt-6">
        {/* Gestión: Edit Content */}
        {activeTab === 'gestion' && (
            <div className="space-y-4">
                <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Modifica el contenido del curso, añade tareas o recursos.</p>
                    <button 
                        onClick={() => setShowAddResourceModal(true)}
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-md"
                    >
                        <span className="material-symbols-outlined text-lg">add</span> Nuevo Recurso
                    </button>
                </div>

                {localModules.map((module) => (
                <div key={module.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-dashed border-gray-300 dark:border-gray-600">
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h4 className="font-bold text-gray-800 dark:text-gray-200">{module.title}</h4>
                    <div className="flex gap-2">
                        <button onClick={() => handleEditModuleTitle(module.id)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-500" title="Editar Título"><span className="material-symbols-outlined text-lg">edit</span></button>
                        <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-500" title="Ocultar Módulo"><span className="material-symbols-outlined text-lg">visibility_off</span></button>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {module.resources.map((resource, idx) => (
                      <div key={resource.id} className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left group">
                        <span className="material-symbols-outlined text-gray-400 cursor-move">drag_indicator</span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 dark:text-gray-200">{resource.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">{resource.type}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => onResourceSelect(resource)} className="p-2 text-gray-500 hover:text-primary hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Ver Recurso"><span className="material-symbols-outlined text-lg">visibility</span></button>
                            <button onClick={() => handleEditResource(module.id, resource.id)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Editar Recurso"><span className="material-symbols-outlined text-lg">edit</span></button>
                            <button onClick={() => handleToggleVisibility(module.id, resource.id)} className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Visibilidad"><span className="material-symbols-outlined text-lg">visibility_off</span></button>
                            <button onClick={() => handleDeleteResource(module.id, resource.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Eliminar"><span className="material-symbols-outlined text-lg">delete</span></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                ))}
            </div>
        )}

        {/* Entregas: Grading Inbox */}
        {activeTab === 'entregas' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Actividad</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Vencimiento</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Entregas</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Pendientes de Calif.</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {course.modules.flatMap(m => m.resources).filter(r => r.type === 'assignment' || r.type === 'quiz').map(r => (
                            <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="p-4 font-medium text-gray-900 dark:text-gray-200">{r.title}</td>
                                <td className="p-4 text-sm text-gray-500">{r.dueDate || 'Sin fecha'}</td>
                                <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{r.submissionsCount || 0}/{totalStudents}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${(r.submissionsCount || 0) - (r.gradedCount || 0) > 0 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                                        {(r.submissionsCount || 0) - (r.gradedCount || 0)}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button 
                                        onClick={() => onResourceSelect(r)}
                                        className="px-3 py-1.5 bg-primary text-white text-xs rounded hover:bg-blue-700 font-medium"
                                    >
                                        Calificar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {/* Alumnos: Roster */}
        {activeTab === 'alumnos' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 dark:text-white">Lista de Clase</h3>
                    <button onClick={handleDownloadCSV} className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">download</span> Descargar CSV
                    </button>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {mockStudents.map(student => (
                        <div key={student.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <div className="flex items-center gap-3">
                                <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{student.name}</p>
                                    <p className="text-xs text-gray-500">{student.code} • {student.email}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => onContact(student.name)} className="p-2 text-gray-500 hover:text-primary hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Enviar Mensaje">
                                    <span className="material-symbols-outlined text-xl">mail</span>
                                </button>
                                <button onClick={() => alert(`Historial de ${student.name}`)} className="p-2 text-gray-500 hover:text-primary hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Ver Historial">
                                    <span className="material-symbols-outlined text-xl">history</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* Add Resource Modal */}
      {showAddResourceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl p-6 shadow-2xl animate-fade-in-up border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Añadir Nuevo Recurso</h3>
                  <form onSubmit={handleAddResource} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
                          <input 
                            type="text" 
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                            value={newResourceTitle}
                            onChange={e => setNewResourceTitle(e.target.value)}
                            required
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo</label>
                          <select 
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                            value={newResourceType}
                            onChange={(e) => setNewResourceType(e.target.value as Resource['type'])}
                          >
                              <option value="assignment">Tarea</option>
                              <option value="pdf">Documento PDF</option>
                              <option value="video">Video</option>
                              <option value="quiz">Examen/Quiz</option>
                              <option value="link">Enlace Externo</option>
                              <option value="text">Texto/Nota</option>
                          </select>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                          <button type="button" onClick={() => setShowAddResourceModal(false)} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Cancelar</button>
                          <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">Añadir</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* Header Image */}
      <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden shadow-md group">
        <img src={course.image} alt={course.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white w-full">
          <button onClick={onBack} className="mb-4 flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors bg-black/20 hover:bg-black/40 px-3 py-1 rounded-full w-fit backdrop-blur-sm">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Volver
          </button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block shadow-sm">{course.code}</span>
              <h1 className="text-3xl md:text-4xl font-bold">{course.name}</h1>
              {!isProfessor && (
                  <p className="text-white/80 mt-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">person</span> {course.professor}
                  </p>
              )}
            </div>
            {!isProfessor && (
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 min-w-[150px] border border-white/10">
                <p className="text-xs text-white/70 mb-1">Créditos: {course.credits}</p>
                <div className="flex items-center gap-2">
                    <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]" style={{ width: `${course.progress}%` }}></div>
                    </div>
                    <span className="font-bold text-sm">{course.progress}%</span>
                </div>
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Render View Based on Role */}
      {isProfessor ? renderProfessorView() : renderStudentView()}

    </div>
  );
};

export default CourseDetail;
