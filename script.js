/*
 * Client-side logic for the JoyCity marketplace.
 *
 * Handles rendering of pages, cart management, checkout flow and order tracking.
 * The script detects which page is loaded via the `data-page` attribute on the
 * <body> tag and runs the appropriate initialization function.
 */

// Utility: parse query parameters from the current URL
function getQueryParams() {
  const params = {};
  const queryString = window.location.search.substring(1);
  const pairs = queryString.split('&');
  pairs.forEach(pair => {
    if (!pair) return;
    const [key, value] = pair.split('=');
    params[decodeURIComponent(key)] = decodeURIComponent(value || '');
  });
  return params;
}

// Cart functions
function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: productId, quantity });
  }
  saveCart(cart);
  updateCartBadge();
}

function updateCartBadge() {
  const cart = getCart();
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const badge = document.querySelector('header .actions .cart-badge');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// Home page initialization
function initHomePage() {
  // Render categories grid
  const categoriesContainer = document.querySelector('.categories');
  if (categoriesContainer) {
    // Clear previous items if any
    categoriesContainer.innerHTML = '';
    // Determine unique categories from products array
    const categoriesSet = new Set(products.map(p => p.category));
    const categories = Array.from(categoriesSet);
    categories.forEach(cat => {
      const card = document.createElement('div');
      card.className = 'category-card';
      // Use emoji or placeholder image for categories
      // Choose a simple emoji based on category for visual variety
      const emojiMap = {
        'Женщинам': '👗',
        'Обувь': '👟',
        'Детям': '🧸',
        'Мужчинам': '👕',
        'Электроника': '📱',
        'Красота': '💄',
        'Спорт': '🏃',
        'Дом': '🏠',
        'Игрушки': '🧸',
        'Бытовая техника': '🔌',
        'Книги': '📚',
        'Для ремонта': '🔧'
      };
      const emoji = emojiMap[cat] || '🛍️';
      const emojiEl = document.createElement('div');
      emojiEl.textContent = emoji;
      emojiEl.style.fontSize = '2rem';
      emojiEl.style.marginBottom = '0.5rem';
      const span = document.createElement('span');
      span.textContent = cat;
      card.appendChild(emojiEl);
      card.appendChild(span);
      card.addEventListener('click', () => {
        // Navigate to product list page with category parameter
        window.location.href = `product-list.html?category=${encodeURIComponent(cat)}`;
      });
      categoriesContainer.appendChild(card);
    });
  }
  // Render featured products (first 4 products)
  const productsContainer = document.querySelector('.products');
  if (productsContainer) {
    const featured = products.slice(0, 4);
    featured.forEach(product => {
      const card = createProductCard(product);
      productsContainer.appendChild(card);
    });
  }
}

// Helper to create a product card element
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  const img = document.createElement('img');
  img.src = product.imageUrl;
  img.alt = product.name;
  const info = document.createElement('div');
  info.className = 'info';
  const title = document.createElement('h3');
  title.textContent = product.name;
  const price = document.createElement('div');
  price.className = 'price';
  price.textContent = `${product.price.toFixed(2)} €`;
  const button = document.createElement('button');
  button.textContent = 'В корзину';
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    addToCart(product.id);
  });
  info.appendChild(title);
  info.appendChild(price);
  info.appendChild(button);
  card.appendChild(img);
  card.appendChild(info);
  card.addEventListener('click', () => {
    window.location.href = `product.html?id=${product.id}`;
  });
  return card;
}

// Product list page initialization
function initProductListPage() {
  const params = getQueryParams();
  const category = params.category || '';
  const heading = document.querySelector('.product-list-header h2');
  if (heading) {
    heading.textContent = category ? `Категория: ${category}` : 'Все товары';
  }
  const listContainer = document.querySelector('.products');
  if (!listContainer) return;
  // Sorting select
  const sortSelect = document.querySelector('#sort-select');
  // Filter products by category
  let filtered = category ? products.filter(p => p.category === category) : products.slice();
  function renderList(arr) {
    listContainer.innerHTML = '';
    arr.forEach(prod => {
      const card = createProductCard(prod);
      listContainer.appendChild(card);
    });
  }
  renderList(filtered);
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const value = sortSelect.value;
      if (value === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (value === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
      }
      renderList(filtered);
    });
  }
}

