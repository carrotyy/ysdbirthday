// --- 1. SISTEM COUNTDOWN & LAYAR ---
const targetDate = new Date('August 18, 2026 00:00:00').getTime();

const layarHitam = document.getElementById('layar-hitam');
const layarBiru = document.getElementById('layar-biru');
const btnLights = document.getElementById('btn-lights');
const btnWorld = document.getElementById('btn-world');
const wadahCountdown = document.getElementById('countdown');
const judulTunggu = document.getElementById('judul-tunggu');

let countdownInterval;

// Saat "Turn On Lights" diklik
btnLights.addEventListener('click', () => {
  layarHitam.classList.add('hilang');
  
  setTimeout(() => {
    layarHitam.style.display = 'none';
    mulaiCountdown();
  }, 2000);
});

// Fungsi Mulai Countdown
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

// Saat "Into Your World" diklik
btnWorld.addEventListener('click', () => {
  layarBiru.classList.add('kembali-hitam');
  
  btnWorld.classList.add('hilang');
  judulTunggu.classList.add('hilang');

  setTimeout(() => {
    layarBiru.classList.add('hilang');
    
    then = timestamp();
    jalankanKembangApi();
  }, 3000);
});

// --- 2. MESIN KEMBANG API ---
const PI2 = Math.PI * 2;
const random = (min, max) => Math.random() * (max - min + 1) + min | 0;
const timestamp = _ => new Date().getTime();

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
     let count = random(3, 5);
     for(let i = 0; i < count; i++) {
       this.fireworks.push(new Firework(
          random(this.spawnA, this.spawnB),
          this.height,
          x,
          y,
          random(0, 260),
          random(30, 110)
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

    this.counter += delta * 3; 
    if (this.counter >= 1) {
      this.fireworks.push(new Firework(
        random(this.spawnA, this.spawnB),
        this.height,
        random(0, this.width),
        random(this.spawnC, this.spawnD),
        random(0, 360),
        random(30, 110)));
      this.counter = 0;
    }

    if (this.fireworks.length > 1000) this.fireworks = this.fireworks.filter(firework => !firework.dead);
  }
}

class Firework {
  constructor(x, y, targetX, targetY, shade, offsprings) {
    this.dead = false;
    this.offsprings = offsprings;
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.shade = shade;
    this.history = [];
  }
  update(delta) {
    if (this.dead) return;

    let xDiff = this.targetX - this.x;
    let yDiff = this.targetY - this.y;
    if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) {
      this.x += xDiff * 2 * delta;
      this.y += yDiff * 2 * delta;
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
      this.madeChilds = true;
      this.history.shift();
    }
    
    if (this.history.length === 0) this.dead = true;
    else if (this.offsprings) { 
        for (let i = 0; this.history.length > i; i++) {
          let point = this.history[i];
          ctx.beginPath();
          ctx.fillStyle = 'hsl(' + this.shade + ',100%,' + i + '%)';
          ctx.arc(point.x, point.y, 1, 0, PI2, false);
          ctx.fill();
        } 
      } else {
      ctx.beginPath();
      ctx.fillStyle = 'hsl(' + this.shade + ',100%,50%)';
      ctx.arc(this.x, this.y, 1, 0, PI2, false);
      ctx.fill();
    }
  }
}

let canvas = document.getElementById('birthday');
let ctx = canvas.getContext('2d');
let then = timestamp();
let birthday = new Birthday();

window.onresize = () => birthday.resize();

// --- KLIK & SENTUH ---
let isTouching = false;
let lastSpawn = 0;

const handleInput = (e) => {
  let x = e.clientX || (e.touches && e.touches[0].clientX);
  let y = e.clientY || (e.touches && e.touches[0].clientY);
  
  let now = timestamp();
  if (now - lastSpawn > 50) { 
    birthday.spawnAt(x, y);
    lastSpawn = now;
  }
};

window.addEventListener('mousedown', (e) => { isTouching = true; handleInput(e); });
window.addEventListener('mousemove', (e) => { if (isTouching) handleInput(e); });
window.addEventListener('mouseup', () => isTouching = false);
window.addEventListener('touchstart', (e) => { isTouching = true; handleInput(e); }, { passive: false });
window.addEventListener('touchmove', (e) => { if (isTouching) { e.preventDefault(); handleInput(e); } }, { passive: false });
window.addEventListener('touchend', () => isTouching = false);

function jalankanKembangApi(){
  requestAnimationFrame(jalankanKembangApi);
  let now = timestamp();
  let delta = now - then;
  then = now;
  birthday.update(delta / 1000);
}
