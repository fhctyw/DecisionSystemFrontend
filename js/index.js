(function() {
    document.addEventListener('DOMContentLoaded', (event) => {
        const roleSelect = document.getElementById('roleSelect');
        
        roleSelect.addEventListener('change', (event) => {
            const role = event.target.value;
            if (role === 'analyst') {
                window.location.href = 'analyst.html'; // Redirect to Analyst interface
            } else if (role === 'productManager') {
                window.location.href = 'product-manager.html'; // Redirect to Product Manager interface
            }
        });
        fetchProducts();    

        const cartIcon = document.getElementById('cartIcon');
        const cartSidebar = document.getElementById('cartSidebar');
        const closeSidebar = document.getElementById('closeSidebar');
        const body = document.body;
    
        cartIcon.addEventListener('click', () => {
            body.classList.add('show-cart-sidebar');
            updateCartUI();
        });
    
        closeSidebar.addEventListener('click', () => {
            body.classList.remove('show-cart-sidebar');
            updateCartUI();
        });


    });

    // Fetch and display products on page load
    function fetchProducts() {
        fetch('http://localhost:5000/api/analys/products')
            .then(response => response.json())
            .then(products => displayProducts(products))
            .catch(error => console.error('Error fetching products:', error));
    }

    // Display products on the page
    function displayProducts(products) {
        const productsContainer = document.getElementById('productsContainer');
        productsContainer.className = 'row'; // Add the 'row' class to the container

        products.forEach(product => {
            // Create the column for each product
            const col = document.createElement('div');
            col.className = 'col-md-3 mb-4'; // Adjust the number here for different layouts, 'col-md-2' for 6 items per row

            // Create the card for each product
            const card = document.createElement('div');
            card.className = 'card h-100';

            // Assuming each product has a 'PhotoUrl'
            if (product.photoUrl) {
                const img = document.createElement('img');
                img.src = product.photoUrl;
                img.className = 'card-img-top';
                img.alt = product.name;
                card.appendChild(img);
            }

            // Card body
            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';

            // Product name
            const title = document.createElement('h5');
            title.className = 'card-title';
            title.textContent = product.name;
            cardBody.appendChild(title);

            // Rating with star icons
            const rating = document.createElement('p');
            rating.className = 'card-text';
            rating.innerHTML = `Rating: ${'<span class="star-icon" style="color: green;">&#9733;</span>'.repeat(Math.round(product.rating))}`;
            cardBody.appendChild(rating);

            // Price formatting
            const price = document.createElement('p');
            price.className = 'card-text price-text';
            const productPrice = product.price !== undefined ? `$${parseFloat(product.price).toFixed(2)}` : 'N/A';
            price.textContent = `Price: ${productPrice}`;
            cardBody.appendChild(price);

            // Buy Button
            const buyButton = document.createElement('button');
            buyButton.className = 'btn btn-success mt-2 buy-now';
            buyButton.textContent = 'Buy Now';
            buyButton.dataset.product = JSON.stringify(product);
            cardBody.appendChild(buyButton);

            card.appendChild(cardBody);

            // Append the column to the container
            col.appendChild(card);
            productsContainer.appendChild(col);
        });
        attachBuyButtons();
    }

    function attachBuyButtons() {
        const buyButtons = document.getElementsByClassName('buy-now');
        Array.from(buyButtons).forEach(button => {
            button.addEventListener('click', buyProductHandler);
        });
    }

    function buyProductHandler(event) {
        event.preventDefault();
        const product = JSON.parse(this.dataset.product);
        addToCart(product);
    }


    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || {};
        if (cart[product.id]) {
            cart[product.id].quantity += 1;
        } else {
            cart[product.id] = { ...product, quantity: 1 };
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
    }

    function updateCartUI() {
        let cart = JSON.parse(localStorage.getItem('cart')) || {};
        const cartItemsContainer = document.getElementById('cartItems');
        cartItemsContainer.innerHTML = '';
        let total = 0;
        for (const id in cart) {
            const product = cart[id];
            const productElement = document.createElement('div');
            productElement.textContent = `${product.name} - Quantity: ${product.quantity} - Price: ${product.price}`;
            cartItemsContainer.appendChild(productElement);
            total += product.price * product.quantity;
        }
        document.getElementById('cartTotal').textContent = `Total: $${total.toFixed(2)}`;
    }
    
    function removeFromCart(productId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || {};
        if (cart[productId]) {
            delete cart[productId];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartUI();
        }
    }
})();
