
import React, { useState } from 'react';
import { User } from '../types';

interface ProfileProps {
  user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [avatarUrl, setAvatarUrl] = useState(user.avatar);
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mi Perfil</h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary to-blue-400"></div>
        
        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-6 flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <div className="relative group">
              <img 
                src={avatarUrl} 
                alt="Profile" 
                className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-md bg-white"
              />
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                <span className="material-symbols-outlined">photo_camera</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
            
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
              <p className="text-gray-500 dark:text-gray-400">{user.role}</p>
            </div>

            <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold uppercase">{user.status}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Información Académica
              </h3>
              
              <div className="grid gap-4">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">Carrera</label>
                  <p className="text-gray-900 dark:text-white font-medium mt-1">{user.career}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">Código de Estudiante</label>
                  <p className="text-gray-900 dark:text-white font-mono mt-1">{user.code}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">Semestre Actual</label>
                  <p className="text-gray-900 dark:text-white font-medium mt-1">{user.semester}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Información de Contacto
              </h3>
              
              <div className="grid gap-4">
                <div className="p-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo Institucional</label>
                  <input 
                    type="email" 
                    value={user.email} 
                    disabled 
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-500 cursor-not-allowed p-2.5"
                  />
                </div>
                
                <div className="p-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono (Opcional)</label>
                  <input 
                    type="tel" 
                    placeholder="Añadir teléfono..." 
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary p-2.5"
                  />
                </div>

                <div className="p-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ciudad</label>
                  <input 
                    type="text" 
                    placeholder="Guadalajara, Jal." 
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary p-2.5"
                  />
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <button className="bg-primary hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-blue-500/30 transition-transform hover:scale-105">
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
