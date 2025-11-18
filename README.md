# Obsolescencia Programada - Arte Digital Interactivo

Una experiencia artística interactiva que explora la obsolescencia programada a través de una página web que se deteriora progresivamente mientras el usuario intenta completar una encuesta por una recompensa que nunca llegará.

## 🎨 Concepto Artístico

Este proyecto es una obra de **Net Sound Art** que combina elementos visuales, sonoros y performativos para crear una crítica al consumismo tecnológico. La página simula el deterioro digital progresivo, generando frustración en el usuario mientras experimenta firsthand la obsolescencia programada.

### Elementos Principales:
- **Temporizador degradativo**: El tiempo se vuelve errático y poco confiable
- **Encuesta fallida**: Los formularios se corrompen y los botones fallan
- **Audio distorsionado**: Música que se descompone con el tiempo
- **Efectos visuales**: Glitches, parpadeos y corrupción visual
- **Mensajes engañosos**: Actualizaciones falsas y promesas de recompensa

## 🚀 Tecnología

- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS + CSS personalizado
- **Gestión de Estado**: Zustand
- **Audio**: Web Audio API
- **Animaciones**: CSS Animations + Framer Motion

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🎯 Experiencia del Usuario

### Fases de Degradación:

1. **Fase 1 (0-10s)**: Funcionamiento aparentemente normal
2. **Fase 2 (10-20s)**: Pequeños retrasos y distorsiones menores
3. **Fase 3 (20-30s)**: Fallos notables en UI y audio
4. **Fase 4 (30-40s)**: Corrupción significativa
5. **Fase 5 (40s+)**: Colapso total de funcionalidad

### Tipos de Fallo:
- **Botones**: Delay, doble clic necesario, texto cambiado
- **Inputs**: Caracteres perdidos, autocorrección errónea
- **Visuales**: Glitches, parpadeo, colores invertidos
- **Audio**: Distorsión, cortes, volumen variable
- **Navegación**: Links rotos, redirecciones falsas

## 🎵 Componente de Audio

El sistema de audio utiliza Web Audio API para crear una melodía que se distorsiona progresivamente:
- **Osciladores**: Generan tonos musicales
- **Filtros**: Reducen frecuencias altas para simular daño
- **Distorsión**: WaveShaperNode con curva personalizada
- **Delay**: Efectos de eco y retraso

## 🎨 Componentes Visuales

### Efectos de Glitch:
- **Barras de colores**: Aparecen aleatoriamente
- **Líneas de escaneo**: Simulan pantalla CRT vieja
- **Corrimiento de colores**: RGB desfasado
- **Ruido estático**: Textura de interferencia

### Degradación Visual:
- **Blur**: Desenfoque progresivo
- **Contraste**: Reducción de contraste
- **Saturación**: Colores que se apagan
- **Hue-rotate**: Cambios de color erráticos

## 📊 Sistema de Fallos

El sistema utiliza un store de Zustand para gestionar:
- **Tiempo transcurrido**: Controla la degradación
- **Nivel de degradación**: 0-100%
- **Fallos activos**: Array de fallos actuales
- **Estado del audio**: Contexto y efectos
- **Progreso de encuesta**: Nunca se completa realmente

## 🎭 Aspectos Performativos

### Net Sound Art:
- **Audio generativo**: Música que evoluciona con el tiempo
- **Performance temporal**: La obra cambia con el tiempo
- **Interacción frustrante**: El usuario se convierte en performer

### Crítica Social:
- **Obsolescencia programada**: Como estrategia de consumo
- **Frustración tecnológica**: Experiencia común del usuario
- **Promesas falsas**: Marketing engañoso en tecnología

## 🔧 Personalización

Puedes ajustar los parámetros en `src/store/obsolescenceStore.ts`:

```typescript
const FAILURE_POINTS = [
  { time: 5000, failures: ['button_delay'] },
  { time: 10000, failures: ['audio_distortion', 'visual_glitch'] },
  { time: 15000, failures: ['input_lag', 'button_unresponsive'] },
  { time: 25000, failures: ['screen_flicker', 'audio_cuts'] },
  { time: 35000, failures: ['navigation_block', 'survey_corruption'] },
  { time: 45000, failures: ['total_breakdown'] }
];
```

## 🎪 Uso en Presentaciones

Para presentaciones artísticas:
1. **Proyector**: Ideal para galerías o espacios de arte
2. **Audio**: Usar altavoces externos para mejor experiencia
3. **Interacción**: Permitir que múltiples usuarios interactúen
4. **Documentación**: Grabar las reacciones de los usuarios

## 📱 Compatibilidad

- **Navegadores modernos**: Chrome, Firefox, Safari, Edge
- **Web Audio API**: Requiere HTTPS para funcionar
- **Responsive**: Adaptable a diferentes tamaños de pantalla

## 🎨 Inspiración

Este proyecto está inspirado en:
- **Net Art**: Obras que existen únicamente en la red
- **Sound Art**: Arte sonoro y música experimental
- **Glitch Art**: Estética de errores digitales
- **Critical Design**: Diseño como herramienta de crítica social

## 📄 Licencia

Este proyecto es una obra de arte conceptual creada para fines educativos y artísticos.

---

**"La tecnología no es neutral"** - Esta obra busca evidenciar cómo los sistemas digitales pueden ser diseñados para fallar, generando frustración y consumo innecesario.
