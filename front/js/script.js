import {default as routes} from "./routes.js";

/**
 * Make a request to the server to get all the products.
 * It then creates an "a" element for each product and appends it to the #items div.
 *
 * @docauthor Tommy MOREAU
 */
function getAllProducts() {
   fetch(routes.products)
      .then(response => response.json())
      .then(data => {
         // Request succeeded. Use the response
         let products = data;
         let productsContainer = document.getElementById('items');

         // Loop through the products and create a new a for each one
         for (let product of products) {
            let productElement = document.createElement('a');

            productElement.href = './product.html?id=' + product._id;
            productElement.innerHTML = `
                <article>
                   <img src="${product.imageUrl}" alt="${product.name}">
                   <h3 class="productName">${product.name}</h3>
                   <p class="productDescription">${product.description}</p>
                </article>
             `;

            productsContainer.appendChild(productElement);
         }
      }).catch(err => console.log(err)); // If the request failed, do something with the response
}

// Call the getProducts function when page first load
getAllProducts();
