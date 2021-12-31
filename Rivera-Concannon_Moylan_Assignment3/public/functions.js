/*
FileName: functions.js
Authors: Peter Rivera-Concannon & Nate Moylan
Purpose: To store functions used. Referenced from a source given by Nate and other outside sources
*/

//////////////////////////////////////////////////////////////////////////////////////
/* This function asks the server for a "service" and converts the response to text. */
//////////////////////////////////////////////////////////////////////////////////////
function loadJSON(service, callback) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('POST', service, false);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

 /////////////////////////////////////////////////////////////////////////////////
 /* Used to update the cart when the user changes the quantity in the cart.html */
 /////////////////////////////////////////////////////////////////////////////////
 function updatecart(updated_cart_data) {
  (async () => {
    const rawResponse = await fetch('Cart', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updated_cart_data)
    });
    const content = await rawResponse.json();
    location.reload();
    alert(content["message"]);
  })();
}
/////////////////////////////////////////////////////////////////////////////////////////
/* Used to get the Cookie to chcek if te user is logged in before they are checked out */
/////////////////////////////////////////////////////////////////////////////////////////
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


 