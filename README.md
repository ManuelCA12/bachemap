# BacheMap · Mi Asistente de Ubicación

PWA académica que integra **APIs REST** (Práctica 2) y **APIs del dispositivo** (Práctica 3) para reportar baches en Mérida, Yucatán. Funciona como dashboard en escritorio y como app de 4 pantallas en móvil.

## Práctica 2 · Integración y consumo de APIs REST

| Requisito | Implementación |
|---|---|
| PWA + API pública | Clima y pronóstico con **Open-Meteo** (`api.open-meteo.com`). |
| Solicitudes HTTP | `fetch()` con `AbortController` (timeout de 8 s). |
| JSON + tarjetas/tablas/gráficos | Tarjetas de clima, tabla de ficha técnica y **gráfico de barras de 7 días**. |
| Buscador y filtros | Buscador de ciudades (geocoding), buscador de reportes y filtros por estado. |
| Control de errores | Mensajes ante HTTP 400/500, timeout, sin red y sin caché. |
| Caché/almacenamiento local | `localStorage` para clima y geocodificación inversa + Service Worker para el app shell. |
| Postman | `postman_collection.json` con 8 solicitudes y 28 aserciones, listo para Runner/Newman. |

Endpoints principales:

- `GET https://api.open-meteo.com/v1/forecast` → clima actual y pronóstico de 7 días.
- `GET https://geocoding-api.open-meteo.com/v1/search` → buscador de ciudades.
- `GET https://nominatim.openstreetmap.org/reverse?format=jsonv2` → dirección a partir de lat/lng.
- `GET https://tile.openstreetmap.org/{z}/{x}/{y}.png` → tiles de Leaflet.

## Práctica 3 · Integración de APIs del dispositivo

| Requisito | Implementación |
|---|---|
| PWA "Mi Asistente de Ubicación" | Nombre declarado en `manifest.json`; instalable en escritorio y móvil. |
| Geolocalización | `navigator.geolocation.getCurrentPosition()` con confirmación previa. |
| Mapa interactivo | **Leaflet 1.9.4 + OpenStreetMap**, marcadores por severidad y clic para elegir punto. |
| Cámara | `navigator.mediaDevices.getUserMedia()` + respaldo de galería y botón para detener la cámara. |
| IndexedDB | Base `bachemap` / store `reports`: latitud, longitud, dirección, severidad, estado, foto, fecha, votos, `uid`, `folio`, `updatedAt` y `lastDevice`. |
| Diseño adaptable | Breakpoint en 899 px: dashboard de 2 columnas en escritorio, barra inferior y FAB en móvil. |
| Privacidad y permisos | Confirmación de GPS, mensajes de permiso denegado, botón **Borrar todo**, cierre de cámara al salir y control para **desactivar la sincronización**. |
| Sincronización | Dos o más dispositivos con el mismo código de sala comparten reportes en tiempo real mediante el canal público **ntfy.sh** (WebSocket). |

## Cómo ejecutar

La cámara, la geolocalización y el Service Worker requieren **HTTPS** o **localhost**.

```bash
# Opción 1: Python
python -m http.server 8080

# Opción 2: Node
npx serve -l 8080
```

Abrir `http://localhost:8080`.

- **Escritorio:** Chrome/Edge → menú → *Instalar BacheMap* (o botón "Instalar app" cuando aparezca).
- **Móvil:** publicar en GitHub Pages/Netlify/ngrok (HTTPS) e instalar desde el navegador.
- **Offline:** cargar la app una vez con red, luego activar modo avión y recargar. El app shell sale del Service Worker y el clima/geocodificación de `localStorage`.

## Pruebas con Postman

1. Importar `postman_collection.json` en Postman.
2. Ejecutar la colección completa con **Runner** (8 requests, 28 aserciones).
3. Alternativa por CLI:

```bash
npx newman run postman_collection.json \
  -r cli,json,htmlextra \
  --reporter-htmlextra-export evidencias/postman/postman-report.html
```

La colección incluye pruebas de éxito, CORS, tipos de datos, longitud del pronóstico, errores 400 y disponibilidad de tiles.

## Estructura del proyecto

```
bachemap/
├── index.html
├── style.css
├── app.js
├── sw.js
├── manifest.json
├── icon.svg
├── icon-192.png
├── icon-512.png
├── postman_collection.json
├── README.md
├── REPORTE_PRUEBAS.md
└── evidencias/
    ├── capturas/
    ├── video/
    ├── postman/
    └── lighthouse/
```

## Evidencias incluidas en la entrega

- `evidencias/capturas/` → dashboard, buscador, filtros, gráfico, GPS, mapa, cámara, foto, IndexedDB, offline, permisos denegados, responsive y Postman.
- `evidencias/video/` → video demostrativo del flujo completo.
- `evidencias/postman/` → reporte HTML/JSON de Newman y captura del resumen.
- `REPORTE_PRUEBAS.md` → matriz de pruebas en dos dispositivos (escritorio y móvil).

## Sincronización entre dispositivos

La app no tiene backend propio: usa **ntfy.sh** como canal de mensajes público y sin registro. Para compartir reportes entre un celular y una computadora:

1. Abre la app en ambos dispositivos y entra a **Explorador de Reportes → ⚙ Sala**.
2. Escribe el **mismo código de sala** en los dos (por defecto `manuelca12`).
3. Los reportes nuevos, votos, cambios de estado y borrados se propagan por WebSocket en segundos. El botón **🔄 Sincronizar ahora** reenvía los reportes creados en ese dispositivo y **☁ Desactivar** apaga la sincronización.

Detalles técnicos:

- Topic: `bachemap-<sala>` en `https://ntfy.sh` (retención aproximada de 12 horas).
- Cada reporte viaja como JSON de menos de 4 KB con `uid`, `folio`, `updatedAt` y `lastDevice`; el merge es *last-write-wins*.
- La foto original permanece en IndexedDB del dispositivo que creó el reporte; a los demás se envía solo una **miniatura JPEG**.
- Los reportes de ejemplo (`seed`) no se publican y el borrado masivo publica *tombstones* para eliminar los reportes sincronizados.
- El canal es público: cualquiera que conozca el código de sala puede leer los mensajes. No uses datos personales sensibles.

## Privacidad

Los reportes, fotos y coordenadas se guardan en el dispositivo mediante IndexedDB. Con la sincronización activa, el reporte (sin la foto original, solo una miniatura) y las coordenadas se envían al canal público de ntfy.sh identificado por el código de sala; el usuario puede desactivarla o cambiar de sala en *Explorador de Reportes*. El botón **Borrar todo** elimina la base local y notifica el borrado a los demás dispositivos sincronizados.
