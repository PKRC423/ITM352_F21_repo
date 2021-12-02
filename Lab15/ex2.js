/*
Purpose: 
Date:
Author:
*/

// Load required packages
var fs = require('fs');
var express = require('express');
var app = express();
var myParser = require("body-parser");
var filename = "./user_data.json";
var queryString = require("query-string");
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(session({secret: "MySecretKey", resave: true, saveUninitialized: true}));
app.use(cookieParser());
app.use(myParser.urlencoded({ extended: true }));
app.use(express.static('./public'));

if (fs.existsSync(filename)) {
    data = fs.readFileSync(filename, 'utf-8');

    user_data = JSON.parse(data);
    console.log("User_data=", user_data);

    fileStats = fs.statSync(filename);
    console.log("File " + filename + " has " + fileStats.size + " characters");
} else {
    console.log("Enter the correct filename bozo!");
}

app.get("/", function (request, response) {
    if (request.session.page_views) {
       request.session.page_views++;
       response.send("Welcome back.  This is vist # " + request.session.page_views);
    } else {
        request.session.page_views = 1;
        response.send("Welcome to this page for the first time!");
    }
}
);

app.get("/set_cookie", function (request, response) {
    my_name = "Rick Kazman";

    response.cookie("My Name", my_name, {maxAge: 8000}).send("Cookie sent");
}
);

app.get("/get_cookie", function (request, response) {
    //console.log("Cookies=" + request.cookies);
    my_cookie_name = request.cookies["My Name"];
    response.send("User " + my_cookie_name + " recognized");
}
);

app.get('/set_session', function (req, res, next) {
    res.send(`welcome, your session ID is ${req.session.id}`);
    next();
});

app.get("/use_session", function (request, response) {
    response.send("Your session ID is " + request.session.id);
    request.session.destroy();
}
);

app.get("/login", function (request, response) {
    // Give a simple login form
    if (typeof request.session['last_login'] != "undefined") {
        login_time = "Last login was " + request.session["last_login"];
    } else {
        login_time = "First login";
    }
    my_cookie_name = request.cookies["username"];

    str = `<body>
    Login info: ${login_time} by ${my_cookie_name}
<form action="/login" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="text" name="color" size="20" placeholder="enter fav color"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
});


app.post("/login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    POST = request.body;
    user_name_from_form = POST["username"];
    if (user_data[user_name_from_form] != undefined) {
        if (typeof request.session.last_login != 'undefined')
        {
            var msg = `You last logged in: ${request.session.last_login}. Your fav color is ${POST["color"]}`;
            var now = new Date();
        } else {
            var msg = '';
            var now = 'first visit';
        }
        request.session.last_login = now;
        request.session.fav_color = POST["color"];
        response.cookie('username', user_name_from_form).send(`${msg} <BR>${user_name_from_form} logged in: ${now}`);
    } else {
        response.send(`Sorry Charlie!`);
    }
});

app.get("/fav_color", function (request, response) {
    response.send("Favorite color is: " + request.session.fav_color);
}
);

/*
app.post("/login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log("Got a POST to login");
    POST = request.body;
    user_name = POST["username"];
    user_pass = POST["password"];
    console.log("User name=" + user_name + " password=" + user_pass);
    if (user_data[user_name] != undefined) {
        if (user_data[user_name].password == user_pass) {
            // Good login
            request.session['last_login'] = Date();
            response.cookie("username", user_name, {"maxAge": 10*1000});
            request.session['username'] = user_name;
            response.send("Welcome " + user_name);
        } else {
            // Bad login, redirect
            response.send("Sorry bud");
        }
    } else {
        // Bad username
        response.send("Bad username");
    }
});
*/

app.get("/register", function (request, response) {
    // Give a simple register form
    str = `<body>
<form action="/register" method="POST">`;
    if (request.query["name_err"] == undefined) {
        str += `<input type="text" name="username" size="40" placeholder="enter username" ><br>`;
    } else {
        str += `<input type="text" name="username" size="40" placeholder="${request.query['name_err']}">User already exists<br>`;
    }

    str += `<input type="password" name="password" size="40" placeholder="enter password"><br>
<input type="password" name="repeat_password" size="40" placeholder="enter password again"><br>
<input type="email" name="email" size="40" placeholder="enter email"><br>
<input type="submit" value="Submit" id="submit">
</form> 
</body>
    `;
    response.send(str);
});

app.post("/register", function (request, response) {
    // process a simple register form
    console.log("Got a POST to register");
    POST = request.body;

    user_name = POST["username"];
    user_pass = POST["password"];
    user_email = POST["email"];
    user_pass2 = POST["repeat_password"];
    query_response = "";

    if (user_data[user_name] == undefined) {
        console.log("Adding user: " + user_name);

        user_data[user_name] = {};
        user_data[user_name].name = user_name;
        user_data[user_name].password = user_pass;
        user_data[user_name].email = user_email;

        data = JSON.stringify(user_data);
        fs.writeFileSync(filename, data, "utf-8");

        response.redirect("login");
    } else {
        query_response += "name_err=" + user_name;
        console.log("Bad request to add user: " + user_name);
        response.redirect("register" + "?" + query_response);
    }
});

app.listen(8080, () => console.log(`listening on port 8080`));