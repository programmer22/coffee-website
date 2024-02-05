const { createStore } = Redux;

// Load state from localStorage
const loadState = () => {
    try {
      const serializedState = localStorage.getItem('cartState');
      if (serializedState === null) {
        return { cart: [] };
      }
      console.log("Loaded State from localStorage:", JSON.parse(serializedState)); // Log loaded state
      return JSON.parse(serializedState);
    } catch (err) {
      console.error("Loading State Failed:", err);
      return { cart: [] };
    }
};

// Save state to localStorage
const saveState = (state) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('cartState', serializedState);
      console.log("Saved State to localStorage:", state); // Log saved state
    } catch (err) {
      console.error('Could not save state', err);
    }
};

const initialState = loadState();

function cartReducer(state = initialState, action) {
  console.log("Reducer Action:", action); // Log every action dispatched
  switch (action.type) {
    case 'ADD_TO_CART':
      const newState = {
        ...state,
        cart: [...state.cart, action.payload],
      };
      console.log("New State after ADD_TO_CART:", newState); // Log new state after addition
      return newState;
    default:
      return state;
  }
}

const store = createStore(cartReducer, initialState);

store.subscribe(() => {
  saveState(store.getState());
});

function handleAddToCart(event) {
  const button = event.target;
  const productName = button.dataset.name;
  const productPrice = parseFloat(button.dataset.price);
  const productId = Date.now().toString(); // Simple unique ID for demonstration
  console.log(`Attempting to add product: ${productName} with ID: ${productId}`); // Log attempt to add

  store.dispatch({
    type: 'ADD_TO_CART',
    payload: { id: productId, name: productName, price: productPrice },
  });

  console.log(`${productName} added to cart!`); // Log confirmation
  showToast(`${productName} added to cart!`);
}

document.querySelectorAll('button[data-name][data-price]').forEach(button => {
  button.addEventListener('click', handleAddToCart);
});

function showToast(message) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.top = "50px";
    toast.style.right = "20px";
    toast.style.backgroundColor = "rgba(0,0,0,0.7)";
    toast.style.color = "white";
    toast.style.padding = "10px";
    toast.style.borderRadius = "5px";
    toast.style.zIndex = "1000";
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 3000); // Remove after 3 seconds
}
