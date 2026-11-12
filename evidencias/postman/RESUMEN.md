# Evidencia Postman / Newman — BacheMap

**Resultado global:** 8 requests, 28 aserciones, 0 fallos.  
**Colección:** `postman_collection.json`  
**Reporte HTML:** `postman-report.html`  
**Resultado JSON:** `postman-results.json`

## Solicitudes ejecutadas

| # | Solicitud | Método | URL | Estado | Tiempo (ms) | Aserciones |
|---:|---|---|---|---:|---:|---:|
| 1 | Clima actual + pronóstico 7 días | GET | `https://api.open-meteo.com/v1/forecast?latitude=20.9674&longitude=-89.5926&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=7&timezone=auto` | 200 | 961 | 7 |
| 2 | Clima por ciudad (Cancún) | GET | `https://api.open-meteo.com/v1/forecast?latitude=21.1619&longitude=-86.8515&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto` | 200 | 206 | 3 |
| 3 | Buscar Mérida | GET | `https://geocoding-api.open-meteo.com/v1/search?name=Merida&count=5&language=es` | 200 | 1729 | 4 |
| 4 | Búsqueda sin resultados | GET | `https://geocoding-api.open-meteo.com/v1/search?name=zzzzzz&count=5&language=es` | 200 | 548 | 2 |
| 5 | Dirección a partir de lat/lng | GET | `https://nominatim.openstreetmap.org/reverse?format=jsonv2&accept-language=es&lat=20.9674&lon=-89.5926` | 200 | 851 | 5 |
| 6 | Tile del mapa disponible | GET | `https://tile.openstreetmap.org/0/0/0.png` | 200 | 1631 | 2 |
| 7 | Latitud inválida (999) | GET | `https://api.open-meteo.com/v1/forecast?latitude=999&longitude=0&current=temperature_2m` | 400 | 120 | 3 |
| 8 | Geocodificación sin parámetro name | GET | `https://geocoding-api.open-meteo.com/v1/search?count=5&language=es` | 400 | 213 | 2 |

## Reproducción

```powershell
npm install -g newman newman-reporter-htmlextra
# Ejecutar desde la carpeta del proyecto:
npx newman run postman_collection.json --reporters cli,json,htmlextra --reporter-json-export evidencias/postman/postman-results.json --reporter-htmlextra-export evidencias/postman/postman-report.html
```

> Open-Meteo puede tardar más en la primera solicitud por arranque en frío; la aserción de tiempo se fijó en < 10 s. Las pruebas de CORS usan `format=jsonv2` en Nominatim porque `format=json` no devuelve cabeceras CORS.
