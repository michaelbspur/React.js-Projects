class Pet {
    constructor(name) {
        this.name = name;
    }

    speak() {
        console.log(`${this.name} makes a noise.`);
    }
}

class Dog extends Pet {
    constructor(name) {
        super(name);
    }

    speak() {
        console.log(`${this.name} says woof, woof.`);
    }
}

class Cat extends Pet {
    constructor(name) {
        super(name);
    }

    speak() {
        console.log(`${this.name} says meow.`);
    }   
}

const pets = [
    new Dog('Mitzie'),
    new Cat('Felix')
];

pets.forEach(pet => pet.speak()); 