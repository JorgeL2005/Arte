import { useState } from 'react';
import { useObsolescenceStore } from '../store/obsolescenceStore';

const SURVEY_QUESTIONS = [
  { id: 1, question: "¿Cuál es tu nombre completo?", type: "text", required: true },
  { id: 2, question: "¿Cuál es tu edad?", type: "number", required: true },
  { id: 3, question: "¿Cuál es tu correo electrónico?", type: "email", required: true },
  { id: 4, question: "¿Cuál es tu ocupación principal?", type: "select", options: ["Estudiante", "Trabajador", "Desempleado", "Otro"], required: true },
  { id: 5, question: "¿Con qué frecuencia cambias tu dispositivo móvil?", type: "select", options: ["Cada año", "Cada 2-3 años", "Cada 4-5 años", "Más de 5 años"], required: true },
  { id: 6, question: "Marca de teléfono preferida", type: "select", options: ["Apple", "Samsung", "Xiaomi", "Motorola", "Otro"], required: true },
  { id: 7, question: "Nivel de satisfacción con tu dispositivo actual (0-10)", type: "range", required: true },
  { id: 8, question: "Gasto mensual aproximado en tecnología (S/)", type: "number", required: true },
  { id: 9, question: "¿Has reparado alguna vez un dispositivo?", type: "select", options: ["Sí", "No"], required: true },
  { id: 10, question: "Componente que más se te malogra", type: "select", options: ["Batería", "Pantalla", "Botones", "Audio", "Almacenamiento"], required: true },
  { id: 11, question: "¿Qué tan frustrante te resulta la obsolescencia? (0-10)", type: "range", required: true },
  { id: 12, question: "¿Cuántos dispositivos usas a diario?", type: "number", required: true },
  { id: 13, question: "¿Cuándo compraste tu último teléfono?", type: "date", required: true },
  { id: 14, question: "¿Sueles conservar la garantía?", type: "select", options: ["Siempre", "A veces", "Nunca"], required: true },
  { id: 15, question: "Opinión breve sobre obsolescencia programada", type: "text", required: false },
  { id: 16, question: "¿Con qué frecuencia actualizas el sistema operativo?", type: "select", options: ["Cada actualización", "A veces", "Nunca"], required: true },
  { id: 17, question: "¿Preferirías reparar o comprar nuevo?", type: "select", options: ["Reparar", "Comprar nuevo"], required: true },
  { id: 18, question: "¿Cuál es tu presupuesto máximo para reparaciones? (S/)", type: "number", required: true },
  { id: 19, question: "¿Cuánto tiempo esperas que dure un teléfono? (años)", type: "number", required: true },
  { id: 20, question: "Describe el peor fallo que has tenido", type: "text", required: false }
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

  // Verificar fallos activos que afecten la encuesta
  const getActiveSurveyFailures = () => {
    return activeFailures.filter(f => 
      f.type === 'input' || f.type === 'button' || f.type === 'navigation'
    );
  };

  // Función para corromper el texto de las preguntas
  const corruptText = (text: string) => {
    if (degradation < 0.3) return text;
    
    const corruptionLevel = Math.floor(degradation * text.length * 0.3);
    const chars = text.split('');
    
    for (let i = 0; i < corruptionLevel; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      chars[randomIndex] = String.fromCharCode(33 + Math.random() * 94);
    }
    
    return chars.join('');
  };

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
          case 'survey_corruption':
            // Corromper el valor
            corruptedValue = value.split('').reverse().join('');
            break;
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
            setTimeout(() => {
              executeAction(action);
            }, failure.severity * 200);
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
          <h2 className="text-2xl font-bold text-white mb-4">¡Encuesta Completada!</h2>
          <p className="text-green-400 mb-4">Gracias por completar la encuesta.</p>
          
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
  const corruptedQuestion = corruptText(currentQ.question);

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
            {corruptedQuestion}
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
              {currentQ.options?.map((option, index) => {
                const corruptedOption = degradation > 0.4 ? 
                  option.split('').reverse().join('') : option;
                return (
                  <option key={index} value={option}>
                    {corruptedOption}
                  </option>
                );
              })}
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
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={getButtonStyles()}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Encuesta'}
            </button>
          ) : (
            <button
              onClick={() => handleButtonClick('next')}
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