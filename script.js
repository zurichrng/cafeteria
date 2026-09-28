const products = [
    { id: 1, name: "Café Americano", category: "Café", price: 2900, icon: "☕" },
    { id: 2, name: "Cappuccino", category: "Café", price: 2800, icon: "☕" },
    { id: 3, name: "Té de hierbas", category: "Tés e infusiones", price: 3200, icon: "🍵" },
    { id: 4, name: "Pastel de chocolate", category: "Pastelería", price: 2500, icon: "🍰" },
    { id: 5, name: "Sándwich especial", category: "Sándwiches", price: 3800, icon: "🥪" }
];

let cart = [];

const slides = [
    ["Nuestro café", "Descubre nuestros productos"],
    ["Oferta especial", "Sabores preparados para ti"],
    ["Café premium", "Un momento para disfrutar"]
];

let currentSlide = 0;

function money(value) {
    return "$" + value.toLocaleString("es-CL");
}

function showScreen(screenId) {
    const screens = document.querySelectorAll(".screen");

    if (window.innerWidth <= 760) {
        screens.forEach(screen => screen.classList.remove("active"));
        document.getElementById(screenId).classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
        document.getElementById(screenId).scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center"
        });
    }
}

function changeSlide(direction) {
    currentSlide += direction;

    if (currentSlide < 0) currentSlide = slides.length - 1;
    if (currentSlide >= slides.length) currentSlide = 0;

    document.getElementById("slideTitle").textContent = slides[currentSlide][0];
    document.getElementById("slideText").textContent = slides[currentSlide][1];
}

function renderProducts() {
    const container = document.getElementById("productsList");

    container.innerHTML = products.map(product => `
        <article class="product-card">
            <div class="product-image">${product.icon}</div>

            <div class="product-info">
                <strong>${product.name}</strong>
                <span>${product.category} · ${money(product.price)}</span>
            </div>

            <button class="add-btn" onclick="addToCart(${product.id})">
                agregar
            </button>
        </article>
    `).join("");
}

function addToCart(productId) {
    const product = products.find(item => item.id === productId);

    if (!product) return;

    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    renderCart();
    renderSelectedPreview();
    updateCartCount();

    showToast(`${product.name} agregado al carrito`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);

    renderCart();
    renderSelectedPreview();
    updateCartCount();

    showToast("Producto quitado del carrito");
}

function renderSelectedPreview() {
    const container = document.getElementById("selectedPreview");

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="selected-item">
                <span>No hay productos seleccionados</span>
                <span>—</span>
            </div>
        `;
        return;
    }

    container.innerHTML = cart.slice(0, 2).map(item => `
        <div class="selected-item">
            <span>${item.name} x${item.quantity}</span>
            <strong>${money(item.price * item.quantity)}</strong>
        </div>
    `).join("");
}

function renderCart() {
    const container = document.getElementById("cartList");
    const totalElement = document.getElementById("cartTotal");

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="selected-item" style="margin-top:12px;">
                <span>Tu carrito está vacío.</span>
                <button class="add-btn" onclick="showScreen('productos')">Agregar</button>
            </div>
        `;
        totalElement.textContent = "$0";
        return;
    }

    container.innerHTML = cart.map(item => `
        <article class="cart-item">
            <div class="cart-item-image">${item.icon}</div>

            <div class="cart-item-info">
                <strong>${item.name}</strong>
                <small>Cantidad: ${item.quantity}</small>
            </div>

            <div class="cart-actions">
                <span class="cart-price">${money(item.price * item.quantity)}</span>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">
                    quitar
                </button>
            </div>
        </article>
    `).join("");

    const total = cart.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);

    totalElement.textContent = money(total);
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cartCount").textContent = count;
}

function checkout() {
    if (cart.length === 0) {
        showToast("Primero agrega productos");
        return;
    }

    showToast("¡Pedido preparado! Gracias por comprar en Café Aroma");

    setTimeout(() => {
        cart = [];
        renderCart();
        renderSelectedPreview();
        updateCartCount();
    }, 1500);
}

function showToast(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 1800);
}

function initialize() {
    renderProducts();
    renderCart();
    renderSelectedPreview();
    updateCartCount();

    if (window.innerWidth <= 760) {
        document.querySelectorAll(".screen").forEach(screen => {
            screen.classList.remove("active");
        });

        document.getElementById("inicio").classList.add("active");
    }
}

window.addEventListener("resize", initialize);

initialize();
