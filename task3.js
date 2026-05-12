// --- Реалізація (Рендерери) ---
class Renderer {
    renderShape(shapeType) {
        throw new Error("Метод renderShape має бути реалізований");
    }
}

class VectorRenderer extends Renderer {
    renderShape(shapeType) {
        return `Drawing ${shapeType} as vectors`;
    }
}

class RasterRenderer extends Renderer {
    renderShape(shapeType) {
        return `Drawing ${shapeType} as pixels`;
    }
}

// --- Абстракція (Фігури) ---
class Shape {
    constructor(renderer) {
        this.renderer = renderer; // Це і є "Міст" до реалізації 
    }
    draw() {
        throw new Error("Метод draw має бути реалізований");
    }
}

class Circle extends Shape {
    draw() {
        console.log(this.renderer.renderShape("Circle"));
    }
}

class Square extends Shape {
    draw() {
        console.log(this.renderer.renderShape("Square"));
    }
}

class Triangle extends Shape {
    draw() {
        console.log(this.renderer.renderShape("Triangle"));
    }
}

// --- Тестування ---
const vector = new VectorRenderer();
const raster = new RasterRenderer();

const circle = new Circle(vector);
const square = new Square(raster);
const triangle = new Triangle(vector);

circle.draw();   // Drawing Circle as vectors 
square.draw();   // Drawing Square as pixels 
triangle.draw(); // Drawing Triangle as vectors