
module.exports.getDateTime = function (offset = 0) {
    
    const date = Date.now() + offset;
    const options = {
        timeZone: 'Africa/Algiers',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false            
    };

    const formatter = new Intl.DateTimeFormat('sv-SE', options)
    const currDate = formatter.format(date); 
    
    return currDate.replace(',','').replaceAll('/','-');

}



