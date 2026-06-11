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
        <div className="container">
          <span className="footer-logo">IMClator</span>
          <p>© {new Date().getFullYear()} IMClator. Todos los derechos reservados. Desarrollado con tecnología de vanguardia.</p>
        </div>
      </footer>
    </>
  )
}

export default App
