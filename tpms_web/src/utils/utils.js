export function isfloat(oNum){
    if(!oNum) return false;
    var strP=/^\d+(\.\d+)?$/;
    if(!strP.test(oNum)) return false;
    try{
        if(parseFloat(oNum)!=oNum) return false;
    }catch(ex){
        return false;
    }
    return true;
}

export function isDual(text){
    return text.split(':').length === 2;
}

export function trim(str){
    return str.replace(/(^\s*)|(\s*$)/g, "");
}