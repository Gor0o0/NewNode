// -=-=-=-= Инициализация =-=-=-=-
const readline = require('readline');    //> Аналог импорта
const helper = require("../utils/helper");    //> Для персональных библиотек нужно указывать путь
const fileManager = require("../utils/fileManager")
const ConsoleDecorator = require("./utils/decorator");  //> с большой буквы чтоб отметить для себя что это класс    
const { resolve } = require('dns');


const rl = readline.createInterface({   //> доставать производные | вытягивание методов из библиотеки
    input: process.stdin,
    output: process.stdout
});

const PROJ_NAME = "NODE-NOTE"
let welcome = `\n|Wellcome|`;    // let изменяемая

//! console.log(welcome)   //> Аналог принта

let notes = fileManager.loadData();

// -=-=-=-= Функционал =-=-=-=-

const question = async (query) => {      //> надстройка readline, переделываем его под async
    return new Promise((resolve) => {   //> Promise — это объект, который представляет результат асинхронной операции
        rl.question(query, resolve);    //> функция всегда возвращает Promise | внутри неё можно использовать await
    });
};

const welcomeApp = async () => {
    ConsoleDecorator.drawLine(50, 3);
    console.log(`\nHello in ${PROJ_NAME}`)
    await showMenu();       //> await -  заставляет подождать, пока Promise выполнится
};

const goodbye = async () => {
    const choice = await question("We gonna cry if you leave | are you sure? (y/n): ")

    switch (choice) {
        case 'y':
            rl.close();      //> "закрытие вопроса"
            break;
        case 'n':
            await showNotes();
            break;
        default:
            await showMenu();
            break;
    }

};

const addNode = async () => {     //> Аналог fun для бэкэнда, function так же существует но не оч подходит | в fun кстати в конце не обязательно ставить ; т.к. это уже замкнутый участок кода
    const title = await question("Enter new note name: ")
    const content = await question("Enter description: ")

    const newNote = {
        id: notes.length + 1, // костыльно
        //! id: new Date().toLocaleString(), // id = текущей дате, но слишком длинный

        title: title,
        content: content,
        date: helper.formatDate()
    }

    notes.push(newNote) //> push как в git - сохранить
    fileManager.saveData(notes)
    console.log(`Notes count ${notes.length}`);
    await showMenu();


};

const showNotes = async () => {
    if (notes.length === 0) {
        console.log("|Nothing Here|")
        return await showMenu();
    }   // if не закрывается ";" она ставится только в случае return
    ConsoleDecorator.showAllFormatNotes(notes);
    await showMenu();
};

const showMenu = async () => {    //> "=>" подобие лямбды
    console.log(welcome);
    console.log(`\n|0-Exit|1-Add|2-Show|3-Delete|\n`)

    const choice = await question('Choice action | 1-3 or 0 to exit: ');

    switch (choice) {     //> свичи для работы с чем-то конкретным, что-то типо is/when если верно понял
        case '1':
            await addNode();
            break;
        case '2':
            await showNotes();
            break;
        case '3':
            await deleteNote();
            break;
        case '0':
            await goodbye();
            break;
        default:
            await showMenu();
            break;
    }
};

const deleteNote = async () => {
    if (notes.length === 0) {
        console.log("No Notes to delete");
        await showMenu();
        return;
    }
    console.log('-->>>| Your Notes |<<<--');
    notes.forEach((note) => {   
        console.log(`[${note.id}] * ${note.title}`);
    });
    const choice = await question("Enter id to delete (enter 0 to cancel): ")

    let num = parseInt(choice);

    if (num === 0) {
        console.log("Cancel")
    }
    else if (num > 0 && num <= notes.length) {     // && - и
        let del = notes.splice(num - 1, 1);
        notes = helper.reindexIds(notes);
        fileManager.saveData(notes);
        console.log(`Note ${num} is deleted`)
    }
    else {
        console.log(`No notes with that name [${num}]`)
    }
    await showMenu();

}

welcomeApp();
