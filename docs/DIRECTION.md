# SCULPTED BY AIR — Dirección de experiencia

Proyecto personal (portfolio). No oficial, sin afiliación con Porsche AG.
Modelo 3D: «Porsche GT3 RS» de Black Snow (Sketchfab), CC BY 4.0.

## 1. Concepto y narrativa

**Idea visual en una frase:** el coche se presenta como una escultura que el aire ha tallado; la luz de estudio revela la forma y las líneas de flujo explican por qué esa forma existe.

Recorrido (el scroll es la cámara):

| Capítulo | Escena | Qué entiende el usuario |
|---|---|---|
| CAR | Hero | Una línea de luz revela una silueta y después un objeto físico en un estudio. |
| FORM | Every line has a reason | Cada abertura tiene un trabajo: splitter, nostrils del radiador central, lamas de las aletas, techo de CFRP, alerón por encima del techo. |
| AERODYNAMICS | Sculpted by air | El aire entra, recorre la carrocería, pasa por debajo, rodea el alerón y sale desviado hacia arriba. |
| DOWNFORCE | Air becomes grip | El alerón (cuello de cisne, elemento superior con DRS) convierte ese desvío en apoyo: 409 kg a 200 km/h, 860 kg a 285 km/h. |
| DETAIL | Controlled at every corner + macros | Freno real del modelo (pinza fija, disco y llanta girando) y una sucesión de macros con barrido de luz. |
| CONTROL | Built around the driver | La cámara entra por la ventanilla: volante, relojes, asientos. Ritmo lento. |
| ENGINEERING | Exploded + vista técnica | Siete capas separadas con orden; después la carrocería se vuelve rayos X. Aviso explícito: la mecánica del modelo es ilustrativa. |
| THE MACHINE | Cifras → silencio → reconstrucción | Cifras verificadas, silencio, y las piezas vuelven exactamente a su sitio. Último plano: coche, negro, luz lateral, claim. |

**Decisión de orden:** la cabina (CONTROL) va antes de la exploded view. La cámara necesita el coche montado para entrar por la ventanilla, y así el estado despiezado se mantiene de forma continua desde ENGINEERING hasta la reconstrucción final, sin "re-explotar" el coche a escondidas.

## 2. Arquitectura de página (escritorio / móvil, en alturas de viewport)

| Sección | Desktop | Móvil | Sticky |
|---|---|---|---|
| Hero (intro por tiempo + salida por scroll) | 160 | 130 | sí |
| Form | 450 | 300 | sí |
| Aerodynamics | 350 | 240 | sí |
| Wing | 280 | 190 | sí |
| Wheels & brakes | 300 | 200 | sí |
| Macro | 420 | 260 | sí |
| Cockpit | 350 | 230 | sí |
| Exploded + Technical | 360 + 260 | 240 + 170 | sí |
| Numbers (5 cifras) | 5 × 100 | 5 × 90 | no (flujo) |
| Control | 220 | 160 | sí |
| Final | 300 | 200 | sí |

Un único `<canvas>` fijo a pantalla completa detrás del HTML. El HTML define el ritmo (alturas) y contiene todo el texto.

## 3. Motion Map

