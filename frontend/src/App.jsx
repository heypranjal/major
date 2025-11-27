import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import GetHealth from './pages/GetHealth';
import AboutUs from './pages/AboutUs';
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/get-health" element={<GetHealth />} />
            <Route path="/about" element={<AboutUs />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
