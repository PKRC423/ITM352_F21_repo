/*
Created by: Peter Rivera-Concannon
Referenced code from many labs and WODS, mainly LAB13 and Inovice 4, as well as help from external sources
*/

var products = require('./views/products.json');
var fs = require('fs');
var express = require('express');
var myParser = require("body-parser");
const { response } = require('express');
var app = express();
products.forEach((prod,i) => {prod.qty_available = 100;});

// monitor all requests
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});
//So Express can decode the body of an HTTP request since by default Express cannot do that.
app.use(express.urlencoded({ extended: true }));
// route all other GET requests to files in public 
app.use(express.static('./public'));
// start server
app.listen(8080, () => console.log(`listening on port 8080`));
//rule to get the products.js data, given by Prof. Kazman.
app.get("/products.js", function (request, response, next){
    response.type('.js');
    var product_str = `var products = ${JSON.stringify(products)};`;
    response.send(product_str);
    console.log('GET products ran')
});

//This function checks if the input is a non-negative integer and if there are more than or equal to 5 tickets of the same type are purchased. And it validates that there are enough tickets availabl to purchase.
function checkInt(input, qty_available, returnErr = false) {
    errors = []; //No errors yet hopefully
    if (input == '') input = 0; //Incase they just delete the value in the input box, itll be treated as a 0.
    if (Number(input) != input) {
        errors.push("<font color='red'>Enter a Valid Number</font>");//Checks if string is a number value
    } else {
        if (input < 0) errors.push('<font color="red">Enter a Positive and Valid Quantity</font>');//Checks if it's a negative value
        if (parseInt(input) != input) errors.push('<font color="red">Enter a non-decimal and Valid Quantity</font>'); //Checks if it has decimal values
        if (input > 10) errors.push('<font color="red">10 Tickets Max per Party</font>'); //Checks if over 10 ticekts are being bought from that section.
        if (input > qty_available) errors.push('<font color="red">Not enough tickets left to fullfill order</font>'); //Checks if the amounted ordered it over the amount available
    }
    return returnErr ? errors : (errors.length == 0);
    
}

/*
//To change the label for the quantity[i]_label when an invalid quantity is inputted
//Given too by professor Kazman after we had a meeting to fix my Assignment.
function checkInput(input, qty_available) {
   retVal = checkInt(input, qty_available)
   if(retVal) { str ="Valid Quantity";
    } 
    else {str ="Invalid Quantity";
    }
   document.getElementById(input.name + '_label').innerHTML = str;
}
*/

//Referenced from the Lab13 Ex5 to process the invoice form and the Assignment 1 MVC EX.
app.post("/Check", function (request, response, next) {
    let POST = request.body;

    query_response = "";

    var noErr = true;
    
    //Validating the quantities and checking the availability of the tickets
    if (typeof POST['submit_purchase'] != undefined) {
        for (i = 0; i < products.length; i++) {

                qty = POST[`quantity${i}`];
                
                if (checkInt(qty, products[i].qty_available) == false) {
                    query_response += "Error with Quantity in Sections" + `${products[i].section_num}`;
                    console.log(products[i].qty_available)
                    console.log("Invalid Quantity");
                    noErr = false;
                } else {
                    QString = query_response.stringify(POST);
                    query_response += QString;
                    console.log(products[i].qty_available)
                    console.log("Valid Quantity");
                }
        }


//If there noErr is false then redirect user back to the UHManoaFootballTickets, otherwise send them to the cart.
        if (noErr == false){
            response.redirect("UHManoaFootballTickets" + "?" + query_response);
            console.log("Redirected to product display");
        }else {
            response.redirect("Cart" + "?" + query_response);
            console.log("Redirected to Cart");
        }

        next();
    }

}
);

