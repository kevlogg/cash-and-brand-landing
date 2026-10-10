# 📹 Web Reel Recorder (Instagram Reels & Stories 9:16 Video Automator)

Proyecto autónomo en Node.js y Puppeteer para automatizar la grabación de pantalla en formato video MP4 de páginas web con scroll vertical suave (Smooth Scroll), optimizado para publicar directamente como Reels o Stories de Instagram.

---

## 🚀 Características

- 📱 **Formato Vertical Optimizado (9:16):** Viewport por defecto de 1080x1920 px con emulación de dispositivo móvil (Touch y User-Agent móvil).
- 📜 **Scroll Vertical Suave (Smooth Scroll):** Algoritmo interno por `requestAnimationFrame` que simula desplazamiento continuo y activa efectos CSS, animaciones e imágenes en *lazy-loading*.
- ⚙️ **Configuración Flexible:** Personalizable mediante argumentos por consola (CLI) o archivo de entorno `.env`.
- 🎥 **Exportación Directa a MP4:** Grabación nativa sin requerir instalación manual de programas externos (incluye binaries integrados mediante `ffmpeg-static`).
- ⏱️ **Tiempos y Esperas Configurables:** Permite definir la duración total del video (velocidad del scroll) y el tiempo de espera inicial para la carga completa de assets/tipografías.

---

## 📁 Estructura del Proyecto

```text
scratch/development/
├── package.json          # Dependencias y scripts de npm
├── .env.example          # Plantilla de variables de entorno
├── .env                  # Configuración local por defecto
├── README.md             # Guía explicativa de uso
├── index.js              # Script principal CLI
├── test-record.js        # Script de prueba automatizada end-to-end
├── src/
│   ├── config.js         # Lógica de lectura de CLI y variables .env
│   ├── recorder.js       # Motor de grabación y navegación Puppeteer
│   ├── scroller.js       # Algoritmo de scroll vertical suave en navegador
│   └── utils.js          # Helpers para manejo de archivos y fechas
└── output/               # Carpeta destino de los videos MP4 generados
```

---

## 🛠️ Instalación

1. Navega a la carpeta del proyecto:
   ```bash
   cd development
   ```

2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```

---

## 💡 Modo de Uso

### 1. Ejecución rápida vía CLI (Comando recomendado)

Puedes ejecutar el grabador pasando la URL del sitio web de tu cliente directamente como argumento:

```bash
npm run record -- --url="https://ejemplo.com"
```

### 2. Opciones de personalización vía CLI

Puedes sobrescribir cualquier parámetro al momento de ejecutar:

```bash
npm run record -- --url="https://ejemplo.com" --duration=12 --wait=3000 --width=1080 --height=1920
```

| Argumento | Alias | Descripción | Valor por defecto |
| :--- | :--- | :--- | :--- |
| `--url` | `-u` | URL de la página web a grabar (**Requerido**) | `None` / `.env` |
| `--duration` | `-d` | Duración total del scroll en segundos | `10` |
| `--wait` | `-w` | Tiempo de espera inicial tras cargar la web (ms) | `2000` |
| `--width` | `-w` | Ancho del viewport en píxeles | `1080` |
| `--height` | `-h` | Alto del viewport en píxeles | `1920` |
| `--fps` | - | Formato de cuadros por segundo del video | `30` |
| `--output` | `-o` | Carpeta de salida del archivo generado | `./output` |

### 3. Configuración mediante archivo `.env`

También puedes configurar los valores por defecto en tu archivo `.env`:

```env
TARGET_URL=https://ejemplo.com
VIEWPORT_WIDTH=1080
VIEWPORT_HEIGHT=1920
RECORD_DURATION=10
INITIAL_WAIT=2000
FPS=30
OUTPUT_DIR=./output
```

Y luego simplemente ejecutar:
```bash
npm run record
```

---

## 🧪 Prueba de Verificación Automática

Para verificar que el sistema de grabación genera correctamente archivos `.mp4` con tamaño válido:

```bash
npm run test:record
```

Este comando cargará una página pública de prueba, ejecutará un scroll vertical de 5 segundos y validará la creación del archivo MP4 en `./output/video-TIMESTAMP.mp4`.
