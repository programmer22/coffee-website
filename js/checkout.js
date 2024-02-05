const { createStore } = Redux;

// Load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('cartState');
    if (serializedState === null) {
      return { cart: [] };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return { cart: [] };
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

const initialState = loadState();

function cartReducer(state = initialState, action) {
    console.log("Reducer Action:", action);
    switch (action.type) {
        case 'REMOVE_FROM_CART':
            const newState = {
                ...state,
                cart: state.cart.filter(item => item.id !== action.payload),
            };
            console.log("New State after REMOVE_FROM_CART:", newState);
            return newState;
        case 'CLEAR_CART': // New action type for clearing the cart
            return {
                ...state,
                cart: [], // Set cart to an empty array
            };
        default:
            return state;
    }
}


const store = createStore(cartReducer, initialState);

store.subscribe(() => {
  renderCartItems();
  saveState(store.getState());
});

const renderCartItems = () => {
  const state = store.getState();
  const cartItemsElement = document.getElementById('cart-items');
  cartItemsElement.innerHTML = '';

  state.cart.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.innerHTML = `${item.name} - $${item.price.toFixed(2)} <button class="remove-item border-2 border-black px-4 py-2 mb-2" data-id="${item.id}">Remove</button>`;
    console.log(`Button for ${item.name} has ID: ${item.id}`); // Confirming button ID assignment
    cartItemsElement.appendChild(itemElement);
  });
  

  attachRemoveItemListeners();
};

function attachRemoveItemListeners() {
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', function(event) {
        // Directly use event.currentTarget to ensure we're always referring to the button itself, not a child element
        const itemId = event.currentTarget.getAttribute('data-id');
        console.log(`Attempting to remove item with ID: ${itemId}`);

        if (itemId) {
          store.dispatch({
            type: 'REMOVE_FROM_CART',
            payload: itemId,
          });
        } else {
          console.error('Item ID is undefined.');
        }
      });
    });
}

document.getElementById('clear-cart').addEventListener('click', () => {
    store.dispatch({ type: 'CLEAR_CART' });
    console.log('Cart cleared');
});


renderCartItems();

