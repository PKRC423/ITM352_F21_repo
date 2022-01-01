/*
FileName: products.js
Authors: Peter Rivera-Concannon & Nate Moylan
Purpose: a file to contain all of our data for the sites products.
*/


var products_array = [
    {
        'type':"Tickets"
    },
    {
        'type':"Tops"
    },
    {
        'type':"Bottoms"
    },
    {
        'type':"Accessories"
    }
]


var Tops = [

    //Mens Shirt
        {
            "name": "Men's Manoa Shirt",
            "price": 25,
            "image": "./images/UHMS.jpg",
            "qty_available": 100
        },
    //Womens Shirt
        {
            "name": "Women's Manoa Shirt",
            "price": 25,
            "image": "./images/UHWS.jpg",
            "qty_available": 100
        },
    //Keiki's Shirt
        {
            "name": "Kid's Manoa Shirt",
            "price": 10,
            "image": "./images/UHMS.jpg",
            "qty_available": 100
        },
    ]

var Bottoms =[
    //Men's SweatPants
        {
            "name": "Men's Sweatpants",
            "price": 30,
            "image": "./images/UHMSP.jpg",
            "qty_available": 100
        },
    //Women's Sweatpants
        {
            "name": "Women's Sweatpants",
            "price": 30,
            "image": "./images/UHWSP.jpg",
            "qty_available": 100
        },
    //Kids Sweatpants
        {
            "name": "Kid's Sweatpants",
            "price": 30,
            "image": "./images/UHMSP.jpg",
            "qty_available": 100
        },
    ]
    
var Accessories =[

    //Hat
        {
            "name": "Hat",
            "price": 25,
            "image": "./images/UHH.jpg",
            "qty_available": 100
        },
    //Wristband
        {
            "name": "Wristband",
            "price": 25,
            "image": "./images/UHW.jpg",
            "qty_available": 100
        },
    //Lanyard
        {
            "name": "Lanyard",
            "price": 25,
            "image": "./images/UHL.jpg",
            "qty_available": 100
        },
    ]
    
var Tickets =[
    //Section 1
    {
        "name": "100, 106, 200, 204",
        "price": 15.00,
        "image": "./images/ticket.jpg",
        "qty_available": 100
        
    },
    //Section 2
    {
        "name": "101, 102, 104, 105, 201, 203",
        "price": 20.00,
        "image": "./images/ticket.jpg",
        "qty_available": 100
        
    },
    //Section 3
    {
        "name": "103 & 202",
        "price": 30.00,
        "image": "./images/ticket.jpg",
        "qty_available": 100
        
    },
    //Section 4
    {
        "name": "140, 141, 148, 149",
        "price": 15.00,
        "image": "./images/ticket.jpg",
        "qty_available": 100
    
    },
    //Section 5
    {
        "section_num": "142, 143, 146, 147",
        "price": 20.00,
        "image": "./images/ticket.jpg",
        "qty_available": 100
        
    },
    //Section 6
    {
        "name": "144 & 145",
        "price": 30.00,
        "image": "./images/ticket.jpg",
        "qty_available": 100
        
    },
    //Section 7
    {
        "name": "160 & 161",
        "price": 15.00,
        "image": "./images/ticket.jpg",
        "qty_available": 100
        
    },
    //Section 8
    {
        "name": "162 & 163",
        "price": 20.00,
        "image": "./images/ticket.jpg",
        "qty_available": 100
        
    },
    //Section 9
    {
        "name": "164 & 165",
        "price": 15.00,
        "image": "./images/ticket.jpg",
        "qty_available": 100
        
    },
    //Section 10
    {
        "name": "120 & 121",
        "price": 15.00,
        "image": "./images/ticket.jpg",
        "qty_available": 100
        
    },
    //Section 11
    {
        "name": "122",
        "price": 20.00,
        "image": "./images/ticket.jpg",
        "qty_available": 100
        
    },
    //Section 12
    {
        "name": "123 & 124",
        "price": 15.00,
        "image": "./images/ticket.jpg",
        "qty_available": 100
        
    },
]

var allProducts ={

    "Football Tickets": Tickets,

    "Manoa Tops": Tops,

    "Manoa Bottoms": Bottoms,

    "Manoa Accessories": Accessories

}
if (typeof module != 'undefined') {
    module.exports.allProducts = allProducts;
}