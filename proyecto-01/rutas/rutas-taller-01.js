const express = require('express')
const router = express.Router()
const { convertidorTemp, resolvedor, mejorParidad, peorParidad } = require('../taller-01')

router.post('/convertidor-temp', (req, res) => {
    const { celsius } = req.body
    if (celsius === undefined) {
        return res.status(400).json({ error: 'Se requiere parámetro: celsius' })
    }
    const resultado = convertidorTemp(celsius)
    res.json({ celsius, fahrenheit: resultado })
})

router.post('/resolvedor', (req, res) => {
    const { a, b, c, positivoisTrue } = req.body
    if (a === undefined || b === undefined || c === undefined || positivoisTrue === undefined) {
        return res.status(400).json({ error: 'Se requieren parámetros: a, b, c, positivoisTrue' })
    }
    const resultado = resolvedor(a, b, c, positivoisTrue)
    res.json({ a, b, c, positivoisTrue, resultado })
})

router.post('/mejor-paridad', (req, res) => {
    const { numero } = req.body
    if (numero === undefined) {
        return res.status(400).json({ error: 'Se requiere parámetro: numero' })
    }
    const resultado = mejorParidad(numero)
    res.json({ numero, espar: resultado })
})

router.post('/peor-paridad', (req, res) => {
    const { numero } = req.body
    if (numero === undefined) {
        return res.status(400).json({ error: 'Se requiere parámetro: numero' })
    }
    const resultado = peorParidad(numero)
    res.json({ numero, resultado })
})

module.exports = router