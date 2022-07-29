/**
 * The deleteProduct function removes a product from the cart.
 *
 *
 * @param id Identify the product to be deleted
 * @param color Check if the color of product is the same
 * @param quantity Check if the quantity of product is the same
 *
 *
 * @docauthor Tommy MOREAU
 */
function deleteProduct(id, color, quantity) {
   // Get the cart from the localStorage
   let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

   // Remove the product from the cart
   for (let i = 0; i < cart.length; i++) {
      if (cart[i].id === id && cart[i].color === color && cart[i].quantity === quantity) {
         cart.splice(i, 1);
      }
   }

   // Save the cart in the localStorage
   localStorage.setItem('cart', JSON.stringify(cart));
}


/**
 * The addCartDOM function adds a product to the cart.
 *
 *
 * @param product Get the product's information
 *
 *
 * @docauthor Tommy MOREAU
 */
function addCartDOM(product){
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
 *
 * @docauthor Tommy MOREAU
 */
function requestProductsCart() {
   let xhr = new XMLHttpRequest();

   let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

   for (let i = 0; i < cart.length; i++) {
      xhr.open('GET', 'http://localhost:3000/api/products/' + cart[i].id);

      xhr.onload = function () {
         let product = JSON.parse(xhr.responseText);

         if (xhr.status === 200) {
            product.quantity = cart[i].quantity;
            product.color = cart[i].color;

            addCartDOM(product);
         }
      }

      xhr.send();
   }
}

// Get the cart from localStorage
requestProductsCart();

// Use click listener when pressed deleteItem
document.addEventListener('click', function (event) {
   if (event.target.classList.contains('deleteItem') && event.target.parentElement.parentElement.parentElement.parentElement.classList.contains('cart__item')) {
      let id = event.target.parentElement.parentElement.parentElement.parentElement.dataset.id;
      let color = event.target.parentElement.parentElement.parentElement.parentElement.dataset.color;
      let quantity = event.target.parentElement.parentElement.parentElement.parentElement.querySelector('.itemQuantity').value;

      deleteProduct(id, color, quantity);
      event.target.parentElement.parentElement.parentElement.parentElement.remove();
   }
});
