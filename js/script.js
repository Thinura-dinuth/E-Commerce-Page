// Add an event listener to toggle the cart visibility
const cartBtn = document.getElementById("cartBtn");
const CloseCartBtn = document.getElementById("closeCartBtn");
const cart = document.getElementById("cart-tab");
const body = document.querySelector('body');
const nav = document.querySelector('.nav');

cartBtn.addEventListener("click", () => {
  body.classList.add("active");
  cart.style.display = "grid";
  nav.classList.add('active');
});

CloseCartBtn.addEventListener("click", () => {
  body.classList.remove("active");
  cart.style.display = "none";
  nav.classList.remove('active');
});

function toggleCart() {
  const cartTab = document.getElementById('cart-tab');
  cartTab.classList.toggle('show-cart');
}

// Function to calculate the price
function updatePrice() {
  const itemPrices = [7000, 4750, 5000, 7750, 6750, 350, 3200, 4950, 1650, 11000];
  const selectedSize = document.getElementById('modal-product-size-1').value;
  const quantity = parseInt(document.getElementById('modal-product-quantity-1').value);

  const itemIndex = parseInt(itemId) - 1;

  let updatedPrice;
  switch(selectedSize) {
    case 'medium':
      updatedPrice = itemPrices[itemIndex] * 1.3;
      break;
    case 'large':
      updatedPrice = itemPrices[itemIndex] * 1.5;
      break;
    default:
      updatedPrice = itemPrices[itemIndex];
  }

  updatedPrice *= quantity;

  document.getElementById('modal-product-price').textContent = 'Rs.' + updatedPrice;

  item.price = 'Rs.' + updatedPrice;
  
  return updatedPrice;
}

let itemId
let item = {};

// Function to open the modal
function toggleItemDescription(event) {
  itemId = event.currentTarget.getAttribute('data-description-id');
  const itemName = document.getElementById(`item-name-${itemId}`).textContent;
  const itemDescription = document.getElementById(`item-description-${itemId}`).textContent;
  const itemPrice = document.getElementById(`item-price-${itemId}`).textContent;
  const itemImage = document.querySelector(`[data-description-id="${itemId}"] .item-img`).getAttribute('src');

  // Set modal content
  document.getElementById('modal-product-image').src = itemImage;
  document.getElementById('modal-product-name').textContent = itemName;
  document.getElementById('modal-product-price').textContent = itemPrice;
  document.getElementById('modal-product-description').textContent = itemDescription;
  document.getElementById('modal-product-size-1').value = 'small';
  document.getElementById('modal-product-quantity-1').value = 1;

  // Set up event listener for add to cart button in the modal
  const addToCartButton = document.getElementById('add-to-cart-modal-1');
  addToCartButton.onclick = function () {
    const selectedSize = document.getElementById('modal-product-size-1').value;
    const selectedQuantity = document.getElementById('modal-product-quantity-1').value;   
    
    const updatedPrice = updatePrice(itemId);    

    // Add item to cart
    item.id = itemId,
    item.name = itemName,
    item.image = itemImage,
    item.description = itemDescription,
    item.price = 'Rs.' + updatedPrice;
    item.size = selectedSize,
    item.quantity = selectedQuantity
    
    addToCart(item);
    
    modal.style.display = 'none';
  };
  
  updatePrice();

  const modal = document.getElementById('myModal');
  modal.style.display = 'block';
}

// Add event listener to the quantity input field
document.getElementById('modal-product-quantity-1').addEventListener('input', updatePrice);

// Close the modal when the user clicks on the close button or outside the modal
const modal = document.getElementById('myModal');
const closeBtn = document.getElementsByClassName('close-icon')[0];
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};
closeBtn.onclick = function () {
  modal.style.display = 'none';
};

function addToCart(item) {
  // Retrieve the cart items from localStorage or initialize an empty array if it doesn't exist
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  // Check if the item already exists in the cart
  const existingItem = cartItems.find(cartItem => cartItem.id === item.id && cartItem.size === item.size);

  if (existingItem) {
      // If the item exists with the same size, update its quantity
      existingItem.quantity = parseInt(existingItem.quantity) + parseInt(item.quantity);
  } else {
      // If the item doesn't exist with the same size, add it to the cart
      cartItems.push(item);
  }
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
 
 
  updateCartCount(cartItems);

  displayCartItems(cartItems);

  const totalPrice = cartItems.reduce((total, item) => total + (parseInt(item.price.replace(/\D/g, '')) * parseInt(item.quantity)), 0);
  updateTotalPrice(totalPrice);

}


