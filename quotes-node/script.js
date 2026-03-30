let quotes = []

function loadQuotes(){
    const saved = localStorage.getItem("quotes");
    if(saved){
        quotes = JSON.parse(saved);
    }
}

function saveQuotes(){
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

function addQuotes(){
    textInput = document.getElementById("quoteText");
    authorInput = document.getElementById("quoteAuthor");

    text = textInput.value.trim();
    author = authorInput.value.trim();
    
    // console.log(`${text}`);
    // console.log(`${author}`);

    if(text && author){
        quotes.push({text, author});
        saveQuotes();
        renderQuotes();
        textInput.value = '';
        authorInput.value = '';
    }
    else{
        alert('Enter content and author');
    }
}

function showAll(){
    const conteiner = document.getElementById("all-quotes");
    const all = `Total quotes: ${quotes.length}`;

    conteiner.innerText = `${all}`;
}

function renderQuotes(){
    const quoteList = document.getElementById("quote-list")
    quoteList.innerHTML = '';   //> innerHTML нужен в случае если мы собираемся создать html штуку например div
    
    quotes.forEach((quote, index) => {
        const quoteCard = document.createElement('div');

        quoteCard.className = 'quote-card'
        quoteCard.innerHTML = `
        <div>"${quote.text}"</div>
        <div>"${quote.author}"</div>
        <button class="delete-btn" data-index="${index}">Del</button>
        `;
        quoteList.appendChild(quoteCard);


    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            quotes.splice(index, 1);
            saveQuotes();
            renderQuotes();
        });
    });
}

document.getElementById('addBtn').addEventListener('click', addQuotes);


loadQuotes();
showAll();