```
HERO         → negro → línea de luz (tira emisiva 3D) → silueta (solo contraluz) → carrocería (entorno de estudio)
               → detalles (faros, luz principal) → identidad (PORSCHE / 911 GT3 RS) → claim + EXPLORE
               Interacción principal: la propia revelación; el scroll inicia el avance de cámara.
FORM         → sticky, 6 capítulos de cámara: frontal → nostrils → paso de rueda → techo → perfil → cenital
               Anotaciones proyectadas (punto + guía) SOLO sobre la pieza que explica el texto.
               Perfil: línea horizontal a la altura del techo para demostrar que el alerón queda por encima.
AERO         → perfil lateral bajo; 12 líneas de flujo derivadas de la geometría real se dibujan de morro a cola.
               "Downforce changes everything": flechas de carga sobre eje delantero y alerón crecen 409 → 860 kg.
WING         → cámara se acerca; alerón sube 3 cm (cuellos de cisne se estiran), elemento superior se aplana (DRS),
               líneas de flujo siguen rodeando el ala a baja opacidad.
WHEELS       → rueda delantera izquierda real: llanta+neumático+disco giran con el scroll, pinza fija;
               llanta y neumático se separan 30 cm por el eje para revelar disco y pinza; macro del freno.
MACRO        → faro → nostrils → carbono del techo → escape. La cámara se retira y vuelve a acercarse entre planos
               (no hay cortes); barrido de luz por plano; teleobjetivo (FOV 22–26) para compresión de macro.
COCKPIT      → exterior ventanilla → interior → volante → relojes → asiento. Luz baja y cálida, sin rotaciones bruscas.
EXPLODED     → cámara fija; 7 grupos se separan en orden (cristal, carrocería, aero, ruedas, interior, chasis, mecánica).
TECHNICAL    → cristal, carrocería e interior pasan a rayos X (fresnel); chasis, ruedas y aero quedan sólidos.
NUMBERS      → canvas casi negro; cada cifra entra por máscara + tracking; el contexto aparece después.
CONTROL      → coche despiezado inmóvil, alineado en alzado lateral; luz muy baja. Silencio.
FINAL        → reconstrucción en orden inverso (mecánica → … → cristal); cámara a plano lateral bajo con luz lateral; claim + EXPLORE.

TRANSICIONES
hero → form       : la cámara gira hacia el frontal puro mientras el claim sale por arriba.
form → aero       : de cenital desciende al perfil lateral; la vista en planta "aterriza" en el plano del aire.
aero → wing       : las líneas que rodean el alerón guían la cámara hacia él.
wing → wheels     : la cámara baja por el costado siguiendo el flujo lateral hasta la rueda delantera.
wheels → macro    : la llanta vuelve a su sitio y la cámara sube al faro, la pieza más cercana.
macro → cockpit   : del escape la cámara recorre el costado hasta la ventanilla del conductor.
cockpit → exploded: sale por la ventanilla y se aleja hasta el plano general; el coche se abre.
exploded → tech   : las capas exteriores se vuelven transparentes; la arquitectura queda dentro de su silueta.
tech → numbers    : la escena se apaga hasta casi negro; las cifras ocupan su lugar.
numbers → control : vuelve una luz mínima sobre el conjunto despiezado.
control → final   : las piezas regresan; la luz lateral dibuja el coche completo.
```

**DESKTOP MOTION:** todo lo anterior, 12 líneas de flujo, anotaciones con guía, cursor y botón magnético, DPR ≤ 2.

**MOBILE MOTION (no es escritorio reducido):**
- Escenas sticky ~30–35 % más cortas.
- Cámaras con más distancia y encuadre vertical (ajuste por relación de aspecto).
- 6 líneas de flujo más gruesas.
- Macros reducidas a 3 planos.
- Sin cursor ni magnetismo, con respuesta táctil (`:active`).
- DPR ≤ 1,5.
- Textos anclados abajo para no tapar el coche.

**REDUCED MOTION:** sin scrub de cámara. Cada sección corta (fundido de 0,4 s) a su plano representativo y estático; sin giro de ruedas, sin flujo animado (líneas dibujadas y quietas), sin intro larga (estado final inmediato), revelados de texto por fundido simple.

## 4. Motion budget

| Hueco | Asignado a |
|---|---|
| 1 gran interacción hero | Revelado de luz: línea → silueta → carrocería |
| 1 sistema principal | Timeline maestra única de cámara + estado del coche ligada al scroll |
| Sistemas secundarios (4) | Líneas de flujo · anotaciones proyectadas · rig de alerón/ruedas · exploded/rayos X |
| Microinteracciones | EXPLORE magnético (Motion), foco visible, indicador de capítulo |
| Ambiental | Ninguno perceptible: solo el movimiento de las líneas de flujo dentro de su escena |