// Function to update the cart count
function updateCartCount(cartItems) {
  const cartCountElement = document.getElementById('lblCartCount');
  const cartCount = cartItems.reduce((total, item) => total + parseInt(item.quantity), 0);
  cartCountElement.textContent = cartCount;

  if (cartCount === 0) {
    const listCart = document.querySelector('.list-cart');
    listCart.innerHTML = '';
    const totalPriceElement = document.querySelector('.price');
    totalPriceElement.textContent = 'Rs.0';

    // Remove cartItems from localStorage when car is empty
    localStorage.removeItem('cartItems');
  } else {
 
    let totalPrice = 0;
    cartItems.forEach(item => {
      totalPrice += parseInt(item.price.replace(/\D/g, '')) * item.quantity;
    });
    const totalPriceElement = document.querySelector('.price');
    totalPriceElement.textContent = 'Rs.' + totalPrice;    

    // Store cartItems in localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }
}

// Function to retrieve cart items from localStorage
function getCartItemsFromStorage() {
  const storedCartItems = localStorage.getItem('cartItems');
  if (storedCartItems) {
    return JSON.parse(storedCartItems);
  } else {
    return [];
  }
}

// Function to display cart items
function displayCartItems(cartItems) {
  const listCart = document.querySelector('.list-cart');
  listCart.innerHTML = '';

  const checkoutList = document.querySelector('.checkout-list');
  checkoutList.innerHTML = '';

  // Add item to the cart
  cartItems.forEach((item, index) => {
    
    const cartItemDiv = document.createElement('div');
    cartItemDiv.classList.add('cart-item');
    cartItemDiv.innerHTML = `
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-size">(${item.size})</div>
      </div>  
        <div class="total-price">${item.price}</div>
        <div class="quantity">
          <span class="minus">&lt;</span>
          <span class="qty">${item.quantity}</span>
          <span class="plus">&gt;</span>
        </div>
        <div class="bin"><ion-icon name="trash-bin-outline" class="del-item"></ion-icon></div>

    `;
    
    listCart.appendChild(cartItemDiv);

    // Plus and minus for the quantity
    const plusBtn = cartItemDiv.querySelector('.plus');
    const minusBtn = cartItemDiv.querySelector('.minus');
    const quantityDisplay = cartItemDiv.querySelector('.qty');
    const binIcon = cartItemDiv.querySelector('.del-item');

    plusBtn.addEventListener('click', () => {
      item.quantity++;  
      quantityDisplay.textContent = item.quantity;
      updateTotalPrice(parseInt(item.price.replace(/\D/g, '')) * item.quantity);      
      
      const updatedItem = cartItems.find(cartItem => cartItem.id === item.id && cartItem.size === item.size);
      updatedItem.quantity = item.quantity;
      updatedItem.priceWithoutCurrency = parseInt(updatedItem.price.replace(/\D/g, '')); // Update the price without currency
      
      updateCartCount(cartItems);
      updateOrderSummary(cartItems);
      
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      
      updateCheckoutItems(cartItems); // Update checkout items display
    });
    
    minusBtn.addEventListener('click', () => {
      if (item.quantity > 1) {
        item.quantity--;
        quantityDisplay.textContent = item.quantity;
        updateTotalPrice(parseInt(item.price.replace(/\D/g, '')) * item.quantity);
        
    
        const updatedItem = cartItems.find(cartItem => cartItem.id === item.id && cartItem.size === item.size);
        updatedItem.quantity = item.quantity;
        updatedItem.priceWithoutCurrency = parseInt(updatedItem.price.replace(/\D/g, '')); // Update the price without currency
        
        // Call updateCartCount here
        updateCartCount(cartItems);
        updateOrderSummary(cartItems);
    
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
          
        updateCheckoutItems(cartItems); // Update checkout items display
      }
    });
    

    binIcon.addEventListener('click', () => {
      cartItems.splice(index, 1);
      cartItemDiv.remove();
      updateTotalPrice(-parseInt(item.price.replace(/\D/g, '')) * item.quantity);
      updateCartCount(cartItems);
      updateOrderSummary(cartItems);
      
      updateCheckoutItems(cartItems); // Update checkout items display
    });
    
    updateOrderSummary(cartItems);
    
  });

  updateCheckoutItems(cartItems); // Initial update of checkout items display
}

function updateCheckoutItems(cartItems) {
  const checkoutList = document.querySelector('.checkout-list');
  checkoutList.innerHTML = '';

  cartItems.forEach(item => {
    const checkoutItemDiv = document.createElement('div');
    checkoutItemDiv.classList.add('checkout-item');
    checkoutItemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="info">
        <div class="name">${item.name}</div>
        <div class="size">${item.size}</div>
      </div>
      <div class="checkout-quantity">${item.quantity}</div>
      <div class="returnPrice">${item.price}</div>
    `;
    checkoutList.appendChild(checkoutItemDiv);
  });
}



// Function to update the order summary
function updateOrderSummary(cartItems) {
  // Calculate the total quantity based on the cartItems array
  const totalItems = cartItems.reduce((total, item) => total + parseInt(item.quantity), 0);

  // Update the order summary quantity element in the HTML
  const totalItemsElement = document.querySelector('.totalQuantity');
  totalItemsElement.textContent = totalItems;

  // Calculate the total price based on the cartItems array
  const totalPrice = cartItems.reduce((total, item) => total + (parseInt(item.price.replace(/\D/g, '')) * parseInt(item.quantity)), 0);

  // Update the order summary total price element in the HTML
  const totalPriceElement = document.querySelector('.totalPrice');
  totalPriceElement.textContent = 'Rs.' + totalPrice;
}

initializeCart();


// Add an event listener to the Empty Cart button
document.getElementById('emptybtn').addEventListener('click', () => {

  const confirmEmpty = confirm("Are you sure you want to empty your cart?");


  if (confirmEmpty) {
    // Clear the cart items from localStorage
    localStorage.removeItem('cartItems');

    updateCartCount([]);

    document.querySelector('.list-cart').innerHTML = '';

    updateTotalPrice(0);
  }
});

// function to initialize the cart
function initializeCart() {
  // Retrieve the cart items from localStorage
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  // Check if there is a dummy item in the cart and remove it
  const dummyIndex = cartItems.findIndex(item => item.dummy === true);
  if (dummyIndex !== -1) {
    cartItems.splice(dummyIndex, 1);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }

  updateCartCount(cartItems);

  displayCartItems(cartItems);

  const totalPrice = cartItems.reduce((total, item) => total + (parseInt(item.price.replace(/\D/g, '')) * parseInt(item.quantity)), 0);
  updateTotalPrice(totalPrice);
}

window.addEventListener('load', initializeCart);

function updateTotalPrice(totalPrice) {
  const totalPriceElement = document.querySelector('.total-price .price');
  totalPriceElement.textContent = 'Rs.' + totalPrice;
}

// Function to remove an item from the cart
function removeCartItem(itemId) {
  // Retrieve the cart items from localStorage
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  const itemIndex = cartItems.findIndex(item => item.id === itemId);

  if (itemIndex !== -1) {
    cartItems.splice(itemIndex, 1);

    updateCartCount(cartItems);

    displayCartItems(cartItems);

    const totalPrice = cartItems.reduce((total, item) => total + (parseInt(item.price.replace(/\D/g, '')) * parseInt(item.quantity)), 0);
    updateTotalPrice(totalPrice);

    // Save the updated cart items to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }
}

document.getElementById('checkoutbtn').addEventListener('click', function () {

  // Retrieve the cart items from localStorage
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const checkoutModal = document.getElementById("checkoutModal");
  const checkoutBtn = document.getElementById("checkoutbtn");

  if (cartItems.length > 0) {
    checkoutModal.style.display = 'block';
  } else {
    alert("Your cart is empty. Please add items to proceed to checkout.");
  }
});
const returncart = document.getElementById("return-cart");

returncart.onclick = function () {
  checkoutModal.style.display = "none";
}

//function to validate the form
function validateForm() {
  var fullName = document.getElementById('fullName').value;
  var email = document.getElementById('email').value;
  var address = document.getElementById('email').value;
  var city = document.getElementById('city').value;
  var district = document.getElementById('district').value;
  var postCode = document.getElementById('postCode').value;
  var cardName = document.getElementById('cardName').value;
  var cardNo = document.getElementById('cardNo').value;
  var expMonth = document.getElementById('expMonth').value;
  var expYear = document.getElementById('expYear').value;
  var cvv = document.getElementById('cvv').value;

  // Validate Full Name
  if (!/^[a-zA-Z ]+$/.test(fullName)) {
    alert('Please enter alphabets only for Full Name.');
    return false;
  }

  // Validate Email
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    alert('Please enter a valid email address.');
    return false;
  }

  // Validate Address, City and District
  if (!address || !city || !district) {
    alert('Please fill out all address fields.');
    return false;
  }

// Validate postal code
  if (!/^\d{5}$/.test(postCode)) {
    alert('Please enter a valid postal code.');
    return false;
  }

  // Validate Credit Card Number
  if (!/^\d{16}$/.test(cardNo)) {
    alert('Please enter a valid card number(16 digits).');
    return false;
  }

  // Validate Card Name, Expiry Month and Expiry Year
  if (!cardName || !expMonth || !expYear) {
    alert('Please fill out all credit card fields.');
    return false;
  }
  
  // Validating Expiry Year
  if (expYear < 2024) {
    alert('Card expired. Please enter a valid expiry year.');
    return false;
  }

  // Validating CVV
  if (!/^\d{3}$/.test(cvv)) {
    alert('Please enter a valid cvv.');
    return false;
  }

  return true
}

document.getElementById('proceed').addEventListener('click', function () {
  var isValid = validateForm();
  if (isValid) {

      const orderNumber = Math.floor(1000000 + Math.random() * 9000000);

      document.getElementById('orderNumber').textContent = '#' + orderNumber;

      document.querySelector('.order-complete').style.display = "block";
  }    
});

document.getElementById('shopMore').addEventListener('click', function() {
  // Clear the cart items from localStorage
  localStorage.removeItem('cartItems');

  updateCartCount([]);

  window.location.href = "shop.html";
});
