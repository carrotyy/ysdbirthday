// ==========================================
// 1. SISTEM COUNTDOWN & LAYAR
// ==========================================
const targetDate = new Date('August 18, 2026 00:00:00').getTime();

const layarHitam = document.getElementById('layar-hitam');
const layarBiru = document.getElementById('layar-biru');
const btnLights = document.getElementById('btn-lights');
const btnWorld = document.getElementById('btn-world');
const wadahCountdown = document.getElementById('countdown');
const judulTunggu = document.getElementById('judul-tunggu');
const scrollHint = document.getElementById('scroll-hint');

let countdownInterval;

btnLights.addEventListener('click', () => {
  layarHitam.classList.add('hilang');
  setTimeout(() => {
    layarHitam.style.display = 'none';
    mulaiCountdown();
  }, 2000);
});

function mulaiCountdown() {
  function hitung() {
    const sekarang = new Date().getTime();
    const selisih = targetDate - sekarang;

    if (selisih <= 0) {
      clearInterval(countdownInterval);
      wadahCountdown.classList.add('tersembunyi');
      judulTunggu.innerHTML = "Waktunya Telah Tiba \u2728";
      btnWorld.classList.remove('tersembunyi');
      return;
    }

    const hari = Math.floor(selisih / (1000 * 60 * 60 * 24));
    const jam = Math.floor((selisih % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const menit = Math.floor((selisih % (1000 * 60 * 60)) / (1000 * 60));
    const detik = Math.floor((selisih % (1000 * 60)) / 1000);

    document.getElementById('hari').innerText = hari.toString().padStart(2, '0');
    document.getElementById('jam').innerText = jam.toString().padStart(2, '0');
    document.getElementById('menit').innerText = menit.toString().padStart(2, '0');
    document.getElementById('detik').innerText = detik.toString().padStart(2, '0');
  }
  
  hitung();
  countdownInterval = setInterval(hitung, 1000);
}

btnWorld.addEventListener('click', () => {
  layarBiru.classList.add('kembali-hitam');
  btnWorld.classList.add('hilang');
  judulTunggu.classList.add('hilang');

  setTimeout(() => {
    layarBiru.classList.add('hilang');
    
    // Mulai kembang api
    then = timestamp();
    jalankanKembangApi();
    
    // Tampilkan tulisan petunjuk scroll ke bawah
    scrollHint.classList.remove('tersembunyi');
  }, 3000);
});


// ==========================================
// 2. MESIN KEMBANG API 
// ==========================================
const PI2 = Math.PI * 2;
const random = (min, max) => Math.random() * (max - min + 1) + min | 0;
const timestamp = _ => new Date().getTime();
let canvas = document.getElementById('birthday');
let ctx = canvas.getContext('2d');
let then;
let birthday;

class Birthday {
  constructor() {
    this.resize();
    this.fireworks = [];
    this.counter = 0;
  }
  resize() {
    this.width = canvas.width = window.innerWidth;
    let center = this.width / 2 | 0;
    this.spawnA = center - center / 4 | 0;
    this.spawnB = center + center / 4 | 0;
    this.height = canvas.height = window.innerHeight;
    this.spawnC = this.height * .1;
    this.spawnD = this.height * .5;
  }
  spawnAt(x, y) {
     let count = random(1, 2);
     for(let i = 0; i < count; i++) {
       this.fireworks.push(new Firework(
          random(this.spawnA, this.spawnB), this.height, x, y, random(0, 260), random(10, 30)
       ));
     }
     this.counter = -1;
  }
  update(delta) {
    ctx.globalCompositeOperation = 'hard-light';
    ctx.fillStyle = `rgba(20,20,20,${ 7 * delta })`;
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.globalCompositeOperation = 'lighter';
    for (let firework of this.fireworks) firework.update(delta);

    this.counter += delta * 0.3; 
    if (this.counter >= 1) {
      this.fireworks.push(new Firework(
        random(this.spawnA, this.spawnB), this.height, random(0, this.width),
        random(this.spawnC, this.spawnD), random(0, 360), random(15, 40)
      ));
      this.counter = 0;
    }
    if (this.fireworks.length > 1000) this.fireworks = this.fireworks.filter(firework => !firework.dead);
  }
}

class Firework {
  constructor(x, y, targetX, targetY, shade, offsprings) {
    this.dead = false; this.offsprings = offsprings; this.x = x; this.y = y;
    this.targetX = targetX; this.targetY = targetY; this.shade = shade; this.history = [];
  }
  update(delta) {
    if (this.dead) return;
    let xDiff = this.targetX - this.x; let yDiff = this.targetY - this.y;
    if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) {
      this.x += xDiff * 2 * delta; this.y += yDiff * 2 * delta;
      this.history.push({ x: this.x, y: this.y });
      if (this.history.length > 20) this.history.shift();
    } else {
      if (this.offsprings && !this.madeChilds) {
        let babies = this.offsprings / 2;
        for (let i = 0; i < babies; i++) {
          let targetX = this.x + this.offsprings * Math.cos(PI2 * i / babies) | 0;
          let targetY = this.y + this.offsprings * Math.sin(PI2 * i / babies) | 0;
          birthday.fireworks.push(new Firework(this.x, this.y, targetX, targetY, this.shade, 0));
        }
      }
      this.madeChilds = true; this.history.shift();
    }
    if (this.history.length === 0) this.dead = true;
    else if (this.offsprings) { 
        for (let i = 0; this.history.length > i; i++) {
          let point = this.history[i];
          ctx.beginPath(); ctx.fillStyle = 'hsl(' + this.shade + ',100%,' + i + '%)';
          ctx.arc(point.x, point.y, 1, 0, PI2, false); ctx.fill();
        } 
      } else {
      ctx.beginPath(); ctx.fillStyle = 'hsl(' + this.shade + ',100%,50%)';
      ctx.arc(this.x, this.y, 1, 0, PI2, false); ctx.fill();
    }
  }
}

// Inisialisasi Kembang Api
birthday = new Birthday();
window.onresize = () => birthday.resize();

let isTouching = false;
let lastSpawn = 0;
const handleInput = (e) => {
  let x = e.clientX || (e.touches && e.touches[0].clientX);
  let y = e.clientY || (e.touches && e.touches[0].clientY);
  let now = timestamp();
  if (now - lastSpawn > 200) { 
    birthday.spawnAt(x, y); lastSpawn = now;
  }
};
// Event listener tetap dijalankan di area layar
window.addEventListener('mousedown', (e) => { isTouching = true; handleInput(e); });
window.addEventListener('mousemove', (e) => { if (isTouching) handleInput(e); });
window.addEventListener('mouseup', () => isTouching = false);
window.addEventListener('touchstart', (e) => { isTouching = true; handleInput(e); }, { passive: false });
window.addEventListener('touchmove', (e) => { 
  if (isTouching) {
     // Hanya preventDefault jika sedang tidak scroll jauh ke bawah (biar bisa scroll)
     if(window.scrollY < 100) e.preventDefault(); 
     handleInput(e); 
  } 
}, { passive: false });
window.addEventListener('touchend', () => isTouching = false);

function jalankanKembangApi(){
  requestAnimationFrame(jalankanKembangApi);
  let now = timestamp();
  let delta = now - then;
  then = now;
  birthday.update(delta / 1000);
}


// ==========================================
// 3. MESIN TIUP LILIN VIRTUAL
// ==========================================
window.onload = function() {
  const candleCanvas = document.getElementById('cake-candle-canvas');
  const candleCtx = candleCanvas.getContext('2d');

  // Mengatur ukuran canvas lilin
  candleCanvas.width = 50;
  candleCanvas.height = 100;

  let flameOn = true;
  let blowing = false;
  let shakeFrame = 0;
  let flameAngle = 0;
  let smokes = [];
  let showCard = false;
  let isBlowDetected = false;
  let flameSize = 1.0;
  let blowIntensity = 0;

  function drawSmokes() {
      smokes.forEach(s => {
          candleCtx.save();
          candleCtx.globalAlpha = s.alpha;
          candleCtx.beginPath();
          candleCtx.ellipse(s.x, s.y, Math.abs(s.r), Math.abs(s.r * 1.5), 0, 0, 2 * Math.PI);
          candleCtx.fillStyle = "#bbb";
          candleCtx.fill();
          candleCtx.restore();
          s.y -= 0.7 + Math.random();
          s.x += Math.sin(s.y / 10) * 0.4;
          s.alpha -= 0.008 + Math.random() * 0.004;
      });
      smokes = smokes.filter(s => s.alpha > 0.05);
  }

  function drawCandle(flame = true, flameShake = 0, smoke = false) {
      candleCtx.clearRect(0, 0, candleCanvas.width, candleCanvas.height);

      // Badan Lilin
      candleCtx.save();
      candleCtx.fillStyle = "#f8bbd0";
      candleCtx.fillRect(18, 38, 8, 40);

      // Bagian atas lilin
      candleCtx.beginPath();
      candleCtx.ellipse(22, 38, 4, 2, 0, 0, 2 * Math.PI);
      candleCtx.fillStyle = "#e57373";
      candleCtx.fill();

      // Sumbu Lilin
      candleCtx.strokeStyle = "#333";
      candleCtx.lineWidth = 1.5;
      candleCtx.beginPath();
      candleCtx.moveTo(22, 38);
      candleCtx.lineTo(22, 28);
      candleCtx.stroke();
      candleCtx.restore();

      // Api Lilin
      if (flame) {
          let flick = 0;
          if (isBlowDetected) {
              flick = Math.sin(shakeFrame) * 2;
          }

          // Menghitung batas ukuran api
          let flameHeight = Math.max(1, 13 * flameSize + flick);
          let flameWidth = Math.max(0.5, 4.5 * flameSize);

          // Glow Api Luar
          candleCtx.save();
          candleCtx.globalAlpha = 0.4 * flameSize;
          candleCtx.beginPath();
          candleCtx.ellipse(22, 22, flameWidth + 3, flameHeight + 3, 0, 0, 2 * Math.PI);
          candleCtx.fillStyle = "#fffde7";
          candleCtx.shadowColor = "#fffde7";
          candleCtx.shadowBlur = 10;
          candleCtx.fill();
          candleCtx.restore();

          // Inti Kuning Api
          candleCtx.save();
          candleCtx.globalAlpha = 0.8 * flameSize;
          candleCtx.beginPath();
          candleCtx.ellipse(22, 22, flameWidth, flameHeight, 0, 0, 2 * Math.PI);
          candleCtx.fillStyle = "#ffe082";
          candleCtx.shadowColor = "#ffd600";
          candleCtx.shadowBlur = 5;
          candleCtx.fill();
          candleCtx.restore();

          // Tengah Orange
          candleCtx.save();
          candleCtx.globalAlpha = 0.6 * flameSize;
          candleCtx.beginPath();
          candleCtx.ellipse(22, 25, Math.max(0.5, flameWidth * 0.5), Math.max(0.5, flameHeight * 0.5), 0, 0, 2 * Math.PI);
          candleCtx.fillStyle = "#ff9800";
          candleCtx.shadowColor = "#ff9800";
          candleCtx.shadowBlur = 2;
          candleCtx.fill();
          candleCtx.restore();
      }

      // Asap setelah padam
      if(smoke) drawSmokes();
  }

  function animateCandle() {
      if (flameOn) {
          flameAngle += 0.1 + Math.random() * 0.05;
          let flameShakeVal = isBlowDetected ? Math.sin(shakeFrame) * 2 : 0;

          if (isBlowDetected) {
              flameSize = Math.max(0.2, flameSize - 0.03 * blowIntensity);
          }

          drawCandle(true, flameShakeVal, false);
          shakeFrame++;
      } else {
          if (Math.random() < 0.15) {
              smokes.push({
                  x: 22 + (Math.random() - 0.5) * 3,
                  y: 18 + Math.random() * 2,
                  r: 4 + Math.random() * 3,
                  alpha: 0.3 + Math.random() * 0.2
              });
          }
          drawCandle(false, 0, true);
      }
      requestAnimationFrame(animateCandle);
  }

  const blowInstruction = document.getElementById('blow-instruction');
  const celebrateMsg = document.getElementById('celebrate-message');
  const greetingCard = document.getElementById('greeting-card');
  const resetBtn = document.getElementById('reset-btn');
  const congratsMsg = document.getElementById('congrats-message');

  function showLottieCard() {
      const container = document.getElementById('lottie-confetti');
      container.innerHTML = '';

      lottie.loadAnimation({
          container: container,
          renderer: 'svg',
          loop: false,
          autoplay: true,
          path: 'https://lottie.host/0ea60585-2a84-47f6-931e-f52310af3cea/kz77wRyH4j.json',
          rendererSettings: { preserveAspectRatio: 'xMidYMid meet' }
      }).addEventListener('complete', function() {
          congratsMsg.style.display = 'block';
          resetBtn.style.display = 'inline-block';
      });
  }

  function extinguishCandle() {
      if (!flameOn) return;
      flameOn = false;
      blowing = false;
      smokes = [];

      if (candleCanvas) candleCanvas.classList.add('candle-off');
      if (celebrateMsg) celebrateMsg.style.display = 'block';
      if (blowInstruction) blowInstruction.style.display = 'none';
      if (greetingCard) greetingCard.classList.add('show');

      // Hilangkan teks scroll setelah kue meledak bahagia
      if (scrollHint) scrollHint.style.display = 'none';

      showLottieCard();

      const audio = document.getElementById('birthday-audio');
      if (audio) {
          audio.currentTime = 0;
          audio.play().catch(e => console.log('Terdapat error saat memutar audio:', e));
      }
  }

  function resetAll() {
      if (window.SpeechRecognition || window.webkitSpeechRecognition) {
          const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          if (recognition && recognition.abort) recognition.abort();
      }

      flameOn = true; blowing = false; shakeFrame = 0; flameAngle = 0; smokes = [];
      flameSize = 1.0; isBlowDetected = false; blowIntensity = 0;

      if (candleCanvas) candleCanvas.classList.remove('candle-off');
      if (celebrateMsg) celebrateMsg.style.display = 'none';
      if (blowInstruction) blowInstruction.style.display = 'inline-block';
      if (greetingCard) greetingCard.classList.remove('show');
      if (congratsMsg) congratsMsg.style.display = 'none';
      if (resetBtn) resetBtn.style.display = 'none';

      const confettiContainer = document.getElementById('lottie-confetti');
      if (confettiContainer) confettiContainer.innerHTML = '';

      const audio = document.getElementById('birthday-audio');
      if (audio) { audio.pause(); audio.currentTime = 0; }

      blowInstruction.textContent = "Klik untuk meniup lilin!";
      drawCandle(true, 0, false);
  }

  // --- SISTEM DETEKSI SUARA (MIC) ---
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new Recognition();
      recognition.lang = 'en-US'; // Bisa diganti 'id-ID' namun 'en-US' lebih sensitif mendeteksi noise angin
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;

      let recognitionActive = false;
      let blowTimeout;

      if (blowInstruction) {
          blowInstruction.onclick = function() {
              if (recognitionActive) return;
              try {
                  blowInstruction.textContent = "Mendengarkan... Tiup layarmu sekarang!";
                  recognition.start();
                  recognitionActive = true;
                  isBlowDetected = false;
                  blowIntensity = 0;
              } catch (e) {
                  console.log('Error Sensor Suara:', e);
                  blowInstruction.textContent = "Gagal menyalakan Mic. Klik untuk coba lagi.";
                  recognitionActive = false;
              }
          };
      }

      recognition.onresult = function(event) {
          for (let i = event.resultIndex; i < event.results.length; i++) {
              const result = event.results[i];

              if (result.isFinal || blowIntensity > 0.4) {
                  isBlowDetected = true;
                  blowIntensity += 0.15;

                  clearTimeout(blowTimeout);
                  blowTimeout = setTimeout(function() {
                      if (flameSize <= 0.4 || blowIntensity > 0.6) {
                          extinguishCandle();
                          try { recognition.stop(); } catch (e) { console.log(e); }
                      }
                      isBlowDetected = false;
                  }, 700);
              }

              // Deteksi desisan angin (tiupan)
              const transcript = result[0]?.transcript?.toLowerCase() || '';
              if (transcript.includes('who') || transcript.includes('fuh') || transcript.includes('shh') || result[0]?.confidence < 0.4) {
                  blowIntensity += 0.2;
                  isBlowDetected = true;
              }
          }
      };

      recognition.onerror = function(event) {
          if (event.error !== 'no-speech' && blowInstruction) {
              blowInstruction.textContent = "Gagal mendeteksi. Klik lagi untuk tiup lilinnya.";
          }
          recognitionActive = false;
          isBlowDetected = false;
      };

      recognition.onend = function() {
          recognitionActive = false;
          if (flameOn && blowInstruction) {
              blowInstruction.textContent = "Klik untuk meniup lilin!";
          }
      };
  } else if (blowInstruction) {
      blowInstruction.textContent = "Browser kamu tidak mendukung sensor suara!";
  }

  if (resetBtn) resetBtn.onclick = resetAll;

  // Jalankan animasi lilin awal
  drawCandle(true, 0, false);
  animateCandle();
};
