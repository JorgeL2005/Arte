import { useState } from 'react';
import { useObsolescenceStore } from '../store/obsolescenceStore';

const SURVEY_QUESTIONS = [
  { id: 1, question: "¿Qué piensas cuando un aparato que usas empieza a fallar con el tiempo?", type: "text", required: true },

  { id: 2, question: "¿Alguna vez  tu aparato electrónico comenzó a fallar sin explicación?", type: "text", required: true },

  { id: 3, question: "¿Te afecta económicamente tener que cambiar tus dispositivos cada cierto tiempo? Argumenta.", type: "text", required: true },

  { id: 4, question: "¿Has sentido que después de una actualización tu celular algo empeoró en su rendimiento ? ¿Qué pasó?", type: "text", required: true },

  { id: 5, question: "¿Crees que algunos aparatos duran menos de lo que deberían? ¿Por qué?", type: "text", required: true },

  { id: 6, question: "¿Cómo te sientes cuando tu dispositivo se vuelve lento o falla?", type: "text", required: true },

  { id: 7, question: "Si pudieras pedirle algo a las marcas sobre cómo fabricar los dispositivos, ¿qué sería y por qué?", type: "text", required: true },

  { id: 8, question: "¿Qué impacto crees que tiene en el planeta la alta frecuencia de cambio de dispositivos?", type: "text", required: true },

  { id: 9, question: "¿Existen los aparatos electrónicos que duran para siempre? Argumenta.", type: "text", required: true },

  { id: 10, question: "¿influye la publicidad o las 'nuevas tendencias' en tu decisión de comprar un nuevo dispositivo? Argumenta.", type: "text", required: true },

  { id: 11, question: "Cuando tu dispositivo se ralentiza o no responde, ¿qué haces normalmente?", type: "text", required: true },

  { id: 12, question: "¿Te gustaría poder reparar tus dispositivos fácilmente en vez de cambiarlos? ¿Por qué?", type: "text", required: true },

  { id: 13, question: "Imagina que tus aparatos duraran muchos años sin perder rendimiento. ¿Cómo cambiaría tu vida?", type: "text", required: true },

  { id: 14, question: "¿Te ha pasado que una actualización eliminó funciones que te gustaban o empeoró el rendimiento del dispositivo? ¿Cómo te afectó?", type: "text", required: true },

  { id: 15, question: "Como usuario, ¿qué cosas crees que podríamos hacer para cuidar mejor nuestros dispositivos?", type: "text", required: true }
];

