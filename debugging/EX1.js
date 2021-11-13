product = {name:'small gumball', price:0.34};

tax_rate = 0.045;

//better_number = Number{product.price};
total = product.price + product.price * tax_rate;

console.log(`A ${product.name} costs \$${total.toFixed(2)}`);