const state = {
  mascotImage: null,
  generatedDataUrl: '',
};

const matchesList = document.getElementById('matchesList');
const template = document.getElementById('matchTemplate');
const addMatchBtn = document.getElementById('addMatch');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const mascotInput = document.getElementById('mascotInput');
const postCanvas = document.getElementById('postCanvas');
const ctx = postCanvas.getContext('2d');

function addMatchRow(values = {}) {
  const node = template.content.firstElementChild.cloneNode(true);
  const inputs = node.querySelectorAll('input[data-field]');

  inputs.forEach((input) => {
    const field = input.dataset.field;
    input.value = values[field] ?? '';
  });

  node.querySelector('[data-action="remove"]').addEventListener('click', () => {
    node.remove();
  });

  matchesList.appendChild(node);
}

function collectMatches() {
  return [...matchesList.querySelectorAll('.match-item')]
    .map((item) => ({
      title: item.querySelector('[data-field="title"]').value.trim(),
      time: item.querySelector('[data-field="time"]').value.trim(),
      odd: item.querySelector('[data-field="odd"]').value.trim(),
    }))
    .filter((match) => match.title);
}

function drawBackground(themeColor) {
  const gradient = ctx.createLinearGradient(0, 0, 0, postCanvas.height);
  gradient.addColorStop(0, '#091121');
  gradient.addColorStop(0.6, '#122c57');
  gradient.addColorStop(1, '#06111f');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, postCanvas.width, postCanvas.height);

  ctx.globalAlpha = 0.16;
  for (let i = 0; i < 6; i += 1) {
    ctx.fillStyle = themeColor;
    ctx.beginPath();
    ctx.arc(
      80 + i * 180,
      120 + i * 170,
      140 + (i % 2) * 30,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawHeader(title, competition, dateLabel, brandName, themeColor) {
  ctx.fillStyle = themeColor;
  ctx.font = 'bold 76px Arial';
  ctx.fillText(title.toUpperCase(), 60, 120);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 42px Arial';
  ctx.fillText(competition.toUpperCase(), 60, 174);

  ctx.fillStyle = '#0b1728';
  ctx.fillRect(60, 205, 260, 66);
  ctx.fillStyle = '#d7ffef';
  ctx.font = 'bold 38px Arial';
  ctx.fillText(dateLabel, 85, 250);

  ctx.fillStyle = '#d3deff';
  ctx.font = '600 30px Arial';
  ctx.fillText(`Casa: ${brandName}`, 60, 306);
}

function drawMascot() {
  if (!state.mascotImage) return;

  const imgW = 360;
  const imgH = 500;
  const x = postCanvas.width - imgW - 40;
  const y = postCanvas.height - imgH - 80;

  ctx.save();
  ctx.globalAlpha = 0.95;
  ctx.drawImage(state.mascotImage, x, y, imgW, imgH);
  ctx.restore();
}

function drawMatchRows(matches, themeColor) {
  const startY = 360;
  const rowHeight = 130;

  matches.forEach((match, index) => {
    const y = startY + index * rowHeight;

    ctx.fillStyle = '#f4f8ff';
    ctx.fillRect(60, y, 740, 98);

    ctx.fillStyle = '#0c1933';
    ctx.font = 'bold 46px Arial';
    ctx.fillText(match.title.toUpperCase().slice(0, 30), 84, y + 54);

    ctx.font = '600 32px Arial';
    ctx.fillStyle = '#1d3157';
    ctx.fillText(`Horário: ${match.time || '--'}`, 84, y + 88);

    ctx.fillStyle = themeColor;
    ctx.fillRect(820, y, 200, 98);
    ctx.fillStyle = '#06200f';
    ctx.font = 'bold 52px Arial';
    ctx.fillText(match.odd || '-', 870, y + 64);
  });
}

function generateImage() {
  const title = document.getElementById('campaignTitle').value.trim() || 'Jogos do Dia';
  const competition = document.getElementById('competition').value.trim() || 'Competição';
  const brandName = document.getElementById('brandName').value.trim() || 'Sua Casa';
  const themeColor = document.getElementById('themeColor').value;
  const rawDate = document.getElementById('matchDate').value;
  const dateLabel = rawDate ? rawDate.split('-').reverse().join('/') : '--/--/----';
  const matches = collectMatches().slice(0, 7);

  drawBackground(themeColor);
  drawHeader(title, competition, dateLabel, brandName, themeColor);
  drawMatchRows(matches, themeColor);
  drawMascot();

  state.generatedDataUrl = postCanvas.toDataURL('image/png');
  downloadBtn.disabled = false;
}

mascotInput.addEventListener('change', (event) => {
  const [file] = event.target.files;
  if (!file) {
    state.mascotImage = null;
    return;
  }

  const image = new Image();
  image.onload = () => {
    state.mascotImage = image;
  };
  image.src = URL.createObjectURL(file);
});

addMatchBtn.addEventListener('click', () => {
  addMatchRow();
});

generateBtn.addEventListener('click', generateImage);

downloadBtn.addEventListener('click', () => {
  if (!state.generatedDataUrl) return;
  const anchor = document.createElement('a');
  anchor.href = state.generatedDataUrl;
  anchor.download = 'post-jogos-do-dia.png';
  anchor.click();
});

addMatchRow({ title: 'Forest Green x Brighton', time: '15h45', odd: '2.10' });
addMatchRow({ title: 'Leeds x Barnsley', time: '15h45', odd: '1.95' });
addMatchRow({ title: 'Tranmere x Newcastle', time: '15h45', odd: '2.40' });

generateImage();
