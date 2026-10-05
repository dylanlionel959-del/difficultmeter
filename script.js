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
    noDataMsg: "No saved configuration found in cache."
  },
  es: {
    subtitle: "Un cliente de código abierto para creadores de Geometry Dash",
    langLabel: "Idioma:",
    labelVideo: "1. Seleccionar Vídeo Local:",
    labelPosition: "2. Posición del Meter:",
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
    noDataMsg: "No se encontró ninguna configuración guardada en la caché."
  }
};

// Elementos DOM
const langSelect = document.getElementById('lang-select');
const videoInput = document.getElementById('video-input');
const videoPlayer = document.getElementById('video-player');
const difficultySelect = document.getElementById('difficulty-select');
const positionSelect = document.getElementById('position-select');
const addSegmentBtn = document.getElementById('add-segment-btn');
const timelineList = document.getElementById('timeline-list');
const saveBtn = document.getElementById('save-btn');
const loadBtn = document.getElementById('load-btn');

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

// Guardar en Caché (localStorage)
saveBtn.addEventListener('click', () => {
  const dataToSave = {
    segments: timelineSegments,
    position: positionSelect.value
  };
  localStorage.setItem('gd_meter_config', JSON.stringify(dataToSave));
  alert(translations[currentLang].savedMsg);
});

// Cargar desde Caché (localStorage)
loadBtn.addEventListener('click', () => {
  const savedData = localStorage.getItem('gd_meter_config');
  if (savedData) {
    const parsed = JSON.parse(savedData);
    timelineSegments = parsed.segments || [];
    if (parsed.position) {
      positionSelect.value = parsed.position;
      meterOverlay.className = `meter-overlay ${parsed.position}`;
    }
    renderTimelineList();
    updateOverlay();
    alert(translations[currentLang].loadedMsg);
  } else {
    alert(translations[currentLang].noDataMsg);
  }
});

// Actualizar Overlay
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
