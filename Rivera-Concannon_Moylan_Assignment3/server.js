/*
FileName: server.js
Authors: Peter Rivera-Concannon
Purpose: Main server file. 
        Referenced from many labs, homeworks, and some outside help
*/

var products = require('./public/products.js');
var allProducts = products.allProducts;
var fs = require('fs');
var qs = require('qs');
var express = require('express');
var app = express();


var myParser = require("body-parser");
app.use(myParser.urlencoded({ extended: true }));
app.use(myParser.json());

const { request } = require('express');

// Setup cookies and sessions
var cookieParser = require('cookie-parser'); // Require cookie-parser
var session = require('express-session'); // Require express sessions
const nodemailer = require("nodemailer"); // Require nodemailer module
const { info } = require('console');

app.use(session({ secret: "ITM352", resave: false, saveUninitialized: true })); //Referenced from google, I (Peter) debugged an error that occured when there was no resave or saveUninitilaized
app.use(cookieParser());

// monitor all requests
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});
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

// Set filename as variable for user_data.json
var user_info = './user_data.json';
//Checks if file exists

if (fs.existsSync(user_info)) {
    data = fs.readFileSync(user_info, 'utf-8');
    var user_login = JSON.parse(data);
} else {
    console.log(user_info + 'does not exist');
}
app.use(express.urlencoded({ extended: true }));


/////////////////////////////////
/* TO PROCESS THE REGISTRATION */
/////////////////////////////////
app.post("/process_register", function (request, response) {
    console.log('request.body', request.body);
    console.log('user_login', user_login);


    // Got from example code from Assignment 2 module
    //assumes no errors at first
    var reg_errors = [];


    // Fullname Validation// 
    if (/^[A-Za-z]+ [A-Za-z]+$/.test(request.body.fullname)) {
        console.log('fullname good');
    }
    else {
        reg_errors.push('Please only use letters for fullname');
        console.log('ERROR: fullname invalid');
    }
    if (request.body.fullname == "") {
        reg_errors.push('This field cannot be empty!')
    }
    if (request.body.fullname.length > 30 || request.body.fullname.length < 1) {
        reg_errors.push('Maximum 30 Characters');
        console.log('ERROR: fullname length is bad')
    }

    //Username Validation//
    var reg_username = request.body.username.toLowerCase(); // Requires username to be in lowercase

    if (typeof user_login[reg_username] != 'undefined') {
        reg_errors.push('Username already taken!');
    }

    if (request.body.username.length > 10 || request.body.username.length < 4) {
        reg_errors.push('Username should be within 4 and 10 characters.');
        console.log('ERROR: username length not good');
    }

    if (typeof reg_username == '') {
        reg_errors.push('Please enter a username.');
        console.log('ERROR: username empty');
    }
    if (/^[0-9a-zA-Z]+$/.test(request.body.username)) {
        console.log('username has no other values')
    } else {
        reg_errors.push('Numbers and letters only please.');
        console.log('ERROR: username has other values')

    }

    //Email Validation//
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(request.body.email)) {
        console.log('Email good');
    }
    else {
        reg_errors.push('Please enter a valid email (Ex: user@gmail.com');
        console.log('email bad');
    }

    //Password Validation//
    if (request.body.password < 6) {
        reg_errors.push('Please make a password longer than 6 characters.');
        console.log('pass too short')
    }

    //Confirm Password Validation 
    if (request.body.password != request.body.confirm_password) {
        reg_errors.push('Passwords do not match.');
        console.log('pass dont match')
    }

    // Requests name, username, and email
    request.query.fullname = request.body.fullname;
    request.query.username = request.body.username;
    request.query.email = request.body.email;

    // If no errors then save new user data in JSON file and redirect to receipt
    console.log('reg_errors:', reg_errors);

    //using object.keys because we need to look at the length of each 'sub-array'
    if (reg_errors.length == 0) {
        console.log('no errors')

        var username = request.body.username;
        user_login[username] = {};
        user_login[username].name = request.body.fullname;
        user_login[username].password = request.body.password;
        user_login[username].email = request.body.email;
        console.log('files were set: ', user_login[username]);
        data = JSON.stringify(user_login);
        fs.writeFileSync(user_info, data, "utf-8");
        console.log('fs.writeFileSyncRan');
        the_username = user_login[username]['name'];
        the_email = user_login[username]['email'];
        var user_input = {"username": username, "name": user_login[username].name, "email": user_login[username].email};
        console.log(user_input);
        response.cookie("username", the_username).send
        response.redirect('/index.html?' + qs.stringify(request.query));
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

        response.redirect('/register.html?' + qs.stringify(request.body));
        console.log('sent back')

    }
});

//////////////////////////
/* TO PROCESS THE LOGIN */
//////////////////////////
app.post("/process_login", function (request, response, next) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    let POST = request.body;
    var the_username = POST.username.toLowerCase();
    var Login_Error = [];

    if (typeof user_login[the_username] != 'undefined') { //if there is a matching username
        if (user_login[the_username].password == POST.password) { //If the password is correct as well
            request.query.username = the_username;
            request.query.name = user_login[request.query.username].name;
            response.cookie('username', the_username);
            response.redirect('/cart.html?' + qs.stringify(request.query)); //redirect to cart if username and password are correct
            return;

        } else {//Password has an error
            Login_Error.push = (`Password is incorrect for username: ${the_username}!`);
            console.log(Login_Error);
            request.query.the_username = the_username;
            request.query.name = user_login[the_username].name;
            request.query.Login_Error = Login_Error.join(';');
        }
    } else {//Username has an error
        Login_Error.push = ('Username does not exists. Please try again.');
        console.log(Login_Error);
        request.query.the_username = the_username;
        request.query.Login_Error = Login_Error.join(';');
    }
    response.redirect('/login.html?' + qs.stringify(request.query)); //redirect to login page with error
});

