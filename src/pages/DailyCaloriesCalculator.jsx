import { useState, useEffect } from 'react'

export default function DailyCaloriesCalculator() {
  // SEO & Structured Data setup
  useEffect(() => {
    document.title = "Calculadora de Calorías Diarias | Gasto Energético y BMR | IMClator"
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Calcula tus calorías diarias recomendadas (TDEE) y Tasa Metabólica Basal (BMR). Planifica tu nutrición y macros para perder, mantener o ganar peso de forma saludable.')
    }
    
    let canonical = document.querySelector('link[rel="canonical"]')
    const canonicalUrl = "https://imclator.vercel.app/calculadora-calorias-diarias"
    if (canonical) {
      canonical.setAttribute('href', canonicalUrl)
    } else {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      canonical.setAttribute('href', canonicalUrl)
      document.head.appendChild(canonical)
    }

    const schemaId = 'json-ld-calories-calculator'
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
      "name": "Calculadora de Calorías Diarias - IMClator",
      "url": canonicalUrl,
      "description": "Calcula de forma precisa tus requerimientos calóricos diarios y distribución de macronutrientes usando la fórmula Mifflin-St Jeor según tu nivel de actividad física.",
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

  // Activity Level
  const [activityLevel, setActivityLevel] = useState('moderate')

  // Selected Goal ID
  const [selectedGoal, setSelectedGoal] = useState('loss')

  // Macro Split Choice: 'balanced' (40/30/30), 'lowcarb' (20/40/40), 'highprotein' (35/40/25)
  const [macroSplit, setMacroSplit] = useState('balanced')

  // Sync unit systems on toggle to prevent value reset
  const handleUnitToggle = (system) => {
    if (system === unitSystem) return

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

  // Safe Fallback Values
  const safeHeight = Number(height) || 170
  const safeWeight = Number(weight) || 70
  const safeWeightLbs = Number(weightLbs) || 154
  const safeFt = Number(ft) || 5
  const safeIn = Number(inVal) || 7
  const safeAge = Number(age) || 25

  // Calculations
  const weightInKg = unitSystem === 'metric' ? safeWeight : safeWeightLbs * 0.45359237
  const heightInCm = unitSystem === 'metric' ? safeHeight : ((safeFt * 12) + safeIn) * 2.54

  // Mifflin-St Jeor Equation for BMR
  const calculateBmr = () => {
    if (gender === 'male') {
      return 10 * weightInKg + 6.25 * heightInCm - 5 * safeAge + 5
    } else {
      return 10 * weightInKg + 6.25 * heightInCm - 5 * safeAge - 161
    }
  }

  const bmr = Math.round(calculateBmr())

  // TDEE Activity Factors
  const activityFactors = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    'very-active': 1.9
  }

  const activityFactor = activityFactors[activityLevel] || 1.55
  const tdee = Math.round(bmr * activityFactor)

  // Goals setup with calorie offset
  const goalsList = [
    { id: 'maintain', name: 'Mantener Peso', description: 'Mantén tu peso actual', offset: 0 },
    { id: 'mild-loss', name: 'Adelgazamiento Suave', description: 'Pierde ~0.25 kg por semana', offset: -250 },
    { id: 'loss', name: 'Pérdida de Peso', description: 'Pierde ~0.50 kg por semana (Recomendado)', offset: -500 },
    { id: 'extreme-loss', name: 'Pérdida Rápida (Cuidado)', description: 'Pierde ~1.00 kg por semana', offset: -1000 },
    { id: 'mild-gain', name: 'Aumento de Peso Suave', description: 'Gana ~0.25 kg por semana', offset: 250 },
    { id: 'gain', name: 'Aumento de Peso', description: 'Gana ~0.50 kg por semana', offset: 500 }
  ]

  // Safe Calories Cap (Floor: 1200 kcal/day for women, 1500 kcal/day for men)
  const getGoalCalories = (offset) => {
    const rawTarget = tdee + offset
    const floor = gender === 'female' ? 1200 : 1500
    if (rawTarget < floor) {
      return { calories: floor, isLimited: true }
    }
    return { calories: Math.round(rawTarget), isLimited: false }
  }

  const activeGoalData = goalsList.find(g => g.id === selectedGoal) || goalsList[2]
  const { calories: targetCalories, isLimited: activeGoalIsLimited } = getGoalCalories(activeGoalData.offset)

  // Macros splits configurations
  const macroSplitsConfig = {
    balanced: { carbs: 0.40, protein: 0.30, fat: 0.30, name: 'Balanceada' },
    lowcarb: { carbs: 0.20, protein: 0.40, fat: 0.40, name: 'Baja en Carbos' },
    highprotein: { carbs: 0.35, protein: 0.40, fat: 0.25, name: 'Alta en Proteína' }
  }

  const activeMacroConfig = macroSplitsConfig[macroSplit]

  // Calculate grams (Protein/Carbs = 4 kcal/g, Fat = 9 kcal/g)
  const carbsGrams = Math.round((targetCalories * activeMacroConfig.carbs) / 4)
  const proteinGrams = Math.round((targetCalories * activeMacroConfig.protein) / 4)
  const fatGrams = Math.round((targetCalories * activeMacroConfig.fat) / 9)

  return (
    <main className="main-content container theme-calories">
      {/* Hero / Title Section */}
      <section className="hero-section">
        <h1 className="hero-title">Calculadora de Calorías Diarias</h1>
        <p className="hero-subtitle">
          Calcula tus necesidades calóricas diarias (TDEE) y tu metabolismo basal (BMR). Diseña un plan de nutrición óptimo según tus objetivos personales de peso y salud.
        </p>
      </section>

      {/* Main Grid */}
      <div className="calculator-grid">
        
        {/* Left Card: Input Parameters */}
        <section className="glass-card">
          <h2 className="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Tus Datos
          </h2>

          <div className="input-section">
            {/* Unit System Toggle */}
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

            {/* Gender Selection */}
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

            {/* Height Input */}
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

            {/* Weight Input */}
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

            {/* Age Input */}
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

            {/* Activity Level Selector */}
            <div className="form-group">
              <label htmlFor="activity-input" className="input-label">Nivel de Actividad Física</label>
              <select 
                id="activity-input"
                className="select-input"
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
              >
                <option value="sedentary">Sedentario (Poco o ningún ejercicio diario)</option>
                <option value="light">Ligero (Ejercicio suave 1-3 días a la semana)</option>
                <option value="moderate">Moderado (Ejercicio medio 3-5 días a la semana)</option>
                <option value="active">Activo (Ejercicio fuerte 6-7 días a la semana)</option>
                <option value="very-active">Muy Activo (Ejercicio extremo o trabajo físico duro)</option>
              </select>
            </div>

          </div>
        </section>

        {/* Right Card: Energy Expenditure and Goals analysis */}
        <section className="glass-card">
          <h2 className="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            Tu Gasto Energético
          </h2>

          <div className="result-section" style={{ gap: '20px' }}>
            
            {/* Visual Ring for TDEE */}
            <div className="gauge-container" style={{ margin: '10px auto' }}>
              <svg viewBox="0 0 200 120" className="gauge-svg" aria-hidden="true">
                <defs>
                  <linearGradient id="calories-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
                
                {/* Arc Track */}
                <path 
                  d="M20,100 A80,80 0 0,1 180,100" 
                  fill="none" 
                  stroke="var(--border-color)" 
                  strokeWidth="14" 
                  strokeLinecap="round" 
                />
                
                {/* Filled Arc based on activity level factor */}
                {/* Map factor 1.2 - 1.9 to percentage of the 180 deg arc */}
                <path 
                  d="M20,100 A80,80 0 0,1 180,100" 
                  fill="none" 
                  stroke="url(#calories-gradient)" 
                  strokeWidth="14" 
                  strokeLinecap="round" 
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * ((activityFactor - 1.2) / (1.9 - 1.2)))}
                  style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
                />
              </svg>

              <div className="gauge-bmi-overlay">
                <div className="bmi-large" style={{ color: '#f97316' }}>{tdee}</div>
                <div className="bmi-label-small">kcal diarias</div>
              </div>
            </div>

            {/* BMR and TDEE Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%', textAlign: 'center' }}>
              <div style={{ background: 'var(--bg-card)', padding: '10px', borderRadius: '10px' }}>
                <span className="goal-description">Metabolismo Basal (BMR)</span>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>{bmr} kcal</div>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '10px', borderRadius: '10px' }}>
                <span className="goal-description">Gasto Diario (TDEE)</span>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>{tdee} kcal</div>
              </div>
            </div>

            {/* Interactive Goals Selector */}
            <div style={{ width: '100%', marginTop: '5px' }}>
              <label className="input-label" style={{ marginBottom: '8px' }}>Selecciona tu Objetivo de Peso</label>
              <div className="goals-list">
                {goalsList.map((g) => {
                  const goalCalData = getGoalCalories(g.offset)
                  return (
                    <div 
                      key={g.id}
                      className={`goal-item ${selectedGoal === g.id ? 'active' : ''}`}
                      onClick={() => setSelectedGoal(g.id)}
                    >
                      <div className="goal-info">
                        <span className="goal-name">{g.name}</span>
                        <span className="goal-description">{g.description}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span className="goal-calories">{goalCalData.calories} kcal</span>
                        {goalCalData.isLimited && (
                          <span style={{ fontSize: '0.7rem', color: '#dc2626', background: 'rgba(220, 38, 38, 0.08)', padding: '2px 6px', borderRadius: '4px', marginTop: '2px' }}>
                            Mínimo Seguro
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Macronutrients breakdown for selected goal */}
            <div style={{ width: '100%', borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="input-label">Distribución de Macronutrientes</label>
              </div>

              {/* Macro Distribution Switcher Buttons */}
              <div className="macro-dist-selector">
                <button 
                  type="button" 
                  className={`macro-dist-btn ${macroSplit === 'balanced' ? 'active' : ''}`}
                  onClick={() => setMacroSplit('balanced')}
                >
                  Equilibrada (40/30/30)
                </button>
                <button 
                  type="button" 
                  className={`macro-dist-btn ${macroSplit === 'lowcarb' ? 'active' : ''}`}
                  onClick={() => setMacroSplit('lowcarb')}
                >
                  Low Carb (20/40/40)
                </button>
                <button 
                  type="button" 
                  className={`macro-dist-btn ${macroSplit === 'highprotein' ? 'active' : ''}`}
                  onClick={() => setMacroSplit('highprotein')}
                >
                  Alta Proteína (35/40/25)
                </button>
              </div>

              {/* Macro stats blocks */}
              <div className="macro-box-container">
                <div className="macro-card carb">
                  <span className="macro-title">Carbohidratos</span>
                  <span className="macro-value">{carbsGrams}g</span>
                  <span className="macro-percent">{Math.round(activeMacroConfig.carbs * 100)}% ({Math.round(carbsGrams * 4)} kcal)</span>
                </div>
                <div className="macro-card protein">
                  <span className="macro-title">Proteínas</span>
                  <span className="macro-value">{proteinGrams}g</span>
                  <span className="macro-percent">{Math.round(activeMacroConfig.protein * 100)}% ({Math.round(proteinGrams * 4)} kcal)</span>
                </div>
                <div className="macro-card fat">
                  <span className="macro-title">Grasas</span>
                  <span className="macro-value">{fatGrams}g</span>
                  <span className="macro-percent">{Math.round(activeMacroConfig.fat * 100)}% ({Math.round(fatGrams * 9)} kcal)</span>
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* Warning message if safety floor is active */}
      {activeGoalIsLimited && (
        <section className="glass-card" style={{ marginBottom: '30px', background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div>
              <h3 style={{ color: '#dc2626', fontWeight: '600' }}>Límite de Seguridad Calórica Activado</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Tu objetivo seleccionado requiere un déficit calórico que está por debajo de los límites saludables recomendados (1500 kcal para hombres y 1200 kcal para mujeres). Hemos ajustado tu consumo al mínimo seguro para proteger tu metabolismo, evitar la pérdida excesiva de masa muscular y prevenir déficits de nutrientes esenciales.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* SEO text block & scientific explanations */}
      <section className="glass-card" style={{ marginBottom: '40px' }}>
        <h2 className="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          ¿Cómo se calcula el Gasto Calórico Diario?
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-secondary)' }}>
          <p>
            El cálculo de las calorías diarias se compone de dos elementos fundamentales: la <strong>Tasa Metabólica Basal (BMR)</strong> y el <strong>Gasto Energético Diario Total (TDEE)</strong>.
          </p>

          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '600', marginTop: '10px' }}>1. Tasa Metabólica Basal (BMR)</h3>
          <p>
            Representa la cantidad mínima de energía (calorías) que tu cuerpo requiere para mantener sus funciones vitales en reposo completo (respiración, circulación, regulación térmica, producción celular). 
            Esta herramienta utiliza la <strong>ecuación Mifflin-St Jeor</strong>, ampliamente reconocida en la nutrición moderna por su alta precisión:
          </p>
          <ul style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><strong>Hombres:</strong> BMR = (10 × peso en kg) + (6.25 × altura en cm) - (5 × edad en años) + 5</li>
            <li><strong>Mujeres:</strong> BMR = (10 × peso en kg) + (6.25 × altura en cm) - (5 × edad en años) - 161</li>
          </ul>

          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '600', marginTop: '10px' }}>2. Gasto Energético Diario Total (TDEE)</h3>
          <p>
            Es el total de calorías reales que consumes en un día completo, sumando tu actividad física y ejercicio a tu BMR. Multiplicamos tu BMR por un coeficiente de actividad estandarizado:
          </p>
          <ul style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><strong>Sedentario (×1.2):</strong> Trabajo de oficina, poco o ningún ejercicio.</li>
            <li><strong>Ligero (×1.375):</strong> Actividades ligeras o entrenamiento de 1 a 3 días/semana.</li>
            <li><strong>Moderado (×1.55):</strong> Estilo de vida activo o entrenamiento de 3 a 5 días/semana.</li>
            <li><strong>Activo (×1.725):</strong> Gran actividad física regular o entrenamiento diario duro de 6 a 7 días/semana.</li>
            <li><strong>Muy Activo (×1.9):</strong> Atletas profesionales, entrenamientos de alta intensidad dobles o trabajo físico muy pesado.</li>
          </ul>

          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '600', marginTop: '10px' }}>3. Planificación de Objetivos de Peso</h3>
          <p>
            Para alterar tu peso corporal, debes ajustar tu consumo calórico por encima o por debajo de tu TDEE:
          </p>
          <ul style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><strong>Déficit Calórico (Pérdida de Peso):</strong> Consumir menos calorías de tu TDEE obliga a tu cuerpo a utilizar las reservas de grasa como energía. Un déficit de 500 kcal diarias se traduce en aproximadamente 0.5 kg de grasa perdidos a la semana de forma segura.</li>
            <li><strong>Superávit Calórico (Aumento de Peso):</strong> Consumir más calorías de tu TDEE permite almacenar energía. Si se acompaña de entrenamiento de fuerza regular, este exceso calórico fomenta la hipertrofia o crecimiento de masa muscular limpia.</li>
          </ul>
        </div>
      </section>
    </main>
  )
}
