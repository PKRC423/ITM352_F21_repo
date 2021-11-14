/*
Statement about what this page is and giving credit to me for making it
*/

var products = require('./products');
products.forEach( (prod,i) => {prod.total_sold = 0});
var fs = require('fs');
var express = require('express');
const { checkServerIdentity } = require('tls');
var app = express();
// Routing 

// monitor all requests
app.all('*', function (request, response, next) {
   console.log(request.method + ' to ' + request.path);
   next();
});

//So Express can decode the body of an HTTP request since by default Express cannot do that.
app.use(express.urlencoded({extended: true}));

// process purchase request (validate quantities, check quantity available)
        //This function checks if the input is a non-negative integer and if there are more than or equal to 5 tickets of the same typ are 
    function checkInt(inputStr, returnErr = false) {
       errors = []; //No errors yet hopefully
        if (Number(inputStr) != inputStr) {
            errors.push("Not a Valid Quantity")
        } else if(inputStr < 0) {
            errors.push('Not a Valid Quantity')
            } else {
                if (parseInt(inputStr) != inputStr) errors.push('Not a Valid Quanity');
                if (inputStr >= 5) errors.push('Too many Tickets Allowed by 1 Party');
            }
        return returnErr ? errors : (errors.length == 0);
        }

// route all other GET requests to files in public 
app.use(express.static('./public'));

// start server
app.listen(8080, () => console.log(`listening on port 8080`));

//Referenced from Lab13 Ex5, this is used to process products.JSON's products[]

app.get("/products.js", function (request, response, next) {
    var products = `${JSON.stringify(products)};`;
    response.send(products);
});
    
       //Refrenced from the Lab13 Ex5
app.post("/process_invoice_form", function (request, response, next) {
    let POST = request.body;
    let section =products[0]['section_num'];
    let section_price=products[0]['price'];

        if(typeof POST['quantity_textbox'] != 'undefined') {
            let quantity = POST['quantity_textbox'];
            if (checkInt(quantity)) {
                products[0]['total_sold'] += Number(quantity);
                response.redirect('/______' + quantity);
            } else {
                response.redirect('/______' +quantity);
            }
        }
    
        
    //Referenced from Invoice 4
    //Function used to generate the item rows for the invoice
    /*
        function gen_invoice_rows(products) {
            for(i=0; product[i][])
        }
    */
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
                <hr/>
                <h1>Sections: ${products[i].section_num}</h1>

                <h2>Ticket price: <br> $${products[i].price}</h2>

                <h3> Quantity </h3>

                <input type"text" placeholder="0" name = "quantity" onkeyup = "checkInt(this);'>

                <h2>There are: ${products[i].qty_available} Seats Available</h2>
                </section>
                `;
                }
                return str;
            }
        }
);
