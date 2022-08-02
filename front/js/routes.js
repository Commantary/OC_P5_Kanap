// Stock all routes for API
let routes = {
   products: 'http://localhost:3000/api/products/',
   getProduct: function (id) {
      return this.products + id;
   },
   order: 'http://localhost:3000/api/products/order/',
};

// Export the routes
export default routes;
