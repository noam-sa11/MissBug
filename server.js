import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

import express from 'express'
import cookieParser from 'cookie-parser'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())

app.get('/', (req, res) =>
    res.send('Hello there')
)

app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => {
            let visitedBugs = req.cookies.visitedBugs || []
            const unvisitedBugs = bugs.filter(bug => !visitedBugs.includes(bug._id))
            const bugsForDisplay = [...unvisitedBugs].splice(0, 3)
            res.cookie(
                'visitedBugs',
                [...visitedBugs, ...bugsForDisplay.map((bug) => bug._id)],
                { maxAge: 1000 * 7 }
            )
            res.send(bugsForDisplay)
        })
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})

app.get('/api/bug/save', (req, res) => {
    const bugToSave = {
        title: req.query.title,
        description: req.query.description,
        severity: +req.query.severity,
        createdAt: +req.query.createdAt,
        _id: req.query._id,
    }

    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

app.get('/api/bug/:bugId', (req, res) => {
    const bugId = req.params.bugId
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
        })
})

app.get('/api/bug/:bugId/remove', (req, res) => {
    const bugId = req.params.bugId
    bugService.remove(bugId)
        .then(() => res.send(bugId))
        .catch((err) => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug')
        })
})

app.listen(3030, () => console.log('Server ready at port http://127.0.0.1:3030/'))