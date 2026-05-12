// Базовий клас для всіх вузлів [cite: 87]
class LightNode {
    get outerHTML() { return ""; }
    get innerHTML() { return ""; }
}

// Вузол для тексту [cite: 89]
class LightTextNode extends LightNode {
    constructor(text) {
        super();
        this.text = text; // Може містити лише текст [cite: 90]
    }

    get outerHTML() { return this.text; }
    get innerHTML() { return this.text; }
}

// Вузол для HTML-елементів [cite: 88]
class LightElementNode extends LightNode {
    constructor(tagName, displayType, closingType, cssClasses = []) {
        super();
        this.tagName = tagName; // Назва тега [cite: 92]
        this.displayType = displayType; // Блочний чи рядковий [cite: 92]
        this.closingType = closingType; // Одиничний чи парний [cite: 92]
        this.cssClasses = cssClasses; // Список CSS класів [cite: 92]
        this.children = []; // Може містити будь-які LightNode 
    }

    addChild(node) {
        this.children.push(node);
    }

    get childrenCount() {
        return this.children.length; // Кількість дочірніх елементів [cite: 92]
    }

    get innerHTML() {
        return this.children.map(child => child.outerHTML).join("");
    }

    get outerHTML() {
        const classes = this.cssClasses.length > 0 ? ` class="${this.cssClasses.join(" ")}"` : "";
        if (this.closingType === "single") {
            return `<${this.tagName}${classes}/>`; // Одиничний тег [cite: 92]
        }
        return `<${this.tagName}${classes}>${this.innerHTML}</${this.tagName}>`; // З закриваючим тегом [cite: 92]
    }
}

// --- Тестування (Виводимо таблицю) [cite: 93] ---
const table = new LightElementNode("table", "block", "double", ["my-table"]);
const tr = new LightElementNode("tr", "block", "double");
const td1 = new LightElementNode("td", "inline", "double");
const td2 = new LightElementNode("td", "inline", "double");

td1.addChild(new LightTextNode("Колонка 1"));
td2.addChild(new LightTextNode("Колонка 2"));
tr.addChild(td1);
tr.addChild(td2);
table.addChild(tr);

console.log("--- Outer HTML Таблиці ---");
console.log(table.outerHTML);
console.log(`\nКількість рядків у таблиці: ${table.childrenCount}`);

