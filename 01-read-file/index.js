const fs = require('fs');
const path = require("path");

const textFilePath = path.join(__dirname, "text.txt"); //абсолютный путь к файлу text.txt
const readStream = fs.createReadStream(textFilePath); //создаем поток чтения (ReadStream) из файла text.txt
readStream.pipe(process.stdout); // направляем поток чтения (ReadStream) в стандартный поток вывода (stdout) с помощью метода pipe()
