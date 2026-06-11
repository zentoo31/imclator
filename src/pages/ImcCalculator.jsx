import { useState, useEffect } from 'react'

export default function ImcCalculator() {
  useEffect(() => {
    document.title = "Calculadora de IMC Profesional | Peso Ideal y Salud | IMClator"
    
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Calcula tu Índice de Masa Corporal (IMC) gratis al instante. Descubre tu rango de peso ideal y obtén recomendaciones de salud personalizadas.')
    }
    
    let canonical = document.querySelector('link[rel="canonical"]')
    const canonicalUrl = "https://imclator.vercel.app/"
    if (canonical) {
      canonical.setAttribute('href', canonicalUrl)
    } else {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      canonical.setAttribute('href', canonicalUrl)
      document.head.appendChild(canonical)
    }

    const schemaId = 'json-ld-imc-calculator'
    let schemaScript = document.getElementById(schemaId)
    if (!schemaScript) {
      schemaScript = document.createElement('script')
      schemaScript.id = schemaId;
      schemaScript.type = 'application/ld+json'
      document.head.appendChild(schemaScript)
    }
    schemaScript.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Calculadora de IMC - IMClator",
      "url": canonicalUrl,
      "description": "Calculadora de IMC (Índice de Masa Corporal) profesional, moderna y gratuita. Calcula tu peso ideal al instante de forma visual e interactiva.",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires HTML5/JavaScript support",
      "offers": {
        "@type": "Offer",
        "price": "0.00",
        "priceCurrency": "USD"
      }
    })
  }, [])

  // Unit System: 'metric' (kg, cm) or 'imperial' (lbs, ft/in)
  const [unitSystem, setUnitSystem] = useState('metric')
  
  // Core Inputs
  const [gender, setGender] = useState('male')
  const [age, setAge] = useState(25)
  
  // Metric Values
  const [weight, setWeight] = useState(70) // kg
  const [height, setHeight] = useState(170) // cm
  
  // Imperial Values
  const [weightLbs, setWeightLbs] = useState(154) // lbs
  const [ft, setFt] = useState(5) // feet
  const [inVal, setInVal] = useState(7) // inches

  // Sync unit systems on toggle to prevent value reset
  const handleUnitToggle = (system) => {
    if (system === unitSystem) return

    // Convert values based on current state, fallback to defaults if empty
    const currentWeight = unitSystem === 'metric' ? (Number(weight) || 70) : (Number(weightLbs) || 154)
    const currentHeightCm = unitSystem === 'metric' 
      ? (Number(height) || 170) 
      : (((Number(ft) || 5) * 12) + (Number(inVal) || 7)) * 2.54

    if (system === 'imperial') {
      const lbs = Math.round(currentWeight * 2.20462)
      const totalInches = Math.round(currentHeightCm / 2.54)
      const feet = Math.floor(totalInches / 12)
      const inches = totalInches % 12
      
      setWeightLbs(lbs)
      setFt(feet)
      setInVal(inches)
    } else {
      const totalInches = ((Number(ft) || 5) * 12) + (Number(inVal) || 7)
      const cm = Math.round(totalInches * 2.54)
      const kg = Math.round(currentWeight * 0.453592)
      
      setWeight(kg)
      setHeight(cm)
    }
    setUnitSystem(system)
  }

  // Safe Fallback Values for calculations when inputs are empty during typing
  const safeHeight = Number(height) || 170
  const safeWeight = Number(weight) || 70
  const safeWeightLbs = Number(weightLbs) || 154
  const safeFt = Number(ft) || 5
  const safeIn = Number(inVal) || 7
  const safeAge = Number(age) || 25

  // Derived Calculations
  const heightInMeters = unitSystem === 'metric' 
    ? safeHeight / 100 
    : ((safeFt * 12) + safeIn) * 0.0254

  const weightInKg = unitSystem === 'metric' 
    ? safeWeight 
    : safeWeightLbs * 0.45359237

  const bmi = heightInMeters > 0 
    ? Number((weightInKg / (heightInMeters * heightInMeters)).toFixed(1))
    : 0

  // Category Configuration
  const getBmiCategory = (bmiVal) => {
    if (bmiVal < 18.5) {
      return {
        name: 'Bajo Peso',
        classCode: 'class-underweight',
        color: '#38bdf8',
        tips: [
          'Considera aumentar tu ingesta calórica diaria con alimentos ricos en nutrientes.',
          'Incorpora ejercicios de fuerza para ganar masa muscular de forma saludable.',
          'Consulta a un especialista para investigar posibles causas del bajo peso.'
        ]
      }
    } else if (bmiVal >= 18.5 && bmiVal <= 24.9) {
      return {
        name: 'Peso Normal',
        classCode: 'class-normal',
        color: '#10b981',
        tips: [
          '¡Excelente! Mantén una dieta equilibrada rica en frutas, verduras y proteínas magras.',
          'Realiza al menos 150 minutos de actividad física moderada a la semana.',
          'Mantente bien hidratado y prioriza un sueño reparador de 7 a 8 horas.'
        ]
      }
    } else if (bmiVal >= 25.0 && bmiVal <= 29.9) {
      return {
        name: 'Sobrepeso',
        classCode: 'class-overweight',
        color: '#f59e0b',
        tips: [
          'Considera reducir el consumo de azúcares refinados y alimentos ultraprocesados.',
          'Aumenta tu actividad física diaria (caminar a paso ligero, nadar, montar en bici) a 30-45 minutos.',
          'El control de porciones y la planificación de comidas son excelentes aliados.'
        ]
      }
    } else if (bmiVal >= 30.0 && bmiVal <= 34.9) {
      return {
        name: 'Obesidad Grado I',
        classCode: 'class-obese1',
        color: '#f97316',
        tips: [
          'Pequeños hábitos como sustituir refrescos por agua tienen un impacto enorme.',
          'Establece metas de pérdida de peso moderadas y realistas (ej. 5-10% de tu peso actual).',
          'Combina entrenamiento cardiovascular ligero con ejercicios de resistencia.'
        ]
      }
    } else if (bmiVal >= 35.0 && bmiVal <= 39.9) {
      return {
        name: 'Obesidad Grado II',
        classCode: 'class-obese2',
        color: '#ef4444',
        tips: [
          'Se recomienda encarecidamente buscar asesoramiento médico o de un nutricionista titulado.',
          'Haz un seguimiento de parámetros metabólicos como presión arterial y glucosa.',
          'Enfócate en metas integrales de bienestar a largo plazo, no solo en la báscula.'
        ]
      }
    } else {
      return {
        name: 'Obesidad Grado III',
        classCode: 'class-obese3',
        color: '#ec4899',
        tips: [
          'Es prioritario consultar con un equipo multidisciplinario de salud.',
          'Realiza actividad física adaptada de bajo impacto (como aquaeróbics o caminata asistida) para proteger tus articulaciones.',
          'Cada pequeño avance en la reducción de peso reduce drásticamente riesgos cardiovasculares.'
        ]
      }
    }
  }

  const category = getBmiCategory(bmi)

  // Ideal weight range calculation (BMI 18.5 - 24.9)
  const minIdealKg = 18.5 * (heightInMeters * heightInMeters)
  const maxIdealKg = 24.9 * (heightInMeters * heightInMeters)

  const formattedIdealRange = unitSystem === 'metric'
    ? `${minIdealKg.toFixed(1)} kg - ${maxIdealKg.toFixed(1)} kg`
    : `${(minIdealKg * 2.20462).toFixed(1)} lbs - ${(maxIdealKg * 2.20462).toFixed(1)} lbs`

  // Ideal weight guidance
  const getWeightGuidance = () => {
    const currentWeight = weightInKg
    if (currentWeight < minIdealKg) {
      const diff = minIdealKg - currentWeight
      const diffStr = unitSystem === 'metric' 
        ? `${diff.toFixed(1)} kg` 
        : `${(diff * 2.20462).toFixed(1)} lbs`
      return `Te encuentras por debajo de tu rango ideal. Necesitas ganar aproximadamente ${diffStr} para alcanzar un IMC saludable.`
    } else if (currentWeight > maxIdealKg) {
      const diff = currentWeight - maxIdealKg
      const diffStr = unitSystem === 'metric' 
        ? `${diff.toFixed(1)} kg` 
        : `${(diff * 2.20462).toFixed(1)} lbs`
      return `Te encuentras por encima de tu rango ideal. Necesitas perder aproximadamente ${diffStr} para alcanzar un IMC saludable.`
    } else {
      return '¡Felicidades! Tu peso actual se encuentra dentro del rango saludable recomendado.'
    }
  }

  // Calculate needle rotation degrees for the gauge
  // BMI range mapped: 15 to 40. Under 15 is leftmost (-90 deg), over 40 is rightmost (90 deg).
  const bmiForGauge = Math.min(Math.max(bmi, 15), 40)
  const ratio = (bmiForGauge - 15) / (40 - 15)
  const needleRotation = (ratio * 180) - 90

  return (
    <main className="main-content container">
      {/* Title / Description */}
      <section className="hero-section">
        <h1 className="hero-title">Calculadora de IMC</h1>
        <p className="hero-subtitle">
          Monitorea de forma visual y precisa tu Índice de Masa Corporal. Toma decisiones informadas sobre tu peso y bienestar diario.
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
            {/* Unit System Switcher */}
            <div className="form-group">
              <label className="input-label">Sistema de Unidades</label>
              <div className={`toggle-container ${unitSystem}`}>
                <div className="toggle-slider"></div>
                <button 
                  type="button" 
                  className={`toggle-btn ${unitSystem === 'metric' ? 'active' : ''}`}
                  onClick={() => handleUnitToggle('metric')}
                >
                  Métrico (kg / cm)
                </button>
                <button 
                  type="button" 
                  className={`toggle-btn ${unitSystem === 'imperial' ? 'active' : ''}`}
                  onClick={() => handleUnitToggle('imperial')}
                >
                  Imperial (lbs / ft-in)
                </button>
              </div>
            </div>

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

            {/* Height Selector */}
            {unitSystem === 'metric' ? (
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
                  value={safeHeight}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  aria-label="Deslizador de estatura en centímetros"
                />
              </div>
            ) : (
              <div className="form-group">
                <label className="input-label">Estatura</label>
                <div className="double-input-grid">
                  <div className="sub-input-group">
                    <input 
                      type="number" 
                      min="3" 
                      max="7" 
                      value={ft} 
                      onChange={(e) => setFt(e.target.value === '' ? '' : Math.min(7, Math.max(3, Number(e.target.value))))}
                      placeholder="5"
                      aria-label="Pies"
                    />
                    <span className="sub-input-unit">ft</span>
                  </div>
                  <div className="sub-input-group">
                    <input 
                      type="number" 
                      min="0" 
                      max="11" 
                      value={inVal} 
                      onChange={(e) => setInVal(e.target.value === '' ? '' : Math.min(11, Math.max(0, Number(e.target.value))))}
                      placeholder="7"
                      aria-label="Pulgadas"
                    />
                    <span className="sub-input-unit">in</span>
                  </div>
                </div>
              </div>
            )}

            {/* Weight Selector */}
            {unitSystem === 'metric' ? (
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
                  value={safeWeight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  aria-label="Deslizador de peso en kilogramos"
                />
              </div>
            ) : (
              <div className="form-group">
                <div className="label-row">
                  <label htmlFor="weight-lbs-input" className="input-label">Peso</label>
                  <div className="value-input-wrapper">
                    <input 
                      id="weight-lbs-input"
                      type="number" 
                      className="value-input" 
                      value={weightLbs}
                      min="60"
                      max="500"
                      placeholder="154"
                      onChange={(e) => setWeightLbs(e.target.value === '' ? '' : Number(e.target.value))}
                      aria-label="Peso en libras"
                    />
                    <span className="value-unit">lbs</span>
                  </div>
                </div>
                <input 
                  id="weight-lbs-range"
                  type="range" 
                  min="60" 
                  max="500" 
                  value={safeWeightLbs}
                  onChange={(e) => setWeightLbs(Number(e.target.value))}
                  aria-label="Deslizador de peso en libras"
                />
              </div>
            )}

            {/* Age Selector */}
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
                value={safeAge}
                onChange={(e) => setAge(Number(e.target.value))}
                aria-label="Deslizador de edad en años"
              />
            </div>

          </div>
        </section>

        {/* Right Side: Speedometer Gauge & Personalized Insights */}
        <section className="glass-card">
          <h2 className="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            Tu Diagnóstico
          </h2>

          <div className="result-section" style={{ gap: '20px' }}>
            {/* Dynamic Speedometer */}
            <div className="gauge-container">
              <svg viewBox="0 0 200 120" className="gauge-svg" aria-hidden="true">
                <defs>
                  <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="25%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="75%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ec4899" />
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
                  stroke="url(#gauge-gradient)" 
                  strokeWidth="14" 
                  strokeLinecap="round" 
                />
                
                {/* Needle pointer */}
                <g transform={`translate(100, 100) rotate(${needleRotation})`}>
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
                <div className="bmi-large">{bmi}</div>
                <div className="bmi-label-small">Tu IMC</div>
              </div>
            </div>

            {/* Category classification badge (outside gauge to prevent visual overlapping) */}
            <div className="category-badge-container">
              <span className={`category-badge ${category.classCode}`}>
                {category.name}
              </span>
            </div>

            {/* Dynamic Health recommendations card */}
            <div className="insight-container">
              <div className="weight-range-info">
                <div className="weight-range-title">Rango de Peso Saludable</div>
                <div className="weight-range-value" style={{ color: '#10b981' }}>{formattedIdealRange}</div>
              </div>
              
              <p className="weight-recommendation">
                {getWeightGuidance()}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Dynamic Category Tips List */}
      <section className="glass-card" style={{ marginBottom: '40px' }}>
        <h2 className="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          Recomendaciones específicas para {category.name}
        </h2>
        <div className="tips-section">
          {category.tips.map((tip, idx) => (
            <div key={idx} className="tip-item">
              <span className="tip-bullet">✦</span>
              <p>{tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Informative Educational Cards */}
      <section className="info-section">
        <div className="info-grid">
          
          <div className="info-card">
            <h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              ¿Qué es el IMC?
            </h3>
            <p>
              El Índice de Masa Corporal (IMC) es un indicador simple de la relación entre el peso y la talla que se utiliza frecuentemente para identificar el bajo peso, el peso saludable, el sobrepeso y la obesidad en los adultos. Se calcula dividiendo el peso de una persona en kilos por el cuadrado de su estatura en metros.
            </p>
          </div>

          <div className="info-card">
            <h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Limitaciones del IMC
            </h3>
            <p>
              Aunque es una medida útil y popular, el IMC es una estimación aproximada ya que no distingue la proporción de masa muscular frente a la grasa corporal acumulada. Atletas con gran masa muscular pueden registrar un IMC alto (clasificado como sobrepeso) a pesar de tener niveles bajos de grasa corporal.
            </p>
          </div>

          <div className="info-card">
            <h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              Tabla de Rangos Oficiales
            </h3>
            <table className="scale-table">
              <thead>
                <tr>
                  <th>Clasificación</th>
                  <th>Rango IMC</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ color: 'var(--color-underweight)', fontWeight: '600' }}>Bajo Peso</td>
                  <td>&lt; 18.5</td>
                </tr>
                <tr>
                  <td style={{ color: 'var(--color-normal)', fontWeight: '600' }}>Peso Normal</td>
                  <td>18.5 – 24.9</td>
                </tr>
                <tr>
                  <td style={{ color: 'var(--color-overweight)', fontWeight: '600' }}>Sobrepeso</td>
                  <td>25.0 – 29.9</td>
                </tr>
                <tr>
                  <td style={{ color: 'var(--color-obese1)', fontWeight: '600' }}>Obesidad Grado I</td>
                  <td>30.0 – 34.9</td>
                </tr>
                <tr>
                  <td style={{ color: 'var(--color-obese2)', fontWeight: '600' }}>Obesidad Grado II</td>
                  <td>35.0 – 39.9</td>
                </tr>
                <tr>
                  <td style={{ color: 'var(--color-obese3)', fontWeight: '600' }}>Obesidad Grado III</td>
                  <td>&ge; 40.0</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>
    </main>
  )
}
