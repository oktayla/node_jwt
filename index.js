const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/profile', verifyToken, (req, res) => {
    jwt.verify(req.token, 'MY_SECRET_KEY', (err, data) => {
        if( err ) {
            res.status(403).json({
                error: true,
                message: 'User not found.'
            })
        } else {
            res.json({data})
        }
    })
})

app.post('/login', (req, res) => {
    const user = {
        id: 1,
        username: 'oktay',
        email: 'info@email.com'
    }

    jwt.sign({user}, 'MY_SECRET_KEY', (err, token) => {
        res.json({
            logged: true,
            token
        })
    })
})

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization']
    if( typeof bearerHeader !== 'undefined' ) {
        const bearerToken = bearerHeader.split(' ')[1]
        req.token = bearerToken

        next()
    } else {
        res.status(403).json({
            error: true,
            message: 'Session timed out.'
        })
    }
}

app.listen(3000, (req, res) => {
    console.log('Server running on port 3000')
})