
import React, { useState } from 'react';
import { mockStudents } from '../data';
import { GradingViewProps } from '../types';

const GradingView: React.FC<GradingViewProps> = ({ globalGrades, onUpdateGrade }) => {
  const assignments = [
    { id: 't1', title: 'Tarea 1', max: 100 },
    { id: 't2', title: 'Tarea 2', max: 100 },
    { id: 'e1', title: 'Examen 1', max: 100 },
  ];

  const calculateAverage = (studentId: string) => {
    const studentGrades = globalGrades[studentId] || {};
    let sum = 0;
    let count = 0;
    Object.values(studentGrades).forEach((g) => {
        const val = parseFloat(g as string);
        if(!isNaN(val)) {
            sum += val;
            count++;
        }
    });
    return count > 0 ? (sum / count).toFixed(1) : '-';
  };

  const handleSave = () => {
      alert("Cambios guardados y notificaciones enviadas a los alumnos.");
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Libro de Calificaciones</h1>
            <p className="text-gray-500 text-sm">Cálculo Diferencial - CD-101</p>
        </div>
        <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Exportar Excel
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Guardar Cambios
            </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-gray-900 z-10 w-64 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Estudiante</th>
                    {assignments.map(a => (
                        <th key={a.id} className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center w-32">
                            {a.title}
                            <span className="block text-[10px] font-normal normal-case text-gray-400">Max: {a.max}</span>
                        </th>
                    ))}
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center w-24">Promedio</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {mockStudents.map(student => (
                    <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="p-3 sticky left-0 bg-white dark:bg-gray-800 group-hover:bg-gray-50 dark:group-hover:bg-gray-700/50 z-10 border-r border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <img src={student.avatar} className="w-8 h-8 rounded-full" alt="" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{student.name}</p>
                                    <p className="text-xs text-gray-500">{student.code}</p>
                                </div>
                            </div>
                        </td>
                        {assignments.map(a => (
                            <td key={a.id} className="p-2 text-center">
                                <input 
                                    type="number" 
                                    value={globalGrades[student.id]?.[a.id] || ''}
                                    onChange={(e) => onUpdateGrade(student.id, a.id, e.target.value)}
                                    className="w-20 p-2 text-center text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
                                    min="0"
                                    max={a.max}
                                />
                            </td>
                        ))}
                        <td className="p-3 text-center font-bold text-gray-900 dark:text-white">
                            {calculateAverage(student.id)}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradingView;
