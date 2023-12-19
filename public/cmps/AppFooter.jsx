import { showSuccessMsg } from '../services/event-bus.service.js'
const { useEffect } = React

export function AppFooter () {

    useEffect(() => {
        // component did mount when dependancy array is empty
    }, [])

    return (
        <footer className="app-footer full flex justify-center align-center" >
            <p>
                coffeerights to all
            </p>
        </footer>
    )

}