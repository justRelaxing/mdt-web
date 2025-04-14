import { shirts } from './shirts.js';

function createShirtCard(shirt) {
  const card = document.createElement('div');
  card.className = 'shirt-card';

  const description = shirt.description || 'Описание отсутствует';

  card.innerHTML = `
    <img src="${shirt.colors?.white?.front || shirt.default?.front}"
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

  card.__shirt__ = shirt;

  return card;
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('shirt-container');
  shirts.forEach(shirt => {
    const card = createShirtCard(shirt);
    container.appendChild(card);
  });

  document.querySelectorAll('.see-page-btn').forEach(btn => {
    btn.onclick = function() {
      const shirtIndex = shirts.indexOf(this.closest('.shirt-card').__shirt__);
      window.location.href = `details.html?id=${shirtIndex}`;
    };
  });

  const quickViewPanel = document.getElementById('quickViewPanel');
  const closeQuickViewBtn = document.getElementById('closeQuickViewBtn');
  const panelImage = document.getElementById('panelImage');
  const panelTitle = document.getElementById('panelTitle');
  const panelPrice = document.getElementById('panelPrice');

  function openQuickView(shirt) {
    panelImage.src = shirt.colors?.white?.front || shirt.default?.front;
    panelTitle.textContent = shirt.name;
    panelPrice.textContent = shirt.price;
    quickViewPanel.classList.add('active');
  }

  function closeQuickView() {
    quickViewPanel.classList.remove('active');
  }

  document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const shirt = this.closest('.shirt-card').__shirt__;
      openQuickView(shirt);
    });
  });

  closeQuickViewBtn.addEventListener('click', closeQuickView);
});
