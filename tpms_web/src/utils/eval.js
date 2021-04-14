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