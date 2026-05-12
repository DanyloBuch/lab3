// Базовий клас для всіх вузлів
class LightNode {
    // --- ПАТЕРН ШАБЛОННИЙ МЕТОД ---
    render() {
        this.onBeforeRender(); 
        const html = this.generateHTML(); 
        this.onAfterRender();  
        return html;
    }

    // Хуки життєвого циклу
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
        this.onCreated(); // Виклик хука
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
        this.onCreated(); // Виклик хука
    }

    addChild(node) {
        this.children.push(node);
        if (node.onInserted) node.onInserted(); // Виклик хука
    }

    get childrenCount() {
        return this.children.length; 
    }

    get innerHTML() {
        return this.children.map(child => child.outerHTML).join("");
    }

    generateHTML() {
        const classes = this.cssClasses.length > 0 ? ` class="${this.cssClasses.join(" ")}"` : "";
        if (this.closingType === "single") {
            return `<${this.tagName}${classes}/>`; 
        }
        return `<${this.tagName}${classes}>${this.innerHTML}</${this.tagName}>`; 
    }

    get outerHTML() { return this.render(); }

    // Перевизначаємо хуки для логування
    onCreated() { console.log(`[Lifecycle]: Створено <${this.tagName}>`); }
    onBeforeRender() { console.log(`[Lifecycle]: Рендеринг <${this.tagName}>...`); }
}

// --- Тестування ---
console.log("=== СТВОРЕННЯ ЕЛЕМЕНТІВ (Спрацюють хуки onCreated) ===");
const table = new LightElementNode("table", "block", "double", ["my-table"]);
const tr = new LightElementNode("tr", "block", "double");
const td1 = new LightElementNode("td", "inline", "double");
const td2 = new LightElementNode("td", "inline", "double");

td1.addChild(new LightTextNode("Колонка 1"));
td2.addChild(new LightTextNode("Колонка 2"));
tr.addChild(td1);
tr.addChild(td2);
table.addChild(tr);

console.log("\n=== ГЕНЕРАЦІЯ HTML (Спрацюють хуки onBeforeRender) ===");
console.log(table.outerHTML);
