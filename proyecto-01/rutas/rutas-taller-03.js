const express = require('express')
const router = express.Router()
const { desglosarString, twoSum, conversionRomana, descomposicion } = require('../taller-03')

router.post('/desglosar-string', (req, res) => {
    const { texto, tipo } = req.body
    if (!texto || !tipo) {
        return res.status(400).json({ error: 'Se requieren parámetros: texto y tipo' })
    }
    const resultado = desglosarString(texto, tipo)
    res.json({ texto, tipo, cantidad: resultado })
})

router.post('/two-sum', (req, res) => {
    const { lista, objetivo } = req.body
    if (!lista || !Array.isArray(lista) || objetivo === undefined) {
        return res.status(400).json({ error: 'Se requieren parámetros: lista (array) y objetivo' })
    }
    const resultado = twoSum(lista, objetivo)
    res.json({ lista, objetivo, indices: resultado })
})

router.post('/conversion-romana', (req, res) => {
    const { valor } = req.body
    if (!valor) {
        return res.status(400).json({ error: 'Se requiere parámetro: valor' })
    }
    const resultado = conversionRomana(valor)
    res.json({ valor, resultado })
})

router.post('/descomposicion', (req, res) => {
    const { cadena } = req.body
    if (!cadena) {
        return res.status(400).json({ error: 'Se requiere parámetro: cadena' })
    }
    const resultado = descomposicion(cadena)
    res.json({ cadena, resultado })
})

module.exports = router