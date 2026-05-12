// --- ПАТЕРН КОМАНДА (Command) ---
class AddClassCommand {
    constructor(node, className) {
        this.node = node;
        this.className = className;
    }
    execute() {
        this.node.cssClasses.push(this.className);
        console.log(`[Command]: Додано клас '${this.className}'`);
    }
    undo() {
        this.node.cssClasses = this.node.cssClasses.filter(c => c !== this.className);
        console.log(`[Command]: Скасовано додавання класу '${this.className}'`);
    }
}

// --- ПАТЕРН ВІДВІДУВАЧ (Visitor) ---
class NodeVisitor {
    constructor() { this.tagCount = 0; this.charCount = 0; }
    visitElement(node) { this.tagCount++; }
    visitText(textNode) { this.charCount += textNode.text.length; }
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
    onCreated() {} 
    onBeforeRender() {}
}

// --- Тестування ---
const table = new LightElementNode("table", "block", "double", ["my-table"]);
const tr = new LightElementNode("tr", "block", "double");
const td1 = new LightElementNode("td", "inline", "double");
const td2 = new LightElementNode("td", "inline", "double");

td1.addChild(new LightTextNode("Колонка 1"));
td2.addChild(new LightTextNode("Колонка 2"));
tr.addChild(td1);
tr.addChild(td2);
table.addChild(tr);

console.log("=== ПЕРЕВІРКА КОМАНДИ (Command) ===");
console.log("До:", table.outerHTML);

const highlightCmd = new AddClassCommand(table, "bg-dark");
highlightCmd.execute(); // Застосовуємо команду
console.log("Після додавання:", table.outerHTML);

highlightCmd.undo(); // Скасовуємо дію
console.log("Після скасування (Undo):", table.outerHTML);
