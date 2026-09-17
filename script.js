function getCart() {
  return JSON.parse(localStorage.getItem('dance_bash_cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('dance_bash_cart', JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(id, name, price) {
  let cart = getCart();
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }

  saveCart(cart);
  alert(`${name} をカートに追加しました！`);
}

function updateQuantity(id, newQty) {
  let cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity = parseInt(newQty) || 1;
    saveCart(cart);
    renderCartPage();
  }
}

function removeItem(id) {
  let cart = getCart().filter(item => item.id !== id);
  saveCart(cart);
  renderCartPage();
}

function updateCartBadge() {
  const cart = getCart();
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const badge = document.getElementById('cart-count');
  if (badge) badge.innerText = count;
}

function renderCartPage() {
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  if (!container || !totalEl) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = '<p>カートに商品が入っていません。</p>';
    totalEl.innerText = '0.00';
    return;
  }

  container.innerHTML = '';
  let grandTotal = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    grandTotal += itemTotal;

    container.innerHTML += `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong><br>
          <small>単価: $${item.price.toFixed(2)}</small>
        </div>
        <div class="cart-controls">
          <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity('${item.id}', this.value)">
          <span>$${itemTotal.toFixed(2)}</span>
          <button class="btn-remove" onclick="removeItem('${item.id}')">削除</button>
        </div>
      </div>
    `;
  });

  totalEl.innerText = grandTotal.toFixed(2);
}

document.addEventListener('DOMContentLoaded', updateCartBadge);
