/* ===================================================
   CONFIGURACIÓN PRINCIPAL
   =================================================== */

// Enlace de YouTube para cuando presiona "No"
const YOUTUBE_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

// Textos de diálogo retro
const TEXT_SCREEN_1 = "Eres Amsi o ne?";
const TEXT_SCREEN_2 = "Segura que eres esta mera?";

const CEPILLIN_MSG_1 = "Te amo muchisimo mi señorita preciosa, agradezco tenerte siempre conmigo <3";
const CEPILLIN_MSG_2 = "Bien, ya me cago la musica";

const CHIWIS_MSG = "Felicidades mi Chiwis, te sacaste el precio a la chamaca mas preciosa de Morelia <333";

const RECUERDAN_MSG = "Pero ya dejando la broma de lado, te amo muchisimo mi niña preciosa, te escribi una carta para ti <333";

const FLOWER_MSG = "Te amo mi niña preciosa, quisiera darte mil flores, mil besos y mil abrazos, te amo muchisimo como no tienes idea, por ahora no puedo obviamente darte flores pero, aca abajo te dejo un ramo mi amorrr <3";

// Lista exclusiva de fotos de Amsi para la Pantalla 4
const AMSI_PHOTOS = [
  "fotosAmsi/Amsi3.webp",
  "fotosAmsi/Amsi7.webp",
  "fotosAmsi/Amsi1.webp",
  "fotosAmsi/Amsi5.webp",
  "fotosAmsi/Amsi2.webp",
  "fotosAmsi/Amsi8.webp",
  "fotosAmsi/Amsi4.webp",
  "fotosAmsi/Amsi6.webp"
];

// Lista de las 5 cosas que recuerdan a ti (1 al 5) para la Pantalla 5
const RECUERDAN_PHOTOS = [
  "fotosAmsi/recuerdanAti.webp",
  "fotosAmsi/recuerdanAti2.webp",
  "fotosAmsi/recuerdanAti3.webp",
  "fotosAmsi/recuerdanAti4.webp",
  "fotosAmsi/recuerdanAti5.webp"
];

let currentPhotoIndex = 0;
let currentTop5Index = 0;

let cepillinTimeout = null;
let slideshowInterval = null;
let confettiInterval = null;

/* ===================================================
   SISTEMA DE AUDIO (EFECTOS RETRO SINTETIZADOS)
   =================================================== */
let soundEnabled = true;
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
  if (!soundEnabled) return;
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  if (type === 'hover') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.05);
  } else if (type === 'select') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.setValueAtTime(659.25, now + 0.08);
    osc.frequency.setValueAtTime(783.99, now + 0.16);
    osc.frequency.setValueAtTime(1046.50, now + 0.24);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc.start(now);
    osc.stop(now + 0.4);
  } else if (type === 'warn') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.3);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'type') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(300 + Math.random() * 200, now);
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    osc.start(now);
    osc.stop(now + 0.03);
  }
}

/* ===================================================
   INICIALIZACIÓN Y EFECTOS VISUALES
   =================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initFloatingBackground();
  startTypewriter('typewriterText1', TEXT_SCREEN_1);
  setupEventListeners();
  updatePhotoGallery();
  updateTop5Gallery();
  setupAudioListeners();
});

function initFloatingBackground() {
  const container = document.getElementById('pixelBg');
  const totalParticles = 12;

  for (let i = 0; i < totalParticles; i++) {
    const heart = document.createElement('div');
    heart.classList.add('floating-pixel-heart');
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDelay = `${Math.random() * 8}s`;
    heart.style.animationDuration = `${6 + Math.random() * 6}s`;
    container.appendChild(heart);
  }
}

function startTypewriter(elementId, text, speed = 40, callback) {
  const target = document.getElementById(elementId);
  if (!target) return;
  target.textContent = '';
  let index = 0;

  function typeChar() {
    if (index < text.length) {
      target.textContent += text.charAt(index);
      playSound('type');
      index++;
      setTimeout(typeChar, speed);
    } else if (callback) {
      callback();
    }
  }

  typeChar();
}

function setupAudioListeners() {
  const audioOpening = document.getElementById('audioOpening');
  audioOpening.addEventListener('ended', () => {
    console.log('Opening.opus finalizó. No suena más música.');
  });
}

/* ===================================================
   MANEJO DE EVENTOS Y FLUJO
   =================================================== */
