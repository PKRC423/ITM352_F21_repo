/*
FileName: server.js
Authors: Peter Rivera-Concannon & Nate Moylan
Purpose: Main server file.
*/

var products = require('./public/products.js');
var allProducts = products.allProducts;
var fs = require('fs');
var qs = require('qs');
var express = require('express');
var app = express();


var myParser = require("body-parser");
app.use(myParser.urlencoded({ extended: true}));
app.use(myParser.json());

const { request } = require('express');


// Set filename as variable for user_data.json
var filename = './views/user_data.json';

// Setup cookies and sessions
var cookieParser = require('cookie-parser'); // Require cookie-parser
var session = require('express-session'); // Require express sessions
const nodemailer = require("nodemailer"); // Require nodemailer module

app.use(session({ secret: "ITM352" }));
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


/////////////////////////////////
/* TO PROCESS THE REGISTRATION */
/////////////////////////////////
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

    //using object.keys because we need to look at the length of each 'sub-array'
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
        response.redirect('/cart.html' + params.toString());
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

        response.redirect('/register.html' + query_response.stringify(request.body));
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
    var Login_Error = '';

    if (typeof user_login[the_username] != 'undefined') { //if there is a matching username
        if (user_login[the_username].password == POST.password) { //If the password is correct as well
            temp_qty_data['username'] = the_username;
            temp_qty_data['email'] = user_login[the_username].email;
            let params = new URLSearchParams(temp_qty_data);
            response.redirect('/cart.html?' + params.toString()); //redirect to Receipt page with error
            return;

        } else {//Password has an error
            Login_Error = `Password is incorrect for username: ${the_username}!`;
            console.log('password incorrect')
            request.query.the_username = the_username;
            request.query.name = user_login[the_username].name;
        }

    } else {//Username has an error
        Login_Error = 'Username does not exists. Please try again.'
        request.query.the_username = the_username;
    }


    params = new URLSearchParams(request.query);
    response.redirect(`/login.html?loginMessage=${Login_Error}&wrong_pass=${the_username}`); //redirect to login page with error
});

///////////////////////////
/* TO PROCESS THE LOGOUT */
///////////////////////////
app.get("/logout", function (request, response){
    str = `<script> alert('${request.cookies["username"]} has logged out); location.href="./index.html";</script>`;
    response.clearCookie('username'); //Clears var user_info
    response.send(str);
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
    }else{
        message = "Valid Quantities, Cart Updated!";
        request.session.cart = request.body.quantities;
    }
    const ref_URL = new URL(request.get('Referrer'));
    ref_URL.searchParams.set("message", message);
    response.redirect(ref_URL.toString());
});

app.post('/get_cart', function (request, response, next){
    response.json(request.session.cart);
})

//////////////////////////////////////////////
/* Completes Purchase and emails the Invoice*/
//////////////////////////////////////////////
app.post("/purchase_cart", function (request, response) {
        console.log(request.body.invoiceHTML);
    var invoiceHTML = request.body.invoiceHTML;
    var username = request.cookies["username"];
    var email = user_data[username].email;
    var transporter = nodemailer.createTransport({
        host: "mail.hawaii.edu",
        port: 25,
        secure: false,
        tls: {
            rejectUnauthorized: false
        }
    });
    var mailOptions = {
        from: 'UHAthletics2021@gmail.com',
        to: email,
        subject: "UH Athletics Store Invoice",
        html: invoiceHTML
    };
    transporter.sendMail(mailOptions, function (error, info){
        if (error) {
            str = 'Error Occured, Invoice not Emailed!';
        } else{
            str = `Invoice Sent to ${user_data[username].email}`;
        }
        response.join({"Status" : str});
    });
    request.session.destroy();
});

///////////////////////////
/* To LOAD THE CART DATA */
///////////////////////////
app.post("/loadCart", function (request, response){
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
    for (product_key in request.session.cart){
        tot += request.session.cart[product_key].reduce((a, b) => a + b);
    }
    response.join({"qty": tot});
});

/////////////////////////////////////////////////////////
/* Processes adding to cart as well as submitting cart */
/////////////////////////////////////////////////////////
app.post("/Check", function (request, response) {
    let POST = request.body;
    var qty = POST["prod_qty"];

    //Validating the quantities and checking the availability of the tickets
    if (typeof POST['submitCart'] != undefined) {
        //try to find the name of the specific product
        product_key = POST["product_key"];
        products = allProducts[product_key];
        var hasvalidquantities = true;
        let quantities = [];
        for (i = 0; i < products.length; i++) {
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
            }else {
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