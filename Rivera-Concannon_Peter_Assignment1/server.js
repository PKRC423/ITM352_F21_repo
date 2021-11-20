/*
Created by: Peter Rivera-Concannon
Referenced code from many labs and WODS, mainly LAB13 and Inovice 4, as well as help from external sources
*/

var products = require('./products.json');
var fs = require('fs');
var express = require('express');
var myParser = require("body-parser");
var app = express();
const { send } = require('process');

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

//This function checks if the input is a non-negative integer and if there are more than or equal to 5 tickets of the same type are purchased. And it validates that there are enough tickets availabl to purchase.
function checkInt(inputStr, qty_available, returnErr = false) {
    errors = []; //No errors yet hopefully
    qty_available = 0;
    if (inputStr == '') inputStr = 0; //Incase they just delete the value in the input box, itll be treated as a 0.
    if (Number(inputStr) != inputStr) {
        errors.push("Enter a Valid Number");//Checks if string is a number value
    } else {
        if (inputStr < 0) errors.push('Enter a Positive and Valid Quantity')//Checks if it's a negative value
        if (parseInt(inputStr) != inputStr) errors.push('Enter a non-decimal and Valid Quantity'); //Checks if it has decimal values
        if (inputStr > qty_available) errors.push('Not enough tickets left to fullfill order'); //Checks if the amounted ordered it over the amount available
        if (inputStr > 10) errors.push('10 Tickets Max per Party'); //Checks if over 10 ticekts are being bought from that section.
    }
    //document.getElementById(inputStr.name + '_label') = errors.join();
    return returnErr ? errors : (errors.length == 0);
}

//Referenced from the Lab13 Ex5 to process the invoice form and the Assignment 1 MVC EX.
app.post("/Check", function (request, response, next) {
    let POST = request.body;
    query_response = "";
    //Validating the quantities and checking the availability of the tickets
    if (typeof POST['submit_purchase'] != undefined) {
        for (i = 0; i < products.length; i++) {
            if ((`quantity${i}`) != undefined) {
                qty = POST[`quantity${i}`];
                err = [ ];
                //= qty; //To make the values sticky incase of an error ````````````````````````````` How Do you make this sticky? I cannot figure out what to put infront of the ==.
                if (checkInt(qty, products[i].qty_available) == false) {
                    query_response += "name_err" + `${products[i].section_num}`;
                    console.log("Invalid Quantity");
                    err.push(`Invalid Quantity for Tickets in Sections: ${products[i].section_num}`);
                } else {
                    err.push();
                }
            }
        }
        if (err != ''){
            response.redirect("UHManoaFootballTickets" + "?" + query_response);
        }else {
            response.redirect("Invoice");
        }

        next();
    }

}
);

//To send the user to the Invoice if the Data is valid
app.get("/Invoice", function (request, response, next) {
    str = `

    <body>
        <form action="./Receipt" method="POST">
            <input type="submit" value="Submit" id="submit">
        </form>
    </body>

`;
    response.send(str);
    //Need to make a form to store the data so we can make a cart page and and display their order to make sure it correct, if not then we'll have a button to let them go back to their order. And then this form will react with a post request to show the invoice. referenced from Lab 14
});

app.post("/Receipt", function (request, response, next) {
    let POST = request.body;
    var bodyInv = fs.readFileSync('./views/invoice.template', 'utf8');
    response.send(eval('`' + bodyInv + '`')); //This renders the template string into a readable html format.   

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
    }
});
//Refrenced from the Assignment1 MVC EX

app.get("/UHManoaFootballTickets", function (request, response) {
    var body = fs.readFileSync('./views/product_display.template', 'utf8');
    response.send(eval('`' + body + '`')); // render template string



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
                <h2>Ticket price: <br> $${products[i].price}</h2>
                <h2><img src=${products[i].image} alt="Image><img></h2> 
                <h3><label id="quantity${i}_label"> Tickets: </label> </h3>
                <input type="text" placeholder="0" name = "quantity${i}" onkeyup = "checkInt(this);">
                <h2><label id"quantity_available${i}"> There are: ${products[i].qty_available} Seats Available </label></h2>
                </section>
                `;

        }
        return str;
    }
});
