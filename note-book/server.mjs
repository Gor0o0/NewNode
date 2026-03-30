// -=-=-=-=| Сервер |=-=-=-=- //


// -=-= Модули | Node =-=- //
import http from 'http';
import fs from 'fs/promises';
import path from 'path';
// |
// const http = require("http");
// const fs = require("fs").promises;    // fs (fileSystem) - аналог библиотеки OC
// const path = require("path");        // path - нужен чтоб обращаться по путям

// -=-= Модули | Наши =-=- //
import {reindexIds, formatDate} from './utils/helper.js'
import {saveData, loadData} from './utils/fileManager.js'
import { fileURLToPath } from 'url';
// |
// const fileManager = require("./utils/fileManager");
// const helper = require("./utils/helper");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

let notes = loadData(); // | fileManager.loadData();

// -= API | обработка запросов
const server = http.createServer(async (req, res) => {
    const { url, method } = req;

    // -= Root Routers
    if (url === '/' && method === 'GET') {    //> т.е. что если пользователь просто постучался к нам в сайт
        const html = await fs.readFile(path.join(__dirname, "public", "index.html"));
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html);
        return;
    }
    if (url === '/api/app.js' && method === 'GET') {
        const js = await fs.readFile(path.join(__dirname, "api", "app.js"), "utf-8");
        res.writeHead(200, { "Content-Type": "application/javascript" });
        res.end(js);
        return;
    }

    // -= API Routers
    if (url === "/api/notes" && method === 'GET') {
        res.writeHead(200, { 'Content-Type': "application/json" });
        res.end(JSON.stringify(notes));
        return;
    }

    if (url === "/api/notes" && method === 'POST') {
        let body = "";
        req.on("data", (chunk) => body += chunk); //> req что-то получаем а потом res сохраняем
        req.on("end", async() => {
            const {title, content} = JSON.parse(body);
            const newNote = {
                id: notes.length + 1, // костыльно
                title: title,
                content: content,
                date: formatDate()
            };
            notes.push(newNote) //> push как в git - сохранить
            await saveData(notes)
            res.writeHead(200, { 'Content-Type': "application/json" });
            res.end(JSON.stringify({ success: true }));
            return;
        });
    }

    if (url.startsWith("/api/notes/") && method === 'DELETE'){
        const id = parseInt(url.split('/')[3])    //> split - для разделения | [3] значит что мы ожидамое третий смвол типо "/api/notes/3"

        if(id > 0 && id <= notes.length){
            notes.splice(id - 1, 1);
            notes = reindexIds(notes)
            await saveData(notes)

            res.writeHead(200, {"Content-Type" : "application/json"});
            res.end(JSON.stringify({success : true}));
        }else{
            res.writeHead(404);
            res.end(JSON.stringify({success : false}));
        }
        return;
    }

    if (url.startsWith("/api/notes/") && method === 'PUT'){
        const id = parseInt(url.split('/')[3])
        let body = "";

        req.on("data", (chunk) => body += chunk); //> req что-то получаем а потом res сохраняем
        req.on("end", async() => {
            const {title, content} = JSON.parse(body);
            const noteIndex = notes.findIndex(note => note.id === id);
            notes[noteIndex] = {
                ...notes[noteIndex],
                title: title,
                content: content,
                date: formatDate()
            };
            await saveData(notes)
        });
        res.writeHead(200, {"Content-Type" : "application/json"});
        res.end(JSON.stringify({success : true}));
        return;
    }

    return;
});

server.listen(3000, () => {
    console.log("Server started: http://localhost:3000")
})