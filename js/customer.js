(function() {
    const shoppingCartForm = document.getElementById('shoppingCartForm');

    shoppingCartForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const cartItems = document.getElementById('cartItems').value;
        const apiEndpoint = 'http://localhost:5000/api/shoppingCart';

        console.log('Submitting cart items to the API:', cartItems);
        // Replace with actual API call
        // Example: fetch(apiEndpoint, { method: 'POST', body: JSON.stringify({ items: cartItems }) });

        alert('Your cart items have been submitted!');
        shoppingCartForm.reset();
    });
})();
