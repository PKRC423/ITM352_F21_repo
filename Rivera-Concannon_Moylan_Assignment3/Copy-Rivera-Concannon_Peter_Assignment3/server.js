/*
Created by: Peter Rivera-Concannon and Nate Moylan
Referenced code from many labs and WODS, mainly LAB13 and Inovice 4, as well as help from external sources
*/

var products = require('./views/products.json');
var fs = require('fs');
var express = require('express');
var myParser = require("body-parser");
const { response } = require('express');
var app = express();
// npm install query-string in terminal
var query_response = require("query-string");

var temp_qty_data = {}; //Stores needed info

// Set filename as variable for user_data.json
var filename = './views/user_data.json';


// Setup cookies and sessions
var cookieParser = require('cookie-parser'); // Require cookie-parser
var session = require('express-session'); // Require express sessions
//const nodemailer = require("nodemailer"); // Require nodemailer module

app.use(session({secret: "MySecretKey", resave: true, saveUninitialized: true}));
app.use(cookieParser());






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
app.get("/products.js", function (request, response, next) {
    response.type('.js');
    var product_str = `var products = ${JSON.stringify(products)};`;
    response.send(product_str);
    console.log('GET products ran')
});


//For Login Page and Processing



//Checks if file exists
if (fs.existsSync(filename)) {
    //Reads user_data.json
    //Moved the require in here from Ex1
    var data1 = fs.readFileSync(filename, 'utf-8');
    var user_login = JSON.parse(data1);
    console.log("User_data = ", user_login);

    //Reads the stats of the file
    fileStats = fs.statSync(filename);
    console.log("File " + filename + " has " + fileStats.size + " characters");
} else {
    console.log("Enter the correct filename");
    const user_login = [];
}
app.use(express.urlencoded({ extended: true }));

/* Just to load the register page */

app.get("/register", function (request, response) {
    // Give a simple register form
    var body = fs.readFileSync('./views/register.template', 'utf8');
    response.send(eval('`' + body + '`')); // render template string
    console.log('register page loaded')
});





/* Processing Register page */