export const SurveyComponent = () => {
  const { 
    degradationLevel, 
    surveyProgress, 
    surveyCompleted,
    rewardPromised,
    activeFailures,
    setSurveyProgress,
    completeSurvey
  } = useObsolescenceStore();

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [inputErrors, setInputErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const degradation = degradationLevel / 100;

  const isQuestionAnswered = (q: { required: boolean }, value: string | undefined) => {
    if (!q.required) return true;
    const v = (value ?? '').trim();
    return v !== '';
  };

  // Verificar fallos activos que afecten la encuesta
  const getActiveSurveyFailures = () => {
    return activeFailures.filter(f => 
      f.type === 'input' || f.type === 'button' || f.type === 'navigation'
    );
  };

  // Sin corrupción de texto: mantener legible siempre

  // Manejar cambios en los inputs con errores introducidos
  const handleInputChange = (questionId: number, value: string) => {
    const failures = getActiveSurveyFailures();
    let corruptedValue = value;

    // Introducir errores basados en fallos activos
    failures.forEach(failure => {
      if (failure.type === 'input' && Math.random() < failure.severity / 10) {
        switch (failure.id) {
          case 'input_lag':
            // Retrasar la entrada
            setTimeout(() => {
              setAnswers(prev => ({ ...prev, [questionId]: value }));
            }, failure.severity * 100);
            return;
          default:
            // Perder caracteres aleatoriamente
            if (Math.random() > 0.7) {
              corruptedValue = value.slice(0, -1);
            }
        }
      }
    });

    setAnswers(prev => ({ ...prev, [questionId]: corruptedValue }));
  };

  // Manejar el clic en botones con fallos
  const handleButtonClick = (action: string) => {
    const failures = getActiveSurveyFailures();

    // Verificar fallos de botón
    const buttonFailures = failures.filter(f => f.type === 'button');
    
    for (const failure of buttonFailures) {
      if (Math.random() < failure.severity / 10) {
        switch (failure.id) {
          case 'button_delay':
            // Retrasar la acción
            {
              const delay = Math.max(1000, failure.severity * 200);
              setTimeout(() => {
                executeAction(action);
              }, delay);
            }
            return;
          case 'button_unresponsive':
            // Hacer el botón no responsivo
            if (Math.random() > 0.5) {
              return;
            }
            break;
        }
      }
    }

    executeAction(action);
  };

  const executeAction = (action: string) => {
    switch (action) {
      case 'next':
        if (currentQuestion < SURVEY_QUESTIONS.length - 1) {
          const q = SURVEY_QUESTIONS[currentQuestion];
          const val = answers[q.id];
          if (!isQuestionAnswered(q, val)) {
            setInputErrors(['Debe responder la pregunta antes de continuar.']);
            return;
          }
          setCurrentQuestion(prev => prev + 1);
          setSurveyProgress(((currentQuestion + 1) / SURVEY_QUESTIONS.length) * 100);
        }
        break;
      case 'prev':
        if (currentQuestion > 0) {
          setCurrentQuestion(prev => prev - 1);
        }
        break;
      case 'submit':
        handleSubmit();
        break;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const missing = SURVEY_QUESTIONS.filter(q => q.required && !isQuestionAnswered(q, answers[q.id]));
    if (missing.length > 0) {
      setInputErrors(['Debe responder todas las preguntas obligatorias.']);
      setIsSubmitting(false);
      return;
    }
    
    // Simular procesamiento con errores
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    // Verificar si hay fallos que impidan el envío
    const criticalFailures = activeFailures.filter(f => 
      f.type === 'navigation' && f.severity > 8
    );
    
    if (criticalFailures.length > 0 && Math.random() > 0.3) {
      // Fallar el envío
      setInputErrors(['Error de conexión. Por favor intente nuevamente.']);
      setIsSubmitting(false);
      return;
    }
    
    completeSurvey();
    setIsSubmitting(false);
  };

  // Estilos dinámicos basados en degradación
  const getInputStyles = () => {
    const failures = getActiveSurveyFailures();
    const hasInputFailures = failures.some(f => f.type === 'input');
    
    return {
      filter: `blur(${degradation * 1}px)`,
      opacity: 1 - degradation * 0.2,
      pointerEvents: (hasInputFailures && Math.random() > 0.7 ? 'none' : 'auto') as 'auto' | 'none'
    };
  };

  const getButtonStyles = () => {
    const failures = getActiveSurveyFailures();
    const hasButtonFailures = failures.some(f => f.type === 'button');
    
    return {
      transform: `translateY(${hasButtonFailures ? Math.random() * 10 - 5 : 0}px)`,
      opacity: hasButtonFailures && Math.random() > 0.8 ? 0.5 : 1
    };
  };

  if (surveyCompleted) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg border border-gray-600">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ya casi...</h2>
          <p className="text-green-400 mb-4">Estamos procesando tus respuestas.</p>
          
          {rewardPromised && (
            <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-4 mb-4">
              <p className="text-yellow-200">Procesando su recompensa de 10 soles...</p>
              <div className="w-full bg-yellow-700 rounded-full h-2 mt-2">
                <div className="bg-yellow-500 h-2 rounded-full animate-pulse" style={{ width: '85%' }} />
              </div>
              <p className="text-yellow-300 text-sm mt-2">Casi listo...</p>
            </div>
          )}
          
          {/* La recompensa nunca llegará realmente */}
          <div className="text-gray-400 text-sm">
            <p>Por favor espere mientras procesamos su pago...</p>
            <p className="mt-2 opacity-50">Este proceso puede tardar varios minutos.</p>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = SURVEY_QUESTIONS[currentQuestion];
  const isCurrentAnswered = isQuestionAnswered(currentQ, answers[currentQ.id]);
  const allRequiredAnswered = SURVEY_QUESTIONS.every(q => !q.required || isQuestionAnswered(q, answers[q.id]));

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg border border-gray-600">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Encuesta de Opinión</h2>
          <span className="text-sm text-gray-400">
            {currentQuestion + 1} de {SURVEY_QUESTIONS.length}
          </span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${surveyProgress}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-white mb-2" style={getInputStyles()}>
            {currentQ.question}
            {currentQ.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          {currentQ.type === 'select' ? (
            <select
              value={answers[currentQ.id] || ''}
              onChange={(e) => handleInputChange(currentQ.id, e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              style={getInputStyles()}
              disabled={getActiveSurveyFailures().some(f => f.type === 'input' && Math.random() > 0.6)}
            >
              <option value="">Seleccione una opción</option>
              {(currentQ as { options?: string[] }).options?.map((option: string, index: number) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          ) : (
            <input
              type={currentQ.type}
              value={answers[currentQ.id] || ''}
              onChange={(e) => handleInputChange(currentQ.id, e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              style={getInputStyles()}
              placeholder={degradation > 0.5 ? "Error al cargar placeholder..." : `Ingrese su ${currentQ.type}`}
              disabled={getActiveSurveyFailures().some(f => f.type === 'input' && Math.random() > 0.6)}
            />
          )}
        </div>

        {inputErrors.length > 0 && (
          <div className="bg-red-900 border border-red-600 rounded p-3">
            {inputErrors.map((error, index) => (
              <p key={index} className="text-red-300 text-sm">{error}</p>
            ))}
          </div>
        )}

        <div className="flex justify-between pt-4">
          <button
            onClick={() => handleButtonClick('prev')}
            disabled={currentQuestion === 0 || isSubmitting}
            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={getButtonStyles()}
          >
            Anterior
          </button>
          
          {currentQuestion === SURVEY_QUESTIONS.length - 1 ? (
            <button
              onClick={() => handleButtonClick('submit')}
              disabled={isSubmitting || !allRequiredAnswered}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={getButtonStyles()}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Encuesta'}
            </button>
          ) : (
            <button
              onClick={() => handleButtonClick('next')}
              disabled={!isCurrentAnswered}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={getButtonStyles()}
            >
              Siguiente
            </button>
          )}
        </div>
      </div>

      {/* Indicadores de fallos */}
      {getActiveSurveyFailures().length > 0 && (
        <div className="mt-4 p-3 bg-red-900 border border-red-600 rounded">
          <p className="text-red-300 text-sm">
            ⚠️ Detectando fallos en el sistema de entrada...
          </p>
        </div>
      )}
    </div>
  );
};