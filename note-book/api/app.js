
const stat = document.getElementById("stat");
const contents = document.getElementById("content");

let notes = []

async function loadNotes(){
    try{
        const res = await fetch("api/notes");    //> fetch - получает ответ конкретно от сервера | в данном случае просит все заметки
        notes = await res.json();
        stat.innerText = `Notes ${notes.length}`;
        console.log(`Notes ${notes.length}`);
    }catch(error){
        console.log("ERROR", error.message);
        stat.innerText = `Notes not found`;
    }
}

async function addNote(){
    const title = prompt("Enter name: ");   //> prompt - это такое страшное окошко ввода как смс сверху
    const content = prompt("Enter content: ");
    if (title === null || content === null){
        stat.innerText = `fill that!!!`
        return;
    }

    try{
        await fetch("api/notes", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({title, content}),
        });
        await loadNotes();
    }catch(error){
        console.log("ERROR", error.message)
    }
    await showNotes();
}

async function showNotes() {
    await loadNotes();
    
    if(notes.length === 0){
        contents.innerHTML = '<h2>No notes now</h2>'
        return;
    }
    let html = '<h3>"Notes: "</h3>'

    notes.forEach(note => {
        html += `
        <div>
            <small>[${note.id}] ${note.date}</small>
            <strong>${note.title}</strong>
            <p>${note.content}</p>
        </div>
        `;
    });

    contents.innerHTML = html;
}

async function delNotes(){
    await loadNotes()

    if(notes.length === 0){
        alert("No nones for now! create note for first")
        return;
    }

    let list = '';
    for (const note of notes){  //> Можно так же использовать notes.forEach / а так же map но тут сложнее
        list += `${note.id}: ${note.title}\n`;
    }
    list = list.trim();

    const input = prompt(`Enter note number to delete: \n\n${list}`)

    const id = parseInt(input);

    if(isNaN(id)){
        alert("Need enter number!");
        return;
    
    }
    const res = await fetch(`api/notes/${id}`, {method : 'DELETE'});
    
    if(res.ok){
        await showNotes();
    }else{
        alert("Error")
    }
}

async function editNote(){
    loadNotes();

    if(notes.length === 0){
        alert("No notes for now!")
        return;
    }

    const list = notes.map(note => `${note.id}: ${note.title}`).join('\n');
    const input = prompt(`Enter note number to edit: \n\n${list}`);

    const id = parseInt(input);

    if(isNaN(id)){
        alert ("Need enter something");
        return;
    }

    const note = notes.find(note => note.id === id);
    if(!note){
        alert("No notes found")
    }

    const title = prompt("Enter name: ", note.title);   //> prompt - это такое страшное окошко ввода как смс сверху
    const content = prompt("Enter content: ", note.content);

    try{
        const res = await fetch(`api/notes/${id}`, {
            method: "PUT",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({title, content}),
        });
        
        if(res.ok){
            await showNotes();
        }
        else{
            alert(" Uncknown error | EditError ")
        }
    }catch(error){
        console.log("ERROR", error.message)
    }
}
loadNotes();