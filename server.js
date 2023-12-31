
import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { userService } from './services/user.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

app.get('/', (req, res) =>
    res.send('Hello there')
)

// Get Bugs (READ)
app.get('/api/bug', (req, res) => {
    const { txt = '', minSeverity = 0, label,
        pageIdx, sortBy = 'createdAt', sortDir = 1, creatorId = []} = req.query
    const filterBy = {
        txt,
        minSeverity,
        label,
        pageIdx,
        sortBy,
        sortDir,
        creatorId,
    }

    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})

// Add Bug (CREATE)
app.post('/api/bug', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')

    const { title, description, severity, labels } = req.body
    const bugToSave = {
        title,
        description,
        severity: +severity,
        labels,
    }

    bugService
        .save(bugToSave, loggedinUser)
        .then(savedBug => res.send(savedBug))
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

// Edit Bug (UPDATE)
app.put('/api/bug', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot update bug')

    const { title, description, severity, labels, _id } = req.body
    const bugToSave = {
        _id,
        title,
        description,
        severity: +severity,
        labels,
    }

    bugService
        .save(bugToSave, loggedinUser)
        .then(savedBug => res.send(savedBug))
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

// Get Bug (READ)
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    const { visitCountMap = [] } = req.cookies

    if (visitCountMap.length >= 3) return res.status(401).send('Exceeded visit count')
    if (!visitCountMap.includes(bugId)) visitCountMap.push(bugId)

    res.cookie('visitedBugs', visitCountMap, { maxAge: 1000 * 7 })

    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
        })
})

// Remove Bug (DELETE)
app.delete('/api/bug/:bugId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot delete bug')

    const { bugId } = req.params
    bugService.remove(bugId, loggedinUser)
        .then(() => {
            loggerService.info(`Bug ${bugId} removed`)
            res.send(bugId)
        })
        .catch((err) => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug')
        })
})

// AUTH API
app.get('/api/user', (req, res) => {
    userService.query()
        .then((users) => {
            res.send(users)
        })
        .catch((err) => {
            console.log('Cannot load users', err)
        })
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.save(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged out')
})

const PORT = 3030
app.listen(PORT, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
)