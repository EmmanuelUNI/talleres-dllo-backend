const express = require('express')
const router = express.Router()
const { findMax, includes, sum, missingNumbers } = require('../taller-02')

router.post('/find-max', (req, res) => {
    const { valores } = req.body
    if (!valores || !Array.isArray(valores)) {
        return res.status(400).json({ error: 'Se requiere parámetro valores como array' })
    }
    const resultado = findMax(valores)
    res.json({ valores, maximo: resultado })
})

router.post('/includes', (req, res) => {
    const { elementos, buscado } = req.body
    if (!elementos || !Array.isArray(elementos) || buscado === undefined) {
        return res.status(400).json({ error: 'Se requieren parámetros: elementos (array) y buscado' })
    }
    const resultado = includes(elementos, buscado)
    res.json({ elementos, buscado, encontrado: resultado })
})

router.post('/sum', (req, res) => {
    const { arreglo } = req.body
    if (!arreglo || !Array.isArray(arreglo)) {
        return res.status(400).json({ error: 'Se requiere parámetro arreglo como array' })
    }
    const resultado = sum(arreglo)
    res.json({ arreglo, suma: resultado })
})

router.post('/missing-numbers', (req, res) => {
    const { conjunto } = req.body
    if (!conjunto || !Array.isArray(conjunto)) {
        return res.status(400).json({ error: 'Se requiere parámetro conjunto como array' })
    }
    const resultado = missingNumbers(conjunto)
    res.json({ conjunto, faltantes: resultado })
})

module.exports = router