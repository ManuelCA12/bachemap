# Reporte de pruebas · BacheMap (Prácticas 2 y 3)

**Proyecto:** BacheMap · Mi Asistente de Ubicación  
**Fecha de ejecución:** 11 de noviembre de 2026  
**Servidor local:** `http://localhost:8141` (capturas/videos) y `http://localhost:8142` (Lighthouse)  
**APIs validadas:** Open-Meteo (clima y geocoding), Nominatim (geocodificación inversa), OpenStreetMap (tiles).

---

## 1. Dispositivos y entorno de prueba

| Dispositivo | Entorno | Pantalla | Navegador | Modo |
|---|---|---|---|---|
| **Dispositivo 1 · PC de escritorio** | Windows 11 Home Single Language 10.0.26300 (equipo 83JE) | 1440 × 900 | Google Chrome 157.0.8103.78 | Ventana de escritorio |
| **Dispositivo 2 · Teléfono móvil** | Emulación Chrome DevTools (Pixel 5) | 390 × 844, DPR 2, táctil | Google Chrome 157.0.8103.78 | Emulación móvil |
| **Dispositivo adicional · Tableta** | Emulación Chrome DevTools | 768 × 1024, DPR 2, táctil | Google Chrome 157.0.8103.78 | Emulación tableta |

> **Nota metodológica:** no había un teléfono físico conectado por USB/ADB al equipo, por lo que el segundo dispositivo se validó con emulación de viewport, densidad de píxeles, eventos táctiles y user-agent móvil de Chrome DevTools. La app usa las mismas APIs web (`geolocation`, `getUserMedia`, IndexedDB, Service Worker) que se ejecutan en un teléfono real; para una prueba física solo se requiere publicar la app por **HTTPS**.

---

## 2. Resultados globales

| Área | Resultado |
|---|---|
| Práctica 2 · APIs REST | **100 % de pruebas funcionales aprobadas** |
| Práctica 3 · APIs del dispositivo | **100 % de pruebas funcionales aprobadas** |
| Postman / Newman | **8 requests · 28 aserciones · 0 fallos** |
| Lighthouse PWA | **Puntuación PWA 1.0 (100)** · instalable |
| Capturas de evidencia | 29 capturas |
| Videos | `demo-escritorio.mp4` (1:13) y `demo-movil.mp4` (0:34) |

---

## 3. Práctica 2 · Pruebas de APIs REST

| ID | Prueba | Resultado esperado | Resultado obtenido | Evidencia |
|---|---|---|---|---|
| P2-01 | Carga del dashboard y consumo de Open-Meteo | Tarjetas de clima con temperatura, humedad, viento y lluvia | **Aprobado**: clima de Mérida visible; 20 tiles y 3 marcadores | `capturas/p2-01-dashboard-clima-grafico.png` |
| P2-02 | Buscador de ciudades (geocoding) | Resultados de la API para “Cancún” | **Aprobado**: se muestran botones con ciudades encontradas | `capturas/p2-02-buscador-ciudades.png` |
| P2-03 | Selección de ciudad | Clima y pronóstico de la ciudad elegida | **Aprobado**: banner actualizado a “Cancún” | `capturas/p2-03-clima-ciudad-seleccionada.png` |
| P2-04 | Gráfico de pronóstico | 7 columnas con temperatura máxima y probabilidad de lluvia | **Aprobado**: 7 columnas renderizadas | `capturas/p2-01-dashboard-clima-grafico.png` |
| P2-05 | Explorador de reportes | Tarjetas con foto, severidad, estado y folio | **Aprobado**: 3 reportes semilla | `capturas/p2-04-reportes-filtros.png` |
| P2-06 | Filtro por estado “Reparado” | Solo reportes reparados | **Aprobado**: 1 tarjeta visible | `capturas/p2-05-filtro-reparado.png` |
| P2-07 | Búsqueda de texto “Montejo” | Reportes que coinciden con calle/folio/colonia | **Aprobado**: 1 tarjeta visible | `capturas/p2-06-busqueda-texto.png` |
| P2-08 | Detalle del reporte | Folio, ficha técnica, trazabilidad y foto | **Aprobado** | `capturas/p2-07-detalle-reporte.png` |
| P2-09 | Servicio no disponible | Mensaje de error sin romper la app | **Aprobado**: “Servicio de clima no disponible y sin datos en caché” | `capturas/p2-08-error-servicio-api.png` |
| P2-10 | Sin conexión con caché | App shell desde Service Worker y clima desde `localStorage` | **Aprobado**: banner con “⚠ caché del …”, chip “Offline (IndexedDB)” y 20 tiles | `capturas/p2-09-offline-cache.png` |
| P2-11 | Validación Postman | Todas las solicitudes y aserciones correctas | **Aprobado**: 8 requests, 28/28 aserciones | `postman/postman-report.html`, `postman/postman-results.json`, `capturas/p2-10-postman-resumen.png` |
| P2-12 | Instalabilidad PWA | Manifest, Service Worker, splash, icono maskable y viewport | **Aprobado**: Lighthouse PWA 1.0 | `lighthouse/lighthouse-pwa.html`, `capturas/p2-12-lighthouse-pwa.png` |

