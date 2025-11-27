import { useEffect, useRef } from 'react';
import { useObsolescenceStore } from '../store/obsolescenceStore';
const soundtrackUrl = new URL('../audio/Satie - Gymnopédie No. 1.mp3', import.meta.url).href;

export const AudioManager = () => {
  const { 
    distortionLevel, 
    audioPlaying, 
    setAudioPlaying,
    activeFailures 
  } = useObsolescenceStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const distortionRef = useRef<WaveShaperNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const unlockRef = useRef<((e: Event) => void) | null>(null);

  useEffect(() => {
    const startAudio = async () => {
      try {
        const w = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
        const AudioContextClass = w.AudioContext ?? w.webkitAudioContext;
        if (!AudioContextClass) return;
        const audioContext = new AudioContextClass();
        contextRef.current = audioContext;
        
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }

        const audioElement = new Audio(soundtrackUrl);
        audioElement.loop = true;
        audioElement.preload = 'auto';
        audioElement.volume = 1;
        audioRef.current = audioElement;
        const source = audioContext.createMediaElementSource(audioElement);
        const gainNode = audioContext.createGain();
        const distortion = audioContext.createWaveShaper();
        const filter = audioContext.createBiquadFilter();
        sourceRef.current = source;
        gainRef.current = gainNode;
        distortionRef.current = distortion;
        filterRef.current = filter;

        source.connect(filter);
        filter.connect(distortion);
        distortion.connect(gainNode);
        gainNode.connect(audioContext.destination);

        filter.type = 'lowpass';
        filter.frequency.value = 20000;
        
        distortion.curve = makeDistortionCurve(0);
        distortion.oversample = '4x';
        
        gainNode.gain.value = 0.8;

        try {
          await audioElement.play();
        } catch (e) {
          audioElement.addEventListener('error', () => {
            console.error('Audio element error');
          });
          const unlock = async () => {
            try {
              if (audioContext.state === 'suspended') await audioContext.resume();
              await audioElement.play();
            } catch {}
            document.removeEventListener('click', unlock);
            document.removeEventListener('keydown', unlock);
          };
          unlockRef.current = unlock;
          document.addEventListener('click', unlock);
          document.addEventListener('keydown', unlock);
        }
        setAudioPlaying(true);

        const degradeAudio = () => {
          if (!audioElement.paused) {
            const distortionAmount = distortionLevel * 100;
            distortion.curve = makeDistortionCurve(distortionAmount);
            filter.frequency.value = Math.max(100, 20000 - (distortionLevel * 18000));
            if (distortionLevel > 0.7 && Math.random() > 0.995) {
              gainNode.gain.value = 0;
              setTimeout(() => {
                if (!audioElement.paused) gainNode.gain.value = 0.25;
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

    // Escuchar evento explícito de inicio de audio (desde el botón de login)
    const handleAppAudioStart = () => {
      if (!audioPlaying) startAudio();
    };
    window.addEventListener('app:audio-start', handleAppAudioStart);
    
    return () => {
      window.removeEventListener('app:audio-start', handleAppAudioStart);
      const audioEl = audioRef.current;
      const ctx = contextRef.current;
      const src = sourceRef.current;
      if (unlockRef.current) {
        document.removeEventListener('click', unlockRef.current);
        document.removeEventListener('keydown', unlockRef.current);
        unlockRef.current = null;
      }
      if (audioEl) {
        audioEl.pause();
      }
      if (src) {
        try { src.disconnect(); } catch {}
      }
      if (ctx) {
        try { ctx.close(); } catch {}
      }
      setAudioPlaying(false);
      audioRef.current = null;
      contextRef.current = null;
      sourceRef.current = null;
      gainRef.current = null;
      distortionRef.current = null;
      filterRef.current = null;
    };
  }, [audioPlaying, distortionLevel, setAudioPlaying]);

  useEffect(() => {
    const handleVisibility = async () => {
      const audioEl = audioRef.current;
      const ctx = contextRef.current;
      if (!audioEl || !ctx) return;
      if (document.visibilityState === 'visible') {
        try {
          if (ctx.state === 'suspended') await ctx.resume();
          if (audioEl.paused) {
            await audioEl.play();
            setAudioPlaying(true);
          }
        } catch {}
      } else {
        audioEl.pause();
        setAudioPlaying(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [setAudioPlaying]);

  useEffect(() => {
    const stop = async () => {
      const audioEl = audioRef.current;
      const ctx = contextRef.current;
      const src = sourceRef.current;
      if (audioEl) audioEl.pause();
      if (src) {
        try { src.disconnect(); } catch {}
      }
      if (ctx) {
        try { await ctx.close(); } catch {}
      }
      setAudioPlaying(false);
    };
    window.addEventListener('pagehide', stop);
    window.addEventListener('beforeunload', stop);
    return () => {
      window.removeEventListener('pagehide', stop);
      window.removeEventListener('beforeunload', stop);
    };
  }, [setAudioPlaying]);

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
