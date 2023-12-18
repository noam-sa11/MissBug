import express from 'express'
import cookieParser from 'cookie-parser'

const app = express()

app.get('/', (req, res) =>
    res.send('Hello there')
)

app.get('/api/bug', (req, res) => {}) 

app.get('/api/bug/save', (req, res) => {}) 

app.get('/api/bug/:bugId', (req, res) => {}) 

app.get('/api/bug/:bugId/remove', (req, res) => {})

app.listen(3030, () => console.log('Server ready at port http://127.0.0.1:3030/'))