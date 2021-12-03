app.post("/registernew", function (request, response) {
    console.log("got a new register")
    POST = request.body;
    //getting the user info from the /register page and putting it into variables for validation. put username and email to lower case to prevent identical copies from forming
    var user_name = POST["username"].toLowerCase();
    var new_user_password = POST["password"];
    var new_user_password_rpt = POST["passwordrpt"];
    var new_user_email = POST["email"].toLowerCase();
    var new_user_fullname = POST["fullname"];
    console.log(POST)


    console.log(new_user_fullname)

    //register validation 
    if (typeof user_data[user_name] != 'undefined') {
        response.send(`<script>
        alert("Username: ${user_name} exists please enter another username"); 
        window.history.back();
        
        </script>`);
        console.log("Username Exist")
    } else {
        var UsernameExist = true
    }
    //uses function below to validate username for register page
    if (!validateUsername(user_name)) {
        response.send(`<script>
    alert("Username: ${user_name} Needs to be no less than 5 characters and must exceed 15 characters"); 
    window.history.back();
    
    </script>`);
    } else {
        var validusername = true
    }
    //uses function below to validate fullname for regeister page
    if (!validatefullname(new_user_fullname)) {
        response.send(`<script>
    alert("Fullname: ${new_user_fullname} Must between 0 and 30 characters following the prompt Last Name, First Name"); 
    window.history.back();
    
    </script>`);
    } else {
        var validfullname = true
    }
    //uses function below to validate email for register page
    if (!validateEmail(new_user_email)) {
        response.send(`<script>
    alert("Email: ${new_user_email} Must follow the example jimmie@gmail.com or jimmie@hotmail.al"); 
    window.history.back();
    
    </script>`);
    } else {
        var validemail = true
    }
    //validates if first password matches with the confirmation password in register page
    if (new_user_password != new_user_password_rpt) {
        response.send(`<script>
    alert("Passwords do not match please make sure and re-confirm that passwords match"); 
    window.history.back();
    </script>`);
    } else {
        var passwordmatch = true
    }
    console.log("REGISTRATION COMPLETE")
    //if it all checks to be true it will write the new user data into user_data.json taken from File/IO Lab and modified 
    if (UsernameExist && validusername && validfullname && validemail && passwordmatch) {

        user_data[user_name] = {}
        user_data[user_name].fullname = POST["fullname"]
        user_data[user_name].email = POST["email"]
        user_data[user_name].password = POST["password"]
        user_data[user_name].passwordrpt = POST["passwordrpt"]



        data = JSON.stringify(user_data);
        //load the user_data.json file to prepare to write the register data after validation
        fs.writeFileSync(user_data_filename, data, "utf-8");
        //after it redirects to invoice to show the invoice after registration
        var invoiceview = fs.readFileSync('./public/invoice.view', 'utf-8');
        response.send(eval('`' + invoiceview + '`'));
    } else {
        response.redirect("/register")
    }

});