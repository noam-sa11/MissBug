const { NavLink } = ReactRouterDOM

export function AppHeader() {
  return (
    <header className="app-header full grid column align-center">
      <h1>Bugs are Forever</h1>
      <nav className="app-nav">
        <NavLink to="/">Home</NavLink> |<NavLink to="/bug">Bugs</NavLink> |
        <NavLink to="/about">About</NavLink>
      </nav>
    </header>
  )
}