function setupEventListeners() {
  // Pantalla 1
  const btnYes1 = document.getElementById('btnYes1');
  const btnNo1 = document.getElementById('btnNo1');

  // Pantalla 2 (Foto)
  const btnYes2 = document.getElementById('btnYes2');
  const btnNo2 = document.getElementById('btnNo2');

  // Pantalla 3 (Cepillín)
  const btnPueblo = document.getElementById('btnPueblo');

  // Pantalla 4 (Fotos & Chiwis)
  const btnWhatIsNext = document.getElementById('btnWhatIsNext');
  const btnPrevPhoto = document.getElementById('btnPrevPhoto');
  const btnNextPhoto = document.getElementById('btnNextPhoto');

  // Pantalla 5 (Top 5)
  const btnToFinal = document.getElementById('btnToFinal');
  const btnPrevTop5 = document.getElementById('btnPrevTop5');
  const btnNextTop5 = document.getElementById('btnNextTop5');

  // Pantalla 6 (Carta de Davidd)
  const btnToFlower = document.getElementById('btnToFlower');

  // Pantalla 7 (Ramo de Flores)
  const btnToFinalGrand = document.getElementById('btnToFinalGrand');

  // Pantalla 8 (Gran Finale)
  const musicToggle = document.getElementById('musicToggle');

  // --- PANTALLA 1 ---
  btnYes1.addEventListener('mouseenter', () => playSound('hover'));
  btnYes1.addEventListener('click', () => {
    playSound('select');
    switchScreen('screen-intro', 'screen-confirm-photo', () => {
      startTypewriter('typewriterText2', TEXT_SCREEN_2);
    });
  });

  btnNo1.addEventListener('mouseenter', () => playSound('hover'));
  btnNo1.addEventListener('click', () => goToYouTube());

  // --- PANTALLA 2 ---
  btnYes2.addEventListener('mouseenter', () => playSound('hover'));
  btnYes2.addEventListener('click', () => {
    playSound('select');
    createBurstEffect();
    switchScreen('screen-confirm-photo', 'screen-cepillin', () => {
      startCepillinPhase();
    });
  });

  btnNo2.addEventListener('mouseenter', () => playSound('hover'));
  btnNo2.addEventListener('click', () => goToYouTube());

  // --- PANTALLA 3: CEPILLÍN ---
  btnPueblo.addEventListener('mouseenter', () => playSound('hover'));
  btnPueblo.addEventListener('click', () => {
    playSound('select');
    stopAllMusic();

    switchScreen('screen-cepillin', 'screen-photos-chiwis', () => {
      startPhotosChiwisPhase();
    });
  });

  // --- PANTALLA 4: FOTOS & CHIWIS ---
  btnWhatIsNext.addEventListener('mouseenter', () => playSound('hover'));
  btnWhatIsNext.addEventListener('click', () => {
    playSound('select');
    createBurstEffect();
    stopAutoSlideshow();

    switchScreen('screen-photos-chiwis', 'screen-top5-recuerdan', () => {
      startTop5Phase();
    });
  });

  btnPrevPhoto.addEventListener('click', () => {
    playSound('hover');
    currentPhotoIndex = (currentPhotoIndex - 1 + AMSI_PHOTOS.length) % AMSI_PHOTOS.length;
    updatePhotoGallery();
    resetAutoSlideshow();
  });

  btnNextPhoto.addEventListener('click', () => {
    playSound('hover');
    currentPhotoIndex = (currentPhotoIndex + 1) % AMSI_PHOTOS.length;
    updatePhotoGallery();
    resetAutoSlideshow();
  });

  // --- PANTALLA 5: TOP 5 RECUERDAN A TI ---
  btnToFinal.addEventListener('mouseenter', () => playSound('hover'));
  btnToFinal.addEventListener('click', () => {
    playSound('select');
    createBurstEffect();

    // Lleva a la Pantalla 6 (Carta de Davidd)
    switchScreen('screen-top5-recuerdan', 'screen-letter');
  });

  btnPrevTop5.addEventListener('click', () => {
    playSound('hover');
    currentTop5Index = (currentTop5Index - 1 + RECUERDAN_PHOTOS.length) % RECUERDAN_PHOTOS.length;
    updateTop5Gallery();
  });

  btnNextTop5.addEventListener('click', () => {
    playSound('hover');
    currentTop5Index = (currentTop5Index + 1) % RECUERDAN_PHOTOS.length;
    updateTop5Gallery();
  });

  // --- PANTALLA 6: CARTA -> PANTALLA 7: FLORES ---
  btnToFlower.addEventListener('mouseenter', () => playSound('hover'));
  btnToFlower.addEventListener('click', () => {
    playSound('select');
    createBurstEffect();

    switchScreen('screen-letter', 'screen-flower-bouquet', () => {
      startFlowerPhase();
    });
  });

  // --- PANTALLA 7: FLORES -> PANTALLA 8: GRAN FINALE ---
  btnToFinalGrand.addEventListener('mouseenter', () => playSound('hover'));
  btnToFinalGrand.addEventListener('click', () => {
    playSound('select');
    createBurstEffect();

    switchScreen('screen-flower-bouquet', 'screen-welcome', () => {
      startFinalGrandPhase();
    });
  });

  // Toggle de música
  musicToggle.addEventListener('click', () => {
    const audioOpening = document.getElementById('audioOpening');
    const audioCepillin = document.getElementById('audioCepillin');

    if (audioOpening.paused && audioCepillin.paused) {
      audioOpening.play();
      musicToggle.textContent = '🎵 Música: ON';
    } else {
      audioOpening.pause();
      audioCepillin.pause();
      musicToggle.textContent = '🔇 Música: OFF';
    }
  });
}

