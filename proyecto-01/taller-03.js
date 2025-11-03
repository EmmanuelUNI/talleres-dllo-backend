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

function twoSum(lista, objetivo) {
    for (let a = 0; a < lista.length; a++) {
        for (let b = a + 1; b < lista.length; b++) {
            if (lista[a] + lista[b] === objetivo && lista[a] !== lista[b]) {
                return [a, b]
            }
        }
    }
}

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

function descomposicion(cadena) {
    let partes = cadena.split(',')
    let palabra = partes[0]
    let diccionario = partes.slice(1)
    for (let i = 0; i < diccionario.length; i++) {
        for (let j = 0; j < diccionario.length; j++) {
            if (diccionario[i] + diccionario[j] === palabra) {
                return [diccionario[i], diccionario[j]]
            }
        }
    }
    return []
}

module.exports = { desglosarString, twoSum, conversionRomana, descomposicion }