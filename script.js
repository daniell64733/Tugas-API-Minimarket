// --- Footer Map Function (DI LUAR DOMContentLoaded) ---
function initFooterMap() {
  console.log("🔄 initFooterMap() called");

  const mapContainer = document.getElementById("mini-map");
  console.log("📍 Map container:", mapContainer);

  if (!mapContainer) {
    console.error("❌ Map container not found!");
    return;
  }

  // Check if Leaflet is available
  if (typeof L === "undefined") {
    console.log("⏳ Leaflet not loaded, retrying...");
    setTimeout(initFooterMap, 500);
    return;
  }

  console.log("✅ Leaflet is available");

  try {
    // Clear container
    mapContainer.innerHTML = "";

    // Initialize map
    console.log("🗺️ Creating map...");
    const map = L.map("mini-map").setView([-6.2088, 106.8456], 15);

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 18,
    }).addTo(map);

    // Add marker
    L.marker([-6.2088, 106.8456])
      .addTo(map)
      .bindPopup("<b>🚗 TokoKu Store</b><br>Jakarta Pusat")
      .openPopup();

    console.log("✅ Footer map initialized successfully!");
  } catch (error) {
    console.error("❌ Map error:", error);
    mapContainer.innerHTML = `
      <div class="w-full h-full flex items-center justify-center text-gray-400">
        <div class="text-center">
          <i class="fas fa-map-marker-alt text-2xl mb-2"></i>
          <p>Lokasi TokoKu</p>
          <p class="text-sm">Jl. Contoh No. 123, Jakarta</p>
        </div>
      </div>
    `;
  }
}

