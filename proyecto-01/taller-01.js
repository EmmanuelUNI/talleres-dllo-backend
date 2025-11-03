function convertidorTemp(C){
    return f = C*(9/5) + 32
}

function resolvedor(a,b,c,positivoisTrue){
    if(positivoisTrue === true){
        return x1 = ((-b) + Math.sqrt((b**2) - (4*a*c)))/2*a
    } 
    else{
        return x2 = ((-b) - Math.sqrt((b**2) - (4*a*c)))/2*a
    }
}

function mejorParidad(n){
    if(n % 2 === 0){
        return true
    }else{
        return false
    }
}

function peorParidad(numero){
    if(numero === 0) {
        return "es par";
    }
    if(numero < 0){
        return "es impar";
    }
    return peorParidad(numero-2)
}

module.exports = { convertidorTemp, resolvedor, mejorParidad, peorParidad }