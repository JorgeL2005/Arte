import { useEffect, useState } from 'react';
import { TimerComponent } from './TimerComponent';
import { SurveyComponent } from './SurveyComponent';
import { AudioManager } from './AudioManager';
import { VisualDegradation } from './VisualDegradation';
import { useObsolescenceStore } from '../store/obsolescenceStore';
import { useObsolescenceTimer } from '../hooks/useObsolescenceTimer';
import ad1 from '../../img/Imagen_art1.jpeg';
import ad2 from '../../img/Imagen_art2.jpeg';

export const ObsolescenceArt = () => {
  useObsolescenceTimer();
  const { 
    degradationLevel, 
    activeFailures, 
    timeElapsed,
    rewardPromised,
    visualCorruption,
    glitchIntensity,
    reset,
    startTimer,
    isLoggedIn,
    userName,
    setUserName,
    setLoggedIn,
    experienceDurationMs
  } = useObsolescenceStore();

  const [showUpdateMessage, setShowUpdateMessage] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [nameInput, setNameInput] = useState('');
  const showAds = timeElapsed >= (experienceDurationMs / 2);

  // Mensajes de actualización falsos
  const FAKE_UPDATE_MESSAGES = [
    "Detectando errores del sistema...",
    "Reparando archivos corruptos...",
    "Optimizando rendimiento...",
    "Instalando parches de seguridad...",
    "Reiniciando servicios...",
    "Actualizando controladores...",
    "Limpiando memoria temporal...",
    "Verificando integridad del sistema..."
  ];

  // Mostrar mensajes de actualización en momentos críticos
  useEffect(() => {
    if (degradationLevel > 70 && Math.random() > 0.98) {
      setShowUpdateMessage(true);
      setUpdateProgress(0);
      
      // Simular progreso de actualización
      const interval = setInterval(() => {
        setUpdateProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setShowUpdateMessage(false), 2000);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [degradationLevel, timeElapsed]);

  // Efectos visuales de degradación
  const getBodyStyles = () => {
    const corruption = visualCorruption;
    
    return {
      filter: `
        blur(${corruption * 0.5}px) 
        contrast(${100 - corruption * 20}%) 
        brightness(${100 - corruption * 15}%) 
        saturate(${100 - corruption * 30}%) 
        hue-rotate(${corruption * 45}deg)
      `,
      transform: `
        skew(${corruption * 2}deg, ${corruption * 1}deg)
        scale(${1 - corruption * 0.02})
      `,
      backgroundColor: `rgb(${Math.floor(17 + corruption * 20)}, ${Math.floor(24 + corruption * 15)}, ${Math.floor(39 + corruption * 10)})`,
      transition: 'all 0.3s ease-out'
    };
  };

  // Efecto de glitch
  const getGlitchStyles = () => {
    if (glitchIntensity < 0.3) return {};
    
    return {
      animation: `glitch ${0.5 - glitchIntensity * 0.3}s infinite`,
      position: 'relative' as const
    };
  };

  // Obtener mensaje de estado según degradación
  const getStatusMessage = () => {
    if (degradationLevel > 80) return "CRÍTICO: Fallo del sistema inminente";
    if (degradationLevel > 60) return "ADVERTENCIA: Múltiples errores detectados";
    if (degradationLevel > 40) return "ATENCIÓN: Degradación del sistema";
    if (degradationLevel > 20) return "Estado: Pequeños retrasos detectados";
    return "Estado: Sistema operativo";
  };

  // Verificar si hay fallos críticos
  const hasCriticalFailures = activeFailures.some(f => f.severity > 8);
  const isTotalBreakdown = degradationLevel >= 100;
  const handleRestart = () => {
    const prevName = userName;
    reset();
    if (prevName) {
      setUserName(prevName);
      setLoggedIn(true);
    }
    startTimer();
    setShowUpdateMessage(false);
    setUpdateProgress(0);
  };

  const handleLogin = () => {
    const name = nameInput.trim();
    if (!name) return;
    setUserName(name);
    setLoggedIn(true);
    startTimer();
  };

  return (
    <div 
      className="min-h-screen transition-all duration-300"
      style={getBodyStyles()}
    >
      <style>{`
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .flicker-effect {
          animation: flicker 0.1s infinite;
        }
      `}</style>

      <AudioManager />
      <VisualDegradation />
      {showAds && (
        <>
          <div className="fixed top-4 right-4 z-40">
            <img src={ad1} className="w-48 h-auto rounded border border-gray-700 shadow-lg" />
          </div>
          <div className="fixed bottom-4 left-4 z-40">
            <img src={ad2} className="w-48 h-auto rounded border border-gray-700 shadow-lg" />
          </div>
        </>
      )}
      {!isLoggedIn && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-white mb-4">Inicio de sesión</h3>
            <p className="text-gray-300 mb-4">Ingrese su nombre para comenzar.</p>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none mb-4"
              placeholder="Su nombre"
            />
            <button
              onClick={handleLogin}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
            >
              Iniciar
            </button>
          </div>
        </div>
      )}
      
      {/* Overlay de glitch */}
      {glitchIntensity > 0.5 && (
        <div 
          className="fixed inset-0 pointer-events-none z-50"
          style={{
            background: `linear-gradient(45deg, transparent 30%, rgba(255,0,0,${glitchIntensity * 0.1}) 50%, transparent 70%)`,
            mixBlendMode: 'multiply' as const
          }}
        />
      )}

      {/* Mensaje de actualización falso */}
      {showUpdateMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-40">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-white mb-2">Actualizando Sistema</h3>
              <p className="text-gray-300 mb-4">
                {FAKE_UPDATE_MESSAGES[Math.floor(updateProgress / 12.5)] || "Finalizando..."}
              </p>
              <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${updateProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-400">{Math.floor(updateProgress)}% completado</p>
              
              {updateProgress >= 100 && (
                <div className="mt-4 text-green-400 animate-pulse">
                  ✓ Actualización completada
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fallo total con opción de reinicio */}
      {isTotalBreakdown && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Fallo total del sistema</h3>
            <p className="text-gray-300 mb-6">La experiencia ha colapsado. Puede reiniciarla para comenzar nuevamente.</p>
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
            >
              Reiniciar experiencia
            </button>
          </div>
        </div>
      )}

      {/* Header con información del sistema */}
      <header className="p-6 border-b border-gray-700">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <div style={getGlitchStyles()}>
              <h1 className="text-3xl font-bold text-white mb-2">
                Encuesta Premiada - Gana 10 Soles
              </h1>
              <p className="text-gray-300">
                {userName ? `${userName}, complete nuestra breve encuesta y reciba su recompensa` : 'Complete nuestra breve encuesta y reciba su recompensa inmediatamente'}
              </p>
            </div>
            
            <div className="text-right">
              <div className={`text-sm px-3 py-1 rounded-full ${
                degradationLevel > 60 ? 'bg-red-900 text-red-300' :
                degradationLevel > 30 ? 'bg-yellow-900 text-yellow-300' :
                'bg-green-900 text-green-300'
              }`}>
                {getStatusMessage()}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Fallos detectados: {activeFailures.length}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timer */}
          <div className="lg:col-span-1">
            <TimerComponent />
          </div>
          
          {/* Survey */}
          <div className="lg:col-span-2">
            <SurveyComponent />
          </div>
        </div>

        {/* Mensaje de recompensa */}
        {rewardPromised && (
          <div className="mt-8 p-6 bg-yellow-900 border border-yellow-600 rounded-lg">
            <div className="text-center">
              <h3 className="text-xl font-bold text-yellow-200 mb-2">
                ¡Felicidades! Su recompensa está siendo procesada...
              </h3>
              <p className="text-yellow-300 mb-4">
                Por favor espere mientras verificamos su información y procesamos el pago de 10 soles.
              </p>
              <div className="w-full bg-yellow-700 rounded-full h-2 mb-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full animate-pulse"
                  style={{ width: '95%' }}
                />
              </div>
              <p className="text-yellow-400 text-sm">
                95% completado - casi listo...
              </p>
              
              {hasCriticalFailures && (
                <div className="mt-4 text-red-400 text-sm animate-pulse">
                  ⚠️ Error de conexión detectado - reconectando...
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer con información adicional */}
      <footer className="mt-12 p-6 border-t border-gray-700 text-center">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-400 text-sm">
            Esta encuesta es completamente segura y sus datos están protegidos.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Tiempo de actividad: {Math.floor(timeElapsed / 1000)}s | 
            Fallos detectados: {activeFailures.length} | 
            Estado: {degradationLevel < 30 ? 'Óptimo' : degradationLevel < 60 ? 'Degradado' : 'Crítico'}
          </p>
        </div>
      </footer>
    </div>
  );
};