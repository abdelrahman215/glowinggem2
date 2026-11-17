const GOLD_PLATING_FEE = 120;

const PRODUCTS = [
  {
    id: "starlight-bangle",
    name: "Starlight Engraved Bangle",
    category: "bracelets",
    price: 340,
    badge: "NEW DROP 💎",
    desc: "Polished stainless steel bangle with inset crystal stars.",
    image: "assets/hero-jewelry.jpg"
  },
  {
    id: "puffed-heart-hoops",
    name: "Chunky Puffed Heart Hoops",
    category: "earrings",
    price: 290,
    badge: "BESTSELLER ✨",
    desc: "Lightweight hollow-heart hoops for effortless everyday wear.",
    image: "assets/rings-earrings-macro.jpg"
  },
  {
    id: "north-star-necklace",
    name: "North Star Crystal Pendant",
    category: "necklaces",
    price: 310,
    badge: "CLEAN GIRL 🎀",
    desc: "Fine chain with sparkling compass star pendant.",
    image: "assets/necklaces-lifestyle.jpg"
  },
  {
    id: "dome-signet-stack",
    name: "Sculpted Dome & Star Signet",
    category: "rings",
    price: 260,
    badge: "SPECIAL OFFER ❗️",
    desc: "Chunky gold dome & geometric star signet stainless ring.",
    image: "assets/rings-earrings-macro.jpg"
  },
  {
    id: "sparkle-hand-chain",
    name: "Delicate Sparkle Hand-Chain",
    category: "bracelets",
    price: 320,
    badge: "TRENDING 🪩",
    desc: "Wrist-to-finger slave bracelet with subtle charm detail.",
    image: "assets/pink-box-unboxing.jpg"
  },
  {
    id: "roman-coin-layer",
    name: "Layered Roman Coin Necklace",
    category: "necklaces",
    price: 360,
    badge: "NEW DROP 💎",
    desc: "Double-layered curb & beaded chain with coin medallion.",
    image: "assets/necklaces-lifestyle.jpg"
  },
  {
    id: "ribbed-drop-hoops",
    name: "Ribbed Door-Knocker Hoops",
    category: "earrings",
    price: 280,
    badge: "EVERYDAY GOLD",
    desc: "Textured sculptural hoops that catch the Cairo sunlight.",
    image: "assets/rings-earrings-macro.jpg"
  },
  {
    id: "tennis-sparkle-bracelet",
    name: "Classic Tennis Bracelet",
    category: "bracelets",
    price: 350,
    badge: "GIFT FAVORITE 💝",
    desc: "Water-resistant stainless steel tennis bracelet with crystal glow.",
    image: "assets/hero-jewelry.jpg"
  }
];

let activeFilter = "all";
const cart = [];

const productGrid = document.getElementById("productGrid");
const filterButtons = document.querySelectorAll(".filter-btn");
const categoryCards = document.querySelectorAll(".category-card");
const cartDrawer = document.getElementById("cartDrawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");
const cartTrigger = document.getElementById("cartTrigger");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const drawerCountEl = document.getElementById("drawerCount");
const cartSubtotalEl = document.getElementById("cartSubtotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const orderModal = document.getElementById("orderModal");
const closeOrderModal = document.getElementById("closeOrderModal");
const orderSummaryText = document.getElementById("orderSummaryText");
const copyOrderBtn = document.getElementById("copyOrderBtn");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileNav = document.getElementById("mobileNav");

function renderProducts() {
  const filtered =
    activeFilter === "all"
      ? PRODUCTS
      : PRODUCTS.filter((item) => item.category === activeFilter);

  productGrid.innerHTML = filtered
    .map(
      (product) => `
      <article class="product-card" data-id="${product.id}">
        <div class="product-img-wrap">
          <img src="${product.image}" alt="${product.name}" loading="lazy" />
          <span class="product-badge">${product.badge}</span>
        </div>
        <div class="product-body">
          <h3 class="product-title">${product.name}</h3>
          <p class="product-desc">${product.desc}</p>
          <label class="plating-toggle">
            <input type="checkbox" class="plating-checkbox" data-id="${product.id}" />
            <span>❣️ Add Custom Gold Plating (+${GOLD_PLATING_FEE} EGP)</span>
          </label>
          <div class="product-footer">
            <span class="product-price" id="price-${product.id}">${product.price} EGP</span>
            <button class="add-btn" data-add="${product.id}">Add to Bag</button>
          </div>
        </div>
      </article>
    `
    )
    .join("");
}

function updateFilter(filter) {
  activeFilter = filter;
  filterButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === filter);
  });
  renderProducts();
}

productGrid.addEventListener("change", (e) => {
  if (e.target.classList.contains("plating-checkbox")) {
    const id = e.target.dataset.id;
    const product = PRODUCTS.find((p) => p.id === id);
    const priceEl = document.getElementById(`price-${id}`);
    if (product && priceEl) {
      const total = e.target.checked ? product.price + GOLD_PLATING_FEE : product.price;
      priceEl.textContent = `${total} EGP`;
    }
  }
});