### Detalle de la colección Postman

| # | Request | Aserciones |
|---|---|---|
| 1 | Clima actual + pronóstico 7 días | 200, JSON, CORS, tiempo, `current`, `daily` de 7 días, unidades °C |
| 2 | Clima por ciudad (Cancún) | 200, `current`, `timezone` |
| 3 | Buscar Mérida | 200, arreglo `results`, coordenadas/país, Mérida presente |
| 4 | Búsqueda sin resultados | 200 y `results` ausente/vacío |
| 5 | Geolocalización inversa (Nominatim) | 200, JSON, `display_name`, `address`, coordenadas cercanas |
| 6 | Tile de OpenStreetMap | 200, `image/png` |
| 7 | Latitud inválida (999) | 400, `error: true`, `reason` |
| 8 | Geocoding sin `name` | 400, `error: true` |

**Resumen Newman:** `requests 8 / 0 fallos`, `assertions 28 / 0 fallos`, duración total 6.9 s, tiempo promedio 782 ms.

---

## 4. Práctica 3 · Pruebas de APIs del dispositivo

| ID | Prueba | Resultado esperado | Resultado obtenido | Evidencia |
|---|---|---|---|---|
| P3-01 | Formulario de captura y estado de permisos | Muestra ubicación/cámara y aviso de privacidad | **Aprobado**: “Ubicación: granted · Cámara: denied” en entorno automatizado | `capturas/p3-01-formulario-permisos.png` |
| P3-02 | Geolocalización con autorización | Coordenadas y precisión | **Aprobado**: ±12 m, 20.97030, -89.62380 | `capturas/p3-02-geolocalizacion-gps.png` |
| P3-03 | Geocodificación inversa | Dirección legible | **Aprobado**: “Calle 62, Centro, Mérida” | `capturas/p3-02-geolocalizacion-gps.png` |
| P3-04 | Mapa Leaflet + OpenStreetMap | Tiles, marcadores y marcador de usuario | **Aprobado**: mapa interactivo con GPS | `capturas/p3-03-mapa-leaflet-gps.png` |
| P3-05 | Cámara del dispositivo | Vista en vivo con `getUserMedia()` | **Aprobado**: video activo y botón “Detener cámara” | `capturas/p3-04-camara-dispositivo.png` |
| P3-06 | Captura de fotografía | Imagen JPEG en pantalla | **Aprobado**: foto capturada y optimizada | `capturas/p3-05-fotografia-capturada.png` |
| P3-07 | Guardar reporte con GPS + foto | Registro persistido en IndexedDB | **Aprobado**: 4 registros, 0.55 MB usados | `capturas/p3-06-reporte-guardado.png`, `capturas/p3-09-indexeddb-registros.png` |
| P3-08 | Reporte visible en el explorador | Tarjeta con foto y datos | **Aprobado** | `capturas/p3-07-reportes-con-foto.png` |
| P3-09 | Detalle del reporte con foto | Ficha + foto + botón “Ver en mapa” | **Aprobado** | `capturas/p3-08-detalle-reporte.png` |
| P3-10 | Permiso de ubicación denegado | Mensaje claro y alternativa de punto manual | **Aprobado**: “Permiso de ubicación denegado…” | `capturas/p3-10-permiso-gps-denegado.png` |
| P3-11 | Permiso de cámara denegado | Mensaje claro y alternativa de galería | **Aprobado**: “Permiso de cámara denegado…” | `capturas/p3-11-permiso-camara-denegado.png` |
| P3-12 | Responsive móvil | Barra inferior, FAB, sin scroll horizontal | **Aprobado**: `nav.top` oculto, `nav.bot` visible, sin overflow | `capturas/p3-12-responsive-movil-dashboard.png` a `p3-14` |
| P3-13 | Responsive tableta | Layout adaptable | **Aprobado** | `capturas/p3-15-responsive-tablet.png` |
| P3-14 | Responsive escritorio | Dashboard de 2 columnas | **Aprobado** | `capturas/p3-16-responsive-escritorio.png` |
| P3-15 | Privacidad y borrado | Confirmación y eliminación de datos locales | **Aprobado**: botón “Borrar todos mis datos” con confirmación | `capturas/p2-04-reportes-filtros.png` |

