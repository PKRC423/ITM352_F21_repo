/*
Statement about what this page is and giving credit to me for making it
*/

var products = require('./products.json');
var fs = require('fs');
var express = require('express');
var app = express();
var myParser = require("body-parser");
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


//Refrenced from the Assignment1 MVC EX

app.get("/UHManoaFootballTickets", function (request, response) {
    var contents = fs.readFileSync('./views/product_display.template', 'utf8');
    response.send(eval('`' + contents + '`')); // render template string

//<!--Referenced from SmartPhoneProducts3 but modified to work with my arrays--> Used to display the different products.
    function display_tickets() {
        str = '';
            for (i = 0; i < products.length; i++) {
                str += `
                <ul>
                <li><h1>${products[i]} Side Stands</h1></li>

                <li><h2>Seat Section: <br> ${products[i][0]}</h2></li>

                <li><p>Ticket price: <br> $${products[i][1]}</p></li>

                <li><h2>There are: ${products[i][2]} Seats Available</h2></li>
                <ul>
                `;
            }
            return str;
        }
    });
