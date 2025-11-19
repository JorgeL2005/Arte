import { create } from 'zustand';

export interface Failure {
  id: string;
  type: 'button' | 'input' | 'audio' | 'visual' | 'navigation';
  severity: number; // 1-10
  active: boolean;
  timestamp: number;
}

export interface ObsolescenceState {
  // Timer and degradation
  timeElapsed: number;
  degradationLevel: number; // 0-100
  isActive: boolean;
  userName: string | null;
  isLoggedIn: boolean;
  experienceDurationMs: number;
  
  // Survey progress
  surveyProgress: number;
  surveyCompleted: boolean;
  rewardPromised: boolean;
  rewardGiven: boolean;
  
  // Failure system
  activeFailures: Failure[];
  totalFailures: number;
  
  // Audio state
  audioContext: AudioContext | null;
  distortionLevel: number;
  audioPlaying: boolean;
  
  // Visual state
  visualCorruption: number;
  glitchIntensity: number;
  
  // Actions
  startTimer: () => void;
  stopTimer: () => void;
  updateTime: (time: number) => void;
  addFailure: (failure: Failure) => void;
  removeFailure: (failureId: string) => void;
  setSurveyProgress: (progress: number) => void;
  completeSurvey: () => void;
  setAudioContext: (context: AudioContext | null) => void;
  setDistortionLevel: (level: number) => void;
  setAudioPlaying: (playing: boolean) => void;
  setVisualCorruption: (corruption: number) => void;
  setGlitchIntensity: (intensity: number) => void;
  setUserName: (name: string) => void;
  setLoggedIn: (logged: boolean) => void;
  reset: () => void;
}

const EXPERIENCE_DURATION_MS = 180000;
const FAILURE_POINTS = [
  { time: 30000, failures: ['button_delay'] },
  { time: 60000, failures: ['audio_distortion', 'visual_glitch'] },
  { time: 90000, failures: ['input_lag', 'button_unresponsive'] },
  { time: 120000, failures: ['screen_flicker', 'audio_cuts'] },
  { time: 150000, failures: ['navigation_block', 'survey_corruption'] },
  { time: 180000, failures: ['total_breakdown'] }
];

const FAILURE_TYPES = {
  button_delay: { type: 'button' as const, severity: 3 },
  audio_distortion: { type: 'audio' as const, severity: 5 },
  visual_glitch: { type: 'visual' as const, severity: 4 },
  input_lag: { type: 'input' as const, severity: 6 },
  button_unresponsive: { type: 'button' as const, severity: 7 },
  screen_flicker: { type: 'visual' as const, severity: 8 },
  audio_cuts: { type: 'audio' as const, severity: 8 },
  navigation_block: { type: 'navigation' as const, severity: 9 },
  survey_corruption: { type: 'input' as const, severity: 9 },
  total_breakdown: { type: 'visual' as const, severity: 10 }
};

export const useObsolescenceStore = create<ObsolescenceState>((set, get) => ({
  // Estado inicial
  timeElapsed: 0,
  degradationLevel: 0,
  isActive: false,
  userName: null,
  isLoggedIn: false,
  experienceDurationMs: EXPERIENCE_DURATION_MS,
  surveyProgress: 0,
  surveyCompleted: false,
  rewardPromised: false,
  rewardGiven: false,
  activeFailures: [],
  totalFailures: 0,
  audioContext: null,
  distortionLevel: 0,
  audioPlaying: false,
  visualCorruption: 0,
  glitchIntensity: 0,

  // Acciones
  startTimer: () => set({ isActive: true }),
  
  stopTimer: () => set({ isActive: false }),
  
  updateTime: (time: number) => {
    const { isActive, timeElapsed } = get();
    if (!isActive) return;
    
    const newTimeElapsed = timeElapsed + time;
    const degradationLevel = Math.min(100, (newTimeElapsed / EXPERIENCE_DURATION_MS) * 100);
    
    // Verificar si debemos activar nuevos fallos
    FAILURE_POINTS.forEach(failurePoint => {
      if (newTimeElapsed >= failurePoint.time && timeElapsed < failurePoint.time) {
        failurePoint.failures.forEach(failureType => {
          const failureConfig = FAILURE_TYPES[failureType as keyof typeof FAILURE_TYPES];
          const failure: Failure = {
            id: `${failureType}_${Date.now()}`,
            type: failureConfig.type,
            severity: failureConfig.severity,
            active: true,
            timestamp: Date.now()
          };
          get().addFailure(failure);
        });
      }
    });
    
    set({ 
      timeElapsed: newTimeElapsed,
      degradationLevel,
      distortionLevel: degradationLevel / 100,
      visualCorruption: degradationLevel / 100,
      glitchIntensity: degradationLevel > 50 ? (degradationLevel - 50) / 50 : 0
    });
  },
  
  addFailure: (failure: Failure) => {
    const { activeFailures, totalFailures } = get();
    set({
      activeFailures: [...activeFailures, failure],
      totalFailures: totalFailures + 1
    });
  },
  
  removeFailure: (failureId: string) => {
    const { activeFailures } = get();
    set({
      activeFailures: activeFailures.filter(f => f.id !== failureId)
    });
  },
  
  setSurveyProgress: (progress: number) => {
    set({ surveyProgress: progress });
  },
  
  completeSurvey: () => {
    set({ 
      surveyCompleted: true,
      rewardPromised: true
    });
    // La recompensa nunca se dará realmente
    setTimeout(() => {
      // Simular fallo al procesar la recompensa
      const failure: Failure = {
        id: `reward_failure_${Date.now()}`,
        type: 'navigation',
        severity: 10,
        active: true,
        timestamp: Date.now()
      };
      get().addFailure(failure);
    }, 2000);
  },
  
  setAudioContext: (context: AudioContext | null) => {
    set({ audioContext: context });
  },
  
  setDistortionLevel: (level: number) => {
    set({ distortionLevel: Math.max(0, Math.min(1, level)) });
  },
  
  setAudioPlaying: (playing: boolean) => {
    set({ audioPlaying: playing });
  },
  
  setVisualCorruption: (corruption: number) => {
    set({ visualCorruption: Math.max(0, Math.min(1, corruption)) });
  },
  
  setGlitchIntensity: (intensity: number) => {
    set({ glitchIntensity: Math.max(0, Math.min(1, intensity)) });
  },
  
  setUserName: (name: string) => {
    set({ userName: name });
  },
  
  setLoggedIn: (logged: boolean) => {
    set({ isLoggedIn: logged });
  },
  
  reset: () => set({
    timeElapsed: 0,
    degradationLevel: 0,
    isActive: false,
    userName: null,
    isLoggedIn: false,
    experienceDurationMs: EXPERIENCE_DURATION_MS,
    surveyProgress: 0,
    surveyCompleted: false,
    rewardPromised: false,
    rewardGiven: false,
    activeFailures: [],
    totalFailures: 0,
    audioContext: null,
    distortionLevel: 0,
    audioPlaying: false,
    visualCorruption: 0,
    glitchIntensity: 0
  })
}));