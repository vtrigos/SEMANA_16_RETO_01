import './style.css';
import axios from 'axios';

const burgersContainer = document.getElementById('burgersContainer');
const cartButton = document.getElementById('cartButton');
const cartContainer = document.getElementById('cartContainer');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');

let cart = [];

initApp();

function initApp() {
  document.addEventListener('DOMContentLoaded', () => {
    readBurgers();
    renderCart();
  });

  cartButton.addEventListener('click', () => {
    cartContainer.style.display = cartContainer.style.display === 'none' ? 'block' : 'none';
  });
}

async function readBurgers() {
  try {
    const { data } = await axios.get('http://localhost:3000/burger');
    pintarBurgers(data);
  } catch (error) {
    console.error('Error al cargar la web:', error);
  }
}

function pintarBurgers(burgers) {
  burgers.forEach((burger) => {
    const burgerDiv = document.createElement('div');

    burgerDiv.innerHTML = `
            <img src="${burger.img}" alt="${burger.name}" class="sizeImg">
            <p>${burger.name}</p>
            <p>$${burger.price}</p>
            <button class="buyBurger">Añadir al carrito</button>
        `;

    const buyButton = burgerDiv.querySelector('.buyBurger');
    buyButton.addEventListener('click', () => addToCart(burger));

    burgersContainer.appendChild(burgerDiv);
  });
}

function addToCart(burger) {
  const itemIndex = cart.findIndex((item) => item.id === burger.id);

  if (itemIndex > -1) {
    cart[itemIndex].quantity += 1;
  } else {
    cart = [...cart, { ...burger, quantity: 1 }];
  }

  renderCart();
}

const cartCount = document.createElement('div');
cartCount.className = 'cart-count';
cartButton.appendChild(cartCount);
updateCartCount();

function renderCart() {
  cartItems.innerHTML = '';

  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;

    const li = document.createElement('li');

    li.innerHTML = `
      <span style="flex: 1; text-align: center;">${item.quantity}</span>
      <span style="flex: 3; text-align: center;">${item.name}</span>
      <span style="flex: 2; text-align: center;">$${item.price}</span>
      <button class="removeItem" data-id="${item.id}"><i class="fa-solid fa-xmark"></i></button>
    `;

    const removeButton = li.querySelector('.removeItem');
    removeButton.addEventListener('click', () => removeFromCart(item.id));

    cartItems.appendChild(li);
  });

  cartTotal.textContent = `Total: $${total}`;
  cartTotal.style.textAlign = 'center';
  cartTotal.style.display = cart.length > 0 ? 'block' : 'none';

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="styleTotal">El carrito está vacío</p>';
  }

  updateCartCount();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}

function updateCartCount() {
  cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0) || 0;
}