/* ===================================================
   LÓGICA DE FASES Y GALERÍAS
   =================================================== */
function startPhotosChiwisPhase() {
  const audioOpening = document.getElementById('audioOpening');
  audioOpening.volume = 0.8;
  audioOpening.currentTime = 0;
  audioOpening.loop = false;
  audioOpening.play().catch(err => console.log("Autoplay bloqueado:", err));

  startTypewriter('chiwisText', CHIWIS_MSG, 40);
  createBurstEffect();
  startAutoSlideshow();
}

function startTop5Phase() {
  currentTop5Index = 0;
  updateTop5Gallery();
  startTypewriter('recuerdanMessageText', RECUERDAN_MSG, 35);
}

function startFlowerPhase() {
  startTypewriter('flowerMessageText', FLOWER_MSG, 35);
}

function startFinalGrandPhase() {
  playSound('select');
  startConfetti();
}

/* ===================================================
   EFECTO DE CONFETI EN PANTALLA 8
   =================================================== */
function startConfetti() {
  stopConfetti();
  const container = document.getElementById('confettiContainer');
  if (!container) return;

  confettiInterval = setInterval(() => {
    for (let i = 0; i < 5; i++) {
      const p = document.createElement('div');
      p.classList.add('confetti-piece');
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDuration = `${2.5 + Math.random() * 2}s`;
      
      const colors = ['#ffb7c5', '#ffdbe2', '#f7f4ea', '#fffdf7', '#d88998'];
      p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

      container.appendChild(p);

      setTimeout(() => {
        p.remove();
      }, 4500);
    }
  }, 300);
}

function stopConfetti() {
  if (confettiInterval) {
    clearInterval(confettiInterval);
    confettiInterval = null;
  }
  const container = document.getElementById('confettiContainer');
  if (container) container.innerHTML = '';
}

