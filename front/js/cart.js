import {default as routes} from "./routes.js";

/**
 * The deleteProduct function removes a product from the cart.
 *
 * @param id Identify the product to be deleted
 * @param color Check if the color of product is the same
 * @param quantity Check if the quantity of product is the same
 *
 * @docauthor Tommy MOREAU
 */
function deleteProduct(id, color, quantity) {
   // Get the cart from the localStorage
   let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

   cart.forEach((item, i) => {
      if (item.id === id && item.color === color) {
         cart.splice(i, 1);
      }

      // Update the localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
   })

   // Update the cart view DOM
   requestProductsCart();
}

/**
 * The updateProduct function update the product quantity and the
 * total price/quantity of the card in the page.
 *
 * @param id Identify the product to be updated
 * @param color Check if the color of product is the same
 * @param quantity the new quantity of the product
 *
 * @docauthor Tommy MOREAU
 */
function updateProduct(id, color, quantity) {
   let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

   for (let i = 0; i < cart.length; i++) {
      if (cart[i].id === id && cart[i].color === color) {

         fetch(routes.getProduct(id))
            .then(response => response.json())
            .then(product => {
               // Get the quantity of the product and update it
               let oldQuantity = parseInt(cart[i].quantity);
               let newQuantity = parseInt(quantity);

               // Get the total price and total quantity
               // Generate regex to remove space
               let gPrice = parseFloat(document.getElementById('totalPrice').innerHTML.replace(/\s/g, ''));
               let gQuantity = parseInt(document.getElementById('totalQuantity').innerHTML.replace(/\D/g, ''));

               // The price of the product
               let price = product.price;

               // Update the total price and total quantity
               gPrice = gPrice - (price * oldQuantity) + (price * newQuantity);
               gQuantity = gQuantity - oldQuantity + newQuantity;

               // Set the price/quantity with a comma between each digit with regex
               document.getElementById('totalPrice').innerHTML = gPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
               document.getElementById('totalQuantity').innerHTML = gQuantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

               // Update the cart
               cart[i].quantity = parseInt(quantity);

               // Update the localStorage
               localStorage.setItem('cart', JSON.stringify(cart));
            })
            .catch(error => console.log(error));
      }
   }
}

/**
 * The addCartDOM function adds a product to the cart.
 *
 * @param product Get the product's information
 *
 * @docauthor Tommy MOREAU
 */
function addCartDOM(product) {
   // Get the container of the cart
   let productsContainer = document.getElementById('cart__items');
   // Create a new article element in the cart
   let productElement = document.createElement('article');

   // Add all the product's informations in the article
   productElement.innerHTML = `
          <article class="cart__item" data-id="${product._id}" data-color="${product.color}">
            <div class="cart__item__img">
              <img src="${product.imageUrl}" alt="Photographie d'un canapé">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${product.name}</h2>
                <p>${product.color}</p>
                <p>${product.price} €</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>
          </article>
       `;

   // Append the productElement to the productsContainer
   productsContainer.appendChild(productElement);
}

/**
 * The requestProductsCart function is used to request the products from the localStorage and add them to the cart.
 *
 * @docauthor Tommy MOREAU
 */
function requestProductsCart() {
   let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
   let price = 0;
   let quantity = 0;

   fetch(routes.products)
      .then(response => response.json())
      .then(products => {
         for (let product of products) {
            for (let i = 0; i < cart.length; i++) {
               if (cart[i].id === product._id) {
                  product.quantity = cart[i].quantity;
                  product.color = cart[i].color;

                  addCartDOM(product);

                  price += product.price * cart[i].quantity;
                  quantity += cart[i].quantity;
               }
            }
         }

         // Set the price with a comma between each digit with regex
         document.getElementById('totalPrice').innerHTML = price.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
         // Set the quantity with a comma between each digit with regex
         document.getElementById('totalQuantity').innerHTML = quantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      })
      .catch(error => console.log(error));
}

// Get the cart from localStorage
requestProductsCart();

