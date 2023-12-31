import { utilService } from "../services/util.service.js"
import { userService } from "../services/user.service.js"
import { bugService } from '../services/bug.service.js'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugSort } from '../cmps/BugSort.jsx'


const { useState, useEffect, useRef } = React

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [user, setUser] = useState(userService.getLoggedInUser())
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
    const debounceOnSetFilter = useRef(utilService.debounce(onSetFilter, 500))

    useEffect(() => {
        loadBugs()
    }, [filterBy])

    function loadBugs() {
        bugService.query(filterBy)
            .then(bugs => setBugs(bugs))
            .catch((err) => {
                console.log('Error getting Bugs', err)
                showErrorMsg('Cannot get bugs')
            })
    }

    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onSetFilter(filterBy) {
        setFilterBy(prevFilter => ({
            ...prevFilter,
            ...filterBy,
            pageIdx: isUndefined(prevFilter.pageIdx) ? undefined : 0
        }))
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            description: prompt('Bug description?'),
            severity: +prompt('Bug severity?'),
            createdAt: Date.now(),
            creator: userService.getLoggedInUser(),
        }
        bugService
            .save(bug)
            .then((savedBug) => {
                console.log('Added Bug', savedBug)
                setBugs([...bugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch((err) => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        bugService
            .save(bugToSave)
            .then((savedBug) => {
                console.log('Updated Bug:', savedBug)
                const bugsToUpdate = bugs.map((currBug) =>
                    currBug._id === savedBug._id ? savedBug : currBug
                )
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch((err) => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }

    function onChangePageIdx(diff) {
        if (isUndefined(filterBy.pageIdx)) return
        setFilterBy(prevFilter => {
            let newPageIdx = prevFilter.pageIdx + diff
            if (newPageIdx < 0) newPageIdx = 0
            return { ...prevFilter, pageIdx: newPageIdx }
        })
    }

    function isUndefined(value) {
        return value === undefined
    }

    const handleSort = (selectedSort, sortDir) => {
        console.log('sortDir:', sortDir)
        setFilterBy((prevFilter) => ({
            ...prevFilter,
            sortBy: selectedSort,
            sortDir: sortDir,
            pageIdx: isUndefined(prevFilter.pageIdx) ? undefined : 0,
        }))
    }

    const { txt, minSeverity, label, pageIdx } = filterBy

    if (!bugs) return <div>Loading...</div>
    return (
        <main className="bug-index main-layout full">
            <BugFilter filterBy={{ txt, minSeverity, label }} onSetFilter={debounceOnSetFilter.current} />

            <section className="actions">
                <BugSort onSort={handleSort} />
                <fieldset className="add-bug">
                    <legend>Add Bug:</legend>
                    <button onClick={onAddBug}>Add Bug ⛐</button>
                </fieldset>
            </section>

            <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />

            <section className="pagination">
                <button onClick={() => onChangePageIdx(1)}>+</button>
                {pageIdx + 1 || 'No Pagination'}
                <button onClick={() => onChangePageIdx(-1)} >-</button>
            </section>
        </main>
    )
}
