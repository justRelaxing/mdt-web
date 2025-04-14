import { shirts } from './shirts.js';

const shirtContainer = document.getElementById('shirt-container');
const quickViewPanel = document.getElementById('quickViewPanel');
const closeQuickView = document.getElementById('closeQuickView');
const panelImage = document.getElementById('panelImage');
const panelTitle = document.getElementById('panelTitle');
const panelPrice = document.getElementById('panelPrice');

function createShirtCard(shirt) {
  const card = document.createElement('div');
  card.className = 'shirt-card';

  const description = shirt.description || 'Описание отсутствует';
  const frontImage = shirt.colors?.white?.front || shirt.default?.front;

  card.innerHTML = `
    <img src="${frontImage}"
         alt="${shirt.name}"
         class="shirt-image"
         onerror="this.src='${shirt.default?.front}'">
    <div class="shirt-info">
      <h3 class="shirt-name">${shirt.name}</h3>
      <p class="shirt-description">${description}</p>
      <p class="shirt-price">${shirt.price}</p>
      <button class="quick-view-btn">Quick View</button>
      <button class="see-page-btn">See Page</button>
    </div>
  `;

  const quickViewBtn = card.querySelector('.quick-view-btn');
  quickViewBtn.addEventListener('click', () => {
    openQuickView(shirt);
  });

  return card;
}

function openQuickView(shirt) {
  panelImage.src = shirt.colors?.white?.front || shirt.default?.front;
  panelTitle.textContent = shirt.name;
  panelPrice.textContent = shirt.price;

  quickViewPanel.classList.add('active');
}

function closePanel() {
  quickViewPanel.classList.remove('active');
}

closeQuickView.addEventListener('click', closePanel);

document.addEventListener('DOMContentLoaded', () => {
  shirts.forEach(shirt => {
    const card = createShirtCard(shirt);
    shirtContainer.appendChild(card);
  });
});