app.post("/process_register", function (request, response) {
    console.log('request.body', request.body);
    console.log('user_login', user_login);


    // Got from example code from Assignment 2 module
    //assumes no errors at first
    var reg_errors = {};

    //validates name, username, email, and password
    reg_errors['fullname'] = [];
    reg_errors['username'] = [];
    reg_errors['email'] = [];
    reg_errors['password'] = [];
    reg_errors['confirm_password'] = [];


    // Fullname Validation// 
    if (/^[A-Za-z]+ [A-Za-z]+$/.test(request.body.fullname)) {
        console.log('fullname good');
    }
    else {
        reg_errors['fullname'].push('Please only use letters for fullname');
        console.log('fullname bad');
    }
    if (request.body.fullname == "") {
        reg_errors['fullname'].push('This field cannot be empty!')
    }
    if (request.body.fullname.length > 30 || request.body.fullname.length < 1) {
        reg_errors['fullname'].push('Maximum 30 Characters');
        console.log('fullname length is bad')
    }

    //Username Validation//
    var reg_username = request.body.username.toLowerCase(); // Requires username to be in lowercase

    if (typeof user_login[reg_username] != 'undefined') {
        reg_errors['username'].push('Username already taken!');
    }

    if (request.body.username.length > 10 || request.body.username.length < 4) {
        reg_errors['username'].push('Username should be within 4 and 10 characters.');
        console.log('username length not good');
    }

    if (typeof reg_username == '') {
        reg_errors['username'].push('Please enter a username.');
        console.log('username empty');
    }
    if (/^[0-9a-zA-Z]+$/.test(request.body.username)) {
        console.log('username has no other values')
    } else {
        reg_errors['username'].push('Numbers and letters only please.');
        console.log('username has other values')

    }

    //Email Validation//
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(request.body.email)) {
        console.log('Email good');
    }
    else {
        reg_errors['email'].push('Please enter a valid email (Ex: user@gmail.com');
        console.log('email bad');
    }

    //Password Validation//
    if (request.body.password < 6) {
        reg_errors['password'].push('Please make a password longer than 6 characters.');
        console.log('pass too short')
    }

    //Confirm Password Validation 
    if (request.body.password != request.body.confirm_password) {
        reg_errors['confirm_password'].push('Passwords do not match.');
        console.log('pass dont match')
    }

    // Requests name, username, and email
    request.query.fullname = request.body.fullname;
    request.query.username = request.body.username;
    request.query.email = request.body.email;





    // If no errors then save new user data in JSON file and redirect to receipt
    console.log('reg_errors:', reg_errors);

    if (Object.keys(reg_errors).length == 0) {
        console.log('no errors')

        var username = request.body['username'].toLowerCase();
        user_login[username] = {};
        user_login[username]["name"] = request.body['fullname'];
        user_login[username]["password"] = request.body['password'];
        user_login[username]["email"] = request.body['email'];
        console.log('files were set: ', user_login[username]);
        //var data = JSON.stringify(user_login);
        fs.writeFileSync(filename, JSON.stringify(user_login), "utf-8");
        console.log('fs.writeFileSyncRan');
        temp_qty_data['username'] = username;
        temp_qty_data['email'] = user_login[username]['email'];
        console.log(temp_qty_data);
        let params = new URLSearchParams(temp_qty_data);
        response.redirect('/Receipt?' + params.toString());
    } else {
        // fix the JSON to show the reg_errors
        request.body.errors_obj = JSON.stringify(reg_errors);

       

        // Makes sticky 
        request.query.StickyUsername = request.body.username;
        request.query.StickyName = request.body.fullname;
        request.query.StickyEmail = request.body.email;

        // Just some consoles to test out the queries
        console.log('IN POST USERNAME IS: ' + request.query.StickyUsername);
        console.log('IN POST FULLNAME IS: ' + request.query.StickyName);
        console.log('IN POST EMAIL IS: ' + request.query.StickyEmail);

        // data passing through the query currently works
        // Things need to do now: add the <script> in register.template but still need to figure that out and modify it from Bryson's

        response.redirect('/register?' + query_response.stringify(request.body));
        console.log('sent back')

    }
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

//Created with a Reference from Nate Moylan
// Check for Tickets
app.post("/Check_tickets", function (request, response, next) {
    let POST = request.body;

    var noErr = {};
    noErr['no_qty'] = 'Enter The Amount of Tickets You Want';
    //Assume No qty from start.

    //Validating the quantities and checking the availability of the tickets
    if (typeof POST['submit_purchase'] != undefined) {
        //try to find the name of the specific product
        for (i = 0; i < products['Tickets'].length; i++) {

            qty = POST[`quantity${i}`];

            //Add and If statement for if the user is/isnt logged in either let the check process happen/ direct them to the login page and then when they sign in/register then they are brought to the cart.

            if (checkInt(qty, products['Tickets'][i].qty_available) == false) {
                noErr['quantity' + i] = `INVALID QUANTITY for Tickets in Section: ${products['Tickets'][i].section_num}`; //This will warn the customer of where their input was invalid
                console.log(products['Tickets'][i].qty_available)
                console.log("Invalid Quantity");
            }
            if (qty > 0) {
                delete noErr['no_qty'];
                if (qty > products['Tickets'][i].qty_available) {
                    noErr['inventory' + i] = `${qty} of tickets in section ${products['Tickets'][i].section_num} are not available. Only ${products['Tickets'][i].qty_available} tickets are left!`;
                }
            }
        }
        qString = query_response.stringify(POST);

        //Add the code to check if the user is logged in or not.
        if (JSON.stringify(noErr) === '{}') {
            //If there noErr is false then redirect user back to the UHManoaFootballTickets, otherwise send them to the cart.
            let errObj = { 'error': JSON.stringify(noErr) };
            qString += '&' + query_response.stringify(errObj)
            temp_qty_data = request.body;
            response.redirect("./index.html" + "?" + qString);
            console.log("Redirected to Receipt");
        } else {
            response.redirect("UHManoaFootballTickets" + "?" + qString);
            console.log("Redirected to product display");
        }

        next();
    }

}
);

// Check for bottoms
app.post("/Check_bottoms", function (request, response, next) {
    let POST = request.body;

    var noErr = {};
    noErr['no_qty'] = 'Enter The Amount of Bottoms You Want';
    //Assume No qty from start.

    //Validating the quantities and checking the availability of the bottoms
    if (typeof POST['submit_purchase'] != undefined) {
        //try to find the name of the specific product
        for (i = 0; i < products['Bottoms'].length; i++) {

            qty = POST[`quantity${i}`];

            //Add and If statement for if the user is/isnt logged in either let the check process happen/ direct them to the login page and then when they sign in/register then they are brought to the cart.

            if (checkInt(qty, products['Bottoms'][i].qty_available) == false) {
                noErr['quantity' + i] = `INVALID QUANTITY for Bottoms in Section: ${products['Bottoms'][i].name}`; //This will warn the customer of where their input was invalid
                console.log(products['Bottoms'][i].qty_available)
                console.log("Invalid Quantity");
            }
            if (qty > 0) {
                delete noErr['no_qty'];
                if (qty > products['Bottoms'][i].qty_available) {
                    noErr['inventory' + i] = `${qty} of bottoms in category ${products['Bottoms'][i].name} are not available. Only ${products['Bottoms'][i].qty_available} bottoms are left!`;
                }
            }
        }
        qString = query_response.stringify(POST);

        //Add the code to check if the user is logged in or not.
        if (JSON.stringify(noErr) === '{}') {
            //If there noErr is false then redirect user back to the UHManoaFootballBottoms, otherwise send them to the cart.
            let errObj = { 'error': JSON.stringify(noErr) };
            qString += '&' + query_response.stringify(errObj)
            temp_qty_data = request.body;
            response.redirect("./index.html" + "?" + qString);
            console.log("Redirected to Receipt");
        } else {
            response.redirect("Bottoms" + "?" + qString);
            console.log("Redirected to product display");
        }

        next();
    }

});


// Check for tops
app.post("/Check_tops", function (request, response, next) {
    let POST = request.body;

    var noErr = {};
    noErr['no_qty'] = 'Enter The Amount of Tops You Want';
    //Assume No qty from start.

    //Validating the quantities and checking the availability of the tops
    if (typeof POST['submit_purchase'] != undefined) {
        //try to find the name of the specific product
        for (i = 0; i < products['Tops'].length; i++) {

            qty = POST[`quantity${i}`];

            //Add and If statement for if the user is/isnt logged in either let the check process happen/ direct them to the login page and then when they sign in/register then they are brought to the cart.

            if (checkInt(qty, products['Tops'][i].qty_available) == false) {
                noErr['quantity' + i] = `INVALID QUANTITY for Tops in Section: ${products['Tops'][i].name}`; //This will warn the customer of where their input was invalid
                console.log(products['Tops'][i].qty_available)
                console.log("Invalid Quantity");
            }
            if (qty > 0) {
                delete noErr['no_qty'];
                if (qty > products['Tops'][i].qty_available) {
                    noErr['inventory' + i] = `${qty} of tops in category ${products['Tops'][i].name} are not available. Only ${products['Tops'][i].qty_available} tops are left!`;
                }
            }
        }
        qString = query_response.stringify(POST);

        //Add the code to check if the user is logged in or not.
        if (JSON.stringify(noErr) === '{}') {
            //If there noErr is false then redirect user back to the UHManoaFootballTops, otherwise send them to the cart.
            let errObj = { 'error': JSON.stringify(noErr) };
            qString += '&' + query_response.stringify(errObj)
            temp_qty_data = request.body;
            response.redirect("./index.html" + "?" + qString);
            console.log("Redirected to Receipt");
        } else {
            response.redirect("Tops" + "?" + qString);
            console.log("Redirected to product display");
        }

        next();
    }
});

// Check for Accessories
app.post("/Check_acc", function (request, response, next) {
    let POST = request.body;

    var noErr = {};
    noErr['no_qty'] = 'Enter The Amount of Accessories You Want';
    //Assume No qty from start.

    //Validating the quantities and checking the availability of the accessories
    if (typeof POST['submit_purchase'] != undefined) {
        //try to find the name of the specific product
        for (i = 0; i < products['Accessories'].length; i++) {

            qty = POST[`quantity${i}`];

            //Add and If statement for if the user is/isnt logged in either let the check process happen/ direct them to the login page and then when they sign in/register then they are brought to the cart.

            if (checkInt(qty, products['Accessories'][i].qty_available) == false) {
                noErr['quantity' + i] = `INVALID QUANTITY for Accessories in Section: ${products['Accessories'][i].name}`; //This will warn the customer of where their input was invalid
                console.log(products['Accessories'][i].qty_available)
                console.log("Invalid Quantity");
            }
            if (qty > 0) {
                delete noErr['no_qty'];
                if (qty > products['Accessories'][i].qty_available) {
                    noErr['inventory' + i] = `${qty} of accessories in category ${products['Accessories'][i].name} are not available. Only ${products['Accessories'][i].qty_available} accessories are left!`;
                }
            }
        }
        qString = query_response.stringify(POST);

        //Add the code to check if the user is logged in or not.
        if (JSON.stringify(noErr) === '{}') {
            //If there noErr is false then redirect user back to the UHManoaFootballAccessories, otherwise send them to the cart.
            let errObj = { 'error': JSON.stringify(noErr) };
            qString += '&' + query_response.stringify(errObj)
            temp_qty_data = request.body;
            response.redirect("./index.html" + "?" + qString);
            console.log("Redirected to Receipt");
        } else {
            response.redirect("Accessories" + "?" + qString);
            console.log("Redirected to product display");
        }

        next();
    }

});




app.get("/login", function (request, response, next) {
    let POST = request.body;
    var body = fs.readFileSync('./views/login.template', 'utf8');
    response.send(eval('`' + body + '`')); //This renders the template string into a readable html format.
    console.log('Login page loaded');

});

app.post("/process_login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    let POST = request.body;
    var the_username = POST.username.toLowerCase();

    var bad_login_str = '';

    if (typeof user_login[the_username] != 'undefined') { //if there is a matching username
        if (user_login[the_username].password == POST.password) { //If the password is correct as well
            temp_qty_data['username'] = the_username;
            temp_qty_data['email'] = user_login[the_username].email;
            let params = new URLSearchParams(temp_qty_data);
            response.redirect('/Receipt?' + params.toString()); //redirect to Receipt page with error
            return;

        } else {//Password has an error
            bad_login_str = `Password is incorrect for username: ${the_username}!`;
            console.log('password incorrect')
            request.query.the_username = the_username;
            request.query.name = user_login[the_username].name;
        }

    } else {//Username has an error
        bad_login_str = 'Username does not exists. Please try again.'
        request.query.the_username = the_username;
    }


    params = new URLSearchParams(request.query);
    response.redirect(`/login?loginMessage=${bad_login_str}&wrong_pass=${the_username}`); //redirect to login page with error
});

