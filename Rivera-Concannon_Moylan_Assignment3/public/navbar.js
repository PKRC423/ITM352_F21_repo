/*
FileName: navbar.js
Authors: Peter Rivera-Concannon & Nate Moylan
Purpose: This document is used to create a function that displays a navigation bar when called on each page, as well as checking if the usre is logged in already and displaying the correct prompt for them (login or logout)
*/

// This function makes a navigation bar from a products_data object

function navbar() {

    var cart_qty;
    loadJSON('./cart_qty', function (res) {
        // Parsing JSON string into object
        cart_qty = JSON.parse(res);
    });

    //------------------------------------To create the nav_bar-------------------------------------------//
    
    document.write(`
        <ul>
            
            <li><a href ="./index.html">UH Manoa Athletic Store</a></li>
            <li><a href ="./cart.html${location.search}">Shopping Cart</a></li>
            <li><a href ="./index.html${location.search}">Products</a></li>
                <div class ="dropdown-content">`);

                for(let prodtype in allProducts){
                    document.write(`<a href = "./products.html?product_key=${prodtype}">${prodtype}</a><br></div>`)
                }
                if (getCookie("username")!= ""){
                    document.write(`
                        <li><a href="./logout">Logout ${getCookie("username")}</a></li>
                    `);
                } else {
                    document.write(`
                        <li><a href="./login.html${location.search}">Login (You are not logged In!)</a></li>
                    `);
                }
                    document.write(`
                        <li><a href="./register.html${location.search}">Register</a></li>
       
            
       </ul>
        `);
};
