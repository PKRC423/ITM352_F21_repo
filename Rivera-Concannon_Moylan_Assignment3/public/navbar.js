/*
FileName: navbar.js
Authors: Peter Rivera-Concannon & Nate Moylan
Purpose: This document is used to create a function that displays a navigation bar when called on each page, as well as checking if the usre is logged in already and displaying the correct prompt for them (login or logout)
*/

// This function makes a navigation bar from a products_data object

function navbar() {


    //------------------------------------To create the nav_bar-------------------------------------------//
    
    document.write(`
        <ul>
            <li style="float:left"><a href = "./index.html">UH Manoa Athletic Store</a></li><br>
            <li><a href ="./cart.html${location.search}">Shopping Cart</a></li>
            <li><a href ="./index.html${location.search}">Products</a></li>
                <div class ="dropdown-content">`);

                for(let prodtype in allProducts){
                    document.write(`<a href = "./products.html?productkey =${prodtype}">${prodtype}</a></ul>`)
                }

};
