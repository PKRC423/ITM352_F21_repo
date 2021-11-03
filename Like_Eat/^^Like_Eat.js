var restaurants = [
    'McDonalds',
    'Bettys Burgers',
    'Teddys Bigger Burgers',
    'Panda Express',
    'Taco Bell',
    'Subway',
    'Vons Chicken',
    'Burger King',
    'Raising Canes',
    'A Place to Eat',
    'Feast',
    'Sergs Mexican Restaurant',
    'Le Crepe Cafe',
    'Phuket Thai Express',
    'J&B Pizza',
    'Pieology',
    'Cafe Maharani',
    'Jersey Mikes Subs',
    'Leonards Bakery',
    'Tanaka of Tokyo'
]

function randomizer (choice) {
    return choice[Math.floor(Math.random()*restaurants.length)]
}

/*function checkInput (input) {
    if {

    } else{

    }
}*/