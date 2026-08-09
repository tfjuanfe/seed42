# Seed42.tech — Especificación de proyecto y sistema de diseño

**Versión:** 1.0
**Fecha:** 9 de agosto de 2026
**Estado:** Diseño aprobado — listo para implementación
**Autor:** Fundador de Seed42.tech

---

## 1. Resumen ejecutivo

Seed42.tech es una plataforma colombiana, gratuita y en español, donde estudiantes de bachillerato aprenden inteligencia artificial construyéndola: diez módulos interactivos de treinta minutos, cada uno con su propio proyecto, más una competencia tipo Kaggle con premios reales y talleres presenciales en colegios.

El proyecto nace inspirado en la IOAI 2026 (Kazajistán) y en los programas de alem.ai, adaptando ese modelo al contexto colombiano.

### 1.1 El problema

Prácticamente toda la educación de calidad en IA para adolescentes está en inglés y asume tres cosas que gran parte de los estudiantes colombianos no tienen: un computador propio, internet estable y exposición previa a programación. Platzi está en español pero es de pago y orientado a adultos. Kaggle Learn es gratuito pero en inglés e intimidante para un principiante.

### 1.2 La cuña

El espacio genuinamente desatendido: **español, apropiado para adolescentes, sin instalación, gratuito.** Esa es la posición que ocupa Seed42.

### 1.3 El nombre

`seed = 42` es la línea de código más repetida en machine learning — la semilla de reproducibilidad. Para alguien del campo es una señal inmediata de pertenencia; para alguien de fuera es simplemente *semilla*, algo que se planta en mentes jóvenes. Doble lectura, corto, memorable.

**Pronunciación oficial:** "sid cuarenta y dos". Debe usarse de forma consistente en talleres, video y redes.

### 1.4 Los tres canales

| Canal | Función | Debilidad que cubre |
|---|---|---|
| Plataforma web | Escala, contenido, competencia | — |
| Talleres presenciales | Retención y confianza | La plataforma sola no retiene |
| Redes sociales | Descubrimiento | Los talleres solos no escalan |

Cada canal compensa la debilidad de los otros. La plataforma es el canal primario; los talleres son la actividad de apoyo; redes documenta lo que ya se está haciendo.

---

## 2. Alcance del MVP

### 2.1 El bucle central

1. El visitante llega y puede probar el primer reto **sin crear cuenta**.
2. Elige un módulo → recibe una explicación breve (2–3 min de lectura, en español, un visual).
3. Resuelve una tarea interactiva **en el navegador**, sin instalación ni configuración.
4. Recibe retroalimentación inmediata más la explicación del *por qué*.
5. Ve su progreso y racha, y es dirigido al siguiente módulo.

### 2.2 Dentro del alcance v1

- 10 módulos completos con un proyecto cada uno
- Autenticación con Google
- Progreso persistente por usuario
- Página de competencia con leaderboard
- Página de talleres para colegios
- Landing page
- Diseño responsive real (móvil primero en el consumo)

### 2.3 Fuera del alcance v1

Contenido generado por usuarios · panel para docentes · certificados · app móvil nativa · multi-idioma · foros · moneda gamificada · videolecciones. Todos son v2 plausibles y v1 fatales.

### 2.4 Métricas que importan

- **Tasa de finalización de módulo** — ¿lo terminan?
- **Retorno a 7 días** — ¿se queda?
- **Conversión taller → sitio** — ¿lo presencial se traduce en digital?

Se ignora deliberadamente el total de registros: es el número que halaga y no informa.

---

## 3. Stack técnico

| Capa | Elección | Razón |
|---|---|---|
| Lenguaje | TypeScript | Definido por el fundador |
| Framework | Next.js (App Router) | Definido por el fundador |
| Hosting | Vercel, plan gratuito | Definido por el fundador |
| Base de datos | PostgreSQL vía **Neon** o **Supabase** | Tier gratuito más generoso que Vercel Postgres y **pooler de conexiones incluido** |
| ORM | Prisma o Drizzle | Con cadena de conexión *pooled* desde el día uno |
| Autenticación | Supabase Auth o Clerk, **solo Google** | Todo estudiante colombiano tiene cuenta Google del colegio. Sin email/contraseña: los flujos de recuperación son una carga de soporte innecesaria |
| Contenido | **MDX en el repositorio** | Versionado, revisable, y permite escribir un módulo nuevo en un editor de texto sin construir un panel de administración |
| Ejecución de código | **Pyodide** (WASM, lado cliente) | Cero costo de backend, sin superficie de seguridad, funciona con funciones frías |
| Visualización | D3 para la matemática, canvas por encima de ~500 puntos | |
| Animación | Framer Motion | |
| Analítica | Vercel Analytics + tabla `events` propia | |

