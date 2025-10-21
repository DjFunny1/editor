const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        let img = new Image();
        let isGif = false;
        let shape = 'square';
        let zoom = 1;
        let offsetX = 0;
        let offsetY = 0;
        let dragging = false;
        let imgX = 0;
        let imgY = 0;
        let currentFilter = 'none';
        let rotation = 0;
        let flipHorizontal = false;
        let flipVertical = false;
        let text1 = '';
        let textX1 = 225;
        let textY1 = 225;
        let fontSize1 = 30;
        let textColor1 = '#000000';
        let text2 = '';
        let textX2 = 225;
        let textY2 = 275;
        let fontSize2 = 30;
        let textColor2 = '#000000';
        let draggingText = 0; // 0: none, 1: text1, 2: text2
        let textOffsetX = 0;
        let textOffsetY = 0;

        document.getElementById('fileInput').addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                console.log('Loading file:', file.name);
                const reader = new FileReader();
                reader.onload = (e) => {
                    img = new Image();
                    img.src = e.target.result;
                    isGif = file.type === 'image/gif';
                    document.getElementById('errorMessage').style.display = 'none';
                    console.log('File loaded successfully:', file.name);
                };
                reader.onerror = () => {
                    console.error('Error reading file:', file.name);
                    document.getElementById('errorMessage').textContent = 'Error reading the file. Please try another file.';
                    document.getElementById('errorMessage').style.display = 'block';
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                };
                reader.readAsDataURL(file);
            }
        });

        img.onload = () => {
            console.log('Image loaded successfully:', img.src);
            drawImage();
            document.getElementById('errorMessage').style.display = 'none';
        };

        img.onerror = () => {
            console.error('Failed to load image:', img.src);
            document.getElementById('errorMessage').textContent = 'Failed to load image: The server may not support CORS, or the URL is invalid. Try downloading the image and uploading it locally.';
            document.getElementById('errorMessage').style.display = 'block';
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };

        function loadImageFromUrl() {
            const url = document.getElementById('urlInput').value.trim();
            const errorMessage = document.getElementById('errorMessage');
            const urlPattern = /^(https?:\/\/.*\.(?:jpg|jpeg|png|gif|bmp|webp|svg))(\?.*)?$/i;
            if (!url) {
                errorMessage.textContent = 'Please enter a URL.';
                errorMessage.style.display = 'block';
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                return;
            }
            if (!urlPattern.test(url)) {
                errorMessage.textContent = 'Please enter a valid image URL ending in .jpg, .jpeg, .png, .gif, .bmp, .webp, or .svg.';
                errorMessage.style.display = 'block';
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                return;
            }

            console.log('Attempting to load image from URL:', url);
            errorMessage.style.display = 'none';
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = url;
            isGif = url.toLowerCase().endsWith('.gif');

            const loadTimeout = setTimeout(() => {
                if (!img.complete && img.naturalWidth === 0) {
                    console.error('Image load timeout:', url);
                    errorMessage.textContent = 'Image load timed out: The server may not support CORS, or the URL is not accessible. Try downloading the image and uploading it locally.';
                    errorMessage.style.display = 'block';
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            }, 5000);

            img.onload = () => {
                clearTimeout(loadTimeout);
                console.log('Image loaded successfully:', img.src);
                drawImage();
                errorMessage.style.display = 'none';
            };

            img.onerror = () => {
                clearTimeout(loadTimeout);
                console.error('Failed to load image:', url);
                errorMessage.textContent = 'Failed to load image: The server may not support CORS, or the URL is invalid. Try downloading the image and uploading it locally.';
                errorMessage.style.display = 'block';
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            };
        }

        function resetImage() {
            img = new Image();
            isGif = false;
            shape = 'square';
            zoom = 1;
            imgX = 0;
            imgY = 0;
            currentFilter = 'none';
            rotation = 0;
            flipHorizontal = false;
            flipVertical = false;
            text1 = '';
            textX1 = 225;
            textY1 = 225;
            fontSize1 = 30;
            textColor1 = '#000000';
            text2 = '';
            textX2 = 225;
            textY2 = 275;
            fontSize2 = 30;
            textColor2 = '#000000';
            document.getElementById('zoomSlider').value = 50;
            document.getElementById('fileInput').value = '';
            document.getElementById('urlInput').value = '';
            document.getElementById('textInput1').value = '';
            document.getElementById('textColor1').value = '#000000';
            document.getElementById('fontSizeSlider1').value = 30;
            document.getElementById('textInput2').value = '';
            document.getElementById('textColor2').value = '#000000';
            document.getElementById('fontSizeSlider2').value = 30;
            document.getElementById('shapeSelect').value = 'square';
            document.getElementById('filterSelect').value = 'none';
            document.getElementById('downloadLink').style.display = 'none';
            document.getElementById('errorMessage').style.display = 'none';
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        function setShape(selectedShape) {
            shape = selectedShape;
            drawImage();
        }

        function setFilter(filter) {
            currentFilter = filter;
            drawImage();
        }

        function rotateImage(degrees) {
            rotation += degrees * (Math.PI / 180);
            drawImage();
        }

        function flipImage(direction) {
            if (direction === 'horizontal') {
                flipHorizontal = !flipHorizontal;
            } else if (direction === 'vertical') {
                flipVertical = !flipVertical;
            }
            drawImage();
        }

        function updateZoom() {
            const sliderValue = parseFloat(document.getElementById('zoomSlider').value);
            zoom = 0.1 + (sliderValue / 100) * (2 - 0.1);
            drawImage();
        }

        function updateText() {
            text1 = document.getElementById('textInput1').value;
            textColor1 = document.getElementById('textColor1').value;
            fontSize1 = parseInt(document.getElementById('fontSizeSlider1').value);
            text2 = document.getElementById('textInput2').value;
            textColor2 = document.getElementById('textColor2').value;
            fontSize2 = parseInt(document.getElementById('fontSizeSlider2').value);
            drawImage();
        }

        canvas.addEventListener('mousedown', (event) => {
            if (event.target.tagName.toLowerCase() === 'input' && event.target.type === 'color') {
                return;
            }

            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            ctx.font = `${fontSize1}px Arial`;
            const textMetrics1 = ctx.measureText(text1);
            const textWidth1 = textMetrics1.width;
            const textHeight1 = fontSize1 * 1.2;
            if (text1 && mouseX >= textX1 - textWidth1 / 2 && mouseX <= textX1 + textWidth1 / 2 &&
                mouseY >= textY1 - textHeight1 / 2 && mouseY <= textY1 + textHeight1 / 2) {
                draggingText = 1;
                textOffsetX = mouseX - textX1;
                textOffsetY = mouseY - textY1;
                return;
            }

            ctx.font = `${fontSize2}px Arial`;
            const textMetrics2 = ctx.measureText(text2);
            const textWidth2 = textMetrics2.width;
            const textHeight2 = fontSize2 * 1.2;
            if (text2 && mouseX >= textX2 - textWidth2 / 2 && mouseX <= textX2 + textWidth2 / 2 &&
                mouseY >= textY2 - textHeight2 / 2 && mouseY <= textY2 + textHeight2 / 2) {
                draggingText = 2;
                textOffsetX = mouseX - textX2;
                textOffsetY = mouseY - textY2;
                return;
            }

            dragging = true;
            offsetX = mouseX;
            offsetY = mouseY;
        });

        canvas.addEventListener('mouseup', () => {
            dragging = false;
            draggingText = 0;
        });

        canvas.addEventListener('mousemove', (event) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            if (dragging) {
                const dx = mouseX - offsetX;
                const dy = mouseY - offsetY;
                offsetX = mouseX;
                offsetY = mouseY;
                imgX += dx;
                imgY += dy;
                drawImage();
            } else if (draggingText === 1) {
                textX1 = mouseX - textOffsetX;
                textY1 = mouseY - textOffsetY;
                drawImage();
            } else if (draggingText === 2) {
                textX2 = mouseX - textOffsetX;
                textY2 = mouseY - textOffsetY;
                drawImage();
            }
        });

        document.getElementById('textColor1').addEventListener('mousedown', (event) => {
            event.stopPropagation();
        });
        document.getElementById('textColor2').addEventListener('mousedown', (event) => {
            event.stopPropagation();
        });

        function drawImage() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (!img.src || !img.complete || img.naturalWidth === 0) {
                console.log('Cannot draw image: Image not loaded or invalid');
                return;
            }
            console.log('Drawing image:', img.src);
            ctx.save();
            switch (currentFilter) {
                case 'grayscale':
                    ctx.filter = 'grayscale(100%)';
                    break;
                case 'sepia':
                    ctx.filter = 'sepia(100%)';
                    break;
                case 'invert':
                    ctx.filter = 'invert(100%)';
                    break;
                case 'blur':
                    ctx.filter = 'blur(5px)';
                    break;
                default:
                    ctx.filter = 'none';
                    break;
            }

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            ctx.beginPath();
            switch (shape) {
                case 'circle':
                    ctx.arc(cx, cy, canvas.width / 2, 0, Math.PI * 2);
                    break;
                case 'triangle':
                    ctx.moveTo(cx, 0);
                    ctx.lineTo(canvas.width, canvas.height);
                    ctx.lineTo(0, canvas.height);
                    ctx.closePath();
                    break;
                case 'heart':
                    const scale = 1.4;
                    ctx.moveTo(cx, cy + 45 + 112.5 * scale);
                    ctx.bezierCurveTo(cx - 236.25 * scale, cy + 45 - 67.5 * scale, cx - 180 * scale, cy + 45 - 292.5 * scale, cx, cy + 45 - 112.5 * scale);
                    ctx.bezierCurveTo(cx + 180 * scale, cy + 45 - 292.5 * scale, cx + 236.25 * scale, cy + 45 - 67.5 * scale, cx, cy + 45 + 112.5 * scale);
                    ctx.closePath();
                    break;
                case 'star':
                    const spikes = 5;
                    const outerRadius = canvas.width / 2;
                    const innerRadius = canvas.width / 4;
                    for (let i = 0; i < spikes * 2; i++) {
                        const radius = i % 2 === 0 ? outerRadius : innerRadius;
                        const angle = (Math.PI * i) / spikes;
                        ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
                    }
                    ctx.closePath();
                    break;
                case 'octagon':
                    const radius = canvas.width / 2;
                    const sides = 8;
                    for (let i = 0; i < sides; i++) {
                        const angle = (Math.PI * 2 * i) / sides - Math.PI / 8;
                        ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
                    }
                    ctx.closePath();
                    break;
                case 'cloud':
                    ctx.arc(cx - 90, cy - 67.5, 90, 0, 2 * Math.PI);
                    ctx.arc(cx - 22.5, cy - 90, 67.5, 0, 2 * Math.PI);
                    ctx.arc(cx + 22.5, cy - 90, 67.5, 0, 2 * Math.PI);
                    ctx.arc(cx + 90, cy - 67.5, 90, 0, 2 * Math.PI);
                    ctx.arc(cx - 90, cy + 67.5, 90, 0, 2 * Math.PI);
                    ctx.arc(cx - 22.5, cy + 90, 67.5, 0, 2 * Math.PI);
                    ctx.arc(cx + 22.5, cy + 90, 78.75, 0, 2 * Math.PI);
                    ctx.arc(cx + 90, cy + 67.5, 90, 0, 2 * Math.PI);
                    ctx.arc(cx - 135, cy, 78.75, 0, 2 * Math.PI);
                    ctx.arc(cx + 135, cy, 78.75, 0, 2 * Math.PI);
                    ctx.arc(cx, cy, 163.125, 0, 2 * Math.PI);
                    ctx.closePath();
                    break;
                case 'musicalnote':
                    ctx.ellipse(cx - 92.25, cy + 157.5, 101.25, 67.5, 0, 0, 2 * Math.PI);
                    ctx.rect(cx - 8.4375, cy - 146.25, 16.875, 303.75);
                    ctx.moveTo(cx, cy - 146.25);
                    ctx.bezierCurveTo(cx, cy - 146.25, cx + 118.125, cy - 196.875, cx + 168.75, cy - 61.875);
                    ctx.bezierCurveTo(cx + 168.75, cy - 61.875, cx + 84.375, cy - 129.375, cx, cy - 78.75);
                    ctx.closePath();
                    break;
                case 'drop':
                    ctx.moveTo(cx, cy - 200);
                    ctx.bezierCurveTo(cx - 80, cy - 100, cx - 110, cy, cx - 125, cy + 75);
                    ctx.arc(cx, cy + 75, 125, Math.PI, 0, true);
                    ctx.bezierCurveTo(cx + 110, cy, cx + 80, cy - 100, cx, cy - 200);
                    ctx.closePath();
                    break;
                case 'square':
                default:
                    ctx.rect(0, 0, canvas.width, canvas.height);
                    break;
            }
            ctx.clip();

            ctx.translate(cx, cy);
            ctx.rotate(rotation);
            ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
            ctx.translate(-cx, -cy);

            const imgWidth = img.width * zoom;
            const imgHeight = img.height * zoom;
            ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);

            ctx.restore();

            if (text1) {
                ctx.save();
                ctx.font = `${fontSize1}px Arial`;
                ctx.fillStyle = textColor1;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(text1, textX1, textY1);
                ctx.restore();
            }

            if (text2) {
                ctx.save();
                ctx.font = `${fontSize2}px Arial`;
                ctx.fillStyle = textColor2;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(text2, textX2, textY2);
                ctx.restore();
            }
        }

        function saveImage() {
            const link = document.getElementById('downloadLink');
            const errorMessage = document.getElementById('errorMessage');
            if (!img.src || !img.complete || img.naturalWidth === 0) {
                errorMessage.textContent = 'No valid image loaded. Please load a valid image or GIF.';
                errorMessage.style.display = 'block';
                return;
            }
            try {
                link.href = canvas.toDataURL('image/png');
                link.download = 'cropped-image.png';
                link.style.display = 'inline';
                link.textContent = 'Descargar Imagen Recortada';
                errorMessage.style.display = 'none';
            } catch (e) {
                console.error('Error saving image:', e.message);
                errorMessage.textContent = 'No se puede guardar la imagen: El origen de la imagen no soporta CORS. Prueba subir un archivo local.';
                errorMessage.style.display = 'block';
            }
        }