// Product detail page initialization
function initProductDetailPage() {
  const params = getQueryParams();
  const productId = parseInt(params.id, 10);
  const product = products.find(p => p.id === productId);
  if (!product) return;
  // Populate details
  const imgEl = document.querySelector('.product-detail .image-gallery img');
  const titleEl = document.querySelector('.product-detail .details h2');
  const priceEl = document.querySelector('.product-detail .details .price');
  const descEl = document.querySelector('.product-detail .details .description');
  const addBtn = document.querySelector('.product-detail .details button');
  if (imgEl) {
    imgEl.src = product.imageUrl;
    imgEl.alt = product.name;
  }
  if (titleEl) titleEl.textContent = product.name;
  if (priceEl) priceEl.textContent = `${product.price.toFixed(2)} €`;
  if (descEl) descEl.textContent = product.description;
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      addToCart(product.id);
    });
  }
}

// Cart page initialization
function initCartPage() {
  const cartItemsContainer = document.querySelector('.cart-items');
  const totalEl = document.querySelector('.cart-summary .total-amount');
  const checkoutBtn = document.querySelector('.cart-summary button');
  function renderCart() {
    const cart = getCart();
    cartItemsContainer.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (!product) return;
      const cartItemEl = document.createElement('div');
      cartItemEl.className = 'cart-item';
      const img = document.createElement('img');
      img.src = product.imageUrl;
      img.alt = product.name;
      const info = document.createElement('div');
      info.className = 'info';
      const title = document.createElement('h3');
      title.textContent = product.name;
      const price = document.createElement('div');
      price.className = 'price';
      price.textContent = `${product.price.toFixed(2)} €`;
      info.appendChild(title);
      info.appendChild(price);
      const actions = document.createElement('div');
      actions.className = 'actions';
      const qtyInput = document.createElement('input');
      qtyInput.type = 'number';
      qtyInput.min = 1;
      qtyInput.value = item.quantity;
      qtyInput.addEventListener('change', () => {
        const qty = parseInt(qtyInput.value, 10);
        if (qty > 0) {
          item.quantity = qty;
          saveCart(cart);
          renderCart();
        }
      });
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Удалить';
      removeBtn.addEventListener('click', () => {
        const index = cart.indexOf(item);
        cart.splice(index, 1);
        saveCart(cart);
        renderCart();
        updateCartBadge();
      });
      actions.appendChild(qtyInput);
      actions.appendChild(removeBtn);
      cartItemEl.appendChild(img);
      cartItemEl.appendChild(info);
      cartItemEl.appendChild(actions);
      cartItemsContainer.appendChild(cartItemEl);
      total += product.price * item.quantity;
    });
    if (totalEl) {
      totalEl.textContent = `${total.toFixed(2)} €`;
    }
    if (checkoutBtn) {
      checkoutBtn.disabled = cart.length === 0;
    }
  }
  renderCart();
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      // Navigate to checkout page
      window.location.href = 'checkout.html';
    });
  }
}

// Checkout page initialization
function initCheckoutPage() {
  const cart = getCart();
  const tableBody = document.querySelector('.checkout-summary tbody');
  const totalEl = document.querySelector('.checkout-summary .total-amount');
  const orderBtn = document.querySelector('.checkout-container button');
  let total = 0;
  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return;
    const row = document.createElement('tr');
    const nameTd = document.createElement('td');
    nameTd.textContent = product.name;
    const qtyTd = document.createElement('td');
    qtyTd.textContent = item.quantity;
    const priceTd = document.createElement('td');
    priceTd.textContent = `${(product.price * item.quantity).toFixed(2)} €`;
    row.appendChild(nameTd);
    row.appendChild(qtyTd);
    row.appendChild(priceTd);
    tableBody.appendChild(row);
    total += product.price * item.quantity;
  });
  if (totalEl) totalEl.textContent = `${total.toFixed(2)} €`;
  if (orderBtn) {
    orderBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (cart.length === 0) return;
      // Create order
      const now = new Date();
      const shippingDays = 4;
      const expectedDate = new Date(now.getTime() + shippingDays * 24 * 60 * 60 * 1000);
      const order = {
        id: `ORD-${Date.now()}`,
        items: cart,
        orderDate: now.toISOString(),
        expectedDeliveryDate: expectedDate.toISOString(),
      };
      localStorage.setItem('currentOrder', JSON.stringify(order));
      // Clear cart
      localStorage.removeItem('cart');
      updateCartBadge();
      // Redirect to tracking page
      window.location.href = 'order-tracking.html';
    });
  }
}

