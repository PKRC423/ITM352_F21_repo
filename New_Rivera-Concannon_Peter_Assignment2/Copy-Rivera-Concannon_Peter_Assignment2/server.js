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


products.forEach((prod, i) => { prod.qty_available = 100; });

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
    var reg_errors = [];

    // Fullname Validation// 
    if (/^[A-Za-z, ]+$/.test(request.body.fullname)) {
        console.log('fullname good');
    }
    else {
        reg_errors['fullname'] = 'Please only use letters for fullname';
        console.log('fullname bad');
    }
    if (request.body.fullname.length > 30 || request.body.fullname < 1) {
        reg_errors['fullname'] = 'Maximum 30 Characters';
        console.log('fullname length is bad')
    }

    //Username Validation//
    var reg_username = request.body.username.toLowerCase(); // Requires username to be in lowercase

    if (request.body.username.length > 10 || request.body.username.length < 4) {
        reg_errors['username'] = 'Username should be within 4 and 10 characters.';
        console.log('username length not good');
    }

    //Checks if username is alread in use or not
    for (i in filename) {
        if (typeof reg_username == filename[i].username) {
            reg_errors['username'] = 'Sorry, this username is already taken.';
            console.log('username not defined');
        }
    }
    if (typeof reg_username == '') {
        reg_errors['username'] = 'Please enter a username.';
        console.log('username empty');
    }
    if (/^[0-9a-zA-Z]+$/.test(request.body.username)) {
        console.log('username has no other values')
    } else {
        reg_errors['username'] = 'Numbers and letters only please.';
        console.log('username has other values')

    }

    //Email Validation//
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(request.body.email)) {
        console.log('Email good');
    }
    else {
        reg_errors['email'] = 'Please enter a valid email (Ex: user@gmail.com';
        console.log('email bad');
    }

    //Password Validation//
    if (request.body.password < 6) {
        reg_errors['password'] = 'Please make a password longer than 6 characters.';
        console.log('pass too short')
    }

    //Confirm Password Validation 
    if (request.body.password != request.body.confirm_password) {
        reg_errors['confirm_password'] = 'Passwords do not match.';
        console.log('pass dont match')
    }

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
        request.body['reg_errors'] = JSON.stringify(reg_errors);
        let params = new URLSearchParams(reg_errors);
        response.redirect('/register?' + params.toString());
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
app.post("/Check", function (request, response, next) {
    let POST = request.body;

    var noErr = {};
    noErr['no_qty'] = 'Enter The Amount of Tickets You Want';
    //Assume No qty from start.

    //Validating the quantities and checking the availability of the tickets
    if (typeof POST['submit_purchase'] != undefined) {

        for (i = 0; i < products.length; i++) {

            qty = POST[`quantity${i}`];

            //Add and If statement for if the user is/isnt logged in either let the check process happen/ direct them to the login page and then when they sign in/register then they are brought to the cart.

            if (checkInt(qty, products[i].qty_available) == false) {
                noErr['quantity' + i] = `INVALID QUANTITY for Tickets in Section: ${products[i].section_num}`; //This will warn the customer of where their input was invalid
                console.log(products[i].qty_available)
                console.log("Invalid Quantity");
            }
            if (qty > 0) {
                delete noErr['no_qty'];
                if (qty > products[i].qty_available) {
                    noErr['inventory' + i] = `${qty} of tickets in section ${products[i].section_num} are not available. Only ${products[i].qty_available} tickets are left!`;
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
            response.redirect("login" + "?" + qString);
            console.log("Redirected to Receipt");
        } else {
            response.redirect("UHManoaFootballTickets" + "?" + qString);
            console.log("Redirected to product display");
        }

        next();
    }

}
);

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

    if (typeof user_login[the_username] != 'undefined') { //if there is a matching username
        if (user_login[the_username].password == POST.password) { //If the password is correct as well
            temp_qty_data['username'] = the_username;
            temp_qty_data['email'] = user_login[the_username].email;
            let params = new URLSearchParams(temp_qty_data); 
            response.redirect('/Receipt?' + params.toString()); //redirect to Receipt page with error
            return;
        }else{//Password has an error
            request.query.username = the_username;
            request.query.Err = 'Invalid Password!';
        }
    }else {//Username has an error
        request.query.Err = 'Invalid Username!';
    }
    params = new URLSearchParams(request.query);
    response.redirect('/login?' + params.toString()); //redirect to login page with error
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
    }
});

