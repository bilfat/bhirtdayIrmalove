import confetti from 'canvas-confetti';

export const triggerFlowerConfetti = () => {
  const petalShape = confetti.shapeFromPath({
    path: 'M24 0 C38 15 35 30 24 35 C13 30 10 15 24 0',
  });

  const colors = ['#a3704c', '#c89666', '#4f7cac', '#3a6073'];
  const duration = 3000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,       
      angle: 60,              
      spread: 55,             
      origin: { x: 0 },       
      colors: colors,
      shapes: [petalShape],   
      scalar: 1.2,            
      ticks: 300,             
    });

    confetti({
      particleCount: 5,
      angle: 120,             
      spread: 55,
      origin: { x: 1 },       
      colors: colors,
      shapes: [petalShape],
      scalar: 1.2,
      ticks: 300,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
};
