
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { currentUser, professorUser } from '../data';

interface LoginViewProps {
  onLogin: (user: User) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>('student');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
        if (role === 'student') {
            onLogin(currentUser);
        } else {
            onLogin(professorUser);
        }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        
        {/* Header */}
        <div className="bg-primary p-8 text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-4xl text-white">school</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Moodle2 CUCEI</h1>
        </div>

        {/* Body */}
        <div className="p-8">
            <div className="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-lg mb-6">
                <button 
                    onClick={() => setRole('student')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'student' ? 'bg-white dark:bg-gray-600 shadow text-primary dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                >
                    Soy Alumno
                </button>
                <button 
                    onClick={() => setRole('professor')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'professor' ? 'bg-white dark:bg-gray-600 shadow text-primary dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                >
                    Soy Profesor
                </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {role === 'student' ? 'Código de Estudiante' : 'Código de Profesor'}
                    </label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400">person</span>
                        <input 
                            type="text" 
                            className="w-full pl-10 p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400"
                            placeholder={role === 'student' ? 'Ej. 2256598' : 'Ej. 9876543'}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            // required // Disabled for easy demo
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400">lock</span>
                        <input 
                            type="password" 
                            className="w-full pl-10 p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            // required
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                        Recordarme
                    </label>
                    <button type="button" className="text-primary hover:underline font-medium">¿Olvidaste tu NIP?</button>
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    ) : (
                        <>
                            <span>Ingresar como {role === 'student' ? 'Alumno' : 'Profesor'}</span>
                            <span className="material-symbols-outlined text-sm">login</span>
                        </>
                    )}
                </button>
            </form>
            
            <p className="text-center text-xs text-gray-400 mt-6">
                © 2024 Universidad de Guadalajara - CUCEI
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
