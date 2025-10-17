// Simple static e-commerce behavior: product list, filtering, cart (no payments).
const products = [
  { id:1, title:"Yellow T-Shirt", price:25.00, category:"clothing", img:"images/product1.svg", desc:"Comfortable cotton tee." },
  { id:2, title:"Wireless Headphones", price:75.00, category:"electronics", img:"images/product2.svg", desc:"Noise-cancelling over-ear." },
  { id:3, title:"Smartwatch", price:200.00, category:"electronics", img:"images/product3.svg", desc:"Track steps & notifications." },
  { id:4, title:"Sneakers", price:50.00, category:"clothing", img:"images/product4.svg", desc:"Casual everyday shoes." },
  { id:5, title:"Leather Bag", price:120.00, category:"accessories", img:"images/product5.svg", desc:"Handcrafted leather bag." },
];

const state = { cart: {} };

function formatPrice(n){ return n.toFixed(2); }

function renderProducts(filterCats = ["all"]){
  const grid = document.getElementById('product-grid');
  grid.innerHTML = '';
  const showAll = filterCats.includes('all') || filterCats.length === 0;
  const list = products.filter(p => showAll || filterCats.includes(p.category));
  list.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h4>${p.title}</h4>
      <p class="price">$${formatPrice(p.price)}</p>
      <p style="color:#6b7280;margin:0">${p.desc}</p>
      <button class="add-btn" data-id="${p.id}">Add to Cart</button>
    `;
    grid.appendChild(card);
  });
}

function updateCartCount(){
  const count = Object.values(state.cart).reduce((s,x)=>s+x.qty,0);
  document.getElementById('cart-count').innerText = count;
}

function addToCart(id){
  const p = products.find(x=>x.id===id);
  if(!state.cart[id]) state.cart[id] = { ...p, qty:0 };
  state.cart[id].qty += 1;
  updateCartCount();
  alert(p.title + " added to cart");
}

function renderCart(){
  const container = document.getElementById('cart-items');
  container.innerHTML = '';
  const items = Object.values(state.cart);
  if(items.length===0){ container.innerHTML = '<p>Your cart is empty.</p>'; return; }
  let total = 0;
  items.forEach(it=>{
    total += it.qty * it.price;
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <img src="${it.img}" />
      <div class="meta">
        <strong>${it.title}</strong><br/>
        <small>$${formatPrice(it.price)} × ${it.qty}</small>
      </div>
      <div>
        <button class="qty-btn" data-id="${it.id}" data-op="-" style="margin-right:6px">-</button>
        <button class="qty-btn" data-id="${it.id}" data-op="+">+</button>
      </div>
    `;
    container.appendChild(el);
  });
  document.getElementById('cart-total').innerText = formatPrice(total);
}

document.addEventListener('click', (e)=>{
  if(e.target.matches('.add-btn')){
    const id = Number(e.target.dataset.id);
    addToCart(id);
  }
  if(e.target.matches('#cart-toggle')){
    document.getElementById('cart-modal').classList.remove('hidden');
    renderCart();
  }
  if(e.target.matches('#cart-close')){
    document.getElementById('cart-modal').classList.add('hidden');
  }
  if(e.target.matches('.qty-btn')){
    const id = Number(e.target.dataset.id);
    const op = e.target.dataset.op;
    if(op === '+') state.cart[id].qty += 1;
    else {
      state.cart[id].qty -= 1;
      if(state.cart[id].qty <= 0) delete state.cart[id];
    }
    renderCart();
    updateCartCount();
  }
  if(e.target.matches('#checkout-btn')){
    alert('This is a demo site. No real payment is processed.');
  }
});

// filters
document.addEventListener('change', (e)=>{
  if(e.target.matches('.filter')){
    const checked = Array.from(document.querySelectorAll('.filter:checked')).map(x=>x.value);
    if(checked.length === 0) checked.push('all');
    renderProducts(checked);
  }
});

// init
document.addEventListener('DOMContentLoaded', ()=>{
  renderProducts(['all']);
  updateCartCount();
  document.getElementById('year').innerText = new Date().getFullYear();
});
