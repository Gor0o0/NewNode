// -=-=-=-= Дополнительный штуки =-=-=-=-
//> export - это то же что и внизу но персонально функции позвояет передавать в глобал использование
export const reindexIds = (notes) => {      //> функция рефакторинга
    return notes.map((note, index) => ({ ...note, id: index +1}) );
};

export const formatDate = (format_date = new Date) => {
    return format_date.toLocaleString();
};

// module.exports = {reindexIds, formatDate}   //> открывае для глобального использования