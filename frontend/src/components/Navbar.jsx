import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <svg className="logo-icon" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
            <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="2"/>
            <path d="M25 15 L25 35 M15 25 L35 25" stroke="currentColor" strokeWidth="2"/>
            <circle cx="25" cy="25" r="5" fill="currentColor"/>
          </svg>
          <span className="logo-text">TB Detect</span>
        </Link>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/get-health"
              className={`nav-link ${location.pathname === '/get-health' ? 'active' : ''}`}
            >
              Get Health
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/about"
              className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
            >
              About Us
            </Link>
          </li>
        </ul>

        <div className="profile-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="2"/>
            <path d="M16 14H8C6.13401 14 4.5 15.634 4.5 17.5V20H19.5V17.5C19.5 15.634 17.866 14 16 14Z" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;