### 3.1 Riesgo crítico: conexiones a la base de datos

Las funciones serverless de Vercel abren una conexión por invocación. **Treinta estudiantes entrando al mismo tiempo en un salón de clase es exactamente el pico que agota el límite de conexiones de un Postgres crudo.** El pooler no es opcional.

### 3.2 La base de datos guarda solo

`users` · `progress` · `submissions` · `events` · `leaderboard`

El contenido de los módulos **nunca** entra a la base de datos.

### 3.3 Requisitos de rendimiento

- Probar el sitio limitado a **Slow 4G** antes del lanzamiento. Ese es el usuario mediano real.
- Pyodide se carga de forma diferida (*lazy*) y solo en los módulos que lo necesitan; advertir sobre el consumo de datos.
- Build estático offline de los primeros tres módulos, transportable en USB, para cuando falle el wifi del colegio (fallará).
- Toda interacción debe responder en **menos de 100 ms**.

---

## 4. Currículo — 10 módulos

Cada módulo dura ~30 minutos y tiene exactamente un proyecto.

| # | Título | Concepto | Proyecto |
|---|---|---|---|
| 01 | ¿Qué es la IA? | Definición y límites | Clasificar 10 ejemplos como IA / no IA y defender el criterio |
| 02 | ¿Para qué sirve la IA? | Aplicaciones reales | Encontrar una aplicación que afecte a Colombia y desglosarla |
| 03 | Los datos son todo | Basura entra, basura sale | Limpiar un CSV colombiano deliberadamente roto |
| 04 | Enseñar con ejemplos | Clasificación supervisada | Etiquetar 30 ítems, entrenar en vivo, ver el modelo fallar en lo que subrepresentaron |
| 05 | La línea que predice | Regresión | Arrastrar una línea sobre precios de vivienda en Bogotá y compararla con la óptima |
| 06 | ¿Cómo sé si mi modelo sirve? | Train/test, métricas | Dados dos modelos con la misma exactitud, decidir cuál es peor y por qué |
| 07 | Sesgo y responsabilidad | Sesgo y consecuencias | Auditar un modelo y proponer una corrección |
| 08 | Redes neuronales sin miedo | Neuronas, capas, pesos | Construir una red que separe un dataset en espiral |
| 09 | La IA que habla | LLMs, tokens, alucinación | Reto de prompting + documentar una alucinación |
| 10 | Tu primera competencia | Pipeline completo | Enviar un baseline real a la competencia antes de salir del módulo |

### 4.1 Notas de currículo

- **Los módulos 03 y 06 son los que se sienten aburridos y los que determinan quién termina la competencia.** Se conservan, pero sus proyectos deben ser los más interactivos del conjunto para compensar.
- **El módulo 09 es el imán de redes sociales.** Debe grabarse y recortarse abundantemente.
- Todos los datasets son colombianos siempre que sea posible: tiempos de transporte en Bogotá, cosechas de café, resultados de la Liga BetPlay, calidad del aire en Medellín. Esto convierte "esto es algo extranjero" en "esto es sobre mi país".
- **Módulo 11 opcional:** *Cómo seguir aprendiendo* — recursos gratuitos en español, ruta IOAI y olimpiadas, programas universitarios en Colombia. Barato de construir, alto valor: convierte un curso terminado en una dirección de vida.

### 4.2 Costo real de contenido

Un reto interactivo de calidad — pedagogía, dataset, lógica de retroalimentación, prueba con estudiantes reales — toma entre **6 y 10 horas**. Doce retos son un semestre de trabajo. No es razón para no hacerlo; es razón para planearlo y no desmoralizarse en la semana 5 cuando se va por el reto cuatro.

---

## 5. Estructura de módulo — el patrón repetido

Cada módulo son 6–10 pantallas con este ritmo fijo:

| Pantalla | Función |
|---|---|
| **1. Gancho** | Un interactivo con instrucción mínima. "Arrastra estos puntos en dos grupos." Sin teoría todavía |
| **2. Revelación** | Nombrar lo que acaban de hacer. "Eso se llama clasificación" |
| **3–5. Construcción** | Interacciones progresivamente más difíciles, cada una introduce **un** elemento nuevo. Texto bajo ~80 palabras por pantalla |
| **6. Romperlo** | Hacer que la cosa falle deliberadamente. Aquí se consolida el aprendizaje; es la pantalla que todos los cursos se saltan |
| **7. Proyecto** | La tarea aplicada, 10–15 min, produce un artefacto |
| **8. Reflexión** | Una pregunta en sus propias palabras + qué viene después |

### 5.1 La lección de Brilliant

El mecanismo real de Brilliant no es "visuales bonitos" — es que **el estudiante manipula algo antes de que se le diga qué significa.** Recibes un control, lo mueves, algo cambia, formas una hipótesis, y *entonces* el texto nombra el concepto que acabas de descubrir. La explicación es la recompensa, no el preámbulo.

Consecuencia práctica: **cada módulo abre con algo que tocar, no con un párrafo que leer.** Si un estudiante puede desplazarse más allá del interactivo sin interactuar, el módulo falló.

Segundo principio a copiar: **una idea por pantalla.** Pantallas cortas, botón de avanzar, sensación constante de progreso. También es diseño de supervivencia móvil.

### 5.2 Reglas invariables

- El esqueleto es **idéntico** en los diez módulos. La consistencia deja que el estudiante deje de aprender la interfaz y empiece a aprender el contenido — y deja que el autor construya un módulo llenando una plantilla en vez de diseñar desde cero.
- Nunca terminar en una pantalla muerta. Siempre una acción siguiente clara.
- El enlace al leaderboard es persistente en la navegación desde el día uno, visible incluso para quien va en el módulo 02. Ver nombres de pares en un tablero es presión aspiracional que arrastra a la gente a través de los módulos intermedios, donde se concentra el abandono.

---

## 6. Interactivos por módulo

El tipo de interacción se ajusta al concepto; no se reutiliza un solo widget en todas partes.

| Módulo | Patrón de interacción |
|---|---|
| 03 Datos | Manipulación directa de tabla. Clic en celda mala, corregir, ver subir un medidor de calidad. Luego entrenar con datos sucios vs. limpios y ver la brecha de exactitud |
| 04 Clasificación | El estudiante como etiquetador. Etiqueta 30 ítems, el modelo entrena en vivo frente a él, y falla en un caso subrepresentado que él mismo creó. El fracaso personal no se olvida |
| 05 Regresión | Línea arrastrable sobre un scatter plot con barra de error en vivo. Su línea vs. la óptima, lado a lado |
| 06 Evaluación | Dos "personalidades" de modelo animadas puestas a prueba con datos no vistos; el sobreajustado colapsa visiblemente. El memorizador vs. el que aprende |
| 07 Sesgo | Un control deslizante que gobierna la representación de un grupo; los resultados cambian a la vista. La consecuencia hecha mecánica |
| 08 Redes | Clon simplificado de TensorFlow Playground. Añadir capa, ver doblarse la frontera de decisión |
| 09 LLMs | Predicción token por token en vivo con barras de probabilidad. Ver la distribución de la siguiente palabra es genuinamente revelador para un adolescente que cree que es magia |

### 6.1 Regla transversal

Todo interactivo debe responder en menos de 100 ms y **debe funcionar con un pulgar.** Si un widget requiere precisión de mouse, se rediseña.

### 6.2 Implementación

Se construyen como un conjunto pequeño de primitivas de React componibles — `<ScatterPlot>`, `<DraggableLine>`, `<LabelingTask>`, `<TrainingViz>` — **no** como diez componentes a medida. Esto es lo que hace barato añadir el módulo 11 después.

---

## 7. Dirección visual aprobada — "Futurista minimalista"

**Opción aprobada: Opción 3.** Referencia: Sapphire UI. Paneles carbón, acento violeta, tarjetas suavemente redondeadas, y una forma iridiscente como única pieza visual central.

La jugada estratégica: **mostrar el producto en la landing page.** Una vista previa del panel de estudiante con el mapa de calor de progreso, para que el visitante vea la cosa que va a recibir.

