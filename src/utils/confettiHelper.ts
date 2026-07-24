import confetti from 'canvas-confetti';

export const triggerFlowerConfetti = () => {
  // 1. Membuat bentuk kelopak bunga menggunakan SVG Path
  // Path ini menggambar bentuk melengkung mirip daun atau kelopak mawar
  const petalShape = confetti.shapeFromPath({
    path: 'M24 0 C38 15 35 30 24 35 C13 30 10 15 24 0',
  });

  // 2. Menentukan palet warna (Cokelat muda, Cokelat tua, Biru muda, Biru klasik)
  const colors = ['#a3704c', '#c89666', '#4f7cac', '#3a6073'];

  // 3. Logika durasi dan animasi (berjalan selama 3 detik)
  const duration = 3000;
  const end = Date.now() + duration;

  // 4. Fungsi loop untuk menembakkan kelopak secara terus-menerus
  (function frame() {
    confetti({
      particleCount: 5,       // Jumlah kelopak per tembakan
      angle: 60,              // Sudut tembakan kiri
      spread: 55,             // Seberapa lebar tebarannya
      origin: { x: 0 },       // Ditembakkan dari ujung kiri layar
      colors: colors,
      shapes: [petalShape],   // Menggunakan bentuk kelopak SVG
      scalar: 1.2,            // Ukuran kelopak
      ticks: 300,             // Seberapa lama kelopak melayang sebelum hilang
    });

    confetti({
      particleCount: 5,
      angle: 120,             // Sudut tembakan kanan
      spread: 55,
      origin: { x: 1 },       // Ditembakkan dari ujung kanan layar
      colors: colors,
      shapes: [petalShape],
      scalar: 1.2,
      ticks: 300,
    });

    // Terus tembakkan sampai durasi (3 detik) habis
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
};