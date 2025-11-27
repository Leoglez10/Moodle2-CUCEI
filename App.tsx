
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AccessibilityPanel from './components/AccessibilityPanel';
import Dashboard from './views/Dashboard';
import Courses from './views/Courses';
import CourseDetail from './views/CourseDetail';
import TaskDetail from './views/TaskDetail';
import CalendarView from './views/CalendarView';
import Grades from './views/Grades';
import Profile from './views/Profile';
import Messages from './views/Messages';
import NotificationsView from './views/NotificationsView';
import Settings from './views/Settings';
import FilesView from './views/FilesView';
import LoginView from './views/LoginView';
import GradingView from './views/GradingView';
import { initialNotifications, messages as initialMessages, courses as initialCourses, initialAnnouncements, professorNotifications } from './data';
import { ViewName, Course, Resource, Notification, NavigationState, Message, AccessibilitySettings, User, Announcement } from './types';

const App: React.FC = () => {
  // User Authentication State
  const [user, setUser] = useState<User | null>(null);

  // Navigation
  const [history, setHistory] = useState<NavigationState[]>([{ view: 'dashboard', breadcrumbLabel: 'Inicio' }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const currentNavState = history[historyIndex];

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  
  // Data - Global State for Synchronization
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [profNotifications, setProfNotifications] = useState<Notification[]>(professorNotifications);
  const [appCourses, setAppCourses] = useState<Course[]>(initialCourses); 
  const [appMessages, setAppMessages] = useState<Message[]>(initialMessages);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  
  // Global Grades State (Student ID -> Assignment ID -> Grade)
  const [globalGrades, setGlobalGrades] = useState<Record<string, Record<string, string>>>({
    's1': { 't1': '95', 't2': '80', 'e1': '90' }, // Alejandro (Current User)
    's2': { 't1': '100', 't2': '85', 'e1': '92' },
    's3': { 't1': '0', 't2': '70', 'e1': '60' },
    's4': { 't1': '88', 't2': '90', 'e1': '85' },
    's5': { 't1': '75', 't2': '0', 'e1': '70' },
  });

  // Accessibility State - Massive Init
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 1,
    dyslexiaFont: false,
    lineSpacing: 'normal',
    letterSpacing: false,
    paragraphSpacing: false,
    textAlign: 'left',
    highlightTitles: false,
    highlightLinks: false,
    underlineLinks: false,
    
    darkMode: false,
    highContrast: false,
    invertColors: false,
    sepiaMode: false,
    lowSaturation: false,
    grayscale: false,
    colorBlindness: 'none',
    reduceBrightness: false,

    keyboardNav: false,
    largeButtons: false,
    largeClickArea: false,
    safeClick: false,
    stopAnimations: false,
    hideImages: false,
    largeCursor: false,
    readingGuide: false,

    textToSpeech: false,
    simplifiedText: false,
    immersiveReader: false,
    focusMode: false,
    blockReading: false,
    glossaryEnabled: false,
    iconography: false,

    autoSubtitles: false,
    transcripts: false,
    signLanguage: false,
    noAutoplay: false,
    accessibleControls: false,

    breadcrumbs: true,
    skipToContent: true,
    shortcutsEnabled: false,
    disableZoom: false
  });

  // --- Effect: Apply Accessibility Settings to DOM ---
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // 1. Visual Classes
    const toggleClass = (condition: boolean, className: string) => {
      if (condition) body.classList.add(className); else body.classList.remove(className);
    };

    toggleClass(settings.darkMode, 'dark');
    toggleClass(settings.highContrast, 'high-contrast');
    toggleClass(settings.invertColors, 'invert-mode');
    toggleClass(settings.sepiaMode, 'sepia-mode');
    toggleClass(settings.grayscale, 'grayscale-mode');
    toggleClass(settings.lowSaturation, 'low-saturation');
    toggleClass(settings.reduceBrightness, 'low-brightness');
    
    // Color Blindness
    body.classList.remove('protanopia', 'deuteranopia', 'tritanopia');
    if (settings.colorBlindness !== 'none') body.classList.add(settings.colorBlindness);

    // Text
    html.style.fontSize = `${16 * settings.fontSize}px`;
    toggleClass(settings.dyslexiaFont, 'font-dyslexic');
    body.classList.remove('line-spacing-wide', 'line-spacing-widest');
    if (settings.lineSpacing === 'wide') body.classList.add('line-spacing-wide');
    if (settings.lineSpacing === 'widest') body.classList.add('line-spacing-widest');
    toggleClass(settings.letterSpacing, 'letter-spacing-wide');
    toggleClass(settings.paragraphSpacing, 'paragraph-spacing-wide');
    
    body.classList.remove('text-align-justify', 'text-align-center');
    if (settings.textAlign === 'justify') body.classList.add('text-align-justify');
    if (settings.textAlign === 'center') body.classList.add('text-align-center');

    toggleClass(settings.highlightTitles, 'highlight-titles');
    toggleClass(settings.highlightLinks, 'highlight-links');
    toggleClass(settings.underlineLinks, 'underline-links');

    // Interaction
    toggleClass(settings.keyboardNav, 'keyboard-nav');
    toggleClass(settings.largeButtons, 'large-buttons');
    toggleClass(settings.largeClickArea, 'large-click-area');
    toggleClass(settings.safeClick, 'safe-click');
    toggleClass(settings.stopAnimations, 'stop-animations');
    toggleClass(settings.hideImages, 'hide-images');
    toggleClass(settings.largeCursor, 'cursor-large');
    toggleClass(settings.immersiveReader, 'immersive-reader');

    // Cognitive
    toggleClass(settings.focusMode, 'focus-mode');
    toggleClass(settings.simplifiedText, 'simplified-text');
    toggleClass(settings.blockReading, 'block-reading');
    toggleClass(settings.glossaryEnabled, 'glossary-enabled');
    toggleClass(settings.iconography, 'iconography');

    // Tools
    const guide = document.getElementById('reading-guide-bar');
    if(guide) guide.style.display = settings.readingGuide ? 'block' : 'none';

    // Shortcuts Listener
    const handleKeydown = (e: KeyboardEvent) => {
      if (!settings.shortcutsEnabled) return;
      if (e.altKey && e.key === '1') navigateTo('dashboard', undefined, 'Inicio', true);
      if (e.altKey && e.key === '2') navigateTo('courses', undefined, 'Mis Cursos', true);
      if (e.altKey && e.key === 'c') setIsAccessibilityOpen(prev => !prev);
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);

  }, [settings]);

  // --- Navigation Logic ---
  const navigateTo = (view: ViewName, params?: any, label?: string, reset: boolean = false) => {
    let breadcrumbLabel = label;
    if (!breadcrumbLabel) {
        switch(view) {
            case 'dashboard': breadcrumbLabel = 'Inicio'; break;
            case 'courses': breadcrumbLabel = 'Mis Cursos'; break;
            case 'calendar': breadcrumbLabel = 'Calendario'; break;
            case 'grades': breadcrumbLabel = 'Calificaciones'; break;
            case 'files': breadcrumbLabel = 'Archivos'; break;
            case 'profile': breadcrumbLabel = 'Perfil'; break;
            case 'messages': breadcrumbLabel = 'Mensajes'; break;
            case 'settings': breadcrumbLabel = 'Configuración'; break;
            case 'notifications': breadcrumbLabel = 'Notificaciones'; break;
            case 'grading-view': breadcrumbLabel = 'Libro de Calificaciones'; break;
            default: breadcrumbLabel = view.charAt(0).toUpperCase() + view.slice(1);
        }
    }

    const newState: NavigationState = { 
      view, 
      params,
      breadcrumbLabel
    };
    
    if (reset) {
        setHistory([newState]);
        setHistoryIndex(0);
    } else {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newState);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }
  };

  const goBack = () => {
    if (historyIndex > 0) setHistoryIndex(historyIndex - 1);
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) setHistoryIndex(historyIndex + 1);
  };

  // --- SYNC LOGIC: Professor Actions -> Student State ---

  const handleCreateAnnouncement = (title: string, content: string) => {
      // 1. Add to announcements list
      const newAnn: Announcement = {
          id: Date.now().toString(),
          title,
          content,
          courseName: 'Cálculo Diferencial', // Hardcoded for this professor
          date: 'Ahora',
          author: 'Dr. Juan Pérez'
      };
      setAnnouncements([newAnn, ...announcements]);

      // 2. Notify Student
      const newNotif: Notification = {
          id: Date.now().toString(),
          title: 'Nuevo Anuncio',
          message: `Dr. Juan Pérez publicó: "${title}"`,
          time: 'Ahora',
          read: false,
          type: 'info',
          targetView: 'dashboard' // Usually announcements appear on dashboard
      };
      setNotifications([newNotif, ...notifications]);
  };

  const handleGlobalGradeUpdate = (studentId: string, assignmentId: string, value: string) => {
      // 1. Update Gradebook
      setGlobalGrades(prev => ({
          ...prev,
          [studentId]: {
              ...prev[studentId],
              [assignmentId]: value
          }
      }));

      // 2. If updating current student (s1), notify them
      if (studentId === 's1') {
          const newNotif: Notification = {
              id: Date.now().toString(),
              title: 'Calificación Actualizada',
              message: `Tu calificación para la tarea ha sido actualizada a ${value}`,
              time: 'Ahora',
              read: false,
              type: 'success',
              targetView: 'grades'
          };
          setNotifications([newNotif, ...notifications]);
      }
  };

  // --- Handlers ---
  const handleCourseSelect = (course: Course) => {
    navigateTo('course-detail', { courseId: course.id }, course.name);
  };

  const handleResourceSelect = (resource: Resource, courseId: string) => {
    navigateTo('task-detail', { resourceId: resource.id, courseId }, resource.title);
  };

  const handleDateSelect = (date: string) => {
    navigateTo('calendar', { initialDate: date }, 'Calendario');
  };

  const handleArchiveCourse = (courseId: string) => {
    const updatedCourses = appCourses.map(c => c.id === courseId ? { ...c, archived: true } : c);
    setAppCourses(updatedCourses);
  };

  const handleContactInstructor = (professorName: string) => {
    const existingChat = appMessages.find(m => m.sender === professorName);
    
    if (existingChat) {
      setActiveChatId(existingChat.id);
    } else {
      const newChat: Message = {
        id: Date.now().toString(),
        sender: professorName,
        avatar: `https://ui-avatars.com/api/?name=${professorName}&background=random`,
        preview: 'Nuevo chat iniciado',
        time: 'Ahora',
        unread: false,
        history: []
      };
      setAppMessages([newChat, ...appMessages]);
      setActiveChatId(newChat.id);
    }
    
    navigateTo('messages', undefined, 'Mensajes'); 
  };

  const handleNotificationClick = (notif: Notification) => {
    // Update local notifications or prof notifications depending on user
    if (user?.userRole === 'student') {
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    } else {
        setProfNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    }

    if (notif.targetView) {
      if (notif.targetView === 'course-detail' && notif.targetId) {
        navigateTo('course-detail', { courseId: notif.targetId }, 'Curso');
      } else if (notif.targetView === 'task-detail' && notif.targetId) {
         const course = appCourses.find(c => c.modules.some(m => m.resources.some(r => r.id === notif.targetId)));
         if(course) navigateTo('task-detail', { resourceId: notif.targetId, courseId: course.id }, 'Tarea');
      } else if (notif.targetView === 'messages') {
         if (notif.targetId) setActiveChatId(notif.targetId);
         navigateTo('messages', undefined, 'Mensajes');
      } else {
        navigateTo(notif.targetView, undefined, undefined); 
      }
    }
  };

  // --- Auth Render Guard ---
  if (!user) {
    return <LoginView onLogin={(loggedInUser) => setUser(loggedInUser)} />;
  }

  // View Rendering
  const renderView = () => {
    const { view, params } = currentNavState;

    switch (view) {
      case 'dashboard': 
        return <Dashboard 
            user={user} 
            onCourseSelect={handleCourseSelect} 
            onEventSelect={(e) => handleCourseSelect(appCourses.find(c => c.id === e.courseId)!)} 
            onDateSelect={handleDateSelect}
            onNavigateToGrading={() => navigateTo('grading-view')}
            onNavigateToCourseDetail={() => handleCourseSelect(appCourses[0])} // Just picking first for demo
            onCreateAnnouncement={handleCreateAnnouncement}
            announcements={announcements}
            notifications={profNotifications}
        />;
      case 'courses': 
        return <Courses onCourseSelect={handleCourseSelect} coursesList={appCourses} onArchiveCourse={handleArchiveCourse} user={user} onNavigateToGrading={() => navigateTo('grading-view')} />;
      case 'course-detail':
        const course = appCourses.find(c => c.id === params?.courseId);
        return course ? <CourseDetail course={course} onBack={goBack} onResourceSelect={(r) => handleResourceSelect(r, course.id)} onContact={handleContactInstructor} user={user} /> : <div>Curso no encontrado</div>;
      case 'task-detail':
        const courseT = appCourses.find(c => c.id === params?.courseId);
        const resource = courseT?.modules.flatMap(m => m.resources).find(r => r.id === params?.resourceId);
        return (courseT && resource) ? <TaskDetail course={courseT} resource={resource} onBack={goBack} onUpdateGrade={() => {}} accessibility={settings} user={user} /> : <div>Recurso no encontrado</div>;
      case 'calendar': return <CalendarView initialDate={params?.initialDate} />;
      case 'grades': return <Grades user={user} onNavigateToGrading={() => navigateTo('grading-view')} />;
      case 'files': return <FilesView />;
      case 'profile': return <Profile user={user} />;
      case 'messages': return <Messages messages={appMessages} setMessages={setAppMessages} activeChatId={activeChatId} setActiveChatId={setActiveChatId} />; 
      case 'settings': return <Settings />;
      case 'grading-view': return <GradingView globalGrades={globalGrades} onUpdateGrade={handleGlobalGradeUpdate} />;
      case 'notifications': 
        return <NotificationsView 
          notifications={user.userRole === 'student' ? notifications : profNotifications} 
          onMarkAllRead={() => setNotifications(n => n.map(x => ({...x, read: true})))}
          onMarkRead={(id) => setNotifications(n => n.map(x => x.id === id ? {...x, read: true} : x))}
          onMarkUnread={(id) => setNotifications(n => n.map(x => x.id === id ? {...x, read: false} : x))}
          onDelete={(id) => setNotifications(n => n.filter(x => x.id !== id))}
          onNavigate={handleNotificationClick}
        />;
      default: return <Dashboard user={user} onCourseSelect={handleCourseSelect} onEventSelect={()=>{}} onDateSelect={()=>{}}/>;
    }
  };

  // Breadcrumbs Builder
  const breadcrumbs = history.slice(0, historyIndex + 1).map((state, idx) => ({
    label: state.breadcrumbLabel || state.view,
    isActive: idx === historyIndex,
    onClick: () => setHistoryIndex(idx)
  }));

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 transition-colors duration-200 overflow-hidden relative">
      {settings.skipToContent && <a href="#main-content" className="skip-link">Saltar al contenido principal</a>}
      
      <Sidebar 
        currentView={currentNavState.view} 
        setView={(v) => navigateTo(v, undefined, undefined, true)} 
        isMobileOpen={isMobileNavOpen} 
        closeMobile={() => setIsMobileNavOpen(false)}
        onLogout={() => { setUser(null); setHistory([{ view: 'dashboard' }]); }}
      />
      
      <button onClick={() => setIsAccessibilityOpen(true)} className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-primary hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300" aria-label="Opciones de Accesibilidad">
        <span className="material-symbols-outlined text-4xl">accessibility_new</span>
      </button>

      <AccessibilityPanel 
        isOpen={isAccessibilityOpen} 
        onClose={() => setIsAccessibilityOpen(false)} 
        settings={settings} 
        toggleSetting={(k) => setSettings(p => ({ ...p, [k]: !p[k as keyof AccessibilitySettings] }))} 
        setSetting={(k, v) => setSettings(p => ({ ...p, [k]: v }))}
        setFontSize={(s) => setSettings(p => ({ ...p, fontSize: s }))} 
        resetSettings={() => setSettings({ ...settings, fontSize: 1, darkMode: false, highContrast: false, grayscale: false, invertColors: false, dyslexiaFont: false })} 
      />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header 
          user={user} 
          notifications={user.userRole === 'student' ? notifications : profNotifications} 
          onMenuClick={() => setIsMobileNavOpen(true)} 
          onAccessibilityClick={() => setIsAccessibilityOpen(true)} 
          onNavigateToProfile={() => navigateTo('profile', undefined, 'Perfil')}
          onNavigateToMessages={() => navigateTo('messages', undefined, 'Mensajes')}
          onNavigateToSettings={() => navigateTo('settings', undefined, 'Configuración')}
          onNavigateToNotifications={() => navigateTo('notifications', undefined, 'Notificaciones')}
          onNotificationClick={handleNotificationClick}
          onDeleteNotification={(id) => setNotifications(n => n.filter(x => x.id !== id))}
          onMarkAllRead={() => setNotifications(n => n.map(x => ({...x, read: true})))}
          onMarkUnread={(id) => setNotifications(n => n.map(x => x.id === id ? {...x, read: false} : x))}
          canGoBack={historyIndex > 0} 
          canGoForward={historyIndex < history.length - 1} 
          onGoBack={goBack} 
          onGoForward={goForward}
          breadcrumbs={settings.breadcrumbs ? breadcrumbs : []}
        />
        <main id="main-content" className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 dark:bg-[#0f172a] p-4 md:p-8 relative scroll-smooth" tabIndex={-1}>
           {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
