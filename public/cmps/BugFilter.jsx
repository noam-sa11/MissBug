
const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilter }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilter(filterByToEdit)
    }, [filterByToEdit])

    function onSetFilterBy(ev) {
        ev.preventDefault()
        onSetFilter(filterByToEdit)
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break

            default:
                break;
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    const { txt, minSeverity, labels } = filterByToEdit
    return (
        <fieldset className="bug-filter">
            <legend>Filter Our Bugs</legend>
            <form onSubmit={onSetFilterBy} >
                <fieldset htmlFor="txt">
                    <legend>Text: </legend>
                    <input value={txt} onChange={handleChange} type="text" id="txt" name="txt" />
                </fieldset>

                <fieldset htmlFor="minSeverity">
                    <legend>minSeverity: </legend>
                    <input value={minSeverity || ''} onChange={handleChange} type="number" id="minSeverity" name="minSeverity" />
                </fieldset>

                <fieldset htmlFor="label">
                    <legend>Label: </legend>
                    <input value={labels} onChange={handleChange} type="text" id="label" name="label" />
                </fieldset>
            </form>
        </fieldset>
    )
}