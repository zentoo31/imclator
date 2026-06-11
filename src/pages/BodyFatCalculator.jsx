import { useState } from 'react'

export default function BodyFatCalculator() {
  const [method, setMethod] = useState('jackson-pollock')
  const [gender, setGender] = useState('male')
  const [age, setAge] = useState(25)
  const [weight, setWeight] = useState(70)
  const [height, setHeight] = useState(170)

  // Jackson-Pollock method inputs (4-site measurement)
  const [chest, setChest] = useState(10)
  const [abdomen, setAbdomen] = useState(20)
  const [thigh, setThigh] = useState(15)
  const [triceps, setTriceps] = useState(12)

  // Katch-McArdle method input
  const [leanMass, setLeanMass] = useState(60)

  // Calculate body fat percentage based on method
  const calculateBodyFat = () => {
    if (method === 'jackson-pollock') {
      // Jackson-Pollock 4-site formula (in mm)
      const sum = chest + abdomen + thigh + triceps
      let bodyFat

      if (gender === 'male') {
        // Formula para hombres
        bodyFat = 495 / (1.10938 - (0.0008267 * sum) + (0.0000016 * sum * sum) - (0.0002574 * age)) - 450
      } else {
        // Formula para mujeres
        bodyFat = 495 / (1.0994921 - (0.0009929 * sum) + (0.0000023 * sum * sum) - (0.0001392 * age)) - 450
      }

      return Math.max(0, Math.min(100, bodyFat))
    } else if (method === 'katch-mcardle') {
      // Katch-McArdle formula: Body Fat % = ((Total Weight - Lean Body Mass) / Total Weight) * 100
      const bodyFat = ((weight - leanMass) / weight) * 100
      return Math.max(0, Math.min(100, bodyFat))
    }
    return 0
  }

  const bodyFat = calculateBodyFat()

  // Get body fat category
  const getBodyFatCategory = (bf, gnd) => {
    if (gnd === 'male') {
      if (bf < 6) {
        return {
          name: 'Esencial',
          classCode: 'class-essential',
          color: '#ec4899',
          description: 'Grasa esencial necesaria para funciones vitales (menos del 6%)'
        }
      } else if (bf >= 6 && bf <= 13) {
        return {
          name: 'Atlético',
          classCode: 'class-athletic',
          color: '#0284c7',
          description: 'Rango típico de atletas profesionales'
        }
      } else if (bf >= 14 && bf <= 17) {
        return {
          name: 'Fitness',
          classCode: 'class-fitness',
          color: '#06b6d4',
          description: 'Rango fitness, excelente estado físico'
        }
      } else if (bf >= 18 && bf <= 24) {
        return {
          name: 'Promedio',
          classCode: 'class-average',
          color: '#10b981',
          description: 'Rango promedio para hombres adultos'
        }
      } else {
        return {
          name: 'Obeso',
          classCode: 'class-obese',
          color: '#f97316',
          description: 'Nivel de grasa corporal elevado (más del 25%)'
        }
      }
    } else {
      if (bf < 12) {
        return {
          name: 'Esencial',
          classCode: 'class-essential',
          color: '#ec4899',
          description: 'Grasa esencial necesaria para funciones vitales'
        }
      } else if (bf >= 12 && bf <= 16) {
        return {
          name: 'Atlético',
          classCode: 'class-athletic',
          color: '#0284c7',
          description: 'Rango típico de atletas profesionales'
        }
      } else if (bf >= 17 && bf <= 20) {
        return {
          name: 'Fitness',
          classCode: 'class-fitness',
          color: '#06b6d4',
          description: 'Rango fitness, excelente estado físico'
        }
      } else if (bf >= 21 && bf <= 32) {
        return {
          name: 'Promedio',
          classCode: 'class-average',
          color: '#10b981',
          description: 'Rango promedio para mujeres adultas'
        }
      } else {
        return {
          name: 'Obeso',
          classCode: 'class-obese',
          color: '#f97316',
          description: 'Nivel de grasa corporal elevado (más del 32%)'
        }
      }
    }
  }

  const category = getBodyFatCategory(bodyFat, gender)

  // Calculate ideal fat mass and lean mass
  const idealBodyFat = gender === 'male' ? 15 : 22
  const currentFatMass = (bodyFat / 100) * weight
  const currentLeanMass = weight - currentFatMass
  const idealFatMass = (idealBodyFat / 100) * weight
  const difference = weight - idealFatMass

  return (
    <main className="main-content container theme-body-fat">
      {/* Title / Description */}
      <section className="hero-section">
        <h1 className="hero-title">Calculadora de Grasa Corporal</h1>
        <p className="hero-subtitle">
          Mide tu porcentaje de grasa corporal con métodos científicos. Obtén una evaluación detallada de tu composición corporal y recomendaciones personalizadas.
        </p>
      </section>

      {/* Dashboard Grid */}
      <div className="calculator-grid">
        
        {/* Left Side: Parameters / Inputs */}
        <section className="glass-card">
          <h2 className="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Tus Datos
          </h2>
          
          <div className="input-section">
            {/* Gender selection cards */}
            <div className="form-group">
              <label className="input-label">Género</label>
              <div className="gender-grid">
                <div 
                  className={`gender-card ${gender === 'male' ? 'active' : ''}`}
                  onClick={() => setGender('male')}
                >
                  <svg className="gender-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="10" cy="14" r="5" />
                    <path d="M15 9l6-6M16 3h5v5" />
                  </svg>
                  <span className="gender-label">Hombre</span>
                </div>
                
                <div 
                  className={`gender-card ${gender === 'female' ? 'active' : ''}`}
                  onClick={() => setGender('female')}
                >
                  <svg className="gender-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="5" />
                    <path d="M12 13v8M9 18h6" />
                  </svg>
                  <span className="gender-label">Mujer</span>
                </div>
              </div>
            </div>

            {/* Method selection */}
            <div className="form-group">
              <label className="input-label">Método de Cálculo</label>
              <div className={`toggle-container ${method}`}>
                <div className="toggle-slider"></div>
                <button 
                  type="button" 
                  className={`toggle-btn ${method === 'jackson-pollock' ? 'active' : ''}`}
                  onClick={() => setMethod('jackson-pollock')}
                >
                  Jackson-Pollock
                </button>
                <button 
                  type="button" 
                  className={`toggle-btn ${method === 'katch-mcardle' ? 'active' : ''}`}
                  onClick={() => setMethod('katch-mcardle')}
                >
                  Katch-McArdle
                </button>
              </div>
            </div>

            {/* Age */}
            <div className="form-group">
              <div className="label-row">
                <label htmlFor="age-input" className="input-label">Edad</label>
                <div className="value-input-wrapper">
                  <input 
                    id="age-input"
                    type="number" 
                    className="value-input" 
                    value={age}
                    min="2"
                    max="120"
                    placeholder="25"
                    onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                    aria-label="Edad en años"
                  />
                  <span className="value-unit">años</span>
                </div>
              </div>
              <input 
                id="age-range"
                type="range" 
                min="2" 
                max="120" 
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                aria-label="Deslizador de edad"
              />
            </div>

            {/* Weight */}
            <div className="form-group">
              <div className="label-row">
                <label htmlFor="weight-input" className="input-label">Peso</label>
                <div className="value-input-wrapper">
                  <input 
                    id="weight-input"
                    type="number" 
                    className="value-input" 
                    value={weight}
                    min="30"
                    max="220"
                    placeholder="70"
                    onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                    aria-label="Peso en kilogramos"
                  />
                  <span className="value-unit">kg</span>
                </div>
              </div>
              <input 
                id="weight-range"
                type="range" 
                min="30" 
                max="220" 
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                aria-label="Deslizador de peso"
              />
            </div>

            {/* Height */}
            <div className="form-group">
              <div className="label-row">
                <label htmlFor="height-input" className="input-label">Estatura</label>
                <div className="value-input-wrapper">
                  <input 
                    id="height-input"
                    type="number" 
                    className="value-input" 
                    value={height}
                    min="100"
                    max="230"
                    placeholder="170"
                    onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
                    aria-label="Estatura en centímetros"
                  />
                  <span className="value-unit">cm</span>
                </div>
              </div>
              <input 
                id="height-range"
                type="range" 
                min="100" 
                max="230" 
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                aria-label="Deslizador de estatura"
              />
            </div>

            {/* Jackson-Pollock Measurements */}
            {method === 'jackson-pollock' && (
              <>
                <h3 style={{ marginTop: '24px', marginBottom: '16px', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  Medidas en Milímetros (mm)
                </h3>
                
                {/* Chest */}
                <div className="form-group">
                  <div className="label-row">
                    <label htmlFor="chest-input" className="input-label">Pecho</label>
                    <div className="value-input-wrapper">
                      <input 
                        id="chest-input"
                        type="number" 
                        className="value-input" 
                        value={chest}
                        min="0"
                        max="50"
                        onChange={(e) => setChest(e.target.value === '' ? 0 : Number(e.target.value))}
                        aria-label="Medida de pecho en mm"
                      />
                      <span className="value-unit">mm</span>
                    </div>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="50" 
                    value={chest}
                    onChange={(e) => setChest(Number(e.target.value))}
                  />
                </div>

                {/* Abdomen */}
                <div className="form-group">
                  <div className="label-row">
                    <label htmlFor="abdomen-input" className="input-label">Abdomen</label>
                    <div className="value-input-wrapper">
                      <input 
                        id="abdomen-input"
                        type="number" 
                        className="value-input" 
                        value={abdomen}
                        min="0"
                        max="100"
                        onChange={(e) => setAbdomen(e.target.value === '' ? 0 : Number(e.target.value))}
                        aria-label="Medida de abdomen en mm"
                      />
                      <span className="value-unit">mm</span>
                    </div>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={abdomen}
                    onChange={(e) => setAbdomen(Number(e.target.value))}
                  />
                </div>

                {/* Thigh */}
                <div className="form-group">
                  <div className="label-row">
                    <label htmlFor="thigh-input" className="input-label">Muslo</label>
                    <div className="value-input-wrapper">
                      <input 
                        id="thigh-input"
                        type="number" 
                        className="value-input" 
                        value={thigh}
                        min="0"
                        max="50"
                        onChange={(e) => setThigh(e.target.value === '' ? 0 : Number(e.target.value))}
                        aria-label="Medida de muslo en mm"
                      />
                      <span className="value-unit">mm</span>
                    </div>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="50" 
                    value={thigh}
                    onChange={(e) => setThigh(Number(e.target.value))}
                  />
                </div>

                {/* Triceps */}
                <div className="form-group">
                  <div className="label-row">
                    <label htmlFor="triceps-input" className="input-label">Tríceps</label>
                    <div className="value-input-wrapper">
                      <input 
                        id="triceps-input"
                        type="number" 
                        className="value-input" 
                        value={triceps}
                        min="0"
                        max="50"
                        onChange={(e) => setTriceps(e.target.value === '' ? 0 : Number(e.target.value))}
                        aria-label="Medida de tríceps en mm"
                      />
                      <span className="value-unit">mm</span>
                    </div>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="50" 
                    value={triceps}
                    onChange={(e) => setTriceps(Number(e.target.value))}
                  />
                </div>
              </>
            )}

            {/* Katch-McArdle Lean Mass */}
            {method === 'katch-mcardle' && (
              <div className="form-group">
                <div className="label-row">
                  <label htmlFor="lean-mass-input" className="input-label">Masa Magra (Lean Mass)</label>
                  <div className="value-input-wrapper">
                    <input 
                      id="lean-mass-input"
                      type="number" 
                      className="value-input" 
                      value={leanMass}
                      min="20"
                      max="200"
                      onChange={(e) => setLeanMass(e.target.value === '' ? 0 : Number(e.target.value))}
                      aria-label="Masa magra en kilogramos"
                    />
                    <span className="value-unit">kg</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="200" 
                  value={leanMass}
                  onChange={(e) => setLeanMass(Number(e.target.value))}
                  aria-label="Deslizador de masa magra"
                />
              </div>
            )}
          </div>
        </section>

        {/* Right Side: Results & Insights */}
        <section className="glass-card">
          <h2 className="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            Tu Análisis
          </h2>

          <div className="result-section" style={{ gap: '20px' }}>
            {/* Body Fat Percentage Display with Circular Gauge */}
            <div className="gauge-container">
              <svg viewBox="0 0 200 120" className="gauge-svg" aria-hidden="true">
                <defs>
                  <linearGradient id="bodyfat-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="20%" stopColor="#0284c7" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="75%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
                
                {/* Gauge Arc Track Background */}
                <path 
                  d="M20,100 A80,80 0 0,1 180,100" 
                  fill="none" 
                  stroke="var(--border-color)" 
                  strokeWidth="14" 
                  strokeLinecap="round" 
                />
                {/* Color Arc representation */}
                <path 
                  d="M20,100 A80,80 0 0,1 180,100" 
                  fill="none" 
                  stroke="url(#bodyfat-gradient)" 
                  strokeWidth="14" 
                  strokeLinecap="round" 
                />
                
                {/* Needle pointer */}
                <g transform={`translate(100, 100) rotate(${(bodyFat / 50) * 180 - 90})`}>
                  <line 
                    x1="0" 
                    y1="0" 
                    x2="0" 
                    y2="-78" 
                    stroke={category.color} 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                    style={{ transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), stroke 0.3s ease' }}
                  />
                  <circle cx="0" cy="0" r="8" fill={category.color} style={{ transition: 'fill 0.3s ease' }} />
                  <circle cx="0" cy="0" r="4.5" fill="var(--bg-main)" style={{ transition: 'fill 0.3s ease' }} />
                </g>
              </svg>

              <div className="gauge-bmi-overlay">
                <div className="bmi-large" style={{ color: category.color }}>{bodyFat.toFixed(1)}</div>
                <div className="bmi-label-small">% Grasa</div>
              </div>
            </div>

            {/* Category Badge */}
            <div className="category-badge-container">
              <span className={`category-badge ${category.classCode}`}>
                {category.name}
              </span>
            </div>

            {/* Category Description */}
            <div className="insight-container">
              <p style={{ color: category.color, fontWeight: '600', marginBottom: '8px' }}>
                {category.description}
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Masa de grasa: <strong>{currentFatMass.toFixed(1)} kg</strong> | Masa magra: <strong>{currentLeanMass.toFixed(1)} kg</strong>
              </p>
            </div>

            {/* Ideal Weight Range */}
            <div className="insight-container">
              <div className="weight-range-info">
                <div className="weight-range-title">Peso Ideal para tu Grasa Corporal Target</div>
                <div className="weight-range-value" style={{ color: '#0284c7' }}>{difference.toFixed(1)} kg</div>
              </div>
              
              <p className="weight-recommendation">
                {bodyFat > idealBodyFat ? 
                  `Necesitas perder aproximadamente ${(currentFatMass - idealFatMass).toFixed(1)} kg de grasa corporal para alcanzar un ${idealBodyFat}% saludable.` :
                  `¡Excelente! Tu porcentaje de grasa corporal es óptimo. Mantén tu estilo de vida actual.`
                }
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Educational Info */}
      <section className="info-section">
        <div className="info-grid">
          
          <div className="info-card">
            <h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              ¿Qué es la Grasa Corporal?
            </h3>
            <p>
              El porcentaje de grasa corporal es la proporción de grasa total en relación con el peso corporal. Es un indicador más preciso que el IMC para evaluar la composición corporal, ya que distingue entre masa muscular y grasa acumulada.
            </p>
          </div>

          <div className="info-card">
            <h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Jackson-Pollock vs Katch-McArdle
            </h3>
            <p>
              <strong>Jackson-Pollock:</strong> Usa medidas de pliegues de piel en 4 sitios específicos. Es más preciso pero requiere mediciones correctas. <strong>Katch-McArdle:</strong> Más simple, utiliza solo el peso y la masa magra, pero puede ser menos preciso en personas no entrenadas.
            </p>
          </div>

          <div className="info-card">
            <h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              Rangos Recomendados
            </h3>
            <p>
              <strong>Hombres:</strong> Esencial &lt;6%, Atlético 6-13%, Fitness 14-17%, Promedio 18-24%, Obeso &gt;25%. <strong>Mujeres:</strong> Esencial &lt;12%, Atlético 12-16%, Fitness 17-20%, Promedio 21-32%, Obeso &gt;32%.
            </p>
          </div>

        </div>
      </section>
    </main>
  )
}