Descartado por presupuesto: profundidad de campo por posprocesado, partículas decorativas, parallax de capas DOM y Lenis.

## 5. Decisiones tecnológicas

- **React 19 + Vite 8:** SPA de una página; build estático y división de código para cargar el 3D aparte.
- **three r186 + @react-three/fiber 9:** modelo, cámara, luces, materiales. Solo R3F escribe transforms 3D.
- **GSAP 3.15 + ScrollTrigger + SplitText (@gsap/react):** una timeline maestra con scrub anima un objeto de estado plano (no toca Three). Timelines DOM por escena para el texto.
- **Motion 14:** solo microinteracción (MagneticButton) y cambio de etiqueta de capítulo (AnimatePresence) en elementos interiores que GSAP no toca.
- **meshoptimizer + gltf-transform:** compresión del GLB sin `join`/`flatten`.
- **Fuentes:** Archivo variable (eje `wdth` para titulares expandidos) + Inter. Alojadas localmente (OFL).

Regla de propiedad: GSAP → objeto `director` y opacidad/transform de texto DOM; R3F → todo lo 3D y la capa de anotaciones proyectadas; Motion → hijos interiores de botones/etiquetas.

## 6. Responsive

Anchos comprobados: 375, 390, 768, 1280, 1440 y 1920 px. `overflow-x: clip` en `html`, tipografía con `clamp()`. La cámara compensa el aspecto vertical alejándose (`fit`). En móvil los textos sticky se anclan al tercio inferior y el coche ocupa el superior.

## 7. Accesibilidad

- Un único `h1` (hero) y `h2` por escena.
- Todo el texto vive en HTML real; el canvas lleva `aria-hidden` y las anotaciones proyectadas son `aria-hidden` porque su contenido está en los subtítulos.
- Skip link, foco visible de 2 px, contraste ≥ 4,5:1 (texto secundario #9a9ea5 sobre #050506 ≈ 7,6:1).
- Póster con `alt`. Sin JS el contenido se lee completo (los estados ocultos solo se aplican bajo `.js`).

## 8. Rendimiento y niveles

- **FULL:** experiencia completa, DPR [1, 2].
- **LITE (táctil):** DPR [1, 1,5], 6 líneas de flujo, cámaras simplificadas, sin cursor.
- **STATIC-LITE (dispositivo débil / save-data):** sin WebGL; póster + texto.
- **STATIC (reduced motion):** WebGL con cortes de plano, sin scrub.

`frameloop="demand"`: solo se renderiza cuando cambia el estado del director o hay flujo visible. Se pausa con la pestaña oculta y cuando el canvas está apagado (cifras). El 3D se importa de forma diferida tras el primer pintado, con póster estático debajo. GLB: 19,3 MB → 2,6 MB (meshopt + WebP), 374 nodos conservados.

## 9. Datos verificados (fuentes: Porsche Newsroom, ver `src/content/story.js`)

525 PS (386 kW) · 9.000 rpm · bóxer atmosférico de 4,0 l · PDK de 7 velocidades · 0–100 km/h en 3,2 s · 296 km/h · 1.450 kg (DIN) · 409 kg de carga aerodinámica a 200 km/h y 860 kg a 285 km/h · frenos de 408 mm con 6 pistones delante y 380 mm con 4 pistones detrás · neumáticos 275/35 R20 y 335/30 R21 · CFRP en puertas, aletas delanteras, techo y capó · DRS con elemento superior hidráulico · borde superior del alerón por encima del techo · radiador central con nostrils en el capó · lamas en las aletas delanteras · volante con 4 mandos giratorios y botón DRS.

> El ejemplo del brief («500 PS») no corresponde al 992: la cifra oficial es 525 PS.
