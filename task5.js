// Базовий клас для всіх вузлів
class LightNode {
    // --- ПАТЕРН ШАБЛОННИЙ МЕТОД ---
    render() {
        this.onBeforeRender(); 
        const html = this.generateHTML(); 
        this.onAfterRender();  
        return html;
    }

    onCreated() {}
    onInserted() {}
    onBeforeRender() {}
    onAfterRender() {}

    generateHTML() { throw new Error("Метод має бути реалізований"); }
}

// Вузол для тексту
class LightTextNode extends LightNode {
    constructor(text) {
        super();
        this.text = text; 
        this.onCreated();
    }

    generateHTML() { return this.text; }
    get outerHTML() { return this.render(); }
    get innerHTML() { return this.text; }
}

// Вузол для HTML-елементів
class LightElementNode extends LightNode {
    constructor(tagName, displayType, closingType, cssClasses = []) {
        super();
        this.tagName = tagName; 
        this.displayType = displayType; 
        this.closingType = closingType; 
        this.cssClasses = cssClasses; 
        this.children = []; 
        this.onCreated();
    }

    addChild(node) {
        this.children.push(node);
        if (node.onInserted) node.onInserted();
    }

    // --- ПАТЕРН ІТЕРАТОР ---
    *[Symbol.iterator]() {
        yield this; // Повертаємо поточний вузол
        for (const child of this.children) {
            if (child instanceof LightElementNode) {
                yield* child; // Рекурсивно йдемо вглиб
            } else if (child instanceof LightNode) {
                yield child;
            }
        }
    }

    get childrenCount() { return this.children.length; }
    get innerHTML() { return this.children.map(child => child.outerHTML).join(""); }

    generateHTML() {
        const classes = this.cssClasses.length > 0 ? ` class="${this.cssClasses.join(" ")}"` : "";
        if (this.closingType === "single") {
            return `<${this.tagName}${classes}/>`; 
        }
        return `<${this.tagName}${classes}>${this.innerHTML}</${this.tagName}>`; 
    }

    get outerHTML() { return this.render(); }

    onCreated() { console.log(`[Lifecycle]: Створено <${this.tagName}>`); }
    onBeforeRender() { console.log(`[Lifecycle]: Рендеринг <${this.tagName}>...`); }
}

// --- Тестування ---
console.log("=== СТВОРЕННЯ ЕЛЕМЕНТІВ ===");
const table = new LightElementNode("table", "block", "double", ["my-table"]);
const tr = new LightElementNode("tr", "block", "double");
const td1 = new LightElementNode("td", "inline", "double");
const td2 = new LightElementNode("td", "inline", "double");

td1.addChild(new LightTextNode("Колонка 1"));
td2.addChild(new LightTextNode("Колонка 2"));
tr.addChild(td1);
tr.addChild(td2);
table.addChild(tr);

console.log("\n=== ГЕНЕРАЦІЯ HTML ===");
console.log(table.outerHTML);

console.log("\n=== ПЕРЕВІРКА ІТЕРАТОРА ===");
for (const node of table) {
    if (node.tagName) console.log(`Ітератор знайшов тег: <${node.tagName}>`);
}
