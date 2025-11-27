
import { Course, CourseStatus, TimelineEvent, User, Notification, Message, StudentSubmission, Student, Submission, Announcement } from './types';

export const currentUser: User = {
  name: "Alejandro",
  role: "Estudiante",
  userRole: 'student',
  avatar: "https://i.pravatar.cc/150?img=11",
  code: "2256598",
  career: "ICOM (Ingeniería en Computación)",
  semester: "5º Semestre",
  email: "alejandro.student@alumnos.udg.mx",
  status: "Activo"
};

export const professorUser: User = {
  name: "Dr. Juan Pérez",
  role: "Profesor Titular",
  userRole: 'professor',
  avatar: "https://i.pravatar.cc/150?img=12",
  code: "9876543",
  career: "Departamento de Matemáticas",
  semester: "N/A",
  email: "juan.perez@academicos.udg.mx",
  status: "Activo"
};

// Helper to get dates relative to today
const getRelativeDate = (offsetDays: number) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split('T')[0]; 
};

export const mockSubmissions: StudentSubmission[] = [
    { studentName: 'Alejandro', studentAvatar: 'https://i.pravatar.cc/150?img=11', date: '20 Oct, 10:00 AM', status: 'Enviado', file: 'Tarea_Calculo.pdf' },
    { studentName: 'María López', studentAvatar: 'https://i.pravatar.cc/150?img=5', date: '20 Oct, 11:30 AM', status: 'Calificado', grade: 95 },
    { studentName: 'Carlos Ruiz', studentAvatar: 'https://i.pravatar.cc/150?img=3', date: '-', status: 'Sin entrega' },
];

export const mockStudents: Student[] = [
  { id: 's1', name: 'Alejandro', avatar: 'https://i.pravatar.cc/150?img=11', email: 'alejandro@alumnos.udg.mx', code: '2256598' },
  { id: 's2', name: 'María López', avatar: 'https://i.pravatar.cc/150?img=5', email: 'maria@alumnos.udg.mx', code: '2256599' },
  { id: 's3', name: 'Carlos Ruiz', avatar: 'https://i.pravatar.cc/150?img=3', email: 'carlos@alumnos.udg.mx', code: '2256600' },
  { id: 's4', name: 'Sofia Diaz', avatar: 'https://i.pravatar.cc/150?img=9', email: 'sofia@alumnos.udg.mx', code: '2256601' },
  { id: 's5', name: 'Javier Hernandez', avatar: 'https://i.pravatar.cc/150?img=13', email: 'javier@alumnos.udg.mx', code: '2256602' },
];

export const professorSubmissions: Submission[] = [
  { id: 'sub1', studentId: 's1', resourceId: 'r5', file: 'Tarea3_Alejandro.pdf', status: 'submitted', date: '20 Oct, 10:00 AM' },
  { id: 'sub2', studentId: 's2', resourceId: 'r5', file: 'Tarea3_Maria.pdf', status: 'graded', grade: 95, date: '20 Oct, 11:30 AM' },
  { id: 'sub3', studentId: 's3', resourceId: 'r5', status: 'missing', date: '-' },
  { id: 'sub4', studentId: 's4', resourceId: 'r5', file: 'Tarea3_Sofia.pdf', status: 'submitted', date: '21 Oct, 09:00 AM' },
  { id: 'sub5', studentId: 's5', resourceId: 'r5', file: 'Tarea3_Javier.pdf', status: 'late', date: '22 Oct, 08:00 AM' },
];

export const initialAnnouncements: Announcement[] = [
    {
        id: '1',
        title: 'Bienvenidos al curso',
        content: 'Les doy la bienvenida a este nuevo ciclo escolar. Revisen el programa.',
        courseName: 'Cálculo Diferencial',
        date: '20 Ago',
        author: 'Dr. Juan Pérez'
    }
];

