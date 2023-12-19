import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

import express from 'express'
import cookieParser from 'cookie-parser'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

app.get('/', (req, res) =>
    res.send('Hello there')
)

// Get Bugs (READ)
app.get('/api/bug', (req, res) => {
    const { txt, minSeverity, label, pageIdx, sortBy, sortDir = -1 } = req.query
    const filterBy = {
        txt: txt || '',
        minSeverity: minSeverity || 0,
        label: label || '',
        pageIdx: pageIdx
    }

    bugService.query(filterBy)
        .then(bugs => {
            if (sortBy) {
                bugs = sortBugs(bugs, sortBy, sortDir)
            }
            res.send(bugs)
        })
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})

function sortBugs(bugs, sortBy, sortDir) {
    switch (sortBy) {
        case 'title':
            return bugs.sort((b1, b2) => sortDir * b1.title.localeCompare(b2.title))
        case 'severity':
            return bugs.sort((b1, b2) => sortDir * (b1.severity - b2.severity))
        case 'createdAt':
            return bugs.sort((b1, b2) => sortDir * (b1.createdAt - b2.createdAt))
        default:
            return bugs
    }
}

// Add Bug (CREATE)
app.post('/api/bug', (req, res) => {
    const { title, description, severity, labels } = req.body
    const bugToSave = {
        title,
        description,
        severity: +severity,
        labels,
    }
    console.log('bugToSave:', bugToSave)
    bugService
        .save(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

// Edit Bug (UPDATE)
app.put('/api/bug', (req, res) => {
    const { title, description, severity, labels, _id } = req.body
    const bugToSave = {
        _id,
        title,
        description,
        severity: +severity,
        labels,
    }

    bugService
        .save(bugToSave)
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
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => {
            loggerService.info(`Bug ${bugId} removed`)
            res.send(bugId)
        })
        .catch((err) => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug')
        })
})

const PORT = 3030
app.listen(PORT, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
)