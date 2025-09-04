// Punto 1
const letras = ['a', 'e', 'i', 'o', 'u']
const filtros = {
    vocales: ch => letras.indexOf(ch) !== -1,
    consonantes: ch => letras.indexOf(ch) === -1
}

function desglosarString(texto, tipo) {
    if (!(tipo in filtros)) return -1
    let chars = Array.from(texto.toLowerCase())
    return chars.reduce((contador, ch) => contador + (filtros[tipo](ch) ? 1 : 0), 0)
}

console.log(desglosarString('murcielagos', 'vocales'))
console.log(desglosarString('murcielagos', 'consonantes'))


// Punto 2
function twoSum(lista, objetivo) {
    for (let a = 0; a < lista.length; a++) {
        for (let b = a + 1; b < lista.length; b++) {
            if (lista[a] + lista[b] === objetivo && lista[a] !== lista[b]) {
                return [a, b]
            }
        }
    }
}

console.log(twoSum([2,7,11,15], 9))
console.log(twoSum([3,4,2], 6))


// Punto 3
const romanos = {
    I: 1, V: 5, X: 10, L: 50,
    C: 100, D: 500, M: 1000
}

function conversionRomana(valor) {
    let resultado = 0
    let cadena = valor.toUpperCase().split('')
    for (let k = 0; k < cadena.length; k++) {
        let actual = romanos[cadena[k]]
        let siguiente = romanos[cadena[k+1]] || 0
        if (actual < siguiente) {
            resultado += siguiente - actual
            k++
        } else {
            resultado += actual
        }
    }
    return resultado
}

console.log(conversionRomana('III'))
console.log(conversionRomana('XIV'))
console.log(conversionRomana('MMXXIV'))
console.log(conversionRomana('MXMVII'))
