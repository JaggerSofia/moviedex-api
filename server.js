require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const MOVIEDEX = require('./moviedex.json')

console.log(process.env.API_TOKEN)

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN

    debugger

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    //move to the next middleware
    next()
})

app.get('/movie', function handleGetMovies(req, res) {
    let response = MOVIEDEX
    const { genre, country, avg_vote } = req.query

    if(genre) {
        response = response.filter(movie =>
            movie.genre.toLowerCase().includes(genre.toLowerCase()))
            
    }

    if(country) {
        response = response.filter(movie => 
            movie.country.toLowerCase().includes(country.toLowerCase()))
    }

    if(avg_vote) {
        response = response.filter(movie => 
            movie.avg_vote >= avg_vote)
    }

    res.json(response)
})

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})