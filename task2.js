// Базовий інтерфейс героя
class Hero {
    constructor(name) {
        this.name = name;
    }
    getStats() {
        return `${this.name} (Базові характеристики)`;
    }
    getPower() {
        return 10; // Базова сила
    }
}

// Конкретні класи героїв 
class Warrior extends Hero { getStats() { return `Воїн ${this.name}`; } getPower() { return 20; } }
class Mage extends Hero { getStats() { return `Маг ${this.name}`; } getPower() { return 15; } }
class Paladin extends Hero { getStats() { return `Паладин ${this.name}`; } getPower() { return 18; } }

// Базовий клас декоратора 
class InventoryDecorator extends Hero {
    constructor(hero) {
        super(hero.name);
        this.hero = hero;
    }
    getStats() { return this.hero.getStats(); }
    getPower() { return this.hero.getPower(); }
}

// Конкретні декоратори-предмети 
class Weapon extends InventoryDecorator {
    getStats() { return `${this.hero.getStats()} + Меч`; }
    getPower() { return this.hero.getPower() + 50; }
}

class Armor extends InventoryDecorator {
    getStats() { return `${this.hero.getStats()} + Броня`; }
    getPower() { return this.hero.getPower() + 30; }
}

class Artifact extends InventoryDecorator {
    getStats() { return `${this.hero.getStats()} + Магічний амулет`; }
    getPower() { return this.hero.getPower() * 2; } // Амулет подвоює силу
}

// --- Тестування [cite: 68] ---
let myHero = new Mage("Гендальф");
console.log(`Початок: ${myHero.getStats()}, Сила: ${myHero.getPower()}`);

// Одягаємо героя (використовуємо декілька декораторів одночасно) 
myHero = new Weapon(myHero);
myHero = new Armor(myHero);
myHero = new Artifact(myHero);

console.log(`Фінал: ${myHero.getStats()}`);
console.log(`Загальна потужність: ${myHero.getPower()}`);

