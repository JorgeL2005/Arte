## Objetivo
- Extender la experiencia a ~4 minutos (configurable 3–5 min).
- Ampliar la encuesta a mínimo 15 preguntas con navegación y degradación progresiva.
- Añadir un botón de "Reiniciar experiencia" tras el fallo total.

## Duración y degradación
- Introducir `EXPERIENCE_DURATION_MS` (por defecto `240000`) en `src/store/obsolescenceStore.ts` y usarlo para calcular `degradationLevel` con `timeElapsed / EXPERIENCE_DURATION_MS * 100`.
- Reescalar `FAILURE_POINTS` para ritmo lento, por ejemplo:
  - `30000 ms`: `['button_delay']`
  - `60000 ms`: `['audio_distortion','visual_glitch']`
  - `90000 ms`: `['input_lag','button_unresponsive']`
  - `135000 ms`: `['screen_flicker','audio_cuts']`
  - `180000 ms`: `['navigation_block','survey_corruption']`
  - `240000 ms`: `['total_breakdown']`
- Mantener el intervalo del hook `src/hooks/useObsolescenceTimer.ts` en `100 ms`; no requiere cambio, la progresión será más lenta por la nueva escala.
- Ajustar umbrales visuales (glitch/overlay) para que reaccionen en fases altas (ej. `glitchIntensity > 0.6` y overlay de actualización sólo en fases > 70%).

## Encuesta (15+ preguntas)
- Refactorizar `src/components/SurveyComponent.tsx` para usar un arreglo de `questions[]` con ≥15 entradas (texto, número, email, select, checkbox, slider, Likert).
- Mantener navegación `prev/next`, `surveyProgress` y degradación del input (lag, corrupción de texto, opciones alteradas) ya implementadas.
- Asegurar que el envío continúa prometiendo la recompensa (`rewardPromised`) pero no se concreta, conservando la lógica de fallo de `navigation` crítica.
- Mejorar feedback visual: barra de progreso clara, mensajes degradados dinámicos según `degradationLevel`.

## Botón de reinicio
- Usar la acción existente `reset()` del store `src/store/obsolescenceStore.ts` para restaurar estado.
- En `src/components/ObsolescenceArt.tsx`, cuando `degradationLevel >= 100` o exista `activeFailures` con `type: 'total_breakdown'`, renderizar un botón `Reiniciar experiencia`.
- Al hacer clic: `reset()`, re‑inicializar el audio (`setAudioPlaying(false)` y re‑arranque controlado al montar) y llamar `startTimer()`.

## Audio/visual coherentes
- `src/components/AudioManager.tsx`: el mapeo actual usa `distortionLevel` del store; quedará naturalmente más lento con la nueva escala. Verificar que cortes aleatorios (>0.7) no sean demasiado frecuentes; reducir probabilidad si fuese necesario.
- `src/components/VisualDegradation.tsx`: mantener efectos (scanlines, color bars, static). Si fuese demasiado agresivo, reescalar intensidad con `glitchIntensity` actualizado.

## Verificación
- Ejecutar `npm run dev` y comprobar:
  - La experiencia dura ~4 min antes del colapso total.
  - La encuesta muestra ≥15 preguntas, navega correctamente y nunca entrega la recompensa.
  - El botón de reinicio aparece al fallo total y reinicia todo (tiempo, audio, fallos, visuales).
  - Overlays y glitches aparecen en fases altas y no saturan al inicio.

## Entregables
- Actualización de `obsolescenceStore.ts`, `SurveyComponent.tsx`, `ObsolescenceArt.tsx` y ajustes menores en `AudioManager.tsx`/`VisualDegradation.tsx` si aplica.
- Sin nuevas dependencias ni archivos externos; todo dentro del proyecto existente.