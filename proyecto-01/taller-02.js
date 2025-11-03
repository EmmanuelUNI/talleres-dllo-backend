function findMax(valores){
  let mayor = valores[0]
  for (let indice=1; indice < valores.length; indice++){
    if(valores[indice] > mayor){
      mayor = valores[indice]
    }
  }
  return mayor
}

function includes(elementos, buscado){
  for (let k=0; k < elementos.length; k++){
    if(elementos[k] === buscado){
      return true
    }
  }
  return false
}

function sum(arreglo){
  let acumulador = 0
  for (let pos=0; pos < arreglo.length; pos++){
    acumulador += arreglo[pos]
  }
  return acumulador
}

function missingNumbers(conjunto){
  const faltantes = []
  let minimo = conjunto[0], maximo = conjunto[0]
  for (let n=1; n < conjunto.length; n++){
    if(conjunto[n] > maximo){
      maximo = conjunto[n]
    }
    if(conjunto[n] < minimo){
      minimo = conjunto[n]
    }
  }
  for (let num=minimo+1; num < maximo; num++){
    let existe = false
    for (let m=0; m < conjunto.length; m++){
      if (num === conjunto[m]){
        existe = true
      }
    }
    if (!existe){
      faltantes.push(num)
    }
  }
  return faltantes
}

module.exports = { findMax, includes, sum, missingNumbers }