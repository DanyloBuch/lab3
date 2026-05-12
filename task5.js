// ==========================================
// ПАТЕРНИ: СТЕЙТ, КОМАНДА, ВІДВІДУВАЧ
// ==========================================

// --- ПАТЕРН СТЕЙТ (State) ---
class VisibleState {
    render(node) { return node.baseRender(); }
}
class HiddenState {
    render(node) { return ""; } // Прихований елемент повертає порожній рядок
}

// --- ПАТЕРН КОМАНДА (Command) ---
class AddClassCommand {
    constructor(node, className) { this.node = node; this.className = className; }
    execute() { this.node.cssClasses.push(this.className); }
    undo() { this.node.cssClasses = this.node.cssClasses.filter(c => c !== this.className); }
}

// --- ПАТЕРН ВІДВІДУВАЧ (Visitor) ---
class NodeVisitor {
    constructor() { this.tagCount = 0; this.charCount = 0; }
    visitElement(node) { this.tagCount++; }
    visitText(textNode) { this.charCount += textNode.text.length; }
}

// ==========================================
// БАЗОВІ КЛАСИ LIGHT HTML
// ==========================================

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

    generateHTML() { throw new Error("Not implemented"); }
    accept(visitor) { throw new Error("Not implemented"); }
}

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

class LightElementNode extends LightNode {
    constructor(tagName, displayType, closingType, cssClasses = []) {
        super();
        this.tagName = tagName; 
        this.displayType = displayType; 
        this.closingType = closingType; 
        this.cssClasses = cssClasses; 
        this.children = []; 
        
        // Встановлюємо початковий стан (VisibleState)
        this.state = new VisibleState(); 
        
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
            if (child instanceof LightElementNode) yield* child;
            else if (child instanceof LightNode) yield child;
        }
    }

    // --- ПАТЕРН ВІДВІДУВАЧ ---
    accept(visitor) {
        visitor.visitElement(this);
        for (const child of this.children) child.accept(visitor);
    }

    get childrenCount() { return this.children.length; }
    get innerHTML() { return this.children.map(child => child.outerHTML).join(""); }

    // Генерація HTML делегується Стейту
    generateHTML() {
        return this.state.render(this);
    }

    // Реальна логіка рендеру, яку викликає VisibleState
    baseRender() {
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

// ==========================================
// ТЕСТУВАННЯ СТЕЙТУ
// ==========================================
const table = new LightElementNode("table", "block", "double", ["my-table"]);
const tr = new LightElementNode("tr", "block", "double");
const td1 = new LightElementNode("td", "inline", "double");

td1.addChild(new LightTextNode("Дані"));
tr.addChild(td1);
table.addChild(tr);

console.log("=== ПЕРЕВІРКА СТЕЙТУ (State) ===");
console.log("Звичайний рендер (VisibleState):");
console.log(table.outerHTML);

console.log("\nМіняємо стан рядка <tr> на HiddenState...");
tr.state = new HiddenState(); // Тепер рядок прихований

console.log("Рендер таблиці після зміни стану (рядок зникне):");
console.log(table.outerHTML);
