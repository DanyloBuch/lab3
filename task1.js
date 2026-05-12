// Клас, який ми хочемо адаптувати (або який задає інтерфейс)
class Logger {
    log(message) {
        // Зелений колір
        console.log(`\x1b[32m%s\x1b[0m`, `[LOG]: ${message}`);
    }

    error(message) {
        // Червоний колір
        console.log(`\x1b[31m%s\x1b[0m`, `[ERROR]: ${message}`);
    }

    warn(message) {
        // Оранжевий (жовтий) колір
        console.log(`\x1b[33m%s\x1b[0m`, `[WARN]: ${message}`);
    }
}

// Клас, який працює з файлами (має інший інтерфейс) [cite: 57]
const fs = require('fs');

class FileWriter {
    constructor(filename) {
        this.filename = filename;
    }

    write(text) {
        fs.appendFileSync(this.filename, text);
    }

    writeLine(text) {
        fs.appendFileSync(this.filename, text + '\n');
    }
}

class FileLoggerAdapter {
    constructor(fileWriter) {
        this.fileWriter = fileWriter;
    }

    log(message) {
        this.fileWriter.writeLine(`[LOG]: ${message}`);
    }

    error(message) {
        this.fileWriter.writeLine(`[ERROR]: ${message}`);
    }

    warn(message) {
        this.fileWriter.writeLine(`[WARN]: ${message}`);
    }
}

// 1. Звичайний консольний логер
const consoleLogger = new Logger();
consoleLogger.log("Це звичайне повідомлення");
consoleLogger.error("Це помилка!");

// 2. Файловий логер через Адаптер
const writer = new FileWriter('log.txt');
const fileLogger = new FileLoggerAdapter(writer);

fileLogger.log("Це повідомлення запишеться у файл");
fileLogger.warn("Це попередження теж буде у файлі");

console.log("\x1b[36m%s\x1b[0m", "Перевір файл log.txt у папці проекту!");