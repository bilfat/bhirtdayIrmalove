import confetti from 'canvas-confetti';

export const triggerFlowerConfetti = () => {
  // 1. Create a beautiful flower petal shape using SVG Path
  const petalShape = confetti.shapeFromPath({
    path: 'M24 0 C38 15 35 30 24 35 C13 30 10 15 24 0',
  });

  // 2. Color Palette (warm browns, classic blues, light rose pink)
  const colors = ['#a3704c', '#c89666', '#4f7cac', '#3a6073', '#ffb6c1', '#fdfdfb'];

  // 3. 5.5-second dramatic duration
  const duration = 5500;
  const end = Date.now() + duration;

  // 4. Double frame loop to fire dense particles from both sides
  (function frame() {
    // Left burst — denser particles, faster speed (startVelocity & gravity increased)
    confetti({
      particleCount: 10,
      angle: 60,
      spread: 80,
      origin: { x: 0, y: 0.75 },
      colors: colors,
      shapes: [petalShape],
      scalar: 1.4,
      startVelocity: 60,   // Blasts out faster (default is 45)
      gravity: 1.35,       // Falls quicker (default is 1.0)
      ticks: 220,          // Quicker fadeout to match higher velocity
      drift: 0.6,
    });

    // Right burst — denser particles, faster speed (startVelocity & gravity increased)
    confetti({
      particleCount: 10,
      angle: 120,
      spread: 80,
      origin: { x: 1, y: 0.75 },
      colors: colors,
      shapes: [petalShape],
      scalar: 1.4,
      startVelocity: 60,   // Blasts out faster
      gravity: 1.35,       // Falls quicker
      ticks: 220,          // Quicker fadeout to match higher velocity
      drift: -0.6,
    });

    // Central splash occasionally for added density
    if (Math.random() < 0.15) {
      confetti({
        particleCount: 8,
        angle: 90,
        spread: 100,
        origin: { x: 0.5, y: 0.55 },
        colors: colors,
        shapes: [petalShape],
        scalar: 1.25,
        startVelocity: 45,
        gravity: 1.4,
        ticks: 180,
      });
    }

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
};