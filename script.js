// Mock Data
const products = [
    {
        id: 1,
        name: "Arctic Frost Smart Fridge",
        category: "fridge",
        price: 1299.99,
        image: "https://images.unsplash.com/photo-1571175443880-49e1d58b794a?auto=format&fit=crop&w=800&h=800&q=80",
        description: "State-of-the-art smart refrigerator with touchscreen interface and AI cooling technology.",
        specs: {
            "Capacity": "500L",
            "Energy Rating": "A+++",
            "Dimensions": "180x90x70cm",
            "Warranty": "5 Years"
        }
    },
    {
        id: 2,
        name: "Polar Portable Cooler",
        category: "cooler",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&h=800&q=80",
        description: "Heavy-duty portable cooler, keeps ice frozen for up to 5 days. Perfect for camping.",
        specs: {
            "Capacity": "45L",
            "Weight": "5kg",
            "Material": "Rotomolded",
            "Warranty": "Lifetime"
        }
    },
    {
        id: 3,
        name: "Glacier Double Door",
        category: "fridge",
        price: 899.99,
        image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=800&h=800&q=80",
        description: "Spacious double door refrigerator with humidity control and quick freeze features.",
        specs: {
            "Capacity": "400L",
            "Energy Rating": "A++",
            "Dimensions": "175x85x65cm",
            "Warranty": "3 Years"
        }
    },
    {
        id: 4,
        name: "Tundra Rolling Cooler",
        category: "cooler",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=800&h=800&q=80",
        description: "Large capacity cooler with rugged wheels and telescoping handle for easy transport.",
        specs: {
            "Capacity": "60L",
            "Weight": "8kg",
            "Material": "Insulated Plastic",
            "Warranty": "5 Years"
        }
    },
    {
        id: 5,
        name: "Compact Mini Fridge",
        category: "fridge",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1536353284924-9220c464e262?auto=format&fit=crop&w=800&h=800&q=80",
        description: "Perfect for dorms or offices. Silent operation and surprisingly spacious.",
        specs: {
            "Capacity": "90L",
            "Energy Rating": "A+",
            "Dimensions": "85x50x50cm",
            "Warranty": "2 Years"
        }
    },
    {
        id: 6,
        name: "Adventure Backpack Cooler",
        category: "cooler",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1622483767128-3f66f32aef97?auto=format&fit=crop&w=800&h=800&q=80",
        description: "Hands-free cooling. Leakproof liner and comfortable straps for hiking.",
        specs: {
            "Capacity": "20L",
            "Weight": "1kg",
            "Material": "Nylon",
            "Warranty": "1 Year"
        }
    }
];

// State Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const cartCount = document.querySelector('.cart-count');

// Helper Functions
function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function updateCartCount() {
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }

    saveCart();
    alert('Added to cart!');
}

// Page Specific Logic
const path = window.location.pathname;

// Index Page Logic
if (path.includes('index.html') || path.endsWith('/')) {
    const featuredContainer = document.getElementById('featured-products');
    if (featuredContainer) {
        const featured = products.slice(0, 4);
        featuredContainer.innerHTML = featured.map(product => createProductCard(product)).join('');
    }
}

// Explore Page Logic
if (path.includes('explore.html')) {
    const grid = document.getElementById('products-grid');
    const categoryInputs = document.querySelectorAll('input[name="category"]');
    const priceInputs = document.querySelectorAll('input[name="price"]');

    function renderProducts(items) {
        grid.innerHTML = items.map(product => createProductCard(product)).join('');
    }

    function filterProducts() {
        let filtered = products;

        // Category Filter
        const selectedCategory = Array.from(categoryInputs)
            .find(input => input.checked)?.value;

        if (selectedCategory && selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        // Price Filter
        const selectedPrice = Array.from(priceInputs)
            .find(input => input.checked)?.value;

        if (selectedPrice) {
            const [min, max] = selectedPrice.split('-').map(Number);
            if (max) {
                filtered = filtered.filter(p => p.price >= min && p.price <= max);
            } else {
                filtered = filtered.filter(p => p.price >= min);
            }
        }

        renderProducts(filtered);
    }

    // Event Listeners
    categoryInputs.forEach(input => input.addEventListener('change', filterProducts));
    priceInputs.forEach(input => input.addEventListener('change', filterProducts));

    // Initial Render
    renderProducts(products);
}

// Product Detail Logic
if (path.includes('product-detail.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = products.find(p => p.id === productId);

    if (product) {
        document.getElementById('detail-image').src = product.image;
        document.getElementById('detail-title').textContent = product.name;
        document.getElementById('detail-price').textContent = formatPrice(product.price);
        document.getElementById('detail-desc').textContent = product.description;

        // Render Specs
        const specsHtml = Object.entries(product.specs)
            .map(([key, value]) => `
                <div class="spec-row">
                    <span class="spec-label">${key}</span>
                    <span class="spec-value">${value}</span>
                </div>
            `).join('');
        document.getElementById('detail-specs').innerHTML = specsHtml;

        // Quantity Logic
        let qty = 1;
        const qtyDisplay = document.getElementById('qty-display');

        document.getElementById('qty-minus').addEventListener('click', () => {
            if (qty > 1) {
                qty--;
                qtyDisplay.textContent = qty;
            }
        });

        document.getElementById('qty-plus').addEventListener('click', () => {
            qty++;
            qtyDisplay.textContent = qty;
        });

        document.getElementById('add-to-cart-btn').addEventListener('click', () => {
            addToCart(product.id, qty);
        });
    }
}

// Cart Page Logic
if (path.includes('cart.html')) {
    const cartContainer = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');

    function renderCart() {
        if (cart.length === 0) {
            cartContainer.innerHTML = '<p>Your cart is empty.</p>';
            updateTotals();
            return;
        }

        cartContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info" style="flex-grow: 1;">
                    <h3>${item.name}</h3>
                    <p>${formatPrice(item.price)}</p>
                </div>
                <div class="cart-item-actions" style="display: flex; align-items: center; gap: 10px;">
                    <button onclick="updateItemQty(${item.id}, ${item.quantity - 1})" class="qty-btn">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateItemQty(${item.id}, ${item.quantity + 1})" class="qty-btn">+</button>
                    <button onclick="removeFromCart(${item.id})" class="btn-outline" style="padding: 5px 10px; margin-left: 10px;">Remove</button>
                </div>
            </div>
        `).join('');

        updateTotals();
    }

    function updateTotals() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.1;
        const total = subtotal + tax;

        subtotalEl.textContent = formatPrice(subtotal);
        taxEl.textContent = formatPrice(tax);
        totalEl.textContent = formatPrice(total);
    }

    window.updateItemQty = (id, newQty) => {
        if (newQty < 1) return;
        const item = cart.find(i => i.id === id);
        if (item) {
            item.quantity = newQty;
            saveCart();
            renderCart();
        }
    };

    window.removeFromCart = (id) => {
        cart = cart.filter(i => i.id !== id);
        saveCart();
        renderCart();
    };

    renderCart();
}

// Shared Component Renderers
function createProductCard(product) {
    return `
        <div class="product-card">
            <a href="product-detail.html?id=${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">${formatPrice(product.price)}</div>
                    <button class="btn btn-primary" onclick="event.preventDefault(); addToCart(${product.id})">Add to Cart</button>
                </div>
            </a>
        </div>
    `;
}

// Initialize
updateCartCount();
