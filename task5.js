// --- ПАТЕРН ВІДВІДУВАЧ (Visitor) ---
class NodeVisitor {
    constructor() {
        this.tagCount = 0;
        this.charCount = 0;
    }
    visitElement(node) {
        this.tagCount++;
    }
    visitText(textNode) {
        this.charCount += textNode.text.length;
    }
}

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
    accept(visitor) { throw new Error("Метод має бути реалізований"); }
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
    
    // Приймаємо відвідувача
    accept(visitor) { visitor.visitText(this); }
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
        yield this;
        for (const child of this.children) {
            if (child instanceof LightElementNode) {
                yield* child;
            } else if (child instanceof LightNode) {
                yield child;
            }
        }
    }

    // --- ПАТЕРН ВІДВІДУВАЧ ---
    accept(visitor) {
        visitor.visitElement(this);
        for (const child of this.children) {
            child.accept(visitor);
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
    onBeforeRender() {} // Порожній, щоб не засмічувати консоль
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

console.log("\n=== ПЕРЕВІРКА ВІДВІДУВАЧА (Visitor) ===");
const visitor = new NodeVisitor();
table.accept(visitor);
console.log(`Статистика дерева: Знайдено тегів - ${visitor.tagCount}, символів тексту - ${visitor.charCount}`);
