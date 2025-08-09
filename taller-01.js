

function convertidorTemp(C){
    return f = C*(9/5) + 32
}

console.log(convertidorTemp(-40))

function resolvedor(a,b,c,positivoisTrue){
    if(positivoisTrue === true){
        return x1 = ((-b) + Math.sqrt((b**2) - (4*a*c)))/2*a
    } 
    else{
        return x2 = ((-b) - Math.sqrt((b**2) - (4*a*c)))/2*a
    }

}

console.log(resolvedor(1,5,4,true))

function mejorParidad(n){
    if(n % 2 === 0){
        return true
    
    }else{
        return false
    }
}

console.log(mejorParidad(332))


function peorParidad(numero){
    if(numero === 0) {
        return "es par";
    }
    if(numero < 0){
        return "es impar";
    }
    return peorParidad(numero-2)
}

console.log(peorParidad(333))
