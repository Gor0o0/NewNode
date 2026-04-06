const btnAction = document.getElementById("btnAction")
btnAction.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (tab) {
            // alert("tabID: " + tab.id);
            chrome.scripting.executeScript(
                {
                    target: { tabId: tab.id, allFrames: true}, //allFrames - компоненты страницы
                    func: grabImages
                },
                onResult
            )
        } else {
            alert("No active tab found");
        }
    });
});

function grabImages(){
    const images = document.querySelectorAll("img");
    return Array.from(images).map(img => {
        // Проверяем разные атрибуты, где может лежать качественное изображение
        return img.currentSrc || img.src || img.dataset.src || img.dataset.lazySrc;
    }).filter(src => src && src.startsWith('http')); // Убираем пустые и base64 (если нужно)
}

function onResult(frames){
    // -=-=| Объединяется все массивы из всех фреймов
    const urls = frames.map(frame => frame.result)
    .reduce((r1, r2) => r1.concat(r2));

    // -=-=| сохранить в буфер обмена:

    // -= Старая логика
    // window.navigator.clipboard.writeText(imageUrls.join("\n")).then(() => {
    //     window.close();
    // });
    // -=//
    openPageDownload(urls);
}
function openPageDownload(urls){
    // chrome.tabs.create({"url": "./pages/page.html", active: false}, (tab) => {
    chrome.tabs.create({"url": "pages/page.html", active: false}, (tab) => { // Исправлено: ./pages/ -> pages/ (путь от корня расширения)
        setTimeout(() => { //> т.е. ждем пока страница загрузится 1 секунду
            chrome.tabs.sendMessage(tab.id, urls, (resp) => {
                chrome.tabs.update(tab.id, {active: true}); //> active: false/true смысл в том что сначала мы загружаем скрипты а уже когда закончилось становится true
            });
        }, 1000);
    });
}