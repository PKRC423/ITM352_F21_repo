
var attributes = "5;-3;0;xxx;7.5;13";
var pieces = attributes.split(";")

function checkIfNegative(inString, returnErrors = false) {
    //Validate that an input is a non-negative integer
    //inString represents the input string for the function checkIfNegative
    
    errors = []; // assume no errors at first
    if(Number(inString) != inString) errors.push('Not a number!'); // Check if string is a number value
    if(inString < 0) errors.push('Negative value!'); // Check if it is non-negative
    if(parseInt(inString) != inString) errors.push('Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0);

}
/*
for (testVal in pieces) {
    console.log(testVal + ": " + pieces[testVal] + " " + checkIfNegative(pieces[testVal]));
}*/

//creates a callback function to check whether array elements are non-negative integers
function checkIt(elem, index) {
    console.log(`${index}: ${elem} is ${(checkIfNegative(elem) ? 'a' : 'not a')}valid quantity`);
}
// Apply checkIt to pieces array.
pieces.forEach(checkIt);

console.log("==========================");

pieces.forEach( (elem, index) => {console.log(`${index}: ${elem} is ${(checkIfNegative(elem) ? 'a' : 'not a')}valid quantity`);})