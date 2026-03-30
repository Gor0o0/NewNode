// -=-=-=-= Декоратор =-=-=-=-
class ConsoleDecorator{
    static drawLine(lines, format){      // статик не требует создания объекта класса
        if(format === 1){
            console.log(`=`.repeat(lines));
        }
        else if(format === 2){
            console.log(`-`.repeat(lines));
        }
        else if(format === 2){
            console.log(`~`.repeat(lines));
        }
        else{
            console.log(`_`.repeat(lines))
        }
    }
    static showAllFormatNotes(notes){
        notes.forEach((note) => this.showFormatNotes(note))    // если обращается сам к себе то приставлятся this.
    }
    static showFormatNotes(note){
        this.drawLine(50, 1);
        console.log(` ┌`+`─`.repeat(20));
        console.log(` ├ [${note.id}]`);
        console.log(` │ `);
        console.log(` ├ [${note.title}]`);
        console.log(` │ `);
        console.log(` ├ >${note.content}<`);
        console.log(` │ `);
        console.log(` ├[${note.date}]`);
        console.log(` └`+`─`.repeat(20));
    }
}

module.exports = ConsoleDecorator;