/*For Assignment 3
//To send the user to the Invoice if the Data is valid
app.get("/Cart", function (request, response, next) {
    let POST = request.query; //Given by Prof Kazman, This reads the query string so the data that is purchased can be processed and displayed on the cart page.
    var body = fs.readFileSync('./views/cart.template', POST, 'utf8');
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
*/

app.get("/Receipt", function (request, response, next) {


    let POST = request.query;
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
                products[i].qty_available -= Number(POST['quantity' + i]);
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

    //if user is logged in then allow them to go to the product_display


    var body = fs.readFileSync('./views/tickets.template', 'utf8');
    response.send(eval('`' + body + '`')); // render template string
    console.log('product display page loaded')



    //<!--Referenced from SmartPhoneProducts3 but modified to work with my arrays--> Used to display the different products.
    function display_tickets() {
        str = '';
        for (i = 0; i < products['Tickets'].length; i++) {
            strErr = "";
            if (request.query["name_err"] == undefined) {
                strErr = ""
            } else {
                strErr += `<h1>Invalid Quantity for purchase of Tickets in: ${products['Tickets'][i].section_num}. - ${request.query['name_err']}</h1>`
            };
            str += ` 
                <section style="text-align: center">
                <hr>
                <h1>Sections:<p style="color: green;"> ${products['Tickets'][i].section_num}</p></h1>
                <h2>Ticket price: <br><p style="color:green"> \$${products['Tickets'][i].price}</p></h2>
                <h2><img src=${products['Tickets'][i].image} style="border: 5px solid green;" alt="Image"><img></h2> 
                <h3><label for="inputQty" id="quantity${i}_label"> Tickets:</h3>
                <input type="text" id="inputQty" placeholder="0" name = "quantity${i}" onkeyup = "checkQuantityTextbox(this, ${products['Tickets'][i].qty_available});">
                <h2><label id="quantity_available${i}"> There are:<p style="color: green;"> ${products['Tickets'][i].qty_available}</p> Seats Available! </label></h2>
                </section>
                `;

        }
        return str;
    }
});

