/*
Statement about what this page is and giving credit to me for making it
*/

var products = require('./products');
var fs = require('fs');
var express = require('express');
const { checkServerIdentity } = require('tls');
const { application } = require('express');
var app = express();
var myParser = require("body-parser");
const { url } = require('inspector');
// Routing 

// monitor all requests
app.all('*', function (request, response, next) {
   console.log(request.method + ' to ' + request.path);
   next();
});

//So Express can decode the body of an HTTP request since by default Express cannot do that.
app.use(express.urlencoded({extended: true}));


// route all other GET requests to files in public 
app.use(express.static('./public'));

// start server
app.listen(8080, () => console.log(`listening on port 8080`));

//Referenced from Lab13 Ex5, this is used to process products.JSON's products[]

app.get("/products.js", function (request, response, next) {
    var products = `${JSON.stringify(products)};`;
    response.send(products);
});

//Checks for a Valid interger and ifthe quantity is Valid
//This function checks if the input is a non-negative integer and if there are more than or equal to 5 tickets of the same type are purchased.
function checkInt(inputStr, returnErr = false) {
    errors = []; //No errors yet hopefully
    if (Number(inputStr) != inputStr) {        //Checks if it is a number
        errors.push("Not a Valid Quantity")
    } else {
        if(inputStr < 0) errors.push('Not a Valid Quantity');//Checks if it's a negative value
        if (parseInt(inputStr) != inputStr) errors.push('Not a Valid Quanity'); //Checks if it has decimal values
        if (inputStr >= 5) errors.push('Too many Tickets Allowed by 1 Party'); //Checks if ober 5 ticekts are being bought from that section.
        }
    return returnErr ? errors : (errors.length == 0);
    };
//Checks if the quantity of the 
function checkQtyTxt(){
    var errors = (document.getElementById(`quantity${i}`).value, true);
        qty_check_message.innerHTML = errors.join(" / ");
}

       //Referenced from the Lab13 Ex5 to process the invoice form
app.post("/Receipt", function (request, response, next) {
    let POST = request.body;
if (typeof POST[`quantity${i}`] == 'undefined') {
    let qty = POST[`quantity${i}`];
    if(checkInt(qty)) {
        products[0]['total_purchases'] += Number(qty);
        response.redirect('./views/invoice.template');
    }else {
        response.redirect('./views/product_display.template')
    }
}

    var bodyInv = fs.readFileSync('./views/invoice.template', 'utf8');
    response.send(eval('`' + bodyInv + '`')); //This renders the template string into a readable html format.    
        
    //Referenced from Invoice 4
    //Function used to generate the item rows for the invoice
    function gen_invoice() {
        str = '';
        subtotal = 0;
        for (i=0 ; i< products.length; i++) {
            qty_purchased = 0;
            if (typeof POST[`quantity${i}`] != 'undefined') {
                qty_purchased = POST[`quantity${i}`];
            }
            if (qty_purchased > 0) {
                exPrice = qty_purchased * products[i].price;
                subtotal += exPrice;
                str += (`
                    <tr>
                        <td> <b><i>Section: </b></i></td>
                        <td style="text-align: center;">${products[i].section_num}</td>
                    </tr>
                    <tr>
                        <td>Tickets: </td>
                        <td style="text-align: center;">${qty_purchased}</td>
                    </tr>
                    <tr>
                        <td>Price per Ticket: </td>
                        <td style="text-align: center;">\$${products[i].price}</td>
                    </tr>
                    <tr>
                        <td>Extended Price: </td>
                        <td style="text-align: center;">\$${exPrice}</td>
                    </tr>
                `);
                qty_purchased += products[i].total_sold;
                }
            }
            //To Compute Tax and the Grand total.
            tax_rate = 0.0575
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

                <img src="${products[i].image}" style="height: 30%; width: 30%;">

                <h2>Ticket price: <br> $${products[i].price}</h2>
                
                <input type="text" placeholder="0" name = "quantity${i}" onChange= "checkQtyTxt(this);">
                <span id='qty_check_message'>Enter a quantity</span>
                    <br>
                    <script>
                        if (params.has('quantity${i}')) {
                            quantity_form.quantity${i}'.value = params.get('quantity${i}'');
                            checkInt(product_purchase_form["quantity${i}'"]);
                        }
                    </script>

                <h2>There are: ${products[i].qty_available - products[i].total_sold} Seats Available</h2>
                </section>
                `;
                }
                return str;
            }
        }
);