///////////////////////////
/* TO PROCESS THE LOGOUT */
///////////////////////////
app.get("/logout", function (request, response) {
    str = `<script> alert('${request.cookies["username"]} has logged out'); location.href="./index.html";</script>`;
    console.log(str)
    response.clearCookie('username'); //Clears var user_info
    console.log("2")

    response.send(str);
    console.log("3")

    request.session.destroy();
})

/////////////////////////////////////
/* To Update and get the Cart Data */
/////////////////////////////////////
app.post("/Cart", function (request, response, next) {
    console.log(request.body, request.session.cart);

    let haserrors = false;
    for (let prodtype in request.body.quantities) {
        for (let i in request.body.quantities[prodtype]) {
            qty = request.body.quantities[prodtype][i];
            haserrors = !isValid(qty) || haserrors;
        };
    };
    if (haserrors == true) {
        message = "Invalid Quantites, Cart not Updated";
    } else {
        message = "Valid Quantities, Cart Updated!";
        request.session.cart = request.body.quantities;
    }
    const ref_URL = new URL(request.get('Referrer'));
    ref_URL.searchParams.set("message", message);
    response.redirect(ref_URL.toString());
});

app.post('/get_cart', function (request, response, next) {
    response.json(request.session.cart);
})

//////////////////////////////////////////////
/* Completes Purchase and emails the Invoice*/
//////////////////////////////////////////////
app.post("/purchase_cart", function (request, response) {
// Generate HTML invoice string FROM example Assignemnt 3 code
var invoice_str = `Thank you for your order!<table border><th>Quantity</th><th>Item</th>`;
var shopping_cart = request.session.cart;
for(product_key in products) {
  for(i=0; i<products[product_key].length; i++) {
      if(typeof shopping_cart[product_key] == 'undefined') continue;
      qty = shopping_cart[product_key][i];
      if(qty > 0) {
        invoice_str += `<tr><td>${qty}</td><td>${products[product_key][i].name}</td><tr>`;
      }
  }
}
invoice_str += '</table>';
// Set up mail server. Only will work on UH Network due to security restrictions
var transporter = nodemailer.createTransport({
  host: "mail.hawaii.edu",
  port: 25,
  secure: false, // use TLS
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
  }
});
var user_name = request.cookies['username'];
console.log(user_name);
var user_email = user_login[user_name].email;
console.log(user_email);
var mailOptions = {
  from: 'UHMAthleticsStore@hawaii.edu',
  to: user_email,
  subject: 'Inovice from UH Manoa Athletics Sports Shop',
  html: invoice_str
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    invoice_str += '<br>There was an error and your invoice could not be emailed';
  } else {
    invoice_str += `<br>Your invoice was mailed to ${user_email}`;
  }
  response.send(invoice_str);
});
response.clearCookie('username'); // deletes cookie info
request.session.destroy(); // deletes session
});
///////////////////////////
/* To LOAD THE CART DATA */
///////////////////////////
app.post("/loadCart", function (request, response) {
    if (typeof request.session.cart == "undefined") {
        request.session.cart = {};
    }
    response.json(request.session.cart) //Gives cart data back as a JSON
});

////////////////////////////
/* CART QTY IN THE NAVBAR */
////////////////////////////
app.post('/cart_qty', function (request, response) {
    var tot = 0;
    for (product_key in request.session.cart) {
        tot += request.session.cart[product_key].reduce((a, b) => a + b);
    }
    response.json({ "qty": tot });
});

/////////////////////////////////////////////////////////
/* Processes adding to cart as well as submitting cart */
/////////////////////////////////////////////////////////
app.post("/Check", function (request, response) {
    let POST = request.body;
    var qty = POST["prod_qty"];



    //Validating the quantities and checking the availability of the tickets
    if (typeof POST['submitCart'] != 'undefined') {

        //try to find the name of the specific product
        product_key = POST["product_key"];
        product = allProducts[product_key];
      


        var hasvalidquantities = true;
        let quantities = [];


        for (i = 0; i < product.length; i++) {
            qty = POST[`quantity${i}`];
            quantities[i] = qty;
            hasvalidquantities = hasvalidquantities && isValid(qty);
        }

        if (hasvalidquantities) {
            if (typeof request.session.cart == "undefined") {
                request.session.cart = {};
            }
            request.session.cart[product_key] = quantities; //POSTS the customer's session and qtys
            POST["message"] = "Added to Cart!";
        } else {
            POST["message"] = "Invalid inputs, Quantites not added to cart!";
        }

        const qString = qs.stringify(POST);
        console.log(request.session);
        response.redirect(`./products.html?${qString}`);

    }
});

function isValid(q, return_errors = false) {
    errors = [];
    if (q == '') q = 0; //if there is nothing inputted then a 0 appears
    if (Number(q) != q) errors.push('<font color="red"><b> Enter a Number </b></font>');//Checks if input is actually a number or not
    else if (q < 0) errors.push('<font color="red"><b> Enter a Positive Number </b></font>'); //Check if the value is positive or negative
    else if (parseInt(q) != q) errors.push('<font color="red"><b> Enter a Whole Number </b></font>');//Check if value is a full number

    return return_errors ? errors : (errors.length == 0);
}