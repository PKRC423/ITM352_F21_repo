//Exercise 2
//Debug the following

prices = [5.95, 3.00, 12.50];
total_price = 0;
tax_rate = 1.08;    // 8% tax 
for (price of prices) {
    total_price = price * tax_rate;
    console.log(total_price);
}
console.log(`Total price (with tax): ${total_price.toFixed(2)}`); 