function startAutoSlideshow() {
  stopAutoSlideshow();
  slideshowInterval = setInterval(() => {
    currentPhotoIndex = (currentPhotoIndex + 1) % AMSI_PHOTOS.length;
    updatePhotoGallery();
  }, 5000);
}

function stopAutoSlideshow() {
  if (slideshowInterval) {
    clearInterval(slideshowInterval);
    slideshowInterval = null;
  }
}

function resetAutoSlideshow() {
  startAutoSlideshow();
}

function updatePhotoGallery() {
  const img = document.getElementById('galleryImg');
  const label = document.getElementById('photoIndexText');

  if (img && label) {
    img.classList.remove('pixel-pop');
    void img.offsetWidth;
    img.src = AMSI_PHOTOS[currentPhotoIndex];
    img.classList.add('pixel-pop');
    label.textContent = `${currentPhotoIndex + 1} / ${AMSI_PHOTOS.length}`;
  }
}

function updateTop5Gallery() {
  const img = document.getElementById('top5Img');
  const label = document.getElementById('top5IndexText');
  const badge = document.getElementById('top5Badge');

  if (img && label && badge) {
    img.classList.remove('pixel-pop');
    void img.offsetWidth;
    img.src = RECUERDAN_PHOTOS[currentTop5Index];
    img.classList.add('pixel-pop');
    
    const num = currentTop5Index + 1;
    badge.textContent = `#${num}`;
    label.textContent = `TOP ${num} / ${RECUERDAN_PHOTOS.length}`;
  }
}

/* ===================================================
   OTRAS FASES Y FUNCIONES AUXILIARES
   =================================================== */
function startCepillinPhase() {
  const audioCepillin = document.getElementById('audioCepillin');
  const btnContainer = document.getElementById('cepillinButtonContainer');
  
  btnContainer.classList.add('hidden');
  audioCepillin.volume = 0.8;
  audioCepillin.currentTime = 0;
  
  audioCepillin.play().catch(err => console.log("Autoplay bloqueado:", err));

  startTypewriter('cepillinText', CEPILLIN_MSG_1, 40);

  cepillinTimeout = setTimeout(() => {
    startTypewriter('cepillinText', CEPILLIN_MSG_2, 40, () => {
      btnContainer.classList.remove('hidden');
    });
  }, 10000);
}

function stopAllMusic() {
  const audioCepillin = document.getElementById('audioCepillin');
  const audioOpening = document.getElementById('audioOpening');

  audioCepillin.pause();
  audioCepillin.currentTime = 0;

  audioOpening.pause();
  audioOpening.currentTime = 0;
}

function goToYouTube() {
  playSound('warn');
  stopAllMusic();
  stopAutoSlideshow();
  stopConfetti();
  document.body.style.animation = "shake 0.4s ease-in-out";
  setTimeout(() => {
    window.location.href = YOUTUBE_URL;
  }, 400);
}

function switchScreen(fromId, toId, onComplete) {
  const fromScreen = document.getElementById(fromId);
  const toScreen = document.getElementById(toId);

  fromScreen.classList.remove('active');
  setTimeout(() => {
    fromScreen.classList.add('hidden');
    toScreen.classList.remove('hidden');
    setTimeout(() => {
      toScreen.classList.add('active');
      if (onComplete) onComplete();
    }, 50);
  }, 300);
}

function createBurstEffect() {
  for (let i = 0; i < 15; i++) {
    const p = document.createElement('div');
    p.classList.add('floating-pixel-heart');
    p.style.position = 'fixed';
    p.style.left = `${50 + (Math.random() * 40 - 20)}%`;
    p.style.top = `${50 + (Math.random() * 40 - 20)}%`;
    p.style.zIndex = '999';
    p.style.animation = 'floatUp 1.5s ease-out forwards';
    document.body.appendChild(p);

    setTimeout(() => {
      p.remove();
    }, 1500);
  }
}