// UH TOPS
app.get("/Tops", function (request, response) {

    //if user is logged in then allow them to go to the product_display


    var body = fs.readFileSync('./views/tops.template', 'utf8');
    response.send(eval('`' + body + '`')); // render template string
    console.log('product display page loaded')

    function display_tops() {
        str = '';
        for (i = 0; i < products['Tops'].length; i++) {
            strErr = "";
            if (request.query["name_err"] == undefined) {
                strErr = ""
            } else {
                strErr += `<h1>Invalid Quantity for purchase of Tops in: ${products['Tops'][i].section_num}. - ${request.query['name_err']}</h1>`
            };
            str += ` 
                <section style="text-align: center">
                <hr>
                <h1>Tops:<p style="color: green;"> ${products['Tops'][i].name}</p></h1>
                <h2>Top price: <br><p style="color:green"> \$${products['Tops'][i].price}</p></h2>
                <h2><img src=${products['Tops'][i].image} style="border: 5px solid green;" alt="Image"><img></h2> 
                <h3><label for="inputQty" id="quantity${i}_label"> Tops:</h3>
                <input type="text" id="inputQty" placeholder="0" name = "quantity${i}" onkeyup = "checkQuantityTextbox(this, ${products['Tops'][i].qty_available});">
                <h2><label id="quantity_available${i}"> There are:<p style="color: green;"> ${products['Tops'][i].qty_available}</p> Tops Available! </label></h2>
                </section>
                `;

        }
        return str;
    }
});

