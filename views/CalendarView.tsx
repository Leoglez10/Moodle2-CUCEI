
import React, { useState, useEffect } from 'react';
import { timelineEvents, courses } from '../data';
import { TimelineEvent, CalendarViewProps } from '../types';

type CalendarViewType = 'month' | 'week' | 'day';

const CalendarView: React.FC<CalendarViewProps> = ({ initialDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarViewType>('month');
  const [selectedDate, setSelectedDate] = useState<string | null>(new Date().toISOString().split('T')[0]);
  const [filterCourse, setFilterCourse] = useState<string>('all');
  
  // Modals State
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  useEffect(() => {
    if (initialDate) {
        const date = new Date(initialDate);
        if (!isNaN(date.getTime())) {
            setCurrentDate(date);
            setSelectedDate(initialDate);
        }
    }
  }, [initialDate]);

  // Navigation Helpers
  const nextPeriod = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') newDate.setMonth(newDate.getMonth() + 1);
    else if (view === 'week') newDate.setDate(newDate.getDate() + 7);
    else newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const prevPeriod = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') newDate.setMonth(newDate.getMonth() - 1);
    else if (view === 'week') newDate.setDate(newDate.getDate() - 7);
    else newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now.toISOString().split('T')[0]);
  };

  // Calendar Generation Helpers
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Formatting
  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  // Filtering Events
  const filteredEvents = timelineEvents.filter(event => {
    if (filterCourse === 'all') return true;
    return event.course === filterCourse;
  });

  const getEventsForDate = (dateStr: string) => {
    return filteredEvents.filter(e => e.date === dateStr);
  };

  const getEventTypeLabel = (type: string) => {
    switch(type) {
      case 'assignment': return 'Tarea';
      case 'exam': return 'Examen';
      case 'forum': return 'Foro';
      case 'personal': return 'Personal';
      default: return 'Evento';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch(type) {
      case 'assignment': return 'assignment';
      case 'exam': return 'quiz';
      case 'forum': return 'forum';
      case 'personal': return 'event';
      default: return 'calendar_today';
    }
  };

  // Render Components
  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysCount = getDaysInMonth(year, month);
    const startDay = getFirstDayOfMonth(year, month);
    const daysArray = Array.from({ length: daysCount }, (_, i) => i + 1);
    const emptySlots = Array.from({ length: startDay }, (_, i) => i);

    return (
      <div className="h-full flex flex-col">
        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          {dayNames.map(day => (
            <div key={day} className="p-3 text-center text-sm font-semibold text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 flex-1 auto-rows-fr overflow-y-auto">
          {emptySlots.map(i => (
            <div key={`empty-${i}`} className="border-b border-r border-gray-100 dark:border-gray-700/50 bg-gray-50/30 dark:bg-gray-900/30"></div>
          ))}
          {daysArray.map(day => {
            const currentDayDate = new Date(year, month, day);
            const dateStr = formatDate(currentDayDate);
            const dayEvents = getEventsForDate(dateStr);
            const isSelected = selectedDate === dateStr;
            const isToday = dateStr === formatDate(new Date());

            return (
              <div 
                key={day} 
                onClick={() => setSelectedDate(dateStr)}
                className={`min-h-[100px] border-b border-r border-gray-100 dark:border-gray-700/50 p-2 relative transition-colors cursor-pointer
                  ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-inset ring-primary' : 'hover:bg-gray-50 dark:hover:bg-gray-700/20'}
                `}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full 
                    ${isToday ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                    {day}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-[10px] bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 rounded-full">
                      {dayEvents.length}
                    </span>
                  )}
                </div>
                
                <div className="mt-2 space-y-1">
                  {dayEvents.slice(0, 3).map(event => (
                    <div key={event.id} className={`text-[10px] px-1.5 py-0.5 rounded truncate border-l-2
                      ${event.type === 'assignment' ? 'bg-red-100 text-red-700 border-red-500 dark:bg-red-900/40 dark:text-red-200' : 
                        event.type === 'exam' ? 'bg-purple-100 text-purple-700 border-purple-500 dark:bg-purple-900/40 dark:text-purple-200' :
                        event.type === 'personal' ? 'bg-green-100 text-green-700 border-green-500 dark:bg-green-900/40 dark:text-green-200' :
                        'bg-blue-100 text-blue-700 border-blue-500 dark:bg-blue-900/40 dark:text-blue-200'
                      }`}>
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-[10px] text-gray-400 pl-1">+ {dayEvents.length - 3} más</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const weekDays = Array.from({length: 7}, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });

    return (
      <div className="h-full flex flex-col">
        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          {weekDays.map((date, i) => (
            <div key={i} className={`p-3 text-center border-r border-gray-200 dark:border-gray-700 ${formatDate(date) === formatDate(new Date()) ? 'bg-primary/10' : ''}`}>
              <div className="text-xs text-gray-500 dark:text-gray-400">{dayNames[i]}</div>
              <div className="text-lg font-bold text-gray-800 dark:text-white">{date.getDate()}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 flex-1 divide-x divide-gray-100 dark:divide-gray-700 overflow-y-auto">
           {weekDays.map((date, i) => {
             const dateStr = formatDate(date);
             const dayEvents = getEventsForDate(dateStr);
             return (
               <div key={i} className="min-h-[400px] p-2 relative hover:bg-gray-50 dark:hover:bg-gray-800/30" onClick={() => setSelectedDate(dateStr)}>
                 {dayEvents.map(event => (
                   <div 
                    key={event.id} 
                    onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}
                    className="mb-2 p-2 rounded bg-blue-100 dark:bg-blue-900/40 border-l-4 border-primary text-xs cursor-pointer hover:scale-[1.02] transition-transform"
                   >
                     <div className="font-bold text-gray-800 dark:text-gray-100">{event.title}</div>
                     <div className="text-gray-600 dark:text-gray-300">{event.course}</div>
                   </div>
                 ))}
               </div>
             )
           })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] animate-fade-in">
      
      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button onClick={prevPeriod} className="p-1 hover:bg-white dark:hover:bg-gray-600 rounded-md shadow-sm transition-all">
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              <button onClick={nextPeriod} className="p-1 hover:bg-white dark:hover:bg-gray-600 rounded-md shadow-sm transition-all">
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button onClick={goToToday} className="text-sm text-primary font-medium hover:underline">Hoy</button>
          </div>

          <div className="flex gap-2">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button 
                onClick={() => setView('month')} 
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${view === 'month' ? 'bg-white dark:bg-gray-600 shadow text-primary dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
              >
                Mes
              </button>
              <button 
                onClick={() => setView('week')} 
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${view === 'week' ? 'bg-white dark:bg-gray-600 shadow text-primary dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
              >
                Semana
              </button>
            </div>
            <select 
              className="bg-gray-100 dark:bg-gray-700 border-none rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-primary"
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
            >
              <option value="all">Todos los cursos</option>
              {courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {view === 'month' ? renderMonthView() : renderWeekView()}
        </div>
      </div>

      {/* Right Side Panel: Details & Quick Add */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        
        <button 
          onClick={() => setShowAddEventModal(true)}
          className="w-full py-3 bg-primary hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 font-bold flex items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Nuevo Evento Personal
        </button>

        <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
          <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">event_available</span>
            Eventos del {selectedDate}
          </h3>
          
          {selectedDate && getEventsForDate(selectedDate).length > 0 ? (
            <div className="space-y-4">
              {getEventsForDate(selectedDate).map(event => (
                <div key={event.id} className={`p-4 rounded-xl border-l-4 ${
                  event.type === 'assignment' ? 'bg-red-50 border-red-500 dark:bg-red-900/20' :
                  event.type === 'exam' ? 'bg-purple-50 border-purple-500 dark:bg-purple-900/20' :
                  event.type === 'personal' ? 'bg-green-50 border-green-500 dark:bg-green-900/20' :
                  'bg-blue-50 border-blue-500 dark:bg-blue-900/20'
                }`}>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-800 dark:text-white text-sm">{event.title}</h4>
                    {event.urgent && <span className="material-symbols-outlined text-red-500 text-sm" title="Urgente">priority_high</span>}
                  </div>
                  <p className="text-xs text-primary font-medium mt-1">{event.course}</p>
                  
                  {/* Short description preview */}
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                    {event.description || "Sin descripción adicional."}
                  </p>

                  <div className="mt-3 flex gap-2">
                    <button 
                      onClick={() => setSelectedEvent(event)}
                      className="text-xs font-medium bg-white dark:bg-gray-700 px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200 flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">visibility</span>
                      Ver detalles
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400">
              <span className="material-symbols-outlined text-4xl mb-2">event_busy</span>
              <p>No hay eventos para este día.</p>
            </div>
          )}
        </div>
      </div>

      {/* ADD EVENT MODAL - IMPROVED COLORS */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Nuevo Evento Personal</h3>
              <button onClick={() => setShowAddEventModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowAddEventModal(false); }}>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Título</label>
                <input 
                  type="text" 
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent p-2.5" 
                  placeholder="Ej. Estudiar para examen" 
                  autoFocus 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Fecha</label>
                <input 
                  type="date" 
                  defaultValue={selectedDate || ''} 
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent p-2.5" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Notas</label>
                <textarea 
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent p-2.5" 
                  rows={3}
                  placeholder="Detalles del evento..."
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button type="button" onClick={() => setShowAddEventModal(false)} className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium shadow-md shadow-primary/20 transition-transform active:scale-95">Guardar Evento</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW EVENT DETAILS MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl p-0 overflow-hidden border border-gray-100 dark:border-gray-700">
            {/* Modal Header with Color Coding */}
            <div className={`p-6 ${
               selectedEvent.type === 'assignment' ? 'bg-red-500' : 
               selectedEvent.type === 'exam' ? 'bg-purple-500' :
               selectedEvent.type === 'personal' ? 'bg-green-500' :
               'bg-blue-500'
            } text-white`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                  <span className="material-symbols-outlined text-sm">{getEventTypeIcon(selectedEvent.type)}</span>
                  <span>{getEventTypeLabel(selectedEvent.type)}</span>
                </div>
                <button onClick={() => setSelectedEvent(null)} className="text-white/80 hover:text-white hover:bg-white/20 p-1 rounded-full transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <h2 className="text-2xl font-bold mt-4">{selectedEvent.title}</h2>
              <p className="text-white/90 mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">school</span>
                {selectedEvent.course}
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300">
                  <span className="material-symbols-outlined">calendar_month</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Fecha de vencimiento</p>
                  <p className="text-gray-900 dark:text-white font-semibold text-lg">{selectedEvent.date}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300">
                  <span className="material-symbols-outlined">description</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Descripción</p>
                  <p className="text-gray-900 dark:text-gray-200 mt-1 leading-relaxed">
                    {selectedEvent.description || "No hay descripción disponible para este evento."}
                  </p>
                </div>
              </div>

              {selectedEvent.urgent && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg flex items-center gap-3">
                  <span className="material-symbols-outlined text-red-600 dark:text-red-400">priority_high</span>
                  <p className="text-red-800 dark:text-red-200 text-sm font-medium">Esta actividad está marcada como urgente.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedEvent(null)} 
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
              >
                Cerrar
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium shadow-md shadow-primary/20 transition-transform active:scale-95 flex items-center gap-2">
                <span>Ir a la actividad</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
