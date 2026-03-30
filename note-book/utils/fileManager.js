// -=-= Импорты =-=- //
import fs from 'fs';
const path = 'note.json';
// |
// const fs = require("fs"); // Модуль сохранения | fs (fileSystem) - аналог библиотеки OC
// const path = 'note.json'

export const saveData = (notes) => {
    const jsonData = JSON.stringify(notes);
    fs.writeFileSync(path, jsonData);
    console.log("Note save success!")
};

export const loadData = () => {
    try{
        const jsonData = fs.readFileSync(path, 'utf-8');
        return JSON.parse(jsonData);
    }
    catch(error){
        console.log('Error | LoadData')
        return [];
    }
};

// module.exports = {saveData, loadData};