/*
filename: products,js
authors: Peter Rivera-Concannon & Nate Moylan
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

var allProducts ={

            "Tickets": Tickets,

            "Tops": Tops,

            "Bottoms": Bottoms,

            "Accessories": Accessories
 
}

var Tops = [

    //Mens Shirt
        {
            "name": "Men's Manoa Shirt",
            "price": 25,
            "image": "https://raw.githubusercontent.com/natemoylan/ITM352_F21_repo/main/Copy-Rivera-Concannon_Peter_Assignment3/public/images/UHVC.jpg",
            "qty_available": 100
        },
    //Womens Shirt
        {
            "name": "Women's Manoa Shirt",
            "price": 25,
            "image": "https://raw.githubusercontent.com/natemoylan/ITM352_F21_repo/main/Copy-Rivera-Concannon_Peter_Assignment3/public/images/UHVC.jpg",
            "qty_available": 100
        },
    //Keiki's Shirt
        {
            "name": "Kid's Manoa Shirt",
            "price": 10,
            "image": "https://raw.githubusercontent.com/natemoylan/ITM352_F21_repo/main/Copy-Rivera-Concannon_Peter_Assignment3/public/images/UHVC.jpg",
            "qty_available": 100
        }
    ]

var Bottoms =[
    //Men's SweatPants
        {
            "name": "Men's Sweatpants",
            "price": 30,
            "image": "https://raw.githubusercontent.com/natemoylan/ITM352_F21_repo/main/Copy-Rivera-Concannon_Peter_Assignment3/public/images/UHVC.jpg",
            "qty_available": 100
        },
    //Women's Sweatpants
        {
            "name": "Women's Sweatpants",
            "price": 30,
            "image": "https://raw.githubusercontent.com/natemoylan/ITM352_F21_repo/main/Copy-Rivera-Concannon_Peter_Assignment3/public/images/UHVC.jpg",
            "qty_available": 100
        },
    //Kids Sweatpants
        {
            "name": "Kid's Sweatpants",
            "price": 30,
            "image": "https://raw.githubusercontent.com/natemoylan/ITM352_F21_repo/main/Copy-Rivera-Concannon_Peter_Assignment3/public/images/UHVC.jpg",
            "qty_available": 100
        }
    ]
    
var Accessories =[

    //Hat
        {
            "name": "Hat",
            "price": 25,
            "image": "https://raw.githubusercontent.com/natemoylan/ITM352_F21_repo/main/Copy-Rivera-Concannon_Peter_Assignment3/public/images/UHVC.jpg",
            "qty_available": 100
        },
    //Wristband
        {
            "name": "Wristband",
            "price": 25,
            "image": "https://raw.githubusercontent.com/natemoylan/ITM352_F21_repo/main/Copy-Rivera-Concannon_Peter_Assignment3/public/images/UHVC.jpg",
            "qty_available": 100
        },
    //Lanyard
        {
            "name": "Lanyard",
            "price": 25,
            "image": "https://raw.githubusercontent.com/natemoylan/ITM352_F21_repo/main/Copy-Rivera-Concannon_Peter_Assignment3/public/images/UHVC.jpg",
            "qty_available": 100
        }
    ]
    
var Tickets =[
    //Section 1
    {
        "section_num": "100, 106, 200, 204",
        "price": 15.00,
        "image": "https://raw.githubusercontent.com/natemoylan/ITM352_F21_repo/main/3-Rivera-Concannon_Peter_&_Moylan_Nate_Assignment3/public/images/UHVC.jpg",
        "qty_available": 100,
        
    },
    //Section 2
    {
        "section_num": "101, 102, 104, 105, 201, 203",
        "price": 20.00,
        "image": "https://raw.githubusercontent.com/natemoylan/ITM352_F21_repo/main/3-Rivera-Concannon_Peter_&_Moylan_Nate_Assignment3/public/images/UHVC.jpg",
        "qty_available": 100,
        
    },
    //Section 3
    {
        "section_num": "103 & 202",
        "price": 30.00,
        "image": "https://raw.githubusercontent.com/natemoylan/ITM352_F21_repo/main/3-Rivera-Concannon_Peter_&_Moylan_Nate_Assignment3/public/images/UHVC.jpg",
        "qty_available": 100,
        
    },
    //Section 4
    {
        "section_num": "140, 141, 148, 149",
        "price": 15.00,
        "image": "https://raw.githubusercontent.com/natemoylan/ITM352_F21_repo/main/3-Rivera-Concannon_Peter_&_Moylan_Nate_Assignment3/public/images/UHVC.jpg",
        "qty_available": 100,
        
    },
    //Section 5
    {
        "section_num": "142, 143, 146, 147",
        "price": 20.00,
        "image": "https://raw.githubusercontent.com/natemoylan/ITM352_F21_repo/main/3-Rivera-Concannon_Peter_&_Moylan_Nate_Assignment3/public/images/UHVC.jpg",
        "qty_available": 100,
        
    },
    //Section 6
    {
        "section_num": "144 & 145",
        "price": 30.00,
        "image": "https://raw.githubusercontent.com/natemoylan/ITM352_F21_repo/main/3-Rivera-Concannon_Peter_&_Moylan_Nate_Assignment3/public/images/UHVC.jpg",
        "qty_available": 100,
        
    },
    //Section 7
    {
        "section_num": "160 & 161",
        "price": 15.00,
        "image": "https://raw.githubusercontent.com/natemoylan/ITM352_F21_repo/main/3-Rivera-Concannon_Peter_&_Moylan_Nate_Assignment3/public/images/UHVC.jpg",
        "qty_available": 100,
        
    },
    //Section 8
    {
        "section_num": "162 & 163",
        "price": 20.00,
        "image": "https://raw.githubusercontent.com/natemoylan/ITM352_F21_repo/main/3-Rivera-Concannon_Peter_&_Moylan_Nate_Assignment3/public/images/UHVC.jpg",
        "qty_available": 100,
        
    },
    //Section 9
    {
        "section_num": "164 & 165",
        "price": 15.00,
        "image": "https://raw.githubusercontent.com/natemoylan/ITM352_F21_repo/main/3-Rivera-Concannon_Peter_&_Moylan_Nate_Assignment3/public/images/UHVC.jpg",
        "qty_available": 100,
        
    },
    //Section 10
    {
        "section_num": "120 & 121",
        "price": 15.00,
        "image": "https://raw.githubusercontent.com/natemoylan/ITM352_F21_repo/main/3-Rivera-Concannon_Peter_&_Moylan_Nate_Assignment3/public/images/UHVC.jpg",
        "qty_available": 100,
        
    },
    //Section 11
    {
        "section_num": "122",
        "price": 20.00,
        "image": "https://raw.githubusercontent.com/natemoylan/ITM352_F21_repo/main/3-Rivera-Concannon_Peter_&_Moylan_Nate_Assignment3/public/images/UHVC.jpg",
        "qty_available": 100,
        
    },
    //Section 12
    {
        "section_num": "123 & 124",
        "price": 15.00,
        "image": "https://raw.githubusercontent.com/natemoylan/ITM352_F21_repo/main/3-Rivera-Concannon_Peter_&_Moylan_Nate_Assignment3/public/images/UHVC.jpg",
        "qty_available": 100,
        
    }
]