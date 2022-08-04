/**
 * @description Set the ID of the command
 */
function getOrderId(){
   document.getElementById('orderId').innerHTML = new URL(window.location.href).searchParams.get('id');
}

getOrderId();
