import { useEffect, useState } from 'react';
import { useObsolescenceStore } from '../store/obsolescenceStore';

export const VisualDegradation = () => {
  const { degradationLevel, glitchIntensity } = useObsolescenceStore();
  const [glitchElements, setGlitchElements] = useState<Array<{
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    opacity: number;
  }>>([]);

  useEffect(() => {
    // Generar elementos de glitch basados en el nivel de degradación
    if (glitchIntensity > 0.3) {
      const elements = [];
      const numElements = Math.floor(glitchIntensity * 10);
      
      for (let i = 0; i < numElements; i++) {
        elements.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          width: Math.random() * 200 + 50,
          height: Math.random() * 20 + 5,
          opacity: Math.random() * 0.5 + 0.1
        });
      }
      
      setGlitchElements(elements);
    } else {
      setGlitchElements([]);
    }
  }, [glitchIntensity]);

  // Efectos de corrupción visual
  const getCorruptionOverlay = () => {
    if (degradationLevel < 40) return null;
    
    return (
      <div className="fixed inset-0 pointer-events-none z-30">
        {/* Escan lines */}
        {degradationLevel > 60 && (
          <div 
            className="absolute inset-0"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                rgba(0, 0, 0, 0.15),
                rgba(0, 0, 0, 0.15) 1px,
                transparent 1px,
                transparent 2px
              )`,
              animation: 'scanlines 8s linear infinite'
            }}
          />
        )}
        
        {/* Glitch bars */}
        {glitchElements.map(element => (
          <div
            key={element.id}
            className="absolute bg-red-500"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              width: `${element.width}px`,
              height: `${element.height}px`,
              opacity: element.opacity,
              mixBlendMode: 'multiply' as const,
              animation: 'glitch-bar 0.1s infinite'
            }}
          />
        ))}
        
        {/* Color distortion */}
        {degradationLevel > 70 && (
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(45deg, 
                rgba(255,0,0,${degradationLevel / 400}) 0%, 
                rgba(0,255,0,${degradationLevel / 400}) 50%, 
                rgba(0,0,255,${degradationLevel / 400}) 100%)`,
              mixBlendMode: 'screen' as const,
              animation: 'color-shift 2s infinite'
            }}
          />
        )}
        
        {/* Static noise */}
        {degradationLevel > 80 && (
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
              animation: 'static-noise 0.1s infinite'
            }}
          />
        )}
      </div>
    );
  };

  return (
    <>
      {getCorruptionOverlay()}
      <style jsx>{`
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(10px); }
        }
        
        @keyframes glitch-bar {
          0% { transform: translateX(0); }
          50% { transform: translateX(10px); }
          100% { transform: translateX(-10px); }
        }
        
        @keyframes color-shift {
          0%, 100% { filter: hue-rotate(0deg); }
          25% { filter: hue-rotate(90deg); }
          50% { filter: hue-rotate(180deg); }
          75% { filter: hue-rotate(270deg); }
        }
        
        @keyframes static-noise {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </>
  );
};