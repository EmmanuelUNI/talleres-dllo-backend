
// Punto 1
function findMax(valores){
  let mayor = valores[0]
  for (let indice=1; indice < valores.length; indice++){
    if(valores[indice] > mayor){
      mayor = valores[indice]
    }
  }
  return mayor
}

lista1 = [3, 17, -1, 4, -19]
console.log(findMax(lista1))

// Punto 2
function includes(elementos, buscado){
  for (let k=0; k < elementos.length; k++){
    if(elementos[k] === buscado){
      return true
    }
  }
  return false
}

lista2 = [3, 17, -1, 4, -19]
console.log(includes(lista2, 4))

// Punto 3
function sum(arreglo){
  let acumulador = 0
  for (let pos=0; pos < arreglo.length; pos++){
    acumulador += arreglo[pos]
  }
  return acumulador
}

lista3 = [3, 17, -1, 4, -19]
console.log(sum(lista3))

// Punto 4
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

