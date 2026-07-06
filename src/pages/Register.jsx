import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button, Container, Form, Row, Col, Spinner } from "react-bootstrap"
import Swal from "sweetalert2"
import { API_BASE_URL } from "../config/api"

const API = `${API_BASE_URL}/auth`

export default function Register() {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [sport, setSport] = useState("")
  const [frequency, setFrequency] = useState("3")
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function validar() {
    const errs = {}
    if (!fullName.trim()) errs.fullName = "El nombre es obligatorio"
    else if (fullName.trim().split(/\s+/).length < 2) errs.fullName = "Ingresa al menos tu nombre y un apellido"
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) errs.email = "El email es obligatorio"
    else if (!emailRegex.test(email)) errs.email = "El email no es válido"

    if (password.length < 8) errs.password = "Mínimo 8 caracteres"
    if (password !== confirm) errs.confirm = "Las contraseñas no coinciden"
    
    setErrors(errs)
    
    if (Object.keys(errs).length > 0) {
      Swal.fire({ icon: 'warning', title: 'Formulario incompleto', text: 'Por favor, rellene correctamente los campos obligatorios.', background: '#1a0f2a', color: '#fff', confirmButtonColor: '#F2B705' })
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validar()) return

    setLoading(true)
    try {
      const body = { full_name: fullName, email, password, role: "user", must_change_password: false, birth_date: birthDate || "2000-01-01", metadata: { sports: sport ? [{ name: sport, frequency_per_week: parseInt(frequency) }] : [] } }
      const res = await fetch(`${API}/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      const data = await res.json()

      if (!res.ok) {
        Swal.fire({ icon: 'error', title: 'Error al registrar', text: data.message || "Intenta de nuevo con otro correo.", background: '#1a0f2a', color: '#fff', confirmButtonColor: '#F2B705' })
        return
      }

      Swal.fire({ icon: 'success', title: '¡Cuenta creada!', text: 'Tu cuenta ha sido registrada. Redirigiendo al login...', background: '#1a0f2a', color: '#fff', showConfirmButton: false, timer: 2000 })
      setTimeout(() => navigate("/login"), 2000)

    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error de red', text: "No se pudo establecer conexión con el servidor de base de datos.", background: '#1a0f2a', color: '#fff', confirmButtonColor: '#F2B705' })
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', padding: '0.85rem 1.1rem' }

  return (
    <Container fluid className="vh-100 p-0" style={{ backgroundColor: '#1a0f2a' }}>
      <Row className="g-0 h-100">
        
        {/* PANEL IZQUIERDO */}
        <Col xs={12} lg={6} className="d-flex flex-column px-4 px-md-5 overflow-auto" style={{ position: 'relative', zIndex: 1, paddingBottom: '3rem', paddingTop: '3rem' }}>
          <div className="w-100 mx-auto" style={{ maxWidth: '480px' }}>
            
            {/* LOGO AQUÍ */}
            <div className="mb-4">
              <Link to="/">
                <img src="/logo.png" alt="SportClub Logo" style={{ height: '50px', width: 'auto' }} />
              </Link>
            </div>

            <h2 className="text-white text-uppercase fw-bold mb-2" style={{ letterSpacing: '1px' }}>Crear cuenta</h2>
            <p className="text-white-50 mb-4">Únete a la comunidad SportClub. Es gratis.</p>

            <Form onSubmit={handleSubmit} noValidate>
              <Form.Group className="mb-3"><Form.Label className="text-white-50 small text-uppercase fw-bold">Nombre completo *</Form.Label><Form.Control type="text" placeholder="Tu nombre completo" value={fullName} onChange={e => setFullName(e.target.value)} style={inputStyle} isInvalid={!!errors.fullName} className="shadow-none text-white" /><Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback></Form.Group>
              <Form.Group className="mb-3"><Form.Label className="text-white-50 small text-uppercase fw-bold">Correo electrónico *</Form.Label><Form.Control type="email" placeholder="tu@correo.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} isInvalid={!!errors.email} className="shadow-none text-white" /><Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback></Form.Group>
              <Row>
                <Col md={6}><Form.Group className="mb-3"><Form.Label className="text-white-50 small text-uppercase fw-bold">Contraseña *</Form.Label><Form.Control type="password" placeholder="Mínimo 8" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} isInvalid={!!errors.password} className="shadow-none text-white" /><Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback></Form.Group></Col>
                <Col md={6}><Form.Group className="mb-3"><Form.Label className="text-white-50 small text-uppercase fw-bold">Confirmar contraseña *</Form.Label><Form.Control type="password" placeholder="Repite" value={confirm} onChange={e => setConfirm(e.target.value)} style={inputStyle} isInvalid={!!errors.confirm} className="shadow-none text-white" /><Form.Control.Feedback type="invalid">{errors.confirm}</Form.Control.Feedback></Form.Group></Col>
              </Row>

              <div className="d-flex align-items-center gap-3 my-4"><div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div><span className="text-white-50 small">Opcional</span><div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div></div>

              <Row>
                <Col md={6}><Form.Group className="mb-3"><Form.Label className="text-white-50 small text-uppercase fw-bold">Nacimiento</Form.Label><Form.Control type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} style={inputStyle} className="shadow-none text-white" /></Form.Group></Col>
                <Col md={6}><Form.Group className="mb-3"><Form.Label className="text-white-50 small text-uppercase fw-bold">Deporte de interés</Form.Label><Form.Select value={sport} onChange={e => setSport(e.target.value)} style={inputStyle} className="shadow-none text-white"><option value="" style={{ backgroundColor: '#1a0f2a' }}>Elige uno</option><option value="football" style={{ backgroundColor: '#1a0f2a' }}>Fútbol</option><option value="crossfit" style={{ backgroundColor: '#1a0f2a' }}>CrossFit</option><option value="yoga" style={{ backgroundColor: '#1a0f2a' }}>Yoga</option><option value="spinning" style={{ backgroundColor: '#1a0f2a' }}>Spinning</option><option value="boxing" style={{ backgroundColor: '#1a0f2a' }}>Boxeo</option><option value="hiit" style={{ backgroundColor: '#1a0f2a' }}>HIIT</option></Form.Select></Form.Group></Col>
              </Row>

              <Form.Group className="mb-4"><Form.Label className="text-white-50 small text-uppercase fw-bold">Frecuencia semanal</Form.Label><Form.Select value={frequency} onChange={e => setFrequency(e.target.value)} style={inputStyle} className="shadow-none text-white">{[1,2,3,4,5,6,7].map(n => (<option key={n} value={n} style={{ backgroundColor: '#1a0f2a' }}>{n} día{n > 1 ? "s" : ""} por semana</option>))}</Form.Select></Form.Group>

              <Button type="submit" className="w-100 fw-bold border-0 py-3 mb-4 text-dark" style={{ backgroundColor: '#F2B705', letterSpacing: '1px' }} disabled={loading}>
                {loading ? <><Spinner size="sm" animation="border" className="me-2" /> Creando cuenta...</> : "CREAR CUENTA"}
              </Button>
            </Form>

            <div className="text-center">
              <Link to="/login" className="text-warning text-decoration-none small">← Volver al inicio de sesión</Link>
            </div>

          </div>
        </Col>

        {/* PANEL DERECHO */}
        <Col lg={6} className="d-none d-lg-flex flex-column justify-content-center align-items-center position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2E1A47 0%, #3d2460 60%, #4a2d70 100%)' }}>
          <div className="z-index-1" style={{ zIndex: 1, maxWidth: '320px' }}>
            <h1 className="text-white text-uppercase fw-bold" style={{ fontSize: '3rem', lineHeight: '1.1' }}>Únete a nuestra<br/><span style={{ color: '#F2B705' }}>comunidad.</span></h1>
            <p className="text-white-50 mt-3 mb-5" style={{ fontSize: '1rem' }}>Contamos con entrenadores especializados, programas personalizados y el mejor ambiente.</p>
            <div className="d-flex flex-column gap-3">
              {['Acceso a todas las clases', 'Seguimiento de progreso', 'Reservas online fáciles', 'Coach personalizado'].map((text, i) => (
                <div key={i} className="d-flex align-items-center gap-3 text-white-50"><span style={{ color: '#F2B705', fontSize: '1.2rem', fontWeight: 'bold' }}>✓</span><span>{text}</span></div>
              ))}
            </div>
          </div>
          <div className="position-absolute fw-bold" style={{ bottom: '-50px', right: '-20px', fontSize: '12rem', color: 'rgba(255,255,255,0.03)', lineHeight: '0.8', textAlign: 'right', pointerEvents: 'none' }}>SPORT<br/>CLUB</div>
        </Col>
      </Row>
    </Container>
  )
}