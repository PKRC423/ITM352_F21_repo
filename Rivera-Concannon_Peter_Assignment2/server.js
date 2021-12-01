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

products.forEach((prod,i) => {prod.qty_available = 100;});

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
app.get("/products.js", function (request, response, next){
    response.type('.js');
    var product_str = `var products = ${JSON.stringify(products)};`;
    response.send(product_str);
    console.log('GET products ran')
});


//For Login Page and Processing
// Set filename as variable for user_data.json
var filename = './user_data.json';

//Checks if file exists
if (fs.existsSync(filename)) {
    //Reads user_data.json
    //Moved the require in here from Ex1
    user_data = require(filename);
    console.log("User_data = ", user_data);

    //Reads the stats of the file
    fileStats = fs.statSync(filename);
    console.log("File " + filename + " has " + fileStats.size + " characters");
} else {
    console.log("Enter the correct filename");
}
app.use(express.urlencoded({ extended: true }));


/* Just to load the register page */

app.get("/register", function (request, response) {
    // Give a simple register form
    str = `
    <body>
    <form action = "/register" method = "POST" name = "register">
    <div class = "container">
        <h1>Register Account</h1>
        <p>Please register an account before purchasing tickets!</p>
       
        <!--Full Name-->
        <label for ="fullname"><b>Full Name</b></label>
        <input type="text" placeholder="Enter first and last name" class="form__input" name="fullname" id="fullname" pattern="[a-zA-Z]+[ ]+[a-zA-Z]+" required title="Full First and last name, letters only.">
        <!--Username-->
        <label for ="username"><b>Username</b></label>
        <input type="text" placeholder="Enter username" class="form__input" name="username" id="username"  pattern=".[a-z0-9]{3,10}" required
        title="Minimum: 4 Characters. Maximum: 10 Characters. Numbers and/or Letters Only.">
        <!--Email-->
        <label for ="email"><b>Email</b></label>
        <input type="email" placeholder="Enter email" name="email" id="email"  pattern="[a-z0-9._]+@[a-z0-9]+\.[a-z]{3,}$" required title="Please enter a valid email.>
        <!--Password-->
        <label for ="password"><b>Password</b></label>
        <input type="password" placeholder="Enter password" class="form__input" name="password" id="password" pattern=".{6,}" required title="Minimum: 6 Characters">
        <!--Confirm Password-->
        <label for ="confirm_password"><b>Confirm Password</b></label>
        <input type="confirm_password" placeholder="Re-enter password" class="form__input" name="confirm_password" id="confirm_password" pattern=".{6,}" required title="Minimum: 6 Characters">
        <br>
        <button type ="submit" class = "reg_btn">Register</button>
    </div>
        <div class = "container sign_in">
            <p>Already have an account? <a href ="./public/login.html">Sign In</a>.</p>
        </div>
    </form>
        `;
    response.send(str);
});



/* Processing Register page */

app.post("/register", function (request, response) {

    // -------------Acquiring request body---------- //
    
    POST = request.body;

    user_fullname = POST ["fullname"];
    user_name = POST["username"];
    user_pass = POST["password"];
    user_confirm_pass = POST ["confirm_password"];
    user_email = POST["email"];

    console.log("Username = " + user_name + " Email = " + user_email);

     // Creates new entry for user data
     user_data[user_name] = {};
     user_data[user_name].fullname = user_fullname
     user_data[user_name].username = user_name
     user_data[user_name].password = user_pass;
     user_data[user_name].email = user_email;

    //Writes user reg into user_data.json
    data = JSON.stringify(user_data);
    fs.writeFileSync(filename, data, "utf-8")
    response.redirect ('./views/register.html')
 

   

    // -------------Full Name Validation---------- //


    // -------------Username Validation---------- //

    // -------------Email Validation---------- //

    // -------------Password Validation---------- //

    // -------------Confirm Password Validation---------- //
    

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
        if(JSON.stringify(noErr)=== '{}') {
//If there noErr is false then redirect user back to the UHManoaFootballTickets, otherwise send them to the cart.
            let errObj = { 'error': JSON.stringify(noErr)};
            qString += '&' + query_response.stringify(errObj)
            response.redirect("Receipt" + "?" + qString);
            console.log("Redirected to Cart");
        }else {
            response.redirect("UHManoaFootballTickets" + "?" + qString);
            console.log("Redirected to product display");
        }

        next();
    }

}
);
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