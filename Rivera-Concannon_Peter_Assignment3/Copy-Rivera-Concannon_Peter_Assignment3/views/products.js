
var navProducts =
[
    {
        "type": "tickets",
        "image": "..."
    },

    {
        "type": "tops",
        "image": "..."
    },



    {
        "type": "bottoms",
        "image": "..."
    },

    {
        "type": "accessories",
        "image": "..."
    }

];


var tops = [
    {
        "name": "Men's T-Shirt",
        "price": 25.00,
        "image": "...",
        "qty_available": 100

    },

    {
        "name": "Women's T-Shirt",
        "price": 25.00,
        "image": "...",
        "qty_available": 100
    },

    {
        "name": "Men's Hoodie",
        "price": 25.00,
        "image": "...",
        "qty_available": 100
    },

    {
        "name": "Women's Hoodie",
        "price": 25.00,
        "image": "...",
        "qty_available": 100
    }

]

var bottoms = [
    {
        "name": "Men's Shorts",
        "price": 25.00,
        "image": "...",
        "qty_available": 100
    },

    {
        "name": "Women's Shorts",
        "price": 25.00,
        "image": "...",
        "qty_available": 100
    },

    {
        "name": "Men's Sweatpants",
        "price": 25.00,
        "image": "...",
        "qty_available": 100
    },

    {
        "name": "Women's Sweatpants",
        "price": 25.00,
        "image": "...",
        "qty_available": 100
    }
]

var accessories = [
    {
        "name": "Wristbands",
        "price": 25.00,
        "image": "...",
        "qty_available": 100
    },

    {
        "name": "Hats",
        "price": 25.00,
        "image": "...",
        "qty_available": 100
    },

    {
        "name": "Small Towel",
        "price": 25.00,
        "image": "...",
        "qty_available": 100
    },

    {
        "name": "Visors",
        "price": 25.00,
        "image": "...",
        "qty_available": 100
    }
]




var tickets = [
    {
        "section_num": "100, 106, 200, 204",
        "price": 15.00,
        "image": "https://raw.githubusercontent.com/PKRC423/ITM352_F21_repo/main/3-Rivera-Concannon_Peter_&_Moylan_Nate_Assignment3/public/images/UHVC.jpg",
        "qty_available": 100,
        "total_sold": 0
    },
    {
        "section_num": "101, 102, 104, 105, 201, 203",
        "price": 20.00,
        "image": "https://raw.githubusercontent.com/PKRC423/ITM352_F21_repo/main/3-Rivera-Concannon_Peter_&_Moylan_Nate_Assignment3/public/images/UHVC.jpg",
        "qty_available": 100,
        "total_sold": 0
    },
    {
        "section_num": "103 & 202",
        "price": 30.00,
        "image": "https://raw.githubusercontent.com/PKRC423/ITM352_F21_repo/main/3-Rivera-Concannon_Peter_&_Moylan_Nate_Assignment3/public/images/UHVC.jpg",
        "qty_available": 100,
        "total_sold": 0
    },
    {
        "section_num": "140, 141, 148, 149",
        "price": 15.00,
        "image": "https://raw.githubusercontent.com/PKRC423/ITM352_F21_repo/main/3-Rivera-Concannon_Peter_&_Moylan_Nate_Assignment3/public/images/UHVC.jpg",
        "qty_available": 100,
        "total_sold": 0
    },
    {
        "section_num": "142, 143, 146, 147",
        "price": 20.00,
        "image": "https://raw.githubusercontent.com/PKRC423/ITM352_F21_repo/main/3-Rivera-Concannon_Peter_&_Moylan_Nate_Assignment3/public/images/UHVC.jpg",
        "qty_available": 100,
        "total_sold": 0
    },
    {
        "section_num": "144 & 145",
        "price": 30.00,
        "image": "https://raw.githubusercontent.com/PKRC423/ITM352_F21_repo/main/3-Rivera-Concannon_Peter_&_Moylan_Nate_Assignment3/public/images/UHVC.jpg",
        "qty_available": 100,
        "total_sold": 0
    },
    {
        "section_num": "160 & 161",
        "price": 15.00,
        "image": "https://raw.githubusercontent.com/PKRC423/ITM352_F21_repo/main/3-Rivera-Concannon_Peter_&_Moylan_Nate_Assignment3/public/images/UHVC.jpg",
        "qty_available": 100,
        "total_sold": 0
    },
    {
        "section_num": "162 & 163",
        "price": 20.00,
        "image": "https://raw.githubusercontent.com/PKRC423/ITM352_F21_repo/main/3-Rivera-Concannon_Peter_&_Moylan_Nate_Assignment3/public/images/UHVC.jpg",
        "qty_available": 100,
        "total_sold": 0
    },
    {
        "section_num": "164 & 165",
        "price": 15.00,
        "image": "https://raw.githubusercontent.com/PKRC423/ITM352_F21_repo/main/3-Rivera-Concannon_Peter_&_Moylan_Nate_Assignment3/public/images/UHVC.jpg",
        "qty_available": 100,
        "total_sold": 0
    },
    {
        "section_num": "120 & 121",
        "price": 15.00,
        "image": "https://raw.githubusercontent.com/PKRC423/ITM352_F21_repo/main/3-Rivera-Concannon_Peter_&_Moylan_Nate_Assignment3/public/images/UHVC.jpg",
        "qty_available": 100,
        "total_sold": 0
    },
    {
        "section_num": "122",
        "price": 20.00,
        "image": "https://raw.githubusercontent.com/PKRC423/ITM352_F21_repo/main/3-Rivera-Concannon_Peter_&_Moylan_Nate_Assignment3/public/images/UHVC.jpg",
        "qty_available": 100,
        "total_sold": 0
    },
    {
        "section_num": "123 & 124",
        "price": 15.00,
        "image": "https://raw.githubusercontent.com/PKRC423/ITM352_F21_repo/main/3-Rivera-Concannon_Peter_&_Moylan_Nate_Assignment3/public/images/UHVC.jpg",
        "qty_available": 100,
        "total_sold": 0
    }
]

var allProducts = {
    "tops": tops,
    "bottoms": bottoms,
    "tickets": tickets,
    "accessories": accessories
}

