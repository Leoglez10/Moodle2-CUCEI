
export enum CourseStatus {
  IN_PROGRESS = 'En progreso',
  FUTURE = 'Futuros',
  PAST = 'Pasados'
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // index
}

export interface CourseModule {
  id: string;
  title: string;
  resources: Resource[];
}

export interface Resource {
  id: string; 
  type: 'pdf' | 'video' | 'assignment' | 'quiz' | 'forum' | 'link' | 'text';
  title: string;
  url?: string;
  description?: string;
  dueDate?: string;
  questions?: QuizQuestion[];
  score?: number;
  maxScore?: number;
  attempts?: number;
  submitted?: boolean;
  // Professor fields
  submissionsCount?: number;
  gradedCount?: number;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  professor: string;
  progress: number;
  credits: number;
  image: string;
  status: CourseStatus;
  archived?: boolean;
  nextTask?: string;
  nextTaskDate?: string;
  color: string;
  description?: string;
  modules: CourseModule[];
}

export interface TimelineEvent {
  id: string;
  title: string;
  course: string;
  courseId: string; 
  resourceId?: string; 
  date: string;
  type: 'assignment' | 'exam' | 'forum' | 'personal';
  urgent: boolean;
  description?: string;
}

export type UserRole = 'student' | 'professor';

export interface User {
  name: string;
  role: string; // Display text like "Estudiante" or "Profesor Titular"
  userRole: UserRole; // Logic identifier
  avatar: string;
  code: string;
  career: string;
  semester: string;
  email: string;
  status: 'Activo' | 'Inactivo';
}

export interface StudentSubmission {
    studentName: string;
    studentAvatar: string;
    date: string;
    status: 'Enviado' | 'Calificado' | 'Sin entrega';
    grade?: number;
    file?: string;
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  email: string;
  code: string;
}

export interface Submission {
  id: string;
  studentId: string;
  resourceId: string;
  file?: string;
  status: 'submitted' | 'graded' | 'late' | 'missing';
  grade?: number;
  feedback?: string;
  date: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  courseName: string;
  date: string;
  author: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success';
  targetView?: ViewName;
  targetId?: string; 
  courseId?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
}

export interface Message {
  id: string;
  sender: string;
  avatar: string;
  preview: string;
  time: string;
  unread: boolean;
  history: ChatMessage[];
}

export type ViewName = 'login' | 'dashboard' | 'courses' | 'course-detail' | 'task-detail' | 'calendar' | 'grades' | 'grading-view' | 'files' | 'profile' | 'messages' | 'notifications' | 'settings' | 'glossary';

export interface NavigationState {
  view: ViewName;
  params?: any;
  breadcrumbLabel?: string;
}

export interface CalendarViewProps {
  initialDate?: string;
}

export interface AccessibilitySettings {
  // 1. Texto
  fontSize: number;
  dyslexiaFont: boolean;
  lineSpacing: 'normal' | 'wide' | 'widest';
  letterSpacing: boolean;
  paragraphSpacing: boolean;
  textAlign: 'left' | 'justify' | 'center';
  highlightTitles: boolean;
  highlightLinks: boolean;
  underlineLinks: boolean;

  // 2. Color y Contraste
  darkMode: boolean;
  highContrast: boolean; // Yellow/Black
  invertColors: boolean;
  sepiaMode: boolean;
  lowSaturation: boolean; // Colores suaves
  grayscale: boolean;
  colorBlindness: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  reduceBrightness: boolean;

  // 3. Interacción
  keyboardNav: boolean; // Foco visible
  largeButtons: boolean;
  largeClickArea: boolean;
  safeClick: boolean; // Clic sostenido (simulado)
  stopAnimations: boolean;
  hideImages: boolean;
  largeCursor: boolean;
  readingGuide: boolean;
  
  // 4. Lectura y Cognición
  textToSpeech: boolean;
  simplifiedText: boolean;
  immersiveReader: boolean; // Ocultar todo menos contenido
  focusMode: boolean; // Oscurecer resto
  blockReading: boolean;
  glossaryEnabled: boolean;
  iconography: boolean; // Iconos junto a textos

  // 5. Multimedia
  autoSubtitles: boolean;
  transcripts: boolean;
  signLanguage: boolean;
  noAutoplay: boolean;
  accessibleControls: boolean;
  
  // 6. Navegación
  breadcrumbs: boolean;
  skipToContent: boolean;
  shortcutsEnabled: boolean;
  disableZoom: boolean;
}

export interface DashboardProps {
  user: User;
  onCourseSelect: (course: Course) => void;
  onEventSelect: (event: TimelineEvent) => void;
  onDateSelect: (date: string) => void;
  onNavigateToGrading?: () => void;
  announcements?: Announcement[];
  notifications?: Notification[]; // For prof dashboard
}

export interface GradingViewProps {
  globalGrades: Record<string, Record<string, string>>;
  onUpdateGrade: (studentId: string, assignmentId: string, value: string) => void;
}
