import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import ImcCalculator from './pages/ImcCalculator'
import BodyFatCalculator from './pages/BodyFatCalculator'
import DailyCaloriesCalculator from './pages/DailyCaloriesCalculator'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<ImcCalculator />} />
        <Route path="/calculadora-grasa-corporal" element={<BodyFatCalculator />} />
        <Route path="/calculadora-calorias-diarias" element={<DailyCaloriesCalculator />} />
      </Routes>
      <footer className="app-footer">
        <div className="container footer-container">
          <div className="footer-info">
            <span className="footer-logo">IMClator</span>
            <p>© {new Date().getFullYear()} IMClator. Todos los derechos reservados. Desarrollado con tecnología de vanguardia.</p>
          </div>
          <div className="footer-actions">
            <a 
              href="https://buymeacoffee.com/zentoo" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bmc-button"
            >
              <svg className="bmc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                <line x1="6" y1="2" x2="6" y2="4" />
                <line x1="10" y1="2" x2="10" y2="4" />
                <line x1="14" y1="2" x2="14" y2="4" />
              </svg>
              <span>Invítame un café</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Floating Buy Me a Coffee Widget */}
      <a 
        href="https://buymeacoffee.com/zentoo" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="bmc-floating-widget"
        title="Invítame un café en Buy Me a Coffee"
      >
        <div className="bmc-floating-content">
          <svg className="bmc-floating-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
            <line x1="6" y1="2" x2="6" y2="4" />
            <line x1="10" y1="2" x2="10" y2="4" />
            <line x1="14" y1="2" x2="14" y2="4" />
          </svg>
          <span className="bmc-floating-text">Invítame un café</span>
        </div>
      </a>
    </>
  )
}

export default App
