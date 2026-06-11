import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <header className="app-header">
      <div className="container header-container">
        <Link to="/" className="logo-link">
          <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          <span className="logo-text">IMClator</span>
        </Link>
        
        <nav>
          <ul className="nav-links">
            <li>
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
              >
                Calculadora IMC
              </Link>
            </li>
            <li>
              <Link 
                to="/calculadora-grasa-corporal" 
                className={`nav-link ${isActive('/calculadora-grasa-corporal') ? 'active' : ''}`}
              >
                Grasa Corporal
              </Link>
            </li>
            <li>
              <a href="#" className="nav-link">
                Calorías Diarias
                <span className="badge-future">Próximamente</span>
              </a>
            </li>
            <li>
              <a href="#" className="nav-link">
                Agua Diaria
                <span className="badge-future">Próximamente</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
