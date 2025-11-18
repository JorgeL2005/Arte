import { useEffect, useRef } from 'react';
import { useObsolescenceStore } from '../store/obsolescenceStore';

export const useObsolescenceTimer = () => {
  const { isActive, updateTime, startTimer } = useObsolescenceStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Iniciar el timer automáticamente cuando el componente se monte
    startTimer();
  }, [startTimer]);

  useEffect(() => {
    if (isActive && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        updateTime(100); // Actualizar cada 100ms
      }, 100);
    } else if (!isActive && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, updateTime]);

  return { isActive };
};