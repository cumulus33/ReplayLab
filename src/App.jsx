// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Home } from './pages/Home'
import { About } from './pages/About'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-black">
        <nav className="fixed top-0 left-0 w-full px-12 md:px-24 py-8 flex justify-between items-center z-10 bg-white">
          <Link to="/" className="font-montserrat font-medium text-xl tracking-tight">
            ReplayLab
          </Link>
          <Link 
            to="/about" 
            className="font-light text-sm tracking-wide opacity-60 hover:opacity-100 transition-opacity"
          >
            About
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App