### Matriz por dispositivo

| Prueba | PC escritorio (Chrome 1440×900) | Móvil emulado (390×844) | Tableta emulada (768×1024) |
|---|---|---|---|
| Dashboard + clima API | ✅ | ✅ | ✅ |
| Buscador + filtros | ✅ | ✅ | ✅ |
| Gráfico 7 días | ✅ | ✅ | ✅ |
| GPS | ✅ (coordenadas simuladas por Playwright) | ✅ (coordenadas simuladas) | ✅ |
| Cámara | ✅ (video de prueba Y4M) | ✅ (video de prueba Y4M) | ✅ |
| IndexedDB + foto | ✅ | ✅ | ✅ |
| Offline / caché | ✅ | ✅ | ✅ |
| Permisos denegados | ✅ | ✅ | ✅ |
| Sin overflow horizontal | ✅ | ✅ | ✅ |

---

## 5. Evidencias

```
evidencias/
├── capturas/          29 capturas PNG
├── video/
│   ├── demo-escritorio.mp4   (1:13)
│   ├── demo-escritorio.webm
│   ├── demo-movil.mp4        (0:34)
│   └── demo-movil.webm
├── postman/
│   ├── postman-report.html
│   ├── postman-results.json
│   └── RESUMEN.md
├── lighthouse/
│   ├── lighthouse-pwa.html
│   └── lighthouse-pwa.json
└── pruebas-automatizadas.json
```

---

## 6. Observaciones y limitaciones

1. **HTTPS:** la cámara, la geolocalización y el Service Worker requieren contexto seguro. En escritorio se probó con `localhost`; en un teléfono físico debe publicarse por HTTPS (GitHub Pages, Netlify, ngrok, etc.).
2. **Datos simulados:** en la automatización se usó geolocalización de Playwright y un video Y4M de prueba como cámara. En un dispositivo real el navegador solicita los permisos al usuario y la app maneja tanto la autorización como la denegación.
3. **Open-Meteo:** la primera solicitud puede tardar más por arranque en frío (se observó hasta 6.6 s); la aserción de Postman se fijó en < 10 s y el resto de mediciones quedó por debajo de 2 s.
4. **Nominatim:** se usa `format=jsonv2`, `accept-language=es` y caché en `localStorage`; se respeta el uso académico y se evita el envío masivo de solicitudes.
5. **Sin backend:** los reportes, fotos y coordenadas se guardan solo en IndexedDB. No se envían datos personales a ningún servidor; el botón “Borrar todos mis datos” elimina la base local y el caché.
6. **Caché offline:** el Service Worker cachea el app shell y Leaflet; Open-Meteo y Nominatim se cachean en `localStorage`. Si no hay caché previa, la app muestra un mensaje de error controlado.

---

## 7. Conclusión

La PWA cumple los entregables de ambas prácticas: consume APIs REST con `fetch()`, procesa JSON, presenta tarjetas/tabla/gráfico, incluye buscador y filtros, maneja errores y caché offline, y valida las APIs con Postman/Newman. Además integra geolocalización, mapa Leaflet/OpenStreetMap, cámara, IndexedDB, diseño adaptable y controles de privacidad. Las 29 capturas, los dos videos y los reportes de Postman/Lighthouse respaldan la ejecución en escritorio y en viewport móvil/tableta.
