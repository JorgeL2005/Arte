import { useEffect } from 'react';
import { useObsolescenceStore } from '../store/obsolescenceStore';

export const AudioManager = () => {
  const { 
    distortionLevel, 
    audioPlaying, 
    setAudioPlaying,
    activeFailures 
  } = useObsolescenceStore();

  useEffect(() => {
    // Auto-iniciar el audio cuando el componente se monte
    const startAudio = async () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }

        // Crear un tono simple que se repetirá
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const distortion = audioContext.createWaveShaper();
        const filter = audioContext.createBiquadFilter();
        
        // Configurar la cadena de audio
        oscillator.connect(filter);
        filter.connect(distortion);
        distortion.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Configurar efectos
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        
        filter.type = 'lowpass';
        filter.frequency.value = 20000;
        
        distortion.curve = makeDistortionCurve(0);
        distortion.oversample = '4x';
        
        gainNode.gain.value = 0.05; // Volumen bajo
        
        oscillator.start();
        setAudioPlaying(true);
        
        // Crear melodía
        const notes = [440, 494, 523, 587, 659, 698, 784];
        let noteIndex = 0;
        
        const playNote = () => {
          if (audioPlaying && oscillator && audioContext) {
            oscillator.frequency.setValueAtTime(notes[noteIndex], audioContext.currentTime);
            noteIndex = (noteIndex + 1) % notes.length;
            setTimeout(playNote, 800);
          }
        };
        
        playNote();
        
        // Aplicar degradación progresiva
        const degradeAudio = () => {
          if (audioPlaying) {
            // Aplicar distorsión basada en el nivel
            const distortionAmount = distortionLevel * 100;
            distortion.curve = makeDistortionCurve(distortionAmount);
            
            // Reducir frecuencias altas (simula daño)
            filter.frequency.value = Math.max(100, 20000 - (distortionLevel * 18000));
            
            // Volumen errático con alta degradación
            if (distortionLevel > 0.7 && Math.random() > 0.98) {
              gainNode.gain.value = 0;
              setTimeout(() => {
                if (audioPlaying) gainNode.gain.value = 0.05;
              }, Math.random() * 300 + 100);
            }
            
            setTimeout(degradeAudio, 500);
          }
        };
        
        degradeAudio();
        
      } catch (error) {
        console.error('Error al inicializar el audio:', error);
      }
    };

    // Iniciar después de un pequeño retraso para permitir la interacción del usuario
    const timer = setTimeout(startAudio, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Verificar fallos de audio específicos
    if (distortionLevel > 0.8) {
      const audioFailures = activeFailures.filter(f => f.type === 'audio');
      
      audioFailures.forEach(failure => {
        if (failure.severity > 7 && Math.random() > 0.95) {
          // Cortes severos de audio
          console.log('Fallo de audio severo detectado');
        }
      });
    }
  }, [activeFailures, distortionLevel]);

  const makeDistortionCurve = (amount: number) => {
    const samples = 44100;
    const curve = new Float32Array(samples);
    
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((3 + amount) * x * 20 * Math.PI / 180) / (Math.PI + amount * Math.abs(x));
    }
    
    return curve;
  };

  return null; // Este componente no renderiza nada visible
};