let date = new Date()

let options = {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
}


module.exports.getDate = function () {
    return (date.toLocaleDateString("en-US", options));
}

module.exports.sortDate = function (array) {
    array.sort(function (date1, date2) {
        date1 = new Date(date1);
        date2 = new Date(date2);
        if (date1 > date2) return 1;
        if (date1 < date2) return -1;
    })
    return(array)
}