export const courses: Course[] = [
  {
    id: '1',
    code: 'CD-101',
    name: 'Cálculo Diferencial',
    professor: 'Dr. Juan Pérez',
    progress: 75,
    credits: 8,
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2940&auto=format&fit=crop',
    status: CourseStatus.IN_PROGRESS,
    color: 'bg-orange-400',
    nextTask: 'Tarea: Derivadas',
    nextTaskDate: 'Hoy, 23:59',
    description: 'Estudio de los límites, la continuidad, la derivada y sus aplicaciones.',
    modules: [
      {
        id: 'm1',
        title: 'Unidad 1: Límites y Continuidad',
        resources: [
          { 
            id: 'r1', 
            type: 'video', 
            title: 'Video: Propiedades de los límites',
            url: 'https://www.youtube.com/embed/riWxJR27keM', 
            description: 'Revisa este material audiovisual antes de la clase.'
          },
          { 
            id: 'r3', 
            type: 'quiz', 
            title: 'Examen Rápido: Límites',
            maxScore: 10,
            attempts: 0,
            questions: [
                { id: 1, question: '¿Cuál es el límite de 1/x cuando x tiende a infinito?', options: ['Infinito', '0', '1', 'No existe'], correctAnswer: 1 },
                { id: 2, question: 'La derivada de una constante es:', options: ['1', 'x', '0', 'La misma constante'], correctAnswer: 2 },
                { id: 3, question: 'Si f(x) = x^2, entonces f\'(x) es:', options: ['x', '2x', 'x^2', '2'], correctAnswer: 1 }
            ]
          }
        ]
      },
      {
        id: 'm2',
        title: 'Unidad 2: La Derivada',
        resources: [
          { 
            id: 'r5',
            type: 'assignment', 
            title: 'Tarea 3: Regla de la Cadena',
            description: 'Resolver los ejercicios 1 al 20 de la página 45 del libro de texto. Sube tu archivo en PDF.',
            dueDate: 'Viernes, 25 de Octubre, 23:59',
            score: 95,
            maxScore: 100,
            submitted: true,
            submissionsCount: 35,
            gradedCount: 12
          },
          {
            id: 'r5-2',
            type: 'link',
            title: 'Recurso: Calculadora Gráfica',
            url: 'https://www.geogebra.org/calculator',
            description: 'Utiliza esta herramienta para visualizar las funciones.'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    code: 'POO-202',
    name: 'Programación Orientada a Objetos',
    professor: 'Dra. Ana Gómez',
    progress: 40,
    credits: 10,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2940&auto=format&fit=crop',
    status: CourseStatus.IN_PROGRESS,
    color: 'bg-blue-500',
    nextTask: 'Proyecto Final: Fase 1',
    nextTaskDate: 'Mañana, 12:00',
    modules: [
      {
        id: 'm1',
        title: 'Semana 1: Introducción',
        resources: [
          { id: 'r7', type: 'forum', title: 'Foro: Presentación' },
          { 
            id: 'r7-2', 
            type: 'text', 
            title: 'Reflexión: Paradigmas de Programación', 
            description: 'Escribe un breve párrafo sobre por qué es útil la POO.',
            maxScore: 5
          }
        ]
      },
      {
        id: 'm2',
        title: 'Semana 2: Clases y Objetos',
        resources: [
          { 
            id: 'r9',
            type: 'assignment', 
            title: 'Práctica 1: Mi primera clase',
            dueDate: 'Lunes, 28 de Octubre, 14:00'
          }
        ]
      }
    ]
  },
  {
    id: '3',
    code: 'FG-102',
    name: 'Física General',
    professor: 'Dr. Carlos Ruiz',
    progress: 90,
    credits: 8,
    image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=2874&auto=format&fit=crop',
    status: CourseStatus.IN_PROGRESS,
    color: 'bg-green-500',
    modules: [
      {
        id: 'm1',
        title: 'Cinemática',
        resources: [
          { 
            id: 'r10', 
            type: 'pdf', 
            title: 'Lectura: Movimiento Rectilíneo Uniforme', 
            url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 
            description: 'Lee el capítulo 3 del libro. Este es un recurso de lectura, no necesitas subir archivos.'
          },
          {
            id: 'r10-2',
            type: 'quiz',
            title: 'Quiz: Conceptos Básicos',
            maxScore: 10,
            questions: [
                { id: 1, question: 'La velocidad es una magnitud...', options: ['Escalar', 'Vectorial'], correctAnswer: 1 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '4',
    code: 'BD-301',
    name: 'Bases de Datos',
    professor: 'Mtra. Sofia Lopez',
    progress: 10,
    credits: 8,
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=2842&auto=format&fit=crop',
    status: CourseStatus.IN_PROGRESS,
    color: 'bg-purple-500',
    modules: [
        {
            id: 'm1',
            title: 'Modelado de Datos',
            resources: [
                { id: 'r12', type: 'assignment', title: 'Diseño de Schema', dueDate: getRelativeDate(7) }
            ]
        }
    ]
  },
  {
    id: '5',
    code: 'IA-405',
    name: 'Inteligencia Artificial',
    professor: 'Dr. Roberto Campos',
    progress: 5,
    credits: 12,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2832&auto=format&fit=crop',
    status: CourseStatus.IN_PROGRESS,
    color: 'bg-pink-500',
    modules: []
  },
  {
    id: '6',
    code: 'RC-201',
    name: 'Redes de Computadoras',
    professor: 'Ing. Marco Díaz',
    progress: 0,
    credits: 8,
    image: 'https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=2656&auto=format&fit=crop',
    status: CourseStatus.FUTURE,
    color: 'bg-indigo-500',
    modules: []
  },
  {
    id: '7',
    code: 'IT-101',
    name: 'Inglés Técnico',
    professor: 'Lic. Sarah Conner',
    progress: 100,
    credits: 6,
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2942&auto=format&fit=crop',
    status: CourseStatus.PAST,
    color: 'bg-teal-500',
    modules: [
        {
            id: 'm1',
            title: 'Final Project',
            resources: [
                { id: 'r99', type: 'assignment', title: 'Technical Report', score: 100, maxScore: 100, submitted: true }
            ]
        }
    ]
  }
];

export const timelineEvents: TimelineEvent[] = [
  {
    id: '1',
    title: 'Entrega: Práctica 3',
    course: 'Cálculo Diferencial',
    courseId: '1',
    resourceId: 'r5',
    date: getRelativeDate(0),
    type: 'assignment',
    urgent: true
  },
  {
    id: '2',
    title: 'Examen Parcial 1',
    course: 'Física General',
    courseId: '3',
    date: getRelativeDate(2),
    type: 'exam',
    urgent: false
  },
  {
    id: '3',
    title: 'Foro: Ética en la IA',
    course: 'Inteligencia Artificial',
    courseId: '5',
    date: getRelativeDate(3),
    type: 'forum',
    urgent: false
  },
  {
    id: '4',
    title: 'Proyecto Final: Fase 1',
    course: 'Programación Orientada a Objetos',
    courseId: '2',
    resourceId: 'r9',
    date: getRelativeDate(5),
    type: 'assignment',
    urgent: false
  },
  {
    id: '5',
    title: 'Diseño de Schema',
    course: 'Bases de Datos',
    courseId: '4',
    resourceId: 'r12',
    date: getRelativeDate(7),
    type: 'assignment',
    urgent: false
  }
];

export const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'Tarea Calificada',
    message: 'Tu tarea "Regla de la Cadena" ha sido calificada: 95/100',
    time: 'Hace 10 min',
    read: false,
    type: 'success',
    targetView: 'task-detail',
    targetId: 'r5',
    courseId: '1'
  },
  {
    id: '2',
    title: 'Recordatorio de Examen',
    message: 'Examen parcial de Física mañana a las 10:00 AM',
    time: 'Hace 2 horas',
    read: false,
    type: 'warning',
    targetView: 'course-detail',
    targetId: '3',
    courseId: '3'
  },
  {
    id: '3',
    title: 'Nuevo mensaje',
    message: 'Dra. Ana Gómez te ha enviado un mensaje.',
    time: 'Ayer',
    read: true,
    type: 'info',
    targetView: 'messages',
    targetId: '1' // Chat ID
  }
];

export const professorNotifications: Notification[] = [
    {
      id: 'p1',
      title: 'Nueva Entrega',
      message: 'Alejandro ha enviado la Tarea 3',
      time: 'Hace 5 min',
      read: false,
      type: 'info',
      targetView: 'task-detail',
      targetId: 'r5',
      courseId: '1'
    },
    {
      id: 'p2',
      title: 'Pregunta en Foro',
      message: 'Sofía ha publicado en el Foro de Dudas',
      time: 'Hace 1 hora',
      read: false,
      type: 'warning',
      targetView: 'course-detail',
      targetId: '1',
      courseId: '1'
    }
];

export const messages: Message[] = [
  {
    id: '1',
    sender: 'Dra. Ana Gómez',
    avatar: 'https://i.pravatar.cc/150?img=5',
    preview: 'Hola Carlos, revisé tu código y tengo algunas sugerencias...',
    time: '10:30 AM',
    unread: true,
    history: [
      { id: 'm1', text: 'Hola Dra. Gómez, tengo una duda con la herencia en Java.', sender: 'me', timestamp: '10:00 AM' },
      { id: 'm2', text: 'Hola Alejandro, claro, dime en qué puedo ayudarte.', sender: 'them', timestamp: '10:15 AM' },
      { id: 'm3', text: 'Hola Carlos, revisé tu código y tengo algunas sugerencias para mejorar la clase abstracta.', sender: 'them', timestamp: '10:30 AM' }
    ]
  },
  {
    id: '2',
    sender: 'Luis Torres',
    avatar: 'https://i.pravatar.cc/150?img=3',
    preview: '¿Vas a ir a la biblioteca hoy para estudiar?',
    time: 'Ayer',
    unread: false,
    history: [
      { id: 'm1', text: '¿Vas a ir a la biblioteca hoy para estudiar?', sender: 'them', timestamp: 'Ayer 4:00 PM' }
    ]
  },
  {
    id: '3',
    sender: 'Dr. Juan Pérez',
    avatar: 'https://i.pravatar.cc/150?img=12',
    preview: 'No olvides traer tu calculadora para el examen.',
    time: 'Lun',
    unread: false,
    history: [
        { id: 'm1', text: 'Profesor, ¿podemos usar calculadora gráfica?', sender: 'me', timestamp: 'Lun 9:00 AM' },
        { id: 'm2', text: 'Sí, está permitida. No olvides traer tu calculadora para el examen.', sender: 'them', timestamp: 'Lun 9:30 AM' }
    ]
  }
];
