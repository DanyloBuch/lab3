class ElementState {
    constructor(tagName, displayType, closingType) {
        this.tagName = tagName;
        this.displayType = displayType;
        this.closingType = closingType;
    }
}

class FlyweightFactory {
    constructor() {
        this.states = {};
    }

    getState(tagName, displayType, closingType) {
        const key = `${tagName}_${displayType}_${closingType}`;
        if (!this.states[key]) {
            this.states[key] = new ElementState(tagName, displayType, closingType);
        }
        return this.states[key];
    }
}

class LightElementNode {
    constructor(state) {
        this.state = state;
        this.children = [];
    }

    addChild(text) {
        this.children.push(text);
    }

    get outerHTML() {
        const content = this.children.join("");
        return `<${this.state.tagName}>${content}</${this.state.tagName}>`;
    }
}

// --- ВИКОНАННЯ ЗАВДАННЯ ---
const factory = new FlyweightFactory();
const textLines = [
    "ACT V",                                      // h1 [cite: 98]
    "Scene I. Mantua. A Street.",                // p (більше 20 симв.) [cite: 114]
    " Scene II. Friar Lawrence's Cell.",          // blockquote [cite: 104]
    "Romeo",                                      // h2 (менше 20 симв.) [cite: 102]
    "Dramatis Personae"                           // h2 [cite: 102]
];

const htmlBook = [];

textLines.forEach((line, index) => {
    let tag, display, closing = "double";
    
    if (index === 0) {
        tag = "h1"; display = "block";
    } else if (line.startsWith(" ")) {
        tag = "blockquote"; display = "block";
    } else if (line.length < 20) {
        tag = "h2"; display = "block";
    } else {
        tag = "p"; display = "block";
    }

    const state = factory.getState(tag, display, closing);
    const node = new LightElementNode(state);
    node.addChild(line.trim());
    htmlBook.push(node);
});

// 1. Вивід верстки [cite: 120]
console.log("--- Сгенерована верстка книги ---");
htmlBook.forEach(node => console.log(node.outerHTML));

// 2. Оцінка пам'яті 
const memoryUsage = JSON.stringify(htmlBook).length;
console.log(`\nРозмір дерева в пам'яті: ~${memoryUsage} символів (serialized)`);
console.log(`Кількість унікальних об'єктів-станів: ${Object.keys(factory.states).length}`);
