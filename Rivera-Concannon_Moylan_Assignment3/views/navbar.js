/*
filename: navigationBar.js
authors: Peter Rivera-Concannon & Nate Moylan
*/

// This function makes a navigation bar from a products_data object

function nav_bar() {

var cart_qty;
loadJSON('Cart', function (res) {
    //to parse JSON into a string
    cart_qty = JSON.parse(res);
});

//------------------------------------To create the nav_bar-------------------------------------------//
document.write(`
    <ul>
        <li style="float:left"><a href="../public/index.html"> UH Manoa  Online Athletics Store </a></li>
        <br>
        <li style="float:left"><a href="Cart">Cart(${cart_qty.value})</a></li>
        <br>
        <div class="dropdown-content">
        <li style="float:right"><a href="./UHManoaFootballTickets"><b>Tickets</b></a></li>
        <br>
        <li style="float:right"><a href="./Tops"><b>Tops</b></a></li>
        <br>
        <li style="float:right"><a href="./Bottoms"><b>Bottoms</b></a></li>
        <br>
        <li style="float:right"><a href="./Accessories"><b>Accessories</b></a></li>
        `)

        /*
//---------to load the part of the nav_bar for login or logout depending if the user is logged in or not---------//
        if (getCookie("username") != "") {
            document.write(`
            <li style="float:left"><a href="logout">Logout ${getCookie("username")}</a></li>
            </ul>`);
        }else {
            document.write(`
                <li style="float:left"><a href="login">Login or Registration</a></li>
            </ul>`);
        }

        */
}
;
