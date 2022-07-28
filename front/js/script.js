function getProducts() {
   // Make a request to the server to get all the products
   let xhr = new XMLHttpRequest();

   // Set the request method to GET
   xhr.open('GET', 'http://localhost:3000/api/products');

   // When the request is completed, do something with the response
   xhr.onload = function () {
      if (xhr.status === 200) {
         // Request succeeded. Parse the response.
         let products = JSON.parse(xhr.responseText);
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
      } else {
         // Request failed
         console.log('Request failed');
      }
   }

   // If the request failed, do something with the response
   xhr.onerror = function () {
      console.log(this.statusText);
   }

   // Set the request header to application/json
   xhr.send();
}

// Call the getProducts function when page first load
getProducts();
