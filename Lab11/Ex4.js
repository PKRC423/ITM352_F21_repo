function convertTemperature(tempIn, units) {
    //function to convert from C to F and from F to C (Temperatures)
    //tempIn is the Temperature you with to convert
    //units is either C or F, depending on the conversion type.

if (units == "F") {
    return (tempIn -32) * 5/9;
}else if (units == "C") {
    return (tempIn * 9/5 + 32);
}else {
    return NaN;
}
}
/*
console.log("100 C =", convertTemperature(100, "C"));
console.log("212 F =", convertTemperature(212, "F"));
console.log("Bad Input = ", convertTemperature(212, "Q"));
*/

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

for (testVal in pieces) {
    console.log(testVal + ": " + pieces[testVal] + " " + checkIfNegative(pieces[testVal]));
}