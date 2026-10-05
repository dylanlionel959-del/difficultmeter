let difficultiesData = [];
let timelineSegments = [];
let currentLang = 'en';

// Diccionario de Traducciones
const translations = {
  en: {
    subtitle: "An Open Source Client for Geometry Dash creators",
    langLabel: "Language:",
    labelVideo: "1. Select Local Video:",
    labelPosition: "2. Meter Position:",
    labelSize: "3. Icon Size:",
    posTL: "Top-Left",
    posTR: "Top-Right",
    posBL: "Bottom-Left",
    posBR: "Bottom-Right",
    titleAdd: "Add Timeline Segment",
    labelDiff: "Difficulty:",
    labelStart: "Start (sec):",
    labelEnd: "End (sec):",
    btnAdd: "Add Segment",
    titleList: "Configured Timeline",
    alertTime: "Please check the start and end times.",
    btnSave: "Save to Cache",
    btnLoad: "Load from Cache",
    savedMsg: "Configuration saved to browser cache successfully!",
    loadedMsg: "Configuration loaded from cache successfully!",
    noDataMsg: "No saved configuration found in cache.",
    btnRender: "Process & Render Video",
    renderProgress: "Rendering: ",
    alertNoVideo: "Please select a video file first.",
    renderDone: "Rendering complete! You can download your video below.",
    downloadLink: "Download Rendered Video"
  },
  es: {
    subtitle: "Un cliente de código abierto para creadores de Geometry Dash",
    langLabel: "Idioma:",
    labelVideo: "1. Seleccionar Vídeo Local:",
    labelPosition: "2. Posición del Meter:",
    labelSize: "3. Tamaño del Icono:",
    posTL: "Arriba a la Izquierda",
    posTR: "Arriba a la Derecha",
    posBL: "Abajo a la Izquierda",
    posBR: "Abajo a la Derecha",
    titleAdd: "Agregar Tramo de Cronograma",
    labelDiff: "Dificultad:",
    labelStart: "Inicio (seg):",
    labelEnd: "Fin (seg):",
    btnAdd: "Añadir Tramo",
    titleList: "Cronograma Configurado",
    alertTime: "Revisa los tiempos de inicio y fin.",
    btnSave: "Guardar en Caché",
    btnLoad: "Cargar desde Caché",
    savedMsg: "¡Configuración guardada en la caché del navegador con éxito!",
    loadedMsg: "¡Configuración cargada desde la caché con éxito!",
    noDataMsg: "No se encontró ninguna configuración guardada en la caché.",
    btnRender: "Procesar y Renderizar Vídeo",
    renderProgress: "Renderizando: ",
    alertNoVideo: "Por favor, selecciona un archivo de vídeo primero.",
    renderDone: "¡Renderizado completado! Puedes descargar tu vídeo abajo.",
    downloadLink: "Descargar Vídeo Renderizado"
  }
};

// Elementos DOM
const langSelect = document.getElementById('lang-select');
const videoInput = document.getElementById('video-input');
const videoPlayer = document.getElementById('video-player');
const difficultySelect = document.getElementById('difficulty-select');
const positionSelect = document.getElementById('position-select');
const sizeRange = document.getElementById('size-range');
const sizeValue = document.getElementById('size-value');
const addSegmentBtn = document.getElementById('add-segment-btn');
const timelineList = document.getElementById('timeline-list');
const saveBtn = document.getElementById('save-btn');
const loadBtn = document.getElementById('load-btn');
const renderBtn = document.getElementById('render-btn');
const renderProgressContainer = document.getElementById('render-progress-container');
const renderStatus = document.getElementById('render-status');
const renderProgress = document.getElementById('render-progress');
const downloadContainer = document.getElementById('download-container');
const downloadLink = document.getElementById('download-link');

const meterOverlay = document.getElementById('meter-overlay');
const meterIcon = document.getElementById('meter-icon');
const meterStars = document.getElementById('meter-stars');

// Cargar JSON
fetch('difficulties.json')
  .then(response => response.json())
  .then(data => {
    difficultiesData = data;
    populateDifficultySelect();
  })
  .catch(err => console.error("Error loading JSON:", err));

// Cambio de idioma
langSelect.addEventListener('change', (e) => {
  currentLang = e.target.value;
  updateLanguageUI();
});