// UH BOTTOMS
app.get("/Bottoms", function (request, response) {

    //if user is logged in then allow them to go to the product_display


    var body = fs.readFileSync('./views/bottoms.template', 'utf8');
    response.send(eval('`' + body + '`')); // render template string
    console.log('product display page loaded')

    function display_bottoms() {
        str = '';
        for (i = 0; i < products['Bottoms'].length; i++) {
            strErr = "";
            if (request.query["name_err"] == undefined) {
                strErr = ""
            } else {
                strErr += `<h1>Invalid Quantity for purchase of Bottoms in: ${products['Bottoms'][i].name}. - ${request.query['name_err']}</h1>`
            };
            str += ` 
                <section style="text-align: center">
                <hr>
                <h1>Bottoms:<p style="color: green;"> ${products['Bottoms'][i].name}</p></h1>
                <h2>Top price: <br><p style="color:green"> \$${products['Bottoms'][i].price}</p></h2>
                <h2><img src=${products['Bottoms'][i].image} style="border: 5px solid green;" alt="Image"><img></h2> 
                <h3><label for="inputQty" id="quantity${i}_label"> Bottoms:</h3>
                <input type="text" id="inputQty" placeholder="0" name = "quantity${i}" onkeyup = "checkQuantityTextbox(this, ${products['Bottoms'][i].qty_available});">
                <h2><label id="quantity_available${i}"> There are:<p style="color: green;"> ${products['Bottoms'][i].qty_available}</p> Bottoms Available! </label></h2>
                </section>
                `;

        }
        return str;
    }

});

// UH ACCESSORIES
app.get("/Accessories", function (request, response) {

    //if user is logged in then allow them to go to the product_display


    var body = fs.readFileSync('./views/acc.template', 'utf8');
    response.send(eval('`' + body + '`')); // render template string
    console.log('product display page loaded')

    function display_acc() {
        str = '';
        for (i = 0; i < products['Accessories'].length; i++) {
            strErr = "";
            if (request.query["name_err"] == undefined) {
                strErr = ""
            } else {
                strErr += `<h1>Invalid Quantity for purchase of Accessories in: ${products['Accessories'][i].name}. - ${request.query['name_err']}</h1>`
            };
            str += ` 
                <section style="text-align: center">
                <hr>
                <h1>Accessories:<p style="color: green;"> ${products['Accessories'][i].name}</p></h1>
                <h2>Top price: <br><p style="color:green"> \$${products['Accessories'][i].price}</p></h2>
                <h2><img src=${products['Accessories'][i].image} style="border: 5px solid green;" alt="Image"><img></h2> 
                <h3><label for="inputQty" id="quantity${i}_label"> Accessories:</h3>
                <input type="text" id="inputQty" placeholder="0" name = "quantity${i}" onkeyup = "checkQuantityTextbox(this, ${products['Accessories'][i].qty_available});">
                <h2><label id="quantity_available${i}"> There are:<p style="color: green;"> ${products['Accessories'][i].qty_available}</p> Accessories Available! </label></h2>
                </section>
                `;

        }
        return str;
    }


});