// Event listener ini memastikan kode JavaScript baru berjalan setelah seluruh elemen HTML dimuat.
document.addEventListener("DOMContentLoaded", () => {
  // --- Elemen DOM ---
  const productGrid = document.getElementById("product-grid");
  const loader = document.getElementById("loader");
  const errorMessage = document.getElementById("error-message");
  const cartCount = document.getElementById("cart-count");

  // Elemen Modal
  const modal = document.getElementById("productModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const modalImage = document.getElementById("modal-image");
  const modalCategory = document.getElementById("modal-category");
  const modalProductName = document.getElementById("modal-product-name");
  const modalPrice = document.getElementById("modal-price");
  const modalDescription = document.getElementById("modal-description");
  const modalAddToCartBtn = document.getElementById("modal-add-to-cart");
  const toastContainer = document.getElementById("toast-container");

  // --- State ---
  let products = [];
  let cart = [];
  const API_URL = "https://fakestoreapi.com/products";

  // --- Utility Functions ---
  function formatPrice(price) {
    return Math.round(price).toLocaleString("id-ID");
  }

  function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    let stars = "";
    for (let i = 0; i < fullStars; i++) {
      stars += '<i class="fas fa-star"></i>';
    }
    if (halfStar) {
      stars += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
      stars += '<i class="far fa-star"></i>';
    }
    return stars;
  }

  // --- Main Functions ---
  async function fetchProducts() {
    loader.style.display = "block";
    productGrid.innerHTML = "";
    errorMessage.classList.add("hidden");
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      products = await response.json();
      displayProducts(products);
      initCategoryFilters();
    } catch (error) {
      console.error("Gagal mengambil produk:", error);
      errorMessage.classList.remove("hidden");
    } finally {
      loader.style.display = "none";
    }
  }

  function displayProducts(productsToDisplay) {
    productGrid.innerHTML = "";
    productsToDisplay.forEach((product) => {
      const productCard = createProductCard(product);
      productGrid.appendChild(productCard);
    });
  }

  function createProductCard(product) {
    const card = document.createElement("div");
    card.className =
      "product-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1";
    card.dataset.category = product.category;

    card.innerHTML = `
      <div class="relative">
        <img 
          src="${product.image}" 
          alt="${product.title}"
          class="w-full h-48 object-contain p-4 bg-white"
          loading="lazy"
        >
        <button class="favorite-btn absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors">
          <i class="far fa-heart text-gray-400 hover:text-red-500"></i>
        </button>
      </div>
      <div class="p-4">
        <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">${
          product.category
        }</span>
        <h3 class="font-semibold text-gray-800 mt-2 mb-1 line-clamp-2">${
          product.title
        }</h3>
        <div class="flex items-center mb-2">
          <div class="flex text-yellow-400 text-sm">
            ${generateStarRating(product.rating.rate)}
          </div>
          <span class="text-gray-500 text-sm ml-1">(${
            product.rating.count
          })</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-xl font-bold text-blue-600">Rp ${formatPrice(
            product.price * 15000
          )}</span>
          <button class="add-to-cart-btn bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors" data-product-id="${
            product.id
          }">
            <i class="fas fa-cart-plus"></i>
          </button>
        </div>
      </div>
    `;
    return card;
  }

  function showProductDetail(productId) {
    const product = products.find((p) => p.id == productId);
    if (!product) return;

    modalImage.src = product.image;
    modalCategory.textContent = product.category;
    modalProductName.textContent = product.title;
    modalPrice.textContent = `Rp ${formatPrice(product.price * 15000)}`;
    modalDescription.textContent = product.description;
    modalAddToCartBtn.dataset.productId = product.id;

    const modalRating = document.getElementById("modal-rating");
    if (modalRating) {
      modalRating.textContent = product.rating.rate;
    }

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function hideModal() {
    modal.classList.add("hidden");
    document.body.style.overflow = "auto";
  }

  function addToCart(productId) {
    const product = products.find((p) => p.id == productId);
    if (product) {
      cart.push(product);
      updateCartCounter();
      showToast(
        `${product.title.substring(0, 20)}... ditambahkan ke keranjang!`
      );
    }
  }

  function updateCartCounter() {
    cartCount.textContent = cart.length;
  }

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className =
      "toast-notification bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg mb-2 transition-all duration-300";
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  function initCategoryFilters() {
    const filterButtons = document.querySelectorAll(".category-filter");
    if (filterButtons.length === 0) {
      console.log("Filter buttons not found");
      return;
    }

    filterButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const category = this.dataset.category;
        filterButtons.forEach((btn) => {
          btn.classList.remove("bg-blue-600", "text-white");
          btn.classList.add(
            "bg-gray-300",
            "text-gray-700",
            "hover:bg-gray-400"
          );
        });
        this.classList.remove(
          "bg-gray-300",
          "text-gray-700",
          "hover:bg-gray-400"
        );
        this.classList.add("bg-blue-600", "text-white");
        filterProducts(category);
      });
    });
  }

  function filterProducts(category) {
    const productCards = document.querySelectorAll(".product-card");
    productCards.forEach((card) => {
      if (category === "all" || card.dataset.category === category) {
        card.style.display = "block";
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "scale(1)";
        }, 50);
      } else {
        card.style.opacity = "0";
        card.style.transform = "scale(0.8)";
        setTimeout(() => {
          card.style.display = "none";
        }, 300);
      }
    });
  }

  function initQuantityHandler() {
    const decreaseBtn = document.getElementById("decrease-qty");
    const increaseBtn = document.getElementById("increase-qty");
    const quantityInput = document.getElementById("quantity");

    if (!decreaseBtn || !increaseBtn || !quantityInput) {
      console.log("Quantity elements not found");
      return;
    }

    decreaseBtn.addEventListener("click", function () {
      let currentValue = parseInt(quantityInput.value);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    });

    increaseBtn.addEventListener("click", function () {
      let currentValue = parseInt(quantityInput.value);
      if (currentValue < 10) {
        quantityInput.value = currentValue + 1;
      }
    });

    quantityInput.addEventListener("change", function () {
      let value = parseInt(this.value);
      if (value < 1) this.value = 1;
      if (value > 10) this.value = 10;
    });
  }

  // --- Load Header & Footer ---
  function loadHeaderAndFooter() {
    // Load header
    fetch("header.html")
      .then((response) => {
        if (!response.ok) throw new Error("Header not found");
        return response.text();
      })
      .then((data) => {
        document.getElementById("header-placeholder").innerHTML = data;
        console.log("✅ Header loaded successfully");
      })
      .catch((error) => {
        console.log("Header loading failed:", error);
        document.getElementById("header-placeholder").innerHTML = `
          <header class="bg-white shadow-md">
            <div class="container mx-auto px-4 py-4 flex justify-between items-center">
              <h1 class="text-2xl font-bold text-gray-800">TokoKu</h1>
              <nav class="flex space-x-4">
                <a href="index.html" class="text-gray-700 hover:text-blue-600">Beranda</a>
                <a href="tentang.html" class="text-gray-700 hover:text-blue-600">Tentang</a>
                <a href="kontak.html" class="text-gray-700 hover:text-blue-600">Kontak</a>
                <a href="alamat.html" class="text-gray-700 hover:text-blue-600">Alamat</a>
              </nav>
            </div>
          </header>
        `;
      });

    // Load footer
    fetch("footer.html")
      .then((response) => {
        if (!response.ok) throw new Error("Footer not found");
        return response.text();
      })
      .then((data) => {
        document.getElementById("footer-placeholder").innerHTML = data;
        console.log("✅ Footer loaded successfully");

        // Initialize map after footer is loaded
        console.log("🔄 Scheduling map initialization...");
        setTimeout(() => {
          initFooterMap(); // Sekarang fungsi ini tersedia di global scope
        }, 1000);
      })
      .catch((error) => {
        console.log("Footer loading failed:", error);
        document.getElementById("footer-placeholder").innerHTML = `
          <footer class="bg-gray-800 text-white py-8 text-center">
            <p>&copy; 2024 TokoKu. All rights reserved.</p>
          </footer>
        `;
      });
  }

  // --- Event Listeners ---
  productGrid.addEventListener("click", (e) => {
    const addToCartBtn = e.target.closest(".add-to-cart-btn");
    if (addToCartBtn) {
      const productId = addToCartBtn.dataset.productId;
      addToCart(productId);
      e.stopPropagation();
      return;
    }

    const favoriteBtn = e.target.closest(".favorite-btn");
    if (favoriteBtn) {
      const heartIcon = favoriteBtn.querySelector("i");
      heartIcon.classList.toggle("far");
      heartIcon.classList.toggle("fas");
      heartIcon.classList.toggle("text-red-500");
      e.stopPropagation();
      return;
    }

    const card = e.target.closest(".product-card");
    if (card) {
      const productId = card.dataset.productId;
      showProductDetail(productId);
    }
  });

  modalAddToCartBtn.addEventListener("click", () => {
    const productId = modalAddToCartBtn.dataset.productId;
    const quantityInput = document.getElementById("quantity");
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
    for (let i = 0; i < quantity; i++) {
      addToCart(productId);
    }
    hideModal();
  });

  closeModalBtn.addEventListener("click", hideModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      hideModal();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      hideModal();
    }
  });

  // --- Inisialisasi ---
  function init() {
    loadHeaderAndFooter();
    fetchProducts();
    initQuantityHandler();
  }

  // Jalankan inisialisasi
  init();
});
