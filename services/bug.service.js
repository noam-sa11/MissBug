
import fs from 'fs'
import { utilService } from "./util.service.js"
import { loggerService } from './logger.service.js'

const PAGE_SIZE = 3
export const bugService = {
    query,
    getById,
    save,
    remove,
}

const bugs = utilService.readJsonFile('data/bug.json')

function query(filterBy) {
    if (!bugs || !bugs.length) return Promise.reject('No bugs..')
    // console.log('filterBy:', filterBy)
    let bugsToReturn = bugs
    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        bugsToReturn = bugsToReturn.filter(bug => regExp.test(bug.title) || regExp.test(bug.description))
    }
    if (filterBy.minSeverity) {
        bugsToReturn = bugsToReturn.filter(bug => bug.severity >= filterBy.minSeverity)
    }
    if (filterBy.label) {
        bugsToReturn = bugsToReturn.filter(bug => bug.labels.some(label => label.includes(filterBy.label)))
    }

    if (filterBy.pageIdx !== undefined) {
        const startIdx = filterBy.pageIdx * PAGE_SIZE
        bugsToReturn = bugsToReturn.slice(startIdx, startIdx + PAGE_SIZE)
    }


    return Promise.resolve(bugsToReturn)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Bug dosen\'t exist!')
    
    return Promise.resolve(bug)
}

function remove(bugId) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if(bugIdx !== -1) bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}

function save(bug) {
    if (bug._id) {
        const bugIdx = bugs.findIndex(currBug => currBug._id === bug._id)
        bugs[bugIdx] = bug
    } else {
        bug._id = utilService.makeId()
        bug.createdAt = Date.now()
        bugs.unshift(bug)
    }

    return _saveBugsToFile().then(() => bug)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) {
                loggerService.error('Cannot write to bugs file', err)
                return reject(err)
            }
            console.log('The file was saved!')
            resolve()
        })
    })
}