const express = require('express')
const app = express()

app.use(express.json())

const rutasTaller01 = require('./rutas/rutas-taller-01')
const rutasTaller02 = require('./rutas/rutas-taller-02')
const rutasTaller03 = require('./rutas/rutas-taller-03')

app.use('/taller-01', rutasTaller01)
app.use('/taller-02', rutasTaller02)
app.use('/taller-03', rutasTaller03)

app.get('/', (req, res) => {
    res.json({
        mensaje: 'API Backend - Proyecto 01',
        talleres: {
            taller01: '/taller-01',
            taller02: '/taller-02',
            taller03: '/taller-03'
        }
    })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`)
})