// Mostrar/Ocultar modal
const favoritesButton = document.getElementById('favoritesButton');
const favoritesModal = document.getElementById('favoritesModal');
const closeButton = document.querySelector('.close-button');
const favoritesGallery = document.getElementById('favoritesGallery');

favoritesButton.addEventListener('click', () => {
  renderFavorites();
  favoritesModal.style.display = 'block';
});

closeButton.addEventListener('click', () => {
  favoritesModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === favoritesModal) {
    favoritesModal.style.display = 'none';
  }
});

// Guardar imagen en localStorage al descargar
function saveImage() {
  const link = document.getElementById('downloadLink');
  const errorMessage = document.getElementById('errorMessage');
  if (!img.src || !img.complete || img.naturalWidth === 0) {
    errorMessage.textContent = 'No valid image loaded. Please load a valid image or GIF.';
    errorMessage.style.display = 'block';
    return;
  }
  try {
    const dataUrl = canvas.toDataURL('image/png');
    link.href = dataUrl;
    link.download = 'cropped-image.png';
    link.style.display = 'inline';
    link.textContent = 'Descargar Imagen Recortada';
    errorMessage.style.display = 'none';

    // Guardar en favoritos
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const newFavorite = {
      id: Date.now(),
      dataUrl: dataUrl
    };
    favorites.push(newFavorite);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  } catch (e) {
    console.error('Error saving image:', e.message);
    errorMessage.textContent = 'No se puede guardar la imagen: El origen de la imagen no soporta CORS. Prueba subir un archivo local.';
    errorMessage.style.display = 'block';
  }
}

