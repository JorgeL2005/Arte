import { useEffect, useState } from 'react';
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
    experienceDurationMs,
    audioPlaying
  } = useObsolescenceStore();

  const [showUpdateMessage, setShowUpdateMessage] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [nameInput, setNameInput] = useState('');
  const [updateShown, setUpdateShown] = useState(false);
  const [showBlueScreen, setShowBlueScreen] = useState(false);
  const [blueScreenCount, setBlueScreenCount] = useState(0);
  const showAds = timeElapsed >= (experienceDurationMs - 60000);
  const [showVirusPopup, setShowVirusPopup] = useState(false);

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

  // Mostrar "Actualizando Sistema" en los últimos 20s
  useEffect(() => {
    if (!updateShown && timeElapsed >= (experienceDurationMs - 20000)) {
      setShowUpdateMessage(true);
      setUpdateProgress(0);
      setUpdateShown(true);
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
  }, [timeElapsed, experienceDurationMs, updateShown]);

  // Pantallazo azul desde minuto 3, máximo 2 veces
  useEffect(() => {
    if (!showBlueScreen && blueScreenCount < 2 && timeElapsed >= 180000 && Math.random() > 0.997) {
      setShowBlueScreen(true);
    }
  }, [timeElapsed, showBlueScreen, blueScreenCount]);

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
    setUpdateShown(false);
    setShowBlueScreen(false);
    setBlueScreenCount(0);
  };

  const handleLogin = () => {
    const name = nameInput.trim();
    if (!name) return;
    setUserName(name);
    setLoggedIn(true);
    startTimer();
  };

  const handleWaitBlueScreen = () => {
    setTimeout(() => {
      setShowBlueScreen(false);
      setBlueScreenCount(prev => prev + 1);
    }, 1000);
  };


  useEffect(() => {
    if (!showVirusPopup && degradationLevel > 40 && Math.random() > 0.997) {
      setShowVirusPopup(true);
    }
  }, [timeElapsed, degradationLevel, showVirusPopup]);

  const handleInstallVirus = () => {
    setShowVirusPopup(false);
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
          <div className="fixed top-6 right-6 z-40">
            <img src={ad1} className="w-96 h-auto rounded-lg border-2 border-gray-700 shadow-2xl" />
          </div>
          <div className="fixed bottom-6 left-6 z-40">
            <img src={ad2} className="w-96 h-auto rounded-lg border-2 border-gray-700 shadow-2xl" />
          </div>
        </>
      )}
      {showVirusPopup && (
        <div className="fixed bottom-8 right-8 z-50">
          <div className="bg-red-900 border border-red-600 rounded-lg p-4 w-80 shadow-2xl">
            <h3 className="text-white font-bold mb-2">Alerta: Virus detectado</h3>
            <p className="text-red-200 text-sm mb-4">Se recomienda instalar el antivirus "Confiable" inmediatamente.</p>
            <button
              onClick={handleInstallVirus}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition-colors w-full"
            >
              Instalar
            </button>
          </div>
        </div>
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

      {/* Pantallazo azul */}
      {showBlueScreen && (
        <div className="fixed inset-0 bg-blue-900 flex items-center justify-center z-50">
          <div className="text-center px-6">
            <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-6">
              El sistema ha fallado, debe esperar a que responda.
            </h2>
            <button
              onClick={handleWaitBlueScreen}
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
            >
              Esperar
            </button>
          </div>
        </div>
      )}

      {/* Mensaje final tras colapso */}
      {isTotalBreakdown && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
          <div className="text-center px-6">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
              Esto fue obsolescencia programada.
            </h2>
            <p className="text-gray-300 mb-8 text-sm md:text-base">
              Gracias por participar. Reinicia para vivirlo nuevamente.
            </p>
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
              {(() => {
                const decayStartMs = 240000;
                const elapsed = timeElapsed;
                let battery = 100;
                if (elapsed >= decayStartMs) {
                  const lastMinuteElapsed = Math.min(60000, Math.max(0, elapsed - decayStartMs));
                  const p = lastMinuteElapsed / 60000;
                  battery = Math.max(1, Math.floor(100 * Math.exp(-3 * p)));
                }
                return (
                  <div className="mb-2">
                    <div className="text-xs text-gray-300 mb-1">Batería: {battery}%</div>
                    <div className="w-32 h-2 bg-gray-700 rounded">
                      <div className="h-2 rounded bg-green-500" style={{ width: `${battery}%` }} />
                    </div>
                  </div>
                );
              })()}
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
          {/* Survey a pantalla completa */}
          <div className="lg:col-span-3">
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

      {isLoggedIn && !audioPlaying && (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center">
          <button
            onClick={() => window.dispatchEvent(new Event('app:audio-start'))}
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-500 transition-colors shadow-lg border border-green-400"
          >
            Poner musica de fondo
          </button>
        </div>
      )}
    </div>
  );
};
