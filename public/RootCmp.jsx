const Router = ReactRouterDOM.HashRouter
const { Route, Routes } = ReactRouterDOM

import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { UserMsg } from './cmps/UserMsg.jsx'
import { Home } from './pages/Home.jsx'
import { BugIndex } from './pages/BugIndex.jsx'
import { BugDetails } from './pages/BugDetails.jsx'
// import { BugEdit } from './pages/BugEdit.jsx'
import { AboutUs } from './pages/AboutUs.jsx'
import { UserDetails } from './pages/UserDetails.jsx'

export function App() {
    return (
        <Router>
            <section className="app main-layout">
                <AppHeader />
                <main className="main-layout full">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/bug" element={<BugIndex />} />
                        <Route path="/bug/:bugId" element={<BugDetails />} />
                        <Route path="/profile" element={<UserDetails />} />
                        {/* <Route path="/bug/edit/:carId" element={<BugEdit />} />
                        <Route path="/bug/edit" element={<BugEdit />} /> */}
                    </Routes>
                </main>
                <AppFooter />
                <UserMsg />
            </section>
        </Router>
    )
}
