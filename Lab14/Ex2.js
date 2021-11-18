var fs = require('fs');

var filename= "./user_data.json";

if (fs.existsSync(filename, "utf-8")) {
data = fs.readFileSync(filename, 'utf-8');

user_data = JSON.parse(data);
console.log("user_data=", user_data);

fileStats = fs.statSync(filename);
console.log("File" + filename + " has " + fileStats.size + "characters");
}else {
    console.log("Invalid Quantity");
}