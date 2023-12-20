import { LoginSignup } from './LoginSignup.jsx'
import { userService } from '../services/user.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'

const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter
const { useState } = React

export function AppHeader() {
  const navigate = useNavigate()

  const [user, setUser] = useState(userService.getLoggedInUser())

  function onLogout() {
    userService.logout()
      .then(() => {
        onSetUser(null)
      })
      .catch((err) => {
        showErrorMsg('OOPs try again')
      })
  }

  function onSetUser(user) {
    console.log("user:", user)
    setUser(user)
    navigate('/')
  }
  return (
    <header className="app-header full grid column align-center">
      <section className="header-container grid">
        <h1>Bugs are Forever</h1>
        <nav className="app-nav">
          <NavLink to="/">Home</NavLink> |
          <NavLink to="/bug">Bugs</NavLink> |
          <NavLink to="/profile">Profile</NavLink> |
          <NavLink to="/about">About</NavLink>
        </nav>
        {user ? (
          <section className="login">
            <Link to={`/user/${user._id}`}>Hello {user.fullname}</Link>
            <button onClick={onLogout}>Logout</button>
          </section >
        ) : (
          <section className="login">
            <LoginSignup onSetUser={onSetUser} />
          </section>
        )}
      </section>
    </header>
  )
}
