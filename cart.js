document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const productsGrid = document.getElementById('products-grid');
    const cartSidebar = document.getElementById('cart-sidebar');
    const viewCartBtn = document.getElementById('view-cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsList = document.getElementById('cart-items');
    const cartCountSpan = document.getElementById('cart-count');
    const cartTotalPriceSpan = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Sample product data
    const products = [
        { id: 1, name: 'Wireless Headphones', price: 99.99, image: 'https://via.placeholder.com/150/4a90e2/ffffff?text=Headphones' },
        { id: 2, name: 'Smart Watch', price: 199.99, image: 'https://via.placeholder.com/150/e94e77/ffffff?text=Watch' },
        { id: 3, name: 'Portable Speaker', price: 59.99, image: 'https://via.placeholder.com/150/f0e68c/333333?text=Speaker' },
        { id: 4, name: 'Gaming Mouse', price: 49.99, image: 'https://via.placeholder.com/150/00bfa5/ffffff?text=Mouse' }
    ];

    // Initialize cart from local storage or empty array
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    // --- Event Listeners ---
    viewCartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('open');
    });

    closeCartBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });

    checkoutBtn.addEventListener('click', () => {
        alert('Thank you for your purchase!');
        cart = []; // Clear the cart
        saveCartToLocalStorage();
        updateCartDisplay();
        cartSidebar.classList.remove('open');
    });

    // --- Functions ---
    // Render products on the page
    const renderProducts = () => {
        productsGrid.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            </div>
        `).join('');

        // Add "add to cart" click handlers
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                addToCart(productId);
            });
        });
    };

    // Add item to cart
    const addToCart = (productId) => {
        const product = products.find(p => p.id === productId);
        const cartItem = cart.find(item => item.id === productId);

        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCartToLocalStorage();
        updateCartDisplay();
    };

    // Remove item from cart
    const removeFromCart = (productId) => {
        cart = cart.filter(item => item.id !== productId);
        saveCartToLocalStorage();
        updateCartDisplay();
    };

    // Update item quantity
    const updateQuantity = (productId, change) => {
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity += change;
            if (cartItem.quantity <= 0) {
                removeFromCart(productId);
            }
        }
        saveCartToLocalStorage();
        updateCartDisplay();
    };

    // Update the cart's HTML display
    const updateCartDisplay = () => {
        cartItemsList.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            cart.forEach(item => {
                total += item.price * item.quantity;
                const listItem = document.createElement('li');
                listItem.classList.add('cart-item');
                listItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="item-quantity-controls">
                        <button class="quantity-btn" data-id="${item.id}" data-change="-1">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" data-id="${item.id}" data-change="1">+</button>
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}">X</button>
                `;
                cartItemsList.appendChild(listItem);
            });
        }

        cartCountSpan.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
        cartTotalPriceSpan.textContent = total.toFixed(2);

        // Add event listeners for new cart items
        document.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                removeFromCart(id);
            });
        });

        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                const change = parseInt(e.target.dataset.change);
                updateQuantity(id, change);
            });
        });
    };

    // Save cart data to local storage
    const saveCartToLocalStorage = () => {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    };

    // Initial load
    renderProducts();
    updateCartDisplay();
});