// Renderizar favoritos en la modal
function renderFavorites() {
  favoritesGallery.innerHTML = '';
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  favorites.forEach(fav => {
    const item = document.createElement('div');
    item.className = 'gallery-item';

    const img = document.createElement('img');
    img.src = fav.dataUrl;

    const actions = document.createElement('div');
    actions.className = 'actions';

    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = '⬇️';
    downloadBtn.onclick = () => {
      const a = document.createElement('a');
      a.href = fav.dataUrl;
      a.download = `favorito-${fav.id}.png`;
      a.click();
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.onclick = () => {
      const updated = favorites.filter(f => f.id !== fav.id);
      localStorage.setItem('favorites', JSON.stringify(updated));
      renderFavorites();
    };

    actions.appendChild(downloadBtn);
    actions.appendChild(deleteBtn);
    item.appendChild(img);
    item.appendChild(actions);
    favoritesGallery.appendChild(item);
  });
}

document.querySelector('.scroll-top').addEventListener('click', function(e) {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

const toggle = document.getElementById('modo-toggle');
const body = document.body;

// Cargar preferencia guardada
if (localStorage.getItem('modo') === 'oscuro') {
  body.classList.add('dark-mode');
  toggle.textContent = '☀️';
}

toggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const modo = body.classList.contains('dark-mode') ? 'oscuro' : 'claro';
  localStorage.setItem('modo', modo);
  toggle.textContent = modo === 'oscuro' ? '☀️' : '🌙';
});