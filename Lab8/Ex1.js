require("./products_data.js");

for (var count = 1; count <= num_products; count++) {
    console.log(`${count}. ${eval('name' + count)}`);
}

