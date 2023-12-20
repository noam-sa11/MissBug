
import { bugService } from '../services/bug.service.js'
import { userService } from '../services/user.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'

const { Link, useParams } = ReactRouterDOM
const { useState, useEffect } = React

export function UserDetails() {
    const [user, setUser] = useState(null)
    const [bugs, setBugs] = useState(null)

    useEffect(() => {
        const loggedInUser = userService.getLoggedInUser()
        setUser(loggedInUser)

        if (loggedInUser) loadBugs(loggedInUser)
    }, [])

    useEffect(() => {
        if (user) {
            loadBugs(user)
        }
    }, [user])

    function loadBugs(user) {
        bugService.query({ creatorId: user._id })
            .then(bugs => setBugs(bugs))
            .catch(err => {
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

    if (!bugs) return <h1>loadings....</h1>
    return (
        <div className='user-details'>
            <h2>{user.fullname}'s Profile</h2>
            <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
        </div>
    )

}

