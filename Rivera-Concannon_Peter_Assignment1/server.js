/*
Statement about what this page is and giving credit to me for making it
*/

var products = require('./products.json');
var fs = require('fs');
var express = require('express');
var app = express();
// Routing 

// monitor all requests
app.all('*', function (request, response, next) {
   console.log(request.method + ' to ' + request.path);
   next();
});

// process purchase request (validate quantities, check quantity available)
        //referenced the Lab13 examples to structure my thing.

// route all other GET requests to files in public 
app.use(express.static('./public'));

// start server
app.listen(8080, () => console.log(`listening on port 8080`));

/*
//Refrenced from the Assignment1 MVC EX
app.post("/process_invoice", function (request, response, next) {
    let POST = request.body;
    if(typeof POST['purchase_submit'] == 'undefined') {
        console.log('Error, no data, undefined');
        next();
    } 

    console.log(Date.now() + ': Purchase made from ip ' + request.ip + ' data: ' + JSON.stringify(POST));

    var contents = fs.readFileSync('./views/invoice.template', 'utf8');
    response.send(eval('`' + contents + '`')); // render template string
*/

//Referenced from Invoice 4
//Function used to generate the item rows for the invoice
/*
function gen_invoice_rows(products) {
    for(i=0; product[i][])
}
*/
//Refrenced from the Assignment1 MVC EX

app.get("/UHManoaFootballTickets", function (request, response) {
    var contents = fs.readFileSync('./views/product_display.template', 'utf8');
    response.send(eval('`' + contents + '`')); // render template string

//<!--Referenced from SmartPhoneProducts3 but modified to work with my arrays--> Used to display the different products.
    function display_tickets() {
            for (i = 0; i < products.length; i++) {
                console.log(`Sub-array ${i}: ${products[i]}`);
                for(j=0; j<products[i].length; j++) {
                    console.log(`Element ${j}: ${products[i][j]}`)
                }
                window.alert(`
                <ul>
                <li><h1>${products[i]} Side Stands</h1></li><!--maybe move before the for [j] loop-->

                <li><h2>Seat Section: <br> ${products[i][j].section}</h2></li>

                <li><p>Ticket price: <br> $${products[i][j].price}</p></li>

                <li><h2

                <li><h2>There are: ${products[i][j].qty_available} Seats Available</h2></li>
                <ul>
                `);
            }
        }
    });
