/**
 * @description stock the hostname of the server
 * @type {string}
 */
const host = 'http://localhost:3000';

/**
 * @description All the routes of the application
 * @type {{getProduct: (function(id)), products: string, order: string}}
 */
const routes = {
   getProduct: function (id) {
      return this.products + id;
   },
   products: `${host}/api/products/`,
   order: `${host}/api/products/order/`,
};

// Export the routes
export default routes;
