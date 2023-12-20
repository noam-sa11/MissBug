

export function BugPreview({ bug }) {
    return <article>
        <h1>🐛</h1>
        <h4>{bug.title}</h4>
        <fieldset>
            <legend>Severity: </legend>
            <span>{bug.severity}</span>
        </fieldset>
        <fieldset>
            <legend>Created At: </legend>
            <span>{new Date(bug.createdAt).toLocaleString()}</span>
        </fieldset>
        <fieldset>
            <legend>Creator: </legend>
            <span>{bug.creator.fullname}</span>
        </fieldset>
        <fieldset>
            <legend>Labels: </legend>
            <p>
                {bug.labels &&
                    bug.labels.map((label, idx) => (
                        <React.Fragment key={idx}>
                            {label}
                            {idx < bug.labels.length - 1 && <br />}
                        </React.Fragment>
                    ))}
                {!bug.labels && <span>None</span>}
            </p>
        </fieldset>

    </article>
}