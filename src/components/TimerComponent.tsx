import { useEffect, useState } from 'react';
import { useObsolescenceStore } from '../store/obsolescenceStore';

export const TimerComponent = () => {
  const { 
    timeElapsed, 
    degradationLevel, 
    experienceDurationMs
  } = useObsolescenceStore();

  const totalSeconds = Math.floor(experienceDurationMs / 1000);
  const [displayTime, setDisplayTime] = useState(totalSeconds);

  useEffect(() => {
    // Actualizar el display del tiempo basado en el tiempo transcurrido
    const degradation = degradationLevel / 100;
    const displayVariation = degradation > 0.3 ? Math.random() * 3 - 1.5 : 0;
    const newDisplayTime = Math.max(0, totalSeconds - (timeElapsed / 1000) + displayVariation);
    setDisplayTime(Math.max(0, newDisplayTime));
  }, [timeElapsed, degradationLevel, totalSeconds]);

  // Efectos visuales basados en degradación
  const getTimerStyles = () => {
    const degradation = degradationLevel / 100;
    
    return {
      filter: `blur(${degradation * 2}px) hue-rotate(${degradation * 90}deg)`,
      transform: `skew(${degradation * 5}deg, ${degradation * 2}deg)`,
      opacity: 1 - degradation * 0.3,
      transition: 'all 0.3s ease-out'
    };
  };

  const getTimeColor = () => {
    if (degradationLevel > 70) return 'text-red-500';
    if (degradationLevel > 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  const formatTime = (time: number) => {
    // Con alta degradación, el formato se vuelve errático
    if (degradationLevel > 60 && Math.random() > 0.7) {
      return Math.floor(time + Math.random() * 10).toString();
    }
    return Math.floor(time).toString();
  };

  return (
    <div className="text-center p-6 bg-gray-900 rounded-lg border-2 border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4">Tiempo Restante</h2>
      <div 
        className={`text-6xl font-mono font-bold ${getTimeColor()} transition-all duration-300`}
        style={getTimerStyles()}
      >
        {formatTime(displayTime)}s
      </div>
      <div className="mt-4">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.max(0, (displayTime / totalSeconds) * 100)}%` }}
          />
        </div>
        <p className="text-sm text-gray-400 mt-2">
          {degradationLevel < 30 ? "Sistema operativo" : 
           degradationLevel < 60 ? "Degradación detectada" :
           "Sistema crítico"}
        </p>
      </div>
      
      {/* Mensajes de estado según degradación */}
      {degradationLevel > 20 && (
        <div className="mt-4 text-xs text-yellow-400 animate-pulse">
          ⚠️ Pequeños retrasos detectados
        </div>
      )}
      {degradationLevel > 50 && (
        <div className="mt-2 text-xs text-orange-400 animate-pulse">
          ⚠️ Fallos en el sistema
        </div>
      )}
      {degradationLevel > 80 && (
        <div className="mt-2 text-xs text-red-400 animate-pulse">
          ⚠️ Sistema crítico
        </div>
      )}
    </div>
  );
};