**El riesgo asumido:** es una estética de dashboard envuelta alrededor de un curso. Solo se mantiene honesta si las superficies de progreso y racha se construyen temprano. **Los dashboards vacíos se leen como humo.**

### 7.1 Tokens de color

#### Modo oscuro (por defecto)

| Token | Hex | Uso |
|---|---|---|
| `--bg` | `#0D0D12` | Fondo de página |
| `--panel` | `#16161D` | Tarjeta en flujo |
| `--sub` | `#1D1D26` | Superficie secundaria, chips |
| `--text` | `#EDEDF2` | Texto principal |
| `--muted` | `#8B8B99` | Texto de apoyo |
| `--border` | `rgba(255,255,255,0.07)` | Filete por defecto |

#### Modo claro

| Token | Hex | Uso |
|---|---|---|
| `--bg` | `#F2F2F6` | Fondo de página |
| `--panel` | `#FFFFFF` | Tarjeta en flujo |
| `--sub` | `#F6F6FA` | Superficie secundaria, chips |
| `--text` | `#16161C` | Texto principal |
| `--muted` | `#61616E` | Texto de apoyo |
| `--border` | `rgba(20,20,28,0.08)` | Filete por defecto |

#### Acentos (ambos modos)

| Token | Hex oscuro | Hex claro | Significado |
|---|---|---|---|
| `--accent` | `#7F77DD` | `#7F77DD` | Violeta. **Solo elementos accionables** |
| `--accent-hover` | `#9A93EA` | `#534AB7` | |
| `--accent-deep` | `#534AB7` | `#534AB7` | Texto violeta sobre fondo claro |
| `--success` | `#5DCAA5` | `#1D9E75` | Correcto, completado |
| `--fail` | `#ED93B1` | `#D4537E` | Las pantallas de "romperlo" y errores |
| `--warn` | `#EF9F27` | `#BA7517` | Advertencia, competencia |

**Regla de acento:** el violeta se reserva para lo que el estudiante puede tocar. Si aparece en decoración, deja de significar algo.

**El modo oscuro es el predeterminado** — es lo que la audiencia espera de cualquier cosa técnica, y hace resaltar las visualizaciones de datos. **Pero el modo claro es de primera clase, no una cortesía:** un videobeam de colegio, un volante impreso y una captura de prensa quieren la versión blanca.

### 7.2 Tipografía

| Rol | Fuente | Notas |
|---|---|---|
| Display + cuerpo | **Geist Sans** (alternativa: Inter) | Una sola grotesca para todo el texto |
| Datos y código | **Geist Mono** (alternativa: JetBrains Mono) | Métricas, código, etiquetas de eje |

Escala:

| Elemento | Tamaño | Peso | Tracking |
|---|---|---|---|
| Display hero | 40px (desktop) / 30px (móvil) | 500 | −0.03em |
| H1 sección | 28px | 500 | −0.025em |
| H2 | 20px | 500 | −0.02em |
| Cuerpo | **17px mínimo** | 400 | 0 |
| Cuerpo secundario | 15px | 400 | 0 |
| Etiqueta / chip | 12.5px | 400 | 0 |
| Métrica grande | 22px | 500 | −0.02em |

**Solo dos pesos: 400 y 500.** Nada más pesado.

**Detalle tipográfico crítico en español:** el español corre aproximadamente 20% más largo que el inglés. Botones, etiquetas y tarjetas se diseñan con ese margen o se pelea con desbordamiento de texto todo el proyecto.

### 7.3 Forma y espacio

| Propiedad | Valor |
|---|---|
| Radio, controles | `9px` |
| Radio, tarjetas | `12px` |
| Radio, paneles | `14px` |
| Radio, contenedor externo | `16px` |
| Borde | `0.5px` — nunca 1px ni 2px |
| Grid de métricas | 4 columnas desktop, 2 móvil, `gap: 11px` |
| Ritmo vertical | rem (1, 1.5, 2) |
| Espaciado interno | px (8, 12, 16, 22) |

### 7.4 Movimiento

Solo con propósito: transiciones entre pantallas, animación en cambios de datos para que el estudiante vea el *cambio* y no solo el resultado, y una celebración sutil al completar módulo. Nada decorativo que se repita en bucle. **Respetar `prefers-reduced-motion` siempre.**

