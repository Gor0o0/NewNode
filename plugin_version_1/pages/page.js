chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    addImageToContainer(message);
    sendResponse("OK");
}) //> runtime это - это объект который позволяет нам работать с браузером, например отправить сообщение получить информацию о текущей вкладке, и т.д

function addImageToContainer(urls){
    //> document.writeln(JSON.stringify(urls)); //> writeln - устаревший метод но всё ещё рабочий
    const conteiner = document.getElementById("conteiner");
    urls.forEach(url => addImage(conteiner, url));
}

function addImage(conteiner, url){
    const div = document.createElement("div");
    div.className = "imageDiv";
    const img = document.createElement("img");
    img.src = url;
    div.appendChild(img); //> appendChild добавляет элемент в конец родителя
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.setAttribute("url", url);
    div.appendChild(checkbox);
    conteiner.appendChild(div);
}

// -=-=|Выбор всех изображений
document.getElementById("selectAll").addEventListener("change", (e) => {
    // const items = document.querySelectorAll(".container input");
    const items = document.querySelectorAll("#conteiner input"); // Исправлено: .container -> #conteiner
    for(let item of items){
        // item.checker = e.target.checker;
        item.checked = e.target.checked; // Исправлено: checker -> checked
    }
});

// -=-=| Скачивание выбранх изображений
document.getElementById("downloadBtn").addEventListener("click", async () => {
    const urls = getSelectedUrls();
    const archive = await createArchive(urls);
    dowloadArchive(archive);
});

// -=-=| Получение выбранных изображений
function getSelectedUrls(){
    // const urls = Array.from(document.querySelectorAll(".container input"))
    //    .filter(item => item.checker)
    const urls = Array.from(document.querySelectorAll("#conteiner input")) // Исправлено: .container -> #conteiner
        .filter(item => item.checked) // Исправлено: checker -> checked
        .map(item => item.getAttribute("url"));
    return urls;
}

// -=-=| Создание архива
async function createArchive(urls){
    const zip = new JSZip();
    for(let index in urls){
        const url = urls[index];
        const response = await fetch(url); //> fetch - это функция которая позволяет нам отправить запрос на сервер
        const blob = await response.blob(); //> blob - это объект который позволяет нам работать с бинарными данными
        zip.file(checkNameFile(index, blob), blob);
    };
    return await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {level: 9}
    });
}

function checkNameFile(index, blob){
    let name = parseInt(index) + 1;
    const [type, extension] = blob.type.split("/");
    if(type != "image" || blob.size <= 0){
        throw Error("Error") //> throw - это слово которое позволяет нам выбросить ошибку
    }
    return name + "." + extension.split("+").shift();
}

function dowloadArchive(archive){
    const link = document.createElement('a');
    link.href = URL.createObjectURL(archive);
    link.download = "images.zip";
    document.body.appendChild(link); // Добавлено: элемент должен быть в DOM для корректной работы в некоторых браузерах
    link.click();
    URL.revokeObjectURL(link.href); //> revokeObjectURL - метод который позволяет нам удалить объект который был создан с помощью createObjectURL
    // document.body.removeChild(link); //> removeChirld - удаляет элемент из родителя 
    link.remove(); // Современный способ удаления элемента
}
