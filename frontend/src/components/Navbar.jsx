/**
 * Navbar Component
 * Main navigation bar with user info and logout
 */
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">=°</span>
            <span className="brand-text">Finance Dashboard</span>
          </Link>
        </div>

        <div className="navbar-menu">
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            Dashboard
          </Link>
          <Link to="/transactions" className={`nav-link ${isActive('/transactions')}`}>
            Transactions
          </Link>
        </div>

        <div className="navbar-user">
          {user && (
            <>
              <span className="user-info">
                <span className="user-icon">=d</span>
                <span className="user-name">{user.full_name || user.email}</span>
              </span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