// Use click listener when pressed deleteItem
document.addEventListener('click', function (event) {
   if (event.target.classList.contains('deleteItem') && event.target.parentElement.parentElement.parentElement.parentElement.classList.contains('cart__item')) {
      // let id = event.target.parentElement.parentElement.parentElement.parentElement.dataset.id;
      let target = event.target.closest('.cart__item');

      let id = target.dataset.id;
      let color = target.dataset.color;
      let quantity = document.querySelector('.itemQuantity').value;

      deleteProduct(id, color, quantity);
      target.remove();

   } else if (event.target.id === 'order') {
      event.preventDefault();

      let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

      // Check if cart is empty
      if (!cart.length) {
         alert("Votre panier est vide");
         return;
      }

      // Stock all errors
      const errorsArr = [
         "Veuillez entrer une ville valide", // City
         "Veuillez entrer un prénom valide", // First name
         "Veuillez entrer un nom valide", // Last name
         "Veuillez entrer une adresse valide", // Address
         "Veuillez entrer un email valide" // Email
      ];

      // Check all input with regex to check if they are valid
      let regexOnlyLetters = /^[A-zÀ-ÿ\s]*$/i;
      let regexAddress = /^[A-Za-z0-9À-ÿ'\.\-\s\,]*$/i;
      let regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i

      let formValidity = true;

      for (let input of document.getElementsByClassName('cart__order__form')[0].elements) {
         switch (input.name) {
            case 'city':
            case 'lastName':
            case 'firstName':
               // Use regex to check if it's a name
               if (regexOnlyLetters.test(input.value) && input.value.length > 1) {
                  document.getElementById(input.name + "ErrorMsg").innerHTML = "";
               } else {
                  switch (input.name) {
                     case 'city':
                        document.getElementById(input.name + "ErrorMsg").innerHTML = errorsArr[0];
                        break;
                     case 'firstName':
                        document.getElementById(input.name + "ErrorMsg").innerHTML = errorsArr[1];
                        break;
                     case 'lastName':
                        document.getElementById(input.name + "ErrorMsg").innerHTML = errorsArr[2];
                        break;
                  }
                  formValidity = false;
               }
               break;
            case 'address':
               if (regexAddress.test(input.value) && input.value.length > 5) {
                  document.getElementById(input.name + "ErrorMsg").innerHTML = "";
               } else {
                  document.getElementById(input.name + "ErrorMsg").innerHTML = errorsArr[3];
                  formValidity = false;
               }
               break;
            case 'email':
               if (regexEmail.test(input.value) && input.value.length > 5) {
                  document.getElementById(input.name + "ErrorMsg").innerHTML = "";
               } else {
                  document.getElementById(input.name + "ErrorMsg").innerHTML = errorsArr[4];
                  formValidity = false;
               }
               break;

         }
      }

      // Is form is not valid, don't continue
      if (!formValidity) {
         return;
      }

      // Make the order with a post
      fetch(routes.order, {
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
         },
         method: 'POST',
         body: JSON.stringify({
            contact: {
               firstName: document.getElementById("firstName").value,
               lastName: document.getElementById("lastName").value,
               address: document.getElementById("address").value,
               city: document.getElementById("city").value,
               email: document.getElementById("email").value
            },
            products: [...cart.map(product => product.id)]
         })
      })
         .then(response => response.json())
         .then(order => {
            localStorage.removeItem('cart');

            window.location = "../html/confirmation.html?id=" + order.orderId;


         })
         .catch(error => console.log(error));
   }
});

// Use change listener when changed itemQuantity in the input
document.addEventListener('change', function (event) {
   if (event.target.classList.contains('itemQuantity')) {
      let id = event.target.parentElement.parentElement.parentElement.parentElement.dataset.id;
      let color = event.target.parentElement.parentElement.parentElement.parentElement.dataset.color;
      let quantity = event.target.parentElement.parentElement.parentElement.parentElement.querySelector('.itemQuantity').value;

      updateProduct(id, color, quantity);
   }
});