### 7.5 Elemento firma

**El mapa de calor de progreso.** Una rejilla de celdas violetas de intensidad variable que aparece en la landing page, en el panel del estudiante y —simplificada— en el logo. Es la única pieza que se repite en todo el sistema y es lo que hace que se sienta autorado en vez de ensamblado.

---

## 8. Identidad — logo

### 8.1 Marca recomendada

**Monograma 42** — "42" en blanco dentro de un cuadrado superelíptico violeta.

| Propiedad | Valor |
|---|---|
| Contenedor | 104×104, `rx="30"` (≈28.8% del lado) |
| Relleno | `#7F77DD` (violeta) o `#16161C` (mono oscuro) |
| Cifras | 46px, peso 500, `#FFFFFF`, centradas, baseline en y=70 |

**Alternativa viva: Píxel** — la rejilla de celdas que forma un brote. Comparte ADN con el mapa de calor del dashboard, lo que hace que el sistema completo se sienta autorado. **Requiere una variante simplificada de favicon**: eliminar las celdas de baja opacidad y conservar solo las ocho sólidas, porque a 16px se empastan.

*Decisión pendiente del fundador. El resto del sistema funciona con cualquiera de las dos.*

### 8.2 El wordmark hace más trabajo que la marca

`seed42` en la grotesca con tracking cerrado (−0.015em), y `.tech` bajado al gris apagado. Es honestamente el activo más fuerte del lockup. **Si el tiempo aprieta, se lanza solo el wordmark y la marca se añade en septiembre.**

Bajada opcional: *Escuela de IA*, 11px, en `--muted`.

### 8.3 Requisito de una sola tinta

Las guías de taller se fotocopian en blanco y negro y algunos decks de patrocinio necesitan versión mono. Tanto el monograma como Píxel funcionan planos.

### 8.4 Archivos requeridos antes del lanzamiento

- `logo.svg` — marca sola
- `logo-lockup.svg` — horizontal, marca + wordmark
- `logo-512.png` — perfiles sociales
- `favicon.ico` — 32px
- `og-image.png` — **1200×630**

El último es el que todo el mundo olvida y es el que aparece cada vez que alguien comparte el sitio por WhatsApp — que será el canal principal de distribución entre estudiantes.

---

## 9. Voz y redacción

- **Sentence case en todo.** Botones, títulos, pestañas, etiquetas.
- **Sin puntuación terminal** en etiquetas y títulos. El texto de ayuda sí lleva punto.
- **Voz activa, verbo primero.** "Empezar módulo", no "Inicio de módulo".
- **Tuteo.** La audiencia tiene 15–17 años y es alérgica a que le hablen desde arriba. Se le habla como a alguien capaz, no como a un niño.
- Evitar: "simplemente", "fácil", "solo tienes que" — presuponen y condescienden.
- Los errores dicen qué pasó y qué hacer. Sin prefijo "Error:", sin disculpas.
- Las pantallas vacías son una invitación, no una disculpa.

---

## 10. Competencia Kaggle

**Bolsa de premios: 500.000 COP.**

### 10.1 Estructura recomendada

Repartir puramente por puesto (250/150/100) premia a los tres estudiantes que ya sabían Python — que probablemente no es el resultado buscado. Se recomienda apartar una porción para una categoría que premie la misión real:

- Mejor notebook documentado
- Mejor principiante sin experiencia previa en código
- Mejor solución de colegio público

No cuesta nada extra y **cambia quién cree que puede ganar.**

### 10.2 Mecanismo de pago — resolver antes, no el 1 de septiembre

Nequi o Daviplata son lo más simple, pero **para menores de edad se necesita cuenta de acudiente.** Eso se confirma **en el registro**, no al momento de pagar.

Si un patrocinador cubre los premios, tarjetas de regalo o equipo pueden ser más fáciles que efectivo — y un portátil o tablet para un primer lugar que no tiene uno vale más que 250.000 COP, tanto en impacto como en historia.

### 10.3 Ubicación

Leaderboard **nativo en el sitio** para v1. Kaggle exige cuenta, está enteramente en inglés y asume fluidez con notebooks: para un estudiante que acaba de aprender qué es un modelo, es un muro. Kaggle es el destino de graduación para el 5% superior — una aspiración declarada, no una función v1.

