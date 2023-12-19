
const { useState } = React

export function BugSort({ onSort }) {
    const [sortDir, setSortDir] = useState(1)
    const [selectedSort, setSelectedSort] = useState('createdAt')

    function handleSortChange({ target }) {
        const selectedSort = target.value
        setSelectedSort(selectedSort)
        onSort(selectedSort, sortDir)
    }

    function handleSortDirChange({ target }) {
        setSortDir(+target.value)
        onSort(selectedSort, +target.value)
    }

    return (
        <section className="flex">
            <fieldset className="bug-sort">
                <legend htmlFor="sortSelect">Sort By:</legend>
                <select className="sortSelect" onChange={handleSortChange}>
                    <option value="createdAt">Created At</option>
                    <option value="title">Title</option>
                    <option value="severity">Severity</option>
                </select>
            </fieldset>
            <fieldset className="flex">
                <legend htmlFor="sortDirSelect">Direction:</legend>
                <select className="sortDirSelect" value={sortDir} onChange={handleSortDirChange}>
                    <option value="1">Asc</option>
                    <option value="-1">Desc</option>
                </select>
            </fieldset>
        </section>
    )
}