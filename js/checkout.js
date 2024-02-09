// Assuming Redux is already included in your project
const { createStore } = Redux;

// Define initial state
const initialState = {
    cart: []
};

// Load state from localStorage
const loadState = () => {
    try {
        const serializedState = localStorage.getItem('cartState');
        if (serializedState === null) {
            return initialState;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        console.error('Could not load state', err);
        return initialState;
    }
};

// Save state to localStorage
const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('cartState', serializedState);
    } catch (err) {
        console.error('Could not save state', err);
    }
};

// Cart reducer
function cartReducer(state = loadState(), action) {
    switch (action.type) {
        case 'ADD_TO_CART':
            return {
                ...state,
                cart: [...state.cart, action.payload]
            };
        case 'REMOVE_FROM_CART':
            return {
                ...state,
                cart: state.cart.filter(item => item.id !== action.payload)
            };
        case 'CLEAR_CART':
            return {
                ...state,
                cart: []
            };
        default:
            return state;
    }
}

// Create Redux store
const store = createStore(cartReducer);

// Subscribe to store updates to save to localStorage
store.subscribe(() => {
    saveState(store.getState());
});

// Render cart items and calculate total
const renderCartItems = () => {
    const { cart } = store.getState();
    const cartItemsElement = document.getElementById('cart-items');
    cartItemsElement.innerHTML = ''; // Clear previous items

    // Start with an empty table
    let tableHTML = `<table class="min-w-full table-auto">
                        <thead class="bg-gray-200">
                            <tr>
                                <th class="px-4 py-2 text-left">Item</th>
                                <th class="px-4 py-2 text-left">Price</th>
                                <th class="px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>`;

    let totalPrice = 0;

    cart.forEach(item => {
        const itemPrice = parseFloat(item.price);
        totalPrice += itemPrice;

        tableHTML += `<tr>
                        <td class="border px-4 py-2">${item.name}</td>
                        <td class="border px-4 py-2">$${itemPrice.toFixed(2)}</td>
                        <td class="border px-4 py-2">
                            <button class="remove-item bg-blue-600 text-white font-bold py-1 px-2 rounded" data-id="${item.id}">Remove</button>
                        </td>
                      </tr>`;
    });

    tableHTML += `</tbody>
                  </table>`;

    cartItemsElement.innerHTML = tableHTML;

    // Update total price display
    const totalPriceElement = document.getElementById('total-price');
    totalPriceElement.innerHTML = `<div class="text-right font-bold mt-2">Total: $${totalPrice.toFixed(2)}</div>`;

    // Attach event listeners to remove buttons after the HTML has been updated
    attachRemoveItemListeners();
};





// Attach event listeners to each remove button
function attachRemoveItemListeners() {
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.getAttribute('data-id');
            store.dispatch({
                type: 'REMOVE_FROM_CART',
                payload: itemId
            });
        });
    });
}

// Clear cart event
document.getElementById('clear-cart').addEventListener('click', () => {
    store.dispatch({ type: 'CLEAR_CART' });
});

// Initial render of the cart items
renderCartItems();

// Subscribe to store updates for re-rendering the cart items
store.subscribe(renderCartItems);












