const fs = require('fs');

// --- Реальний суб'єкт [cite: 77] ---
class SmartTextReader {
    read(filename) {
        try {
            const data = fs.readFileSync(filename, 'utf8');
            // Перетворюємо текст на двомірний масив [рядок][символ] [cite: 77]
            return data.split('\n').map(line => line.split(''));
        } catch (e) {
            return null;
        }
    }
}

// --- Логуючий Проксі (SmartTextChecker) [cite: 78] ---
class SmartTextChecker {
    constructor(reader) {
        this.reader = reader;
    }

    read(filename) {
        console.log(`[Proxy]: Спроба відкрити файл "${filename}"...`);
        const result = this.reader.read(filename);
        
        if (result) {
            console.log(`[Proxy]: Файл успішно прочитано.`);
            const totalLines = result.length;
            const totalChars = result.reduce((sum, line) => sum + line.length, 0);
            // Виводимо загальну кількість рядків і символів [cite: 78]
            console.log(`[Proxy]: Статистика - Рядків: ${totalLines}, Символів: ${totalChars}`);
            console.log(`[Proxy]: Файл закрито.`);
        } else {
            console.log(`[Proxy]: Помилка читання або файл порожній.`);
        }
        return result;
    }
}

// --- Захисний Проксі (SmartTextReaderLocker) [cite: 79] ---
class SmartTextReaderLocker {
    constructor(reader, regexPattern) {
        this.reader = reader;
        this.pattern = new RegExp(regexPattern); // Приймає регулярний вираз [cite: 80]
    }

    read(filename) {
        // Якщо назва файлу відповідає ліміту [cite: 81]
        if (this.pattern.test(filename)) {
            console.log(`[Proxy Locker]: Access denied!`); // Повідомлення про відмову [cite: 81]
            return null;
        }
        return this.reader.read(filename);
    }
}

// --- ТЕСТУВАННЯ [cite: 82] ---
// Створюємо файл для тесту
fs.writeFileSync('test.txt', 'Привіт\nСвіт');

const realReader = new SmartTextReader();
const checkerProxy = new SmartTextChecker(realReader);
// Блокуємо доступ до файлів, що починаються на "secret" [cite: 80]
const lockerProxy = new SmartTextReaderLocker(checkerProxy, '^secret'); 

console.log("--- Тест 1: Звичайний файл ---");
lockerProxy.read('test.txt');

console.log("\n--- Тест 2: Обмежений файл ---");
lockerProxy.read('secret_passwords.txt');