var express = require('express');
var app = express();

app.all('*', function (request, response, next) {
    response.send(request.method + ' to path ' + request.path);
    next();
});

app.get('/test',function(request, respinse, next) {
    response.send('Got a GET request to path: test');
});



app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here