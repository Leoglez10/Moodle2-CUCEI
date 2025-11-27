
import React from 'react';
import { currentUser } from '../data';

const Settings: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Configuración</h1>

      <div className="space-y-8">
        {/* Account Section */}
        <section className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                <span className="material-symbols-outlined">manage_accounts</span> Cuenta
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre Completo</label>
                    <input type="text" value={currentUser.name} disabled className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-gray-500 dark:text-gray-400 cursor-not-allowed" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo Institucional</label>
                    <input type="email" value={currentUser.email} disabled className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-gray-500 dark:text-gray-400 cursor-not-allowed" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña</label>
                    <button className="text-primary hover:underline text-sm font-medium">Cambiar contraseña</button>
                </div>
            </div>
        </section>

        {/* Notifications Section */}
        <section className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                <span className="material-symbols-outlined">notifications</span> Notificaciones
            </h2>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">Notificaciones por Correo</p>
                        <p className="text-xs text-gray-500">Recibe actualizaciones de tareas y foros.</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle-checkbox h-6 w-6 rounded border-gray-300 text-primary focus:ring-primary" />
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">Recordatorios de Tareas</p>
                        <p className="text-xs text-gray-500">Avisos 24 horas antes de la entrega.</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle-checkbox h-6 w-6 rounded border-gray-300 text-primary focus:ring-primary" />
                </div>
            </div>
        </section>

        {/* Privacy Section */}
        <section className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                <span className="material-symbols-outlined">security</span> Privacidad
            </h2>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">Mostrar mi email a otros estudiantes</p>
                    </div>
                    <select className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm p-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary">
                        <option>Solo en mis cursos</option>
                        <option>A todos</option>
                        <option>A nadie</option>
                    </select>
                </div>
            </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
