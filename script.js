const scale = 4; // Scaling factor (e.g. for 0–100 court to 0–400 canvas)
const textSize = 20; // Font size in px

const files = [
  'data/players/142/2425-01.json',
  'data/players/142/2425-02.json'
];

const canvas = document.getElementById('courtCanvas');
const ctx = canvas.getContext('2d');

const shots = [];

Promise.all(files.map(file => fetch(file).then(r => r.json())))
  .then(jsons => {
    jsons.forEach(data => {
      data.shots.forEach(shot => {
        if (shot.x !== null && shot.y !== null) {
          shots.push(shot);
        }
      });
    });
    drawShots();
  });

function drawShots() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  shots.forEach(shot => {
    const x = shot.x * scale;
    const y = shot.y * scale;
    const made = shot.result === 'success';

    ctx.fillStyle = made ? 'green' : 'red';
    ctx.font = `${textSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(made ? 'O' : 'X', x, y);
  });
}

const tooltip = document.getElementById('tooltip');

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const mouseX = (e.clientX - rect.left) * scaleX;
  const mouseY = (e.clientY - rect.top) * scaleY;

  const radius = textSize;

  const hovered = shots.find(shot => {
    const dx = shot.x * scale - mouseX;
    const dy = shot.y * scale - mouseY;
    return Math.sqrt(dx * dx + dy * dy) < radius;
  });

  if (hovered) {
    tooltip.style.display = 'block';
    tooltip.style.left = `${e.pageX + 12}px`;
    tooltip.style.top = `${e.pageY + 12}px`;
    tooltip.textContent =
      `${hovered.result === 'success' ? 'Made' : hovered.result === 'blocked' ? 'Blocked' : 'Missed'}: ${hovered.type}\n` +
      `Q${hovered.period}, ${hovered.clock}` +
      (hovered.qualifiers?.length ? `\n${hovered.qualifiers.join(', ')}` : '');
  } else {
    tooltip.style.display = 'none';
  }
});

canvas.addEventListener('mouseleave', () => {
  tooltip.style.display = 'none';
});
