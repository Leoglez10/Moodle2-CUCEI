
import React, { useState } from 'react';
import { courses } from '../data';

const FilesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'submissions' | 'resources'>('submissions');

  // Generate mock file data based on courses
  const submissions = courses.flatMap(c => 
    c.modules.flatMap(m => m.resources)
    .filter(r => r.type === 'assignment' && r.score) // Submitted ones
    .map(r => ({
        id: r.id,
        name: `Entrega_${r.title.replace(/\s/g, '_')}.pdf`,
        course: c.name,
        date: '20 Oct 2024',
        size: '1.2 MB'
    }))
  );

  const materials = courses.flatMap(c => 
    c.modules.flatMap(m => m.resources)
    .filter(r => r.type === 'pdf')
    .map(r => ({
        id: r.id,
        name: `${r.title}.pdf`,
        course: c.name,
        date: '15 Oct 2024',
        size: '3.5 MB'
    }))
  );

  const FileList = ({ files }: { files: any[] }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {files.length > 0 ? (
            <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                        <th className="p-4 text-xs font-bold text-gray-500 uppercase">Nombre</th>
                        <th className="p-4 text-xs font-bold text-gray-500 uppercase">Curso</th>
                        <th className="p-4 text-xs font-bold text-gray-500 uppercase">Fecha</th>
                        <th className="p-4 text-xs font-bold text-gray-500 uppercase">Tamaño</th>
                        <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Acción</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {files.map(file => (
                        <tr key={file.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="p-4 flex items-center gap-3">
                                <span className="material-symbols-outlined text-red-500">picture_as_pdf</span>
                                <span className="font-medium text-gray-800 dark:text-gray-200">{file.name}</span>
                            </td>
                            <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{file.course}</td>
                            <td className="p-4 text-sm text-gray-500">{file.date}</td>
                            <td className="p-4 text-sm text-gray-500">{file.size}</td>
                            <td className="p-4 text-right">
                                <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-500">
                                    <span className="material-symbols-outlined text-lg">download</span>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : (
            <div className="p-10 text-center text-gray-500">No hay archivos en esta categoría.</div>
        )}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-20">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mis Archivos</h1>
        
        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
            <button 
                onClick={() => setActiveTab('submissions')}
                className={`pb-2 px-4 font-medium transition-colors border-b-2 ${activeTab === 'submissions' ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}
            >
                Mis Entregas
            </button>
            <button 
                onClick={() => setActiveTab('resources')}
                className={`pb-2 px-4 font-medium transition-colors border-b-2 ${activeTab === 'resources' ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}
            >
                Material del Curso
            </button>
        </div>

        <FileList files={activeTab === 'submissions' ? submissions : materials} />
    </div>
  );
};

export default FilesView;
