/*
Statement about what this page is and giving credit to me for making it
*/

var products = require('./products.json');
var fs = require('fs');
var express = require('express');
var myParser = require("body-parser");
var app = express();

// Routing 

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

//This function checks if the input is a non-negative integer and if there are more than or equal to 5 tickets of the same type are purchased.
function checkInt(inputStr, returnErr = false) {
    errors = []; //No errors yet hopefully
    if (Number(inputStr) != inputStr) {        //Checks if string is a number value
        errors.push("Enter a Valid Number")
    } else {
        if(inputStr < 0) errors.push('Enter a Positive and Valid Quantity')//Checks if it's a negative value
        if (parseInt(inputStr) != inputStr) errors.push('Enter a non-decimal and Valid Quantity'); //Checks if it has decimal values
        if (inputStr > 10) errors.push('10 Tickets Max per Party'); //Checks if over 10 ticekts are being bought from that section.

        }
    return returnErr ? errors : (errors.length == 0);
    }



//Check te validity of the quantity entered.
function checkQtyTxt(entry) {
    errors = checkInt(entry.value, true);
    if (entry.value.trim() == '') {
        errors = ['Enter Number of Tickets Wanted: ']
    }
    if (errors.length == 0) {
        errors = ['Desired Amount:']
    }
    document.getElementById(entry.name + '_label').innerHTML = errors.join;
}



//Referenced from the Lab13 Ex5 to process the invoice form and the Assignment 1 MVC EX.
app.post("/Receipt", function (request, response, next) {
    let POST = request.body;
    if (typeof POST['submit_purchase'] == 'undefined') {
        response.send(`<h1> Invalid purchase, Return to HomePage </h1>`);
        next();
    }

    var bodyInv = fs.readFileSync('./views/invoice.template', 'utf8');
    response.send(eval('`' + bodyInv + '`')); //This renders the template string into a readable html format.    

    //Referenced from Invoice 4
    //Function used to generate the item rows for the invoice
    function gen_invoice() {
        str = '';
        subtotal = 0;
        for (i = 0; i < products.length; i++) {
            qty_purchased = 0;
            if (typeof POST[`quantity${i}`] != 'undefined') {
                qty_purchased = POST[`quantity${i}`];
            }
            if (qty_purchased > 0) {
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
                qty_purchased += products[i].total_sold;
            }
        }
        //To Compute Tax and the Grand total.
        tax_rate = 0.0575;
        tax = tax_rate * subtotal;
        grandTotal = subtotal + tax;

        return str;
    }
}
);
//Refrenced from the Assignment1 MVC EX

app.get("/UHManoaFootballTickets", function (request, response) {
    var body = fs.readFileSync('./views/product_display.template', 'utf8');
    response.send(eval('`' + body + '`')); // render template string

    //<!--Referenced from SmartPhoneProducts3 but modified to work with my arrays--> Used to display the different products.
    function display_tickets() {
        str = '';
        for (i = 0; i < products.length; i++) {
            str += `
                <section style="text-align: center">
                <hr>
                <h1>Sections: ${products[i].section_num}</h1>
                <h2>Ticket price: <br> $${products[i].price}</h2>
                <h3><label id="quantity${i}_label"> Tickets: </label> </h3>
                <input type="text" placeholder="0" name = "quantity${i}" onkeyup = "checkQtyTxt(this);">
                <h2><label id"quantity_available${i}"> There are: ${products[i].qty_available} Seats Available </label></h2>
                </section>
                `;

        }
        return str;
    }
}
);