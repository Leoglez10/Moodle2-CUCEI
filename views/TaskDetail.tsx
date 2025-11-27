
import React, { useState } from 'react';
import { Resource, Course, AccessibilitySettings, User, Submission } from '../types';
import { professorSubmissions } from '../data';

interface TaskDetailProps {
  course: Course;
  resource: Resource;
  onBack: () => void;
  onUpdateGrade?: (courseId: string, resourceId: string, grade: number) => void;
  accessibility: AccessibilitySettings;
  user: User;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ course, resource, onBack, onUpdateGrade, accessibility, user }) => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(resource.score || 0);
  const [textSubmission, setTextSubmission] = useState('');
  const [textSubmitted, setTextSubmitted] = useState(false);

  // Professor Grading States
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');

  // Media Accessibility States
  const [showTranscript, setShowTranscript] = useState(false);
  const [showSignLanguage, setShowSignLanguage] = useState(false);

  const isProfessor = user.userRole === 'professor';

  const handleQuizSubmit = () => {
    let correctCount = 0;
    resource.questions?.forEach((q, i) => {
        if (answers[i] === q.correctAnswer) correctCount++;
    });
    const finalScore = (correctCount / (resource.questions?.length || 1)) * (resource.maxScore || 100);
    setScore(finalScore);
    setQuizFinished(true);
    if (onUpdateGrade) onUpdateGrade(course.id, resource.id, finalScore);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setTextSubmitted(true);
      if (onUpdateGrade && resource.maxScore) onUpdateGrade(course.id, resource.id, resource.maxScore);
  }

  const handleGradeSubmission = (e: React.FormEvent) => {
      e.preventDefault();
      alert(`Calificación guardada: ${gradeInput}`);
      setGradingSubmission(null);
      setGradeInput('');
      setFeedbackInput('');
  }

  const renderContent = () => {
    // PROFESSOR VIEW
    if (isProfessor && (resource.type === 'assignment' || resource.type === 'text')) {
        return (
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-center border border-blue-100 dark:border-blue-800">
                        <span className="text-3xl font-bold text-blue-700 dark:text-blue-300 block">{resource.submissionsCount || 0}</span>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Entregas</span>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl text-center border border-green-100 dark:border-green-800">
                        <span className="text-3xl font-bold text-green-700 dark:text-green-300 block">{resource.gradedCount || 0}</span>
                        <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase">Calificadas</span>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl text-center border border-orange-100 dark:border-orange-800">
                        <span className="text-3xl font-bold text-orange-700 dark:text-orange-300 block">{(resource.submissionsCount || 0) - (resource.gradedCount || 0)}</span>
                        <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase">Pendientes</span>
                    </div>
                </div>

                {/* Grading Queue Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                        <h3 className="font-bold text-gray-800 dark:text-white">Cola de Calificación</h3>
                        <div className="flex gap-2 text-sm">
                            <button className="text-gray-500 hover:text-gray-800 dark:hover:text-white">Todos</button>
                            <button className="text-primary font-bold">Pendientes</button>
                        </div>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Estudiante</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Estado</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Fecha Entrega</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {professorSubmissions.map((sub, idx) => (
                                <tr key={sub.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 ${sub.status === 'missing' ? 'opacity-50' : ''}`}>
                                    <td className="p-4 font-medium flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">S{idx+1}</div>
                                        Estudiante {idx + 1}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            sub.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                                            sub.status === 'graded' ? 'bg-green-100 text-green-700' :
                                            sub.status === 'late' ? 'bg-orange-100 text-orange-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {sub.status === 'submitted' ? 'Por Calificar' : sub.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">{sub.date}</td>
                                    <td className="p-4 text-right">
                                        {sub.status !== 'missing' && (
                                            <button 
                                                onClick={() => setGradingSubmission(sub)}
                                                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-blue-700 shadow-sm"
                                            >
                                                {sub.status === 'graded' ? 'Editar Nota' : 'Calificar'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // STUDENT VIEW CODE REMAINS THE SAME ...
    // (Collapsed for brevity, assuming existing code is preserved below this block in final file)
    
    if (resource.type === 'pdf') {
      return (
          <div className="flex flex-col gap-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-xl text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <span className="material-symbols-outlined text-6xl text-red-500 mb-4">picture_as_pdf</span>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{resource.title}</h3>
                  <p className="text-gray-500 mb-6">Este es un recurso de lectura. No requiere entrega.</p>
                  <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                      <span className="material-symbols-outlined">open_in_new</span>
                      Abrir PDF en pestaña nueva
                  </a>
              </div>
              {!accessibility.hideImages && (
                <div className="h-[600px] w-full bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden shadow-inner">
                    <iframe src={resource.url} className="w-full h-full" title="PDF Viewer"></iframe>
                </div>
              )}
          </div>
      );
    }

    if (resource.type === 'link') {
        return (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-xl border border-blue-200 dark:border-blue-800 text-center">
                <span className="material-symbols-outlined text-6xl text-blue-500 mb-4">link</span>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Recurso Externo</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{resource.description}</p>
                <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <span className="material-symbols-outlined">public</span>
                    Visitar Enlace
                </a>
            </div>
        );
    }

    if (resource.type === 'text') {
        if (textSubmitted) {
            return (
                <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 text-center">
                    <span className="material-symbols-outlined text-4xl text-green-600 mb-2">check_circle</span>
                    <p className="text-green-800 dark:text-green-200 font-bold">Respuesta enviada correctamente.</p>
                    <button onClick={onBack} className="mt-4 text-sm text-green-700 underline">Volver al curso</button>
                </div>
            );
        }
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <form onSubmit={handleTextSubmit}>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Tu Respuesta</label>
                    <textarea 
                        className="w-full h-40 p-4 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary"
                        placeholder="Escribe tu respuesta aquí..."
                        value={textSubmission}
                        onChange={(e) => setTextSubmission(e.target.value)}
                        required
                    ></textarea>
                    <div className="flex justify-end mt-4">
                        <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium">
                            Enviar Respuesta
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    // Video with Accessibility Features
    if (resource.type === 'video') {
        return (
            <div className="flex flex-col gap-4">
                <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden shadow-lg group">
                    {!accessibility.hideImages && (
                        <iframe 
                            width="100%" 
                            height="100%" 
                            src={resource.url || "https://www.youtube.com/embed/dQw4w9WgXcQ"} 
                            title="Video Player" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                    )}
                    
                    {(accessibility.signLanguage || showSignLanguage) && (
                        <div className="absolute bottom-4 right-4 w-32 h-48 bg-black/80 border-2 border-white rounded-lg overflow-hidden shadow-xl z-20 flex items-center justify-center">
                            <span className="text-white text-xs text-center p-2">Intérprete de Señas (Simulado)</span>
                        </div>
                    )}

                    {accessibility.accessibleControls && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-8 pointer-events-none">
                             <button className="pointer-events-auto p-4 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-md">
                                <span className="material-symbols-outlined text-white text-4xl">replay_10</span>
                             </button>
                             <button className="pointer-events-auto p-6 bg-primary hover:bg-blue-600 rounded-full shadow-xl transform hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-white text-5xl">play_arrow</span>
                             </button>
                             <button className="pointer-events-auto p-4 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-md">
                                <span className="material-symbols-outlined text-white text-4xl">forward_10</span>
                             </button>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap gap-3">
                    <button 
                        onClick={() => setShowTranscript(!showTranscript)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium ${showTranscript || accessibility.transcripts ? 'bg-blue-50 border-primary text-primary' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}
                    >
                        <span className="material-symbols-outlined">description</span> Transcripción
                    </button>
                    <button 
                        onClick={() => setShowSignLanguage(!showSignLanguage)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium ${showSignLanguage || accessibility.signLanguage ? 'bg-blue-50 border-primary text-primary' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}
                    >
                        <span className="material-symbols-outlined">sign_language</span> Lengua de Señas
                    </button>
                </div>

                {(showTranscript || accessibility.transcripts) && (
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 animate-fade-in-up">
                        <h4 className="font-bold mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined">subtitles</span> Transcripción del Video
                        </h4>
                        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                            [00:00] Bienvenidos a la clase de hoy...
                        </p>
                    </div>
                )}
            </div>
        );
    }

    if (resource.type === 'quiz') {
        if (quizFinished) {
            return (
                <div className="text-center p-8 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">¡Cuestionario Finalizado!</h3>
                    <p className="text-lg text-gray-700 dark:text-gray-200">Calificación: <span className="font-bold">{score}/{resource.maxScore}</span></p>
                    <button onClick={onBack} className="mt-4 px-6 py-2 bg-primary text-white rounded-lg">Volver al curso</button>
                </div>
            );
        }

        if (!quizStarted) {
            return (
                <div className="text-center p-10 border border-gray-200 dark:border-gray-700 rounded-xl">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Examen Rápido</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Intentos permitidos: 2</p>
                    <button onClick={() => setQuizStarted(true)} className="px-6 py-3 bg-primary text-white rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-all">
                        Comenzar intento
                    </button>
                </div>
            );
        }

        const question = resource.questions?.[currentQuestion];
        return (
            <div className="max-w-2xl mx-auto">
                <div className="mb-4 flex justify-between text-sm text-gray-500">
                    <span>Pregunta {currentQuestion + 1} de {resource.questions?.length}</span>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-medium mb-6 text-gray-900 dark:text-white">{question?.question}</h4>
                    <div className="space-y-3">
                        {question?.options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    const newAnswers = [...answers];
                                    newAnswers[currentQuestion] = idx;
                                    setAnswers(newAnswers);
                                }}
                                className={`w-full text-left p-4 rounded-lg border transition-all text-gray-700 dark:text-gray-200 ${
                                    answers[currentQuestion] === idx 
                                    ? 'border-primary bg-blue-50 dark:bg-blue-900/20 text-primary dark:text-primary' 
                                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                    <div className="mt-8 flex justify-end">
                        {currentQuestion < (resource.questions?.length || 0) - 1 ? (
                            <button 
                                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                                className="px-6 py-2 bg-gray-800 text-white rounded-lg"
                            >
                                Siguiente
                            </button>
                        ) : (
                            <button 
                                onClick={handleQuizSubmit}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold"
                            >
                                Terminar y Enviar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Default: Assignment Upload
    return (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-10 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group">
            <span className="material-symbols-outlined text-5xl text-gray-400 group-hover:text-primary mb-4 transition-colors">cloud_upload</span>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">Arrastra y suelta tu tarea aquí</p>
            <p className="text-sm text-gray-400 mt-1">o haz clic para seleccionar archivo (PDF, DOCX)</p>
            <button className="mt-6 px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
                Seleccionar archivo
            </button>
        </div>
    );
  };
  
  return (
    <div className="space-y-6 animate-fade-in pb-20 max-w-5xl mx-auto">
      
      {/* Grading Modal */}
      {gradingSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white dark:bg-gray-900 w-full max-w-5xl h-[80vh] rounded-xl shadow-2xl flex overflow-hidden">
                  {/* Left: Document Preview */}
                  <div className="w-2/3 bg-gray-200 dark:bg-gray-800 flex items-center justify-center p-8 border-r border-gray-200 dark:border-gray-700">
                      <div className="text-center">
                          <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">picture_as_pdf</span>
                          <p className="text-gray-600 dark:text-gray-300 font-medium">{gradingSubmission.file}</p>
                          <button className="mt-4 px-4 py-2 bg-white dark:bg-gray-700 rounded-lg text-sm shadow-sm">Abrir documento</button>
                      </div>
                  </div>
                  {/* Right: Grading Panel */}
                  <div className="w-1/3 p-6 flex flex-col">
                      <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Calificar Entrega</h3>
                      <form onSubmit={handleGradeSubmission} className="flex-1 flex flex-col">
                          <div className="mb-4">
                              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Calificación (0-100)</label>
                              <input 
                                type="number" 
                                className="w-full border rounded-lg p-2 text-2xl font-bold text-center dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
                                value={gradeInput}
                                onChange={e => setGradeInput(e.target.value)}
                                autoFocus
                              />
                          </div>
                          <div className="mb-6 flex-1">
                              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Retroalimentación</label>
                              <textarea 
                                className="w-full h-full border rounded-lg p-2 resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                value={feedbackInput}
                                onChange={e => setFeedbackInput(e.target.value)}
                                placeholder="Escribe tus comentarios aquí..."
                              ></textarea>
                          </div>
                          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                              <button type="button" onClick={() => setGradingSubmission(null)} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">Cancelar</button>
                              <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">Guardar Calificación</button>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      )}

      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
        <button onClick={onBack} className="hover:text-primary hover:underline">{course.name}</button>
        <span>/</span>
        <span className="font-medium text-gray-800 dark:text-gray-200 truncate">{resource.title}</span>
      </div>

      <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden ${accessibility.immersiveReader ? 'immersive-hide' : ''}`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl text-white ${
                resource.type === 'quiz' ? 'bg-purple-500' : 
                resource.type === 'video' ? 'bg-red-500' : 
                resource.type === 'pdf' ? 'bg-orange-500' :
                resource.type === 'link' ? 'bg-sky-500' :
                resource.type === 'text' ? 'bg-emerald-500' :
                'bg-blue-500'
            }`}>
              <span className="material-symbols-outlined text-3xl">
                {resource.type === 'quiz' ? 'quiz' : 
                 resource.type === 'video' ? 'play_circle' : 
                 resource.type === 'pdf' ? 'picture_as_pdf' :
                 resource.type === 'link' ? 'link' :
                 resource.type === 'text' ? 'edit_note' :
                 'assignment'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{resource.title}</h1>
              {resource.dueDate && (
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">event</span>
                    Vence: {resource.dueDate}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <div className="prose dark:prose-invert max-w-none">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Instrucciones</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {resource.description || "Revisa el material cuidadosamente y completa la actividad."}
            </p>
          </div>
          
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