---

## 11. Cronograma

### 10–20 de agosto — Construir v1 + beta

- Plataforma funcional con contenido, frontend, y beta abierta
- **Reclutar los 10–15 beta testers ANTES del 10.** Nombres y contactos de WhatsApp listos, para que apenas suba v1 se esté recibiendo retroalimentación y no todavía reclutando
- Mezcla: 2–3 que ya programen, el resto sin ningún antecedente. El grupo sin antecedentes es donde están los hallazgos reales
- **Observar en silencio** a al menos tres de ellos pasar por el módulo 01, con pantalla compartida o presencialmente. Veinte minutos de observación callada revelan más que cualquier formulario
- Preparar los activos de outreach en esta ventana — deck de patrocinio, one-pager para colegios, kit de prensa — para que el 21 empiece enviando, no escribiendo

### 21–30 de agosto — Outreach

- **La competencia se lanza aquí, no después.** Si cierra el 1 de septiembre, los participantes necesitan mínimo una semana. Se anuncia y se abren envíos el 21, de modo que la competencia misma se convierta en la historia que se está vendiendo. Un leaderboard vivo con estudiantes reales es infinitamente más convincente para un periodista o patrocinador que la descripción de un sitio web
- Patrocinios con **pedidos específicos**, no generales: créditos de hosting, premios para el top 3, o financiar un día de taller. "Necesitamos 500.000 COP para premios" recibe un sí mucho más a menudo que "buscamos patrocinio". Prioridad: programas de MinTIC, Ruta N en Medellín, y los brazos de RSE de Bancolombia, Rappi y Grupo Éxito
- **Colegios: contactar docentes directamente** — profesores de tecnología e informática — no administraciones. La administración es un proceso de meses; un docente motivado es un proceso de dos semanas. Ofrecer un taller gratuito de 90 minutos con fecha fija, no una alianza abierta

### 1 de septiembre — Cierre de competencia

Ceremonia de cierre, aunque sea un Instagram Live anunciando ganadores. Crea un momento, le da a la prensa un gancho con fecha, y le da a los participantes algo que compartir — el canal de adquisición más barato que existe. Publicar los notebooks ganadores como material de aprendizaje: contenido gratis que además valida públicamente a los estudiantes.

### 2–30 de septiembre — Outreach y documentación

- **Reencuadrar la documentación como informe público de impacto**, no registro interno: números, citas de estudiantes, capturas, qué funcionó y qué no. Ese único artefacto sirve simultáneamente como pitch de patrocinio, adjunto de prensa, credencial ante colegios y registro propio. Escribirlo sobre la marcha, no al final del mes
- **Prensa colombiana:** sección de tecnología de El Tiempo, cobertura educativa de Semana, La República, medios regionales de Bogotá. El ángulo que aterriza es *"estudiante colombiano construye una escuela de IA gratuita para estudiantes colombianos"*, no "nueva plataforma educativa"
- **Cohorte de egresados:** invitar a los 5–10 participantes más fuertes a co-escribir el módulo 11 o facilitar el siguiente taller. Así el proyecto sobrevive a septiembre sin que el fundador sea su única mano de obra

### Transversal a todo el cronograma

Un changelog público o hilo de *build in public* en Instagram o X, actualizado 2–3 veces por semana. Cuesta diez minutos por publicación, construye audiencia **antes** del lanzamiento en vez de después, y para septiembre existe un arco narrativo documentado que hace que el pitch de prensa se escriba solo.

---

## 12. Sostenibilidad más allá de septiembre

Gratis es lo correcto para el lanzamiento. Las rutas viables en el contexto colombiano:

1. **Talleres pagos a colegios** privados, subsidiando los públicos
2. **Patrocinio corporativo o de fundaciones** — MinTIC, Ruta N, RSE corporativa
3. **Reclutar contribuidores entre los propios estudiantes destacados** — los mejores usuarios se convierten en los creadores de contenido

La tercera es la más elegante y la que mejor resuelve el problema de mano de obra.

---

## 13. Vara de éxito

El listón para "exitoso" aquí es **cincuenta adolescentes colombianos que entiendan IA mejor que antes** — no una plataforma pulida con muchas funciones. Si eso se logra, todo lo demás se sigue.