function updateLanguageUI() {
  const t = translations[currentLang];
  
  document.getElementById('i18n-subtitle').textContent = t.subtitle;
  document.getElementById('i18n-lang-label').textContent = t.langLabel;
  document.getElementById('i18n-label-video').textContent = t.labelVideo;
  document.getElementById('i18n-label-position').textContent = t.labelPosition;
  document.getElementById('i18n-label-size').textContent = t.labelSize;
  document.getElementById('i18n-pos-tl').textContent = t.posTL;
  document.getElementById('i18n-pos-tr').textContent = t.posTR;
  document.getElementById('i18n-pos-bl').textContent = t.posBL;
  document.getElementById('i18n-pos-br').textContent = t.posBR;
  document.getElementById('i18n-title-add').textContent = t.titleAdd;
  document.getElementById('i18n-label-diff').textContent = t.labelDiff;
  document.getElementById('i18n-label-start').textContent = t.labelStart;
  document.getElementById('i18n-label-end').textContent = t.labelEnd;
  addSegmentBtn.textContent = t.btnAdd;
  document.getElementById('i18n-title-list').textContent = t.titleList;
  saveBtn.textContent = t.btnSave;
  loadBtn.textContent = t.btnLoad;
  renderBtn.textContent = t.btnRender;
  downloadLink.textContent = t.downloadLink;

  populateDifficultySelect();
  renderTimelineList();
}

function populateDifficultySelect() {
  difficultySelect.innerHTML = '';
  difficultiesData.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.id;
    opt.textContent = `${item.name} (${item.stars}★)`;
    difficultySelect.appendChild(opt);
  });
}

// Cargar vídeo local
videoInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    videoPlayer.src = url;
  }
});

// Cambiar posición
positionSelect.addEventListener('change', (e) => {
  meterOverlay.className = `meter-overlay ${e.target.value}`;
  updateOverlay();
});

// Cambiar tamaño en PX dinámicamente
sizeRange.addEventListener('input', (e) => {
  const val = e.target.value;
  sizeValue.textContent = val;
  meterOverlay.style.setProperty('--icon-size', `${val}px`);
});

// Agregar Segmento
addSegmentBtn.addEventListener('click', () => {
  const diffId = difficultySelect.value;
  const start = parseFloat(document.getElementById('start-time').value);
  const end = parseFloat(document.getElementById('end-time').value);

  if (isNaN(start) || isNaN(end) || start >= end) {
    alert(translations[currentLang].alertTime);
    return;
  }

  const selectedDiff = difficultiesData.find(d => d.id === diffId);

  timelineSegments.push({
    id: Date.now(),
    difficulty: selectedDiff,
    start: start,
    end: end
  });

  renderTimelineList();
  updateOverlay();
});

