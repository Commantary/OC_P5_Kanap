/**
 * The getProduct function retrieves a product from the server.
 *
 *
 * @docauthor Tommy MOREAU
 */
function getProduct() {
   // Get the product id from the url
   let id = new URL(window.location.href).searchParams.get('id');
   let xhr = new XMLHttpRequest();

   xhr.open('GET', 'http://localhost:3000/api/products/' + id);

   xhr.onload = function () {
      if (xhr.status === 200) {
         // Request succeeded. Parse the response.
         let product = JSON.parse(xhr.responseText);

         // Change the title of the page with the product name
         document.title = product.name;

         // Put the product image in the div.item__img
         let itemImgContainer = document.getElementsByClassName('item__img');
         let imgElement = document.createElement('img');

         // Set the src attribute to the imageUrl
         imgElement.src = product.imageUrl;
         // Set the alt attribute to the name
         imgElement.alt = "Photographie d'un canapé";

         // Append the imgElement to the itemImgContainer
         itemImgContainer[0].appendChild(imgElement);

         // Set the product name in the h1#title
         let titleElement = document.getElementById('title');

         // Set the innerHTML of the titleElement to the name
         titleElement.innerHTML = product.name;

         // Set the product description in the p#description
         let descriptionElement = document.getElementById('description');

         // Set the innerHTML of the descriptionElement to the description
         descriptionElement.innerHTML = product.description;

         // Set the product price in the p#price
         let priceElement = document.getElementById('price');

         // Set the innerHTML of the priceElement to the price
         priceElement.innerHTML = product.price;

         // Set all colors in the select#colors
         let colorsElement = document.getElementById('colors');

         // Loop through the colors and create a new option for each one
         for (let color of product.colors) {
            let optionElement = document.createElement('option');

            // Set the value of the option to the color
            optionElement.value = color;
            // Set the innerHTML of the option to the color
            optionElement.innerHTML = color;

            // Append the optionElement to the colorsElement
            colorsElement.appendChild(optionElement);
         }
      }
   }

   // If the request failed, do something with the response
   xhr.onerror = function () {
      console.log(this.statusText);
   }

   xhr.send();
}

/**
 * The addToCart function adds a product to the cart.
 *
 *
 * @docauthor Trelent
 */
function addToCart() {
   // Get the product id from the url
   let id = new URL(window.location.href).searchParams.get('id');

   // Stock in the localStorage the id, color and quantity of product
   let color = document.getElementById('colors').value;
   let quantity = document.getElementById('quantity').value;

   // Check if the form is valid
   if (quantity === '0' || color === '') {
      alert("Veuillez remplir tous les champs");
      return;
   }

   // Get the cart from the localStorage
   let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

   // Add the product to the cart
   cart[cart.length] = {
      id: id,
      color: color,
      quantity: quantity
   };

   // Save the cart in the localStorage
   localStorage.setItem('cart', JSON.stringify(cart));
}

getProduct();