//To send the user to the Invoice if the Data is valid
app.get("/Cart", function (request, response, next) {
    let POST = request.body;
    var body = fs.readFileSync('./views/cart.template', 'utf8');
    response.send(eval('`' + body + '`')); //This renders the template string into a readable html format.
    console.log('cart page loaded')

        //Referenced from Invoice 4
    //Function used to generate the item rows for the invoice
    function gen_cart() {
        str = '';
        subtotal = 0;
        for (i = 0; i < products.length; i++) {
            qty_purchased = POST[`quantity${i}`];
            if (qty_purchased > 0) {

                //takes the value of the amount purchased and subtracts it from the amount available
                products[i].total_sold += qty_purchased;
                products[i].qty_available -= products[i].total_sold;

                exPrice = qty_purchased * products[i].price;
                subtotal += exPrice;
                str += (`
                    <tr style="text-align: center; border: 4px solid black">
                        <td> <h2>Section:</h2></td>
                        <td style="text-align: center;">${products[i].section_num}</td>
                    </tr>
                    <tr style="border: 2px solid black">
                        <td>Tickets: </td>
                        <td style="text-align: center;">${qty_purchased}</td>
                    </tr>
                    <tr style="border: 2px solid black">
                        <td>Price per Ticket: </td>
                        <td style="text-align: center;">\$${products[i].price}</td>
                    </tr>
                    <tr style="border: 2px solid black">
                        <td>Extended Price: </td>
                        <td style="text-align: center;">\$${exPrice}</td>
                    </tr>
                `);
            }
        }
        //To Compute Tax and the Grand total.
        tax_rate = 0.0575;
        tax = tax_rate * subtotal;
        grandTotal = subtotal + tax;

        return str;
    }

    //Need to make a form to store the data so we can make a cart page and and display their order to make sure it correct, if not then we'll have a button to let them go back to their order. And then this form will react with a post request to show the invoice. referenced from Lab 14
});

app.post("/Receipt", function (request, response, next) {
    let POST = request.body;
    var body = fs.readFileSync('./views/invoice.template', 'utf8');
    response.send(eval('`' + body + '`')); //This renders the template string into a readable html format.
    console.log('Receipt page loaded');   

    //Referenced from Invoice 4
    //Function used to generate the item rows for the invoice
    function gen_invoice() {
        str = '';
        subtotal = 0;
        for (i = 0; i < products.length; i++) {
            qty_purchased = POST[`quantity${i}`];
            if (qty_purchased > 0) {

                //takes the value of the amount purchased and subtracts it from the amount available
                products[i].total_sold += qty_purchased;
                products[i].qty_available -= products[i].total_sold;

                exPrice = qty_purchased * products[i].price;
                subtotal += exPrice;
                str += (`
                    <tr style="text-align: center; border: 4px solid black">
                        <td> <h2>Section:</h2></td>
                        <td style="text-align: center;">${products[i].section_num}</td>
                    </tr>
                    <tr style="border: 2px solid black">
                        <td>Tickets: </td>
                        <td style="text-align: center;">${qty_purchased}</td>
                    </tr>
                    <tr style="border: 2px solid black">
                        <td>Price per Ticket: </td>
                        <td style="text-align: center;">\$${products[i].price}</td>
                    </tr>
                    <tr style="border: 2px solid black">
                        <td>Extended Price: </td>
                        <td style="text-align: center;">\$${exPrice}</td>
                    </tr>
                `);
            }
        }
        //To Compute Tax and the Grand total.
        tax_rate = 0.0575;
        tax = tax_rate * subtotal;
        grandTotal = subtotal + tax;

        return str;
        console.log("gen_invoice ran");
    }
});
//Refrenced from the Assignment1 MVC EX

app.get("/UHManoaFootballTickets", function (request, response) {
    var body = fs.readFileSync('./views/product_display.template', 'utf8');
    response.send(eval('`' + body + '`')); // render template string
    console.log('product display page loaded')



    //<!--Referenced from SmartPhoneProducts3 but modified to work with my arrays--> Used to display the different products.
    function display_tickets() {
        str = '';
        for (i = 0; i < products.length; i++) {
            strErr = "";
            if (request.query["name_err"] == undefined) {
                strErr = ""
            } else {
                strErr += `<h1>Invalid Quantity for purchase of Tickets in: ${products[i].section_num}. - ${request.query['name_err']}</h1>`
            };
            str += ` 
                <section style="text-align: center">
                <hr>
                <h1>Sections: ${products[i].section_num}</h1>
                <h2>Ticket price: <br> \$${products[i].price}</h2>
                <h2><img src=${products[i].image} alt="Image"><img></h2> 
                <h3><label for="inputQty" id="quantity${i}_label"> Tickets:</h3>
                <input type="text" id="inputQty" placeholder="0" name = "quantity${i}" onkeyup = "checkInput(this, ${products[i].qty_available});">
                <h2><label id="quantity_available${i}"> There are: ${products[i].qty_available} Seats Available </label></h2>
                </section>
                `;

        }
        return str;
        console.log('display_tickets ran')
    }
});