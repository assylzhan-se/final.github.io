// page2.js
(() => {
  // Sample product data (expandable)
  const products = [
    { id: 1, title: "Nike Air", price: 20, category: "Clothing", img: "https://i.pinimg.com/736x/ef/62/2c/ef622cc489f83b6eefba054434b426be.jpg" },
    { id: 2, title: "Canon EOS C70", price: 30, category: "Equipment", img: "https://i.pinimg.com/1200x/81/c7/f6/81c7f6c16da3ade77d0e3b41d76e533a.jpg" },
    { id: 3, title: "Grand Seiko", price: 25, category: "Accessories", img: "https://i.pinimg.com/1200x/fe/af/4a/feaf4afed99bb25713d2c121d89720e4.jpg" },
    { id: 4, title: "Tool Set", price: 35, category: "Equipment", img: "https://i.pinimg.com/1200x/c2/e8/9b/c2e89bf8c1cb180eeca16ba7983ba2c1.jpg" },
    // Add more products here if needed
  ];

  // DOM refs
  const productGrid = document.getElementById("productGrid");
  const productsCount = document.getElementById("productsCount");
  const cartCountEl = document.getElementById("cart-count");
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");
  const categoriesWrap = document.getElementById("categories");
  const clearFiltersBtn = document.getElementById("clearFilters");
  const searchResultCount = document.getElementById("searchResultCount");
  const priceMinInput = document.getElementById("priceMin");
  const priceMaxInput = document.getElementById("priceMax");
  const priceFilterBtn = document.getElementById("priceFilterBtn");
  const newsletterBtn = document.getElementById("newsletterBtn");
  const newsletterEmail = document.getElementById("newsletterEmail");

  // Toast
  const toastEl = document.getElementById("cartToast");
  const toast = new bootstrap.Toast(toastEl);

  // State
  let state = {
    products,
    filters: {
      category: null,
      search: "",
      priceMin: null,
      priceMax: null
    },
    sort: "popular"
  };

  // localStorage cart helpers
  // localStorage cart helpers
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId) {
  const cart = getCart();
  const product = products.find(p => p.id === productId);
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.title,
      price: product.price,
      quantity: 1
    });
  }

  saveCart(cart);
  toastEl.querySelector(".toast-body").textContent = `${product.title} added to cart`;
  toast.show();
}

function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountEl.textContent = total;
  cartCountEl.style.display = total === 0 ? "none" : "inline-block";
}


  // Render categories chips
  function renderCategories() {
    const cats = Array.from(new Set(products.map(p => p.category)));
    categoriesWrap.innerHTML = "";
    cats.forEach(cat => {
      const chip = document.createElement("button");
      chip.className = "category-chip";
      chip.textContent = cat;
      chip.dataset.category = cat;
      chip.addEventListener("click", () => {
        // toggle
        state.filters.category = state.filters.category === cat ? null : cat;
        applyFilters();
        updateCategoryUI();
      });
      categoriesWrap.appendChild(chip);
    });
  }
  function updateCategoryUI() {
    const chips = categoriesWrap.querySelectorAll(".category-chip");
    chips.forEach(chip => {
      chip.classList.toggle("active", chip.dataset.category === state.filters.category);
    });
  }

  // Render product grid
  function renderProducts(list) {
    productGrid.innerHTML = "";
    if (!list.length) {
      productGrid.innerHTML = `<div class="col-12"><div class="alert alert-light">No products found.</div></div>`;
      productsCount.textContent = 0;
      searchResultCount.textContent = "No products match your filters.";
      return;
    }

    list.forEach(p => {
      const col = document.createElement("div");
      col.className = "col-6 col-sm-4 col-md-3";

      const card = document.createElement("div");
      card.className = "product-card p-3 shadow-sm";

      const imgWrap = document.createElement("div");
      imgWrap.className = "product-img rounded mb-3";
      const img = document.createElement("img");
      img.src = p.img;
      img.alt = p.title;
      imgWrap.appendChild(img);

      const meta = document.createElement("div");
      meta.className = "product-meta";

      const title = document.createElement("p");
      title.className = "product-title";
      title.textContent = p.title;

      const price = document.createElement("div");
      price.className = "product-price";
      price.textContent = `$${p.price}`;

      const btn = document.createElement("button");
      btn.className = "btn btn-sm btn-outline-dark btn-add";
      btn.textContent = "Add to cart";
      btn.addEventListener("click", () => addToCart(p.id));

      meta.appendChild(title);
      meta.appendChild(price);

      card.appendChild(imgWrap);
      card.appendChild(meta);
      card.appendChild(btn);

      col.appendChild(card);
      productGrid.appendChild(col);
    });

    productsCount.textContent = list.length;
    searchResultCount.textContent = `Showing ${list.length} product(s)`;
    // apply fade-in animation
    const cards = productGrid.querySelectorAll(".product-card");
    cards.forEach((c, i) => {
      c.style.opacity = 0;
      c.style.transform = "translateY(8px)";
      setTimeout(() => {
        c.style.transition = "opacity 350ms ease, transform 350ms ease";
        c.style.opacity = 1;
        c.style.transform = "translateY(0)";
      }, 80 * i);
    });
  }

  // Filter & sort pipeline
  function applyFilters() {
    const f = state.filters;
    let list = [...state.products];

    // search
    if (f.search && f.search.trim()) {
      const q = f.search.trim().toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }

    // category
    if (f.category) list = list.filter(p => p.category === f.category);

    // price range
    if (f.priceMin != null && f.priceMin !== "") {
      const min = Number(f.priceMin);
      if (!Number.isNaN(min)) list = list.filter(p => p.price >= min);
    }
    if (f.priceMax != null && f.priceMax !== "") {
      const max = Number(f.priceMax);
      if (!Number.isNaN(max)) list = list.filter(p => p.price <= max);
    }

    // sort
    if (state.sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (state.sort === "price-desc") list.sort((a, b) => b.price - a.price);
    // popular keeps original order

    renderProducts(list);
  }

  // Events
  function attachEvents() {
    searchInput.addEventListener("input", (e) => {
      state.filters.search = e.target.value;
      applyFilters();
    });

    sortSelect.addEventListener("change", (e) => {
      state.sort = e.target.value;
      applyFilters();
    });

    clearFiltersBtn.addEventListener("click", (ev) => {
      ev.preventDefault();
      // reset filters
      state.filters = { category: null, search: "", priceMin: null, priceMax: null };
      searchInput.value = "";
      priceMinInput.value = "";
      priceMaxInput.value = "";
      sortSelect.value = "popular";
      state.sort = "popular";
      updateCategoryUI();
      applyFilters();
    });

    priceFilterBtn.addEventListener("click", () => {
      state.filters.priceMin = priceMinInput.value;
      state.filters.priceMax = priceMaxInput.value;
      applyFilters();
    });

    newsletterBtn.addEventListener("click", () => {
      const email = newsletterEmail.value.trim();
      if (email.includes("@") && email.includes(".")) {
        alert("Спасибо за подписку!");
        newsletterEmail.value = "";
      } else {
        alert("Please enter a valid email address.");
      }
    });
  }

  // init
  function init() {
    renderCategories();
    updateCategoryUI();
    applyFilters();
    attachEvents();
    updateCartBadge();
  }

  // run
  init();

  // expose small helpers for debugging (optional)
  window.__shop = { products, applyFilters, addToCart, getCart };
})();

  
