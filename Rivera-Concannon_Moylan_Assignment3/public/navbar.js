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
            
            <li><a href ="./index.html"><p style="color:black;"><b>UH Manoa Athletic Store</b></p></a></li>
            <li><a href ="./index.html${location.search}"><p style="color:black;"><b>Products</b></p></a></li>
            <li><a href ="./cart.html${location.search}"><p style="color:black;"><b>Shopping Cart</b></p></a></li>
            
                `);

                for(let prodtype in allProducts){
                    document.write(`<div class ="dropdown-content"><a href = "./products.html?product_key=${prodtype}">${prodtype}</a></div>`)
                }
                if (getCookie("username")!= ""){
                    document.write(`
                        <li><a href="./logout">Logout ${getCookie("username")}</a></li>
                    `);
                } else {
                    document.write(`
                        <li><a href="./login.html${location.search}"><p style="color:black;"><b>Login <i>(You are not logged In!)</i></b></p></a></li>
                    `);
                }
                    document.write(`
                        <li><a href="./register.html${location.search}"><p style="color:black;"><b>Register</b></p></a></li>
       
            
       </ul>
        `);
};
