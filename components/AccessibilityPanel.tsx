
import React, { useState } from 'react';
import { AccessibilitySettings } from '../types';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  toggleSetting: (key: keyof AccessibilitySettings) => void;
  setSetting: (key: keyof AccessibilitySettings, value: any) => void;
  setFontSize: (size: number) => void;
  resetSettings: () => void;
}

type Tab = 'Visual' | 'Lectura' | 'Interacción' | 'Media';

const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ 
  isOpen, 
  onClose, 
  settings, 
  toggleSetting, 
  setSetting,
  setFontSize, 
  resetSettings 
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('Visual');

  if (!isOpen) return null;

  const ToggleItem = ({ settingKey, label, icon }: { settingKey: keyof AccessibilitySettings, label: string, icon: string }) => (
    <button 
      onClick={() => toggleSetting(settingKey)}
      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all text-left ${settings[settingKey] ? 'bg-blue-100 border-blue-500 text-blue-900 dark:bg-blue-900/40 dark:text-white dark:border-blue-400' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50'}`}
      aria-pressed={!!settings[settingKey]}
    >
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-xl">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className={`w-8 h-4 rounded-full relative transition-colors ${settings[settingKey] ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}>
        <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${settings[settingKey] ? 'translate-x-4' : ''}`}></div>
      </div>
    </button>
  );

  const renderVisualContent = () => (
    <div className="space-y-4 h-full overflow-y-auto pr-2 pb-4">
      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Tamaño de Texto</p>
        <div className="flex items-center gap-2">
          <button onClick={() => setFontSize(Math.max(0.8, settings.fontSize - 0.1))} className="p-2 bg-white dark:bg-gray-700 border rounded shadow-sm"><span className="material-symbols-outlined">text_decrease</span></button>
          <span className="flex-1 text-center font-bold text-gray-800 dark:text-white">{Math.round(settings.fontSize * 100)}%</span>
          <button onClick={() => setFontSize(Math.min(2.5, settings.fontSize + 0.1))} className="p-2 bg-white dark:bg-gray-700 border rounded shadow-sm"><span className="material-symbols-outlined">text_increase</span></button>
          <button onClick={() => setFontSize(1)} className="p-2 bg-white dark:bg-gray-700 border rounded shadow-sm text-xs text-gray-800 dark:text-white">Reset</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <ToggleItem settingKey="highContrast" label="Alto Contraste (Amarillo/Negro)" icon="contrast" />
        <ToggleItem settingKey="invertColors" label="Invertir Colores" icon="invert_colors" />
        <ToggleItem settingKey="darkMode" label="Modo Oscuro" icon="dark_mode" />
        <ToggleItem settingKey="sepiaMode" label="Modo Sepia" icon="filter_vintage" />
        <ToggleItem settingKey="grayscale" label="Escala de Grises" icon="filter_b_and_w" />
        <ToggleItem settingKey="lowSaturation" label="Colores Suaves" icon="opacity" />
        <ToggleItem settingKey="reduceBrightness" label="Reducir Brillo" icon="brightness_low" />
        <ToggleItem settingKey="highlightTitles" label="Resaltar Títulos" icon="title" />
        <ToggleItem settingKey="highlightLinks" label="Resaltar Enlaces" icon="link" />
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Daltonismo</p>
        <select 
          value={settings.colorBlindness} 
          onChange={(e) => setSetting('colorBlindness', e.target.value)}
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="none" className="bg-white dark:bg-gray-700 text-black dark:text-white">Ninguno</option>
          <option value="protanopia" className="bg-white dark:bg-gray-700 text-black dark:text-white">Protanopia (Rojo)</option>
          <option value="deuteranopia" className="bg-white dark:bg-gray-700 text-black dark:text-white">Deuteranopia (Verde)</option>
          <option value="tritanopia" className="bg-white dark:bg-gray-700 text-black dark:text-white">Tritanopia (Azul)</option>
        </select>
      </div>
    </div>
  );

  const renderReadingContent = () => (
    <div className="space-y-2 h-full overflow-y-auto pr-2 pb-4">
      <ToggleItem settingKey="textToSpeech" label="Lectura en Voz Alta" icon="record_voice_over" />
      <ToggleItem settingKey="dyslexiaFont" label="Fuente Dislexia" icon="spellcheck" />
      <ToggleItem settingKey="readingGuide" label="Guía de Lectura" icon="menu_book" />
      <ToggleItem settingKey="immersiveReader" label="Lector Inmersivo" icon="import_contacts" />
      <ToggleItem settingKey="focusMode" label="Modo Concentración" icon="center_focus_strong" />
      <ToggleItem settingKey="simplifiedText" label="Texto Simplificado" icon="format_align_left" />
      <ToggleItem settingKey="blockReading" label="Lectura por Bloques" icon="view_agenda" />
      <ToggleItem settingKey="glossaryEnabled" label="Glosario Emergente" icon="dictionary" />
      <ToggleItem settingKey="iconography" label="Iconos Explicativos" icon="emoji_objects" />
      
      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 mt-2">
        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Alineación</p>
        <div className="flex gap-2">
          <button onClick={() => setSetting('textAlign', 'left')} className={`flex-1 p-2 rounded border ${settings.textAlign === 'left' ? 'bg-blue-100 border-blue-500 text-blue-900' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white'}`}><span className="material-symbols-outlined">format_align_left</span></button>
          <button onClick={() => setSetting('textAlign', 'justify')} className={`flex-1 p-2 rounded border ${settings.textAlign === 'justify' ? 'bg-blue-100 border-blue-500 text-blue-900' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white'}`}><span className="material-symbols-outlined">format_align_justify</span></button>
          <button onClick={() => setSetting('textAlign', 'center')} className={`flex-1 p-2 rounded border ${settings.textAlign === 'center' ? 'bg-blue-100 border-blue-500 text-blue-900' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white'}`}><span className="material-symbols-outlined">format_align_center</span></button>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 mt-2">
        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Espaciado</p>
        <div className="flex flex-col gap-2">
            <ToggleItem settingKey="letterSpacing" label="Espaciado de Letras" icon="format_letter_spacing" />
            <ToggleItem settingKey="paragraphSpacing" label="Espaciado Párrafos" icon="format_line_spacing" />
            <div className="flex gap-2">
                <button onClick={() => setSetting('lineSpacing', 'normal')} className={`flex-1 py-1 text-xs rounded border ${settings.lineSpacing === 'normal' ? 'bg-blue-100 text-blue-900' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white'}`}>Normal</button>
                <button onClick={() => setSetting('lineSpacing', 'wide')} className={`flex-1 py-1 text-xs rounded border ${settings.lineSpacing === 'wide' ? 'bg-blue-100 text-blue-900' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white'}`}>Ancho</button>
                <button onClick={() => setSetting('lineSpacing', 'widest')} className={`flex-1 py-1 text-xs rounded border ${settings.lineSpacing === 'widest' ? 'bg-blue-100 text-blue-900' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white'}`}>Muy Ancho</button>
            </div>
        </div>
      </div>
    </div>
  );

  const renderInteractionContent = () => (
    <div className="space-y-2 h-full overflow-y-auto pr-2 pb-4">
      <ToggleItem settingKey="keyboardNav" label="Navegación por Teclado (Foco)" icon="keyboard" />
      <ToggleItem settingKey="largeCursor" label="Cursor Grande" icon="mouse" />
      <ToggleItem settingKey="largeButtons" label="Botones Grandes" icon="smart_button" />
      <ToggleItem settingKey="largeClickArea" label="Aumentar Área de Clic" icon="touch_app" />
      <ToggleItem settingKey="safeClick" label="Clic Seguro (Retardo Visual)" icon="timer" />
      <ToggleItem settingKey="stopAnimations" label="Detener Animaciones" icon="motion_photos_off" />
      <ToggleItem settingKey="hideImages" label="Ocultar Imágenes" icon="hide_image" />
      <ToggleItem settingKey="skipToContent" label="Botón 'Ir al Contenido'" icon="skip_next" />
      <ToggleItem settingKey="breadcrumbs" label="Migas de Pan (Breadcrumbs)" icon="linear_scale" />
      <ToggleItem settingKey="shortcutsEnabled" label="Atajos de Teclado" icon="keyboard_command_key" />
      <ToggleItem settingKey="disableZoom" label="Bloquear Zoom Web" icon="zoom_in_map" />
    </div>
  );

  const renderMediaContent = () => (
    <div className="space-y-2 h-full overflow-y-auto pr-2 pb-4">
      <ToggleItem settingKey="autoSubtitles" label="Subtítulos Automáticos" icon="subtitles" />
      <ToggleItem settingKey="transcripts" label="Transcripción de Audio" icon="description" />
      <ToggleItem settingKey="signLanguage" label="Ventana Lengua de Señas" icon="sign_language" />
      <ToggleItem settingKey="accessibleControls" label="Controles de Video Grandes" icon="play_circle" />
      <ToggleItem settingKey="noAutoplay" label="Evitar Reproducción Auto" icon="pause_circle" />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4 pointer-events-none">
      <div className="absolute inset-0 bg-black/40 pointer-events-auto backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl h-[85vh] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 pointer-events-auto transform transition-all flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-white p-2 rounded-lg">
              <span className="material-symbols-outlined">accessibility_new</span>
            </div>
            <div>
              <h2 className="font-bold text-gray-800 dark:text-white text-lg">Herramientas de Accesibilidad</h2>
              <p className="text-xs text-gray-500">Personaliza tu experiencia de aprendizaje</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={resetSettings} className="text-xs font-medium text-red-500 hover:bg-red-50 px-3 py-1 rounded-full border border-red-200 transition-colors">
              Restablecer Todo
            </button>
            <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          {['Visual', 'Lectura', 'Interacción', 'Media'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as Tab)}
              className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === tab ? 'border-primary text-primary bg-blue-50/50 dark:bg-blue-900/10' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 bg-white dark:bg-gray-900 overflow-hidden">
          {activeTab === 'Visual' && renderVisualContent()}
          {activeTab === 'Lectura' && renderReadingContent()}
          {activeTab === 'Interacción' && renderInteractionContent()}
          {activeTab === 'Media' && renderMediaContent()}
        </div>
      </div>
    </div>
  );
};

export default AccessibilityPanel;