productGrid.addEventListener("click", (e) => {
  const addId = e.target.dataset.add;
  if (!addId) return;

  const product = PRODUCTS.find((p) => p.id === addId);
  const card = e.target.closest(".product-card");
  const checkbox = card.querySelector(".plating-checkbox");
  const hasGoldPlating = checkbox ? checkbox.checked : false;

  addToCart(product, hasGoldPlating);
  openCart();
});

function addToCart(product, hasGoldPlating) {
  const key = `${product.id}-${hasGoldPlating ? "plated" : "standard"}`;
  const existing = cart.find((item) => item.key === key);
  const unitPrice = hasGoldPlating ? product.price + GOLD_PLATING_FEE : product.price;

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      key,
      name: product.name,
      image: product.image,
      hasGoldPlating,
      unitPrice,
      qty: 1
    });
  }
  renderCart();
}

function renderCart() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);

  cartCountEl.textContent = totalQty;
  drawerCountEl.textContent = `(${totalQty})`;
  cartSubtotalEl.textContent = `${subtotal} EGP`;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="empty-cart">
        <p>Your Pink Box is empty ✨</p>
        <p style="font-size:0.84rem;margin-top:6px;">Add everyday stainless steel pieces to start sparkling.</p>
      </div>
    `;
    return;
  }

  cartItemsEl.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" />
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <div class="cart-item-meta">
            ${item.hasGoldPlating ? "❣️ With Custom Gold Plating" : "Standard Stainless Steel"} • ${item.unitPrice} EGP
          </div>
          <div class="cart-item-controls">
            <div class="qty-box">
              <button data-qty="-1" data-key="${item.key}" aria-label="Decrease quantity">−</button>
              <span>${item.qty}</span>
              <button data-qty="1" data-key="${item.key}" aria-label="Increase quantity">+</button>
            </div>
            <button class="remove-item" data-remove="${item.key}">Remove</button>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

cartItemsEl.addEventListener("click", (e) => {
  const key = e.target.dataset.key;
  const removeKey = e.target.dataset.remove;

  if (key && e.target.dataset.qty) {
    const delta = Number(e.target.dataset.qty);
    const item = cart.find((i) => i.key === key);
    if (item) {
      item.qty += delta;
      if (item.qty <= 0) {
        const idx = cart.indexOf(item);
        cart.splice(idx, 1);
      }
      renderCart();
    }
  } else if (removeKey) {
    const idx = cart.findIndex((i) => i.key === removeKey);
    if (idx !== -1) {
      cart.splice(idx, 1);
      renderCart();
    }
  }
});

function openCart() {
  cartDrawer.classList.add("open");
  drawerBackdrop.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  drawerBackdrop.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

cartTrigger.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
drawerBackdrop.addEventListener("click", closeCart);

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => updateFilter(btn.dataset.filter));
});

categoryCards.forEach((card) => {
  card.addEventListener("click", () => {
    updateFilter(card.dataset.filter);
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
  });
});

// Accordion
document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const panel = trigger.nextElementSibling;
    const icon = trigger.querySelector(".acc-icon");
    const isOpen = panel.classList.toggle("open");
    trigger.setAttribute("aria-expanded", String(isOpen));
    icon.textContent = isOpen ? "−" : "+";
  });
});

// Mobile Nav
mobileMenuBtn.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("open");
  mobileNav.setAttribute("aria-hidden", String(!isOpen));
});

document.querySelectorAll(".mobile-nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    mobileNav.setAttribute("aria-hidden", "true");
  });
});

// Checkout Modal
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) return;
  const lines = cart.map(
    (item) =>
      `• ${item.qty}x ${item.name} (${item.hasGoldPlating ? "Custom Gold Plated" : "Stainless Steel"}) — ${item.unitPrice * item.qty} EGP`
  );
  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  orderSummaryText.value = `✨ New Glowing Gems Order ✨\n\n${lines.join("\n")}\n\nSubtotal: ${subtotal} EGP\nCity / Governorate: (Add your Cairo/Egypt address here)`;
  closeCart();
  orderModal.classList.add("open");
  orderModal.setAttribute("aria-hidden", "false");
});

closeOrderModal.addEventListener("click", () => {
  orderModal.classList.remove("open");
  orderModal.setAttribute("aria-hidden", "true");
});

copyOrderBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(orderSummaryText.value);
    copyOrderBtn.textContent = "Copied! 💎";
    setTimeout(() => {
      copyOrderBtn.textContent = "Copy Order Summary 📋";
    }, 2000);
  } catch {
    orderSummaryText.select();
    document.execCommand("copy");
  }
});

renderProducts();
renderCart();