function renderTimelineList() {
  timelineList.innerHTML = '';
  timelineSegments.forEach(seg => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span><b>${seg.start}s - ${seg.end}s</b>: ${seg.difficulty.name} (${seg.difficulty.stars}★)</span>
      <button class="delete-btn" onclick="removeSegment(${seg.id})">X</button>
    `;
    timelineList.appendChild(li);
  });
}

function removeSegment(id) {
  timelineSegments = timelineSegments.filter(s => s.id !== id);
  renderTimelineList();
  updateOverlay();
}

// Guardar en Caché
saveBtn.addEventListener('click', () => {
  const dataToSave = {
    segments: timelineSegments,
    position: positionSelect.value,
    size: sizeRange.value
  };
  localStorage.setItem('gd_meter_config', JSON.stringify(dataToSave));
  alert(translations[currentLang].savedMsg);
});

// Cargar desde Caché
loadBtn.addEventListener('click', () => {
  const savedData = localStorage.getItem('gd_meter_config');
  if (savedData) {
    const parsed = JSON.parse(savedData);
    timelineSegments = parsed.segments || [];
    
    if (parsed.position) {
      positionSelect.value = parsed.position;
      meterOverlay.className = `meter-overlay ${parsed.position}`;
    }
    
    if (parsed.size) {
      sizeRange.value = parsed.size;
      sizeValue.textContent = parsed.size;
      meterOverlay.style.setProperty('--icon-size', `${parsed.size}px`);
    }

    renderTimelineList();
    updateOverlay();
    alert(translations[currentLang].loadedMsg);
  } else {
    alert(translations[currentLang].noDataMsg);
  }
});

// Actualizar Overlay en tiempo real
videoPlayer.addEventListener('timeupdate', updateOverlay);

function updateOverlay() {
  const currentTime = videoPlayer.currentTime;

  const activeSegment = timelineSegments.find(
    seg => currentTime >= seg.start && currentTime <= seg.end
  );

  if (activeSegment) {
    const diff = activeSegment.difficulty;
    meterIcon.src = diff.icon;
    meterStars.textContent = `${diff.stars}★`;
    meterOverlay.classList.remove('hidden');
  } else {
    meterOverlay.classList.add('hidden');
  }
}

// --- PROCESAR Y RENDERIZAR VÍDEO ---
renderBtn.addEventListener('click', async () => {
  if (!videoPlayer.src) {
    alert(translations[currentLang].alertNoVideo);
    return;
  }

  renderBtn.disabled = true;
  renderProgressContainer.classList.remove('hidden');
  downloadContainer.classList.add('hidden');
  renderProgress.value = 0;

  const t = translations[currentLang];
  const canvas = document.createElement('canvas');
  canvas.width = videoPlayer.videoWidth || 1280;
  canvas.height = videoPlayer.videoHeight || 720;
  const ctx = canvas.getContext('2d');

  // Precargar imágenes de dificultades utilizadas
  const imageCache = {};
  for (const diff of difficultiesData) {
    await new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = diff.icon;
      img.onload = () => {
        imageCache[diff.id] = img;
        resolve();
      };
      img.onerror = () => resolve();
    });
  }

  const stream = canvas.captureStream(30); // 30 FPS
  let recorder;
  try {
    recorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
  } catch (e) {
    recorder = new MediaRecorder(stream);
  }

  const chunks = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadContainer.classList.remove('hidden');
    renderBtn.disabled = false;
    renderProgressContainer.classList.add('hidden');
    alert(t.renderDone);
  };

  videoPlayer.pause();
  videoPlayer.currentTime = 0;

  recorder.start();

  const duration = videoPlayer.duration;
  const fps = 30;
  const interval = 1 / fps;
  let currentTime = 0;

  const renderFrame = () => {
    if (currentTime <= duration) {
      videoPlayer.currentTime = currentTime;
    }
  };

  videoPlayer.onseeked = () => {
    // Dibujar fotograma del vídeo
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);

    // Buscar segmento activo
    const activeSegment = timelineSegments.find(
      seg => currentTime >= seg.start && currentTime <= seg.end
    );

    if (activeSegment) {
      const diff = activeSegment.difficulty;
      const img = imageCache[diff.id];
      const iconSize = parseInt(sizeRange.value) * (canvas.width / videoPlayer.clientWidth || 1);
      const margin = 15 * (canvas.width / videoPlayer.clientWidth || 1);
      
      const pos = positionSelect.value;
      let x = margin;
      let y = margin;

      if (pos === 'top-right') {
        x = canvas.width - iconSize - margin;
        y = margin;
      } else if (pos === 'bottom-left') {
        x = margin;
        y = canvas.height - iconSize - (iconSize * 0.4) - margin;
      } else if (pos === 'bottom-right') {
        x = canvas.width - iconSize - margin;
        y = canvas.height - iconSize - (iconSize * 0.4) - margin;
      }

      if (img) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 8;
        ctx.drawImage(img, x, y, iconSize, iconSize);
        ctx.shadowBlur = 0; // Reset sombra
      }

      // Dibujar estrellas
      ctx.fillStyle = '#ffe600';
      ctx.font = `bold ${Math.round(iconSize * 0.28)}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;

      const textX = x + (iconSize / 2);
      const textY = y + iconSize + 4;
      const starsText = `${diff.stars}★`;

      ctx.strokeText(starsText, textX, textY);
      ctx.fillText(starsText, textX, textY);
    }

    // Actualizar barra de progreso
    const percent = Math.min(100, Math.round((currentTime / duration) * 100));
    renderProgress.value = percent;
    renderStatus.textContent = `${t.renderProgress}${percent}%`;

    currentTime += interval;
    if (currentTime <= duration) {
      setTimeout(renderFrame, 10);
    } else {
      recorder.stop();
      videoPlayer.onseeked = null;
    }
  };

  renderFrame();
});