// Order tracking page initialization
function initOrderTrackingPage() {
  const order = JSON.parse(localStorage.getItem('currentOrder') || 'null');
  const container = document.querySelector('.tracking-container');
  if (!order || !container) {
    if (container) container.innerHTML = '<p>Заказ не найден. Пожалуйста, оформите заказ.</p>';
    return;
  }
  const orderDate = new Date(order.orderDate);
  const expectedDate = new Date(order.expectedDeliveryDate);
  // Display order ID and dates
  const infoEl = container.querySelector('.tracking-info');
  if (infoEl) {
    infoEl.innerHTML = `<p><strong>Номер заказа:</strong> ${order.id}</p>
      <p><strong>Дата заказа:</strong> ${orderDate.toLocaleDateString()}</p>
      <p><strong>Ожидаемая дата доставки:</strong> ${expectedDate.toLocaleDateString()}</p>`;
  }
  // Define steps with offset days
  const steps = [
    { name: 'Заказ оформлен', offset: 0 },
    { name: 'Упакован', offset: 1 },
    { name: 'Передан в доставку', offset: 2 },
    { name: 'В пути', offset: 3 },
    { name: 'Доставлен', offset: 4 },
  ];
  const stepsContainer = container.querySelector('.tracking-steps');
  stepsContainer.innerHTML = '';
  const now = new Date();
  steps.forEach(step => {
    const stepDate = new Date(orderDate.getTime() + step.offset * 24 * 60 * 60 * 1000);
    const completed = now >= stepDate;
    const stepEl = document.createElement('div');
    stepEl.className = 'tracking-step' + (completed ? ' completed' : '');
    const icon = document.createElement('div');
    icon.className = 'icon';
    icon.innerHTML = completed ? '✔️' : '⏳';
    const details = document.createElement('div');
    details.className = 'details';
    const nameEl = document.createElement('div');
    nameEl.className = 'name';
    nameEl.textContent = step.name;
    const dateEl = document.createElement('div');
    dateEl.className = 'date';
    dateEl.textContent = stepDate.toLocaleDateString();
    details.appendChild(nameEl);
    details.appendChild(dateEl);
    stepEl.appendChild(icon);
    stepEl.appendChild(details);
    stepsContainer.appendChild(stepEl);
  });
  // Countdown timer
  const countdownEl = container.querySelector('.countdown');
  function updateCountdown() {
    const now = new Date();
    const diffMs = expectedDate - now;
    if (diffMs <= 0) {
      countdownEl.textContent = 'Заказ доставлен!';
      clearInterval(interval);
      return;
    }
    const diffSec = Math.floor(diffMs / 1000);
    const days = Math.floor(diffSec / 86400);
    const hours = Math.floor((diffSec % 86400) / 3600);
    const minutes = Math.floor((diffSec % 3600) / 60);
    const seconds = diffSec % 60;
    countdownEl.textContent = `До доставки осталось: ${days}д ${hours}ч ${minutes}м ${seconds}с`;
  }
  updateCountdown();
  const interval = setInterval(updateCountdown, 1000);
}

// Main entry: run appropriate initialization on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  const page = document.body.getAttribute('data-page');
  switch (page) {
    case 'home':
      initHomePage();
      break;
    case 'product-list':
      initProductListPage();
      break;
    case 'product-detail':
      initProductDetailPage();
      break;
    case 'cart':
      initCartPage();
      break;
    case 'checkout':
      initCheckoutPage();
      break;
    case 'order-tracking':
      initOrderTrackingPage();
      break;
    default:
      break;
  }
});