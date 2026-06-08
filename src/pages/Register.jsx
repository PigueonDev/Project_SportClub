import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Alert, Button, Card, Col, Container,
  Form, Row, Spinner
} from "react-bootstrap"

const API = "http://localhost:3000/api/auth"

function Register() {
  const navigate = useNavigate()

  // Campos obligatorios
  const [fullName,  setFullName]  = useState("")
  const [email,     setEmail]     = useState("")
  const [password,  setPassword]  = useState("")
  const [confirm,   setConfirm]   = useState("")

  // Campos opcionales
  const [birthDate, setBirthDate] = useState("")
  const [sport,     setSport]     = useState("")
  const [frequency, setFrequency] = useState("3")

  // Estado UI
  const [errors,   setErrors]   = useState({})
  const [error,    setError]    = useState("")
  const [success,  setSuccess]  = useState("")
  const [loading,  setLoading]  = useState(false)

  // ── VALIDACIÓN ────────────────────────────────────────
  function validar() {
    const errs = {}
    
    // Validaciones de Nombre completo
    if (!fullName.trim()) {
      errs.fullName = "El nombre es obligatorio"
    } else if (fullName.trim().split(/\s+/).length < 2) {
      errs.fullName = "Ingresa al menos nombre y apellido"
    } else if (fullName.length > 70) {
      errs.fullName = "El nombre no puede superar los 70 caracteres"
    }
    
    // Validaciones de Correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      errs.email = "El email es obligatorio"
    } else if (email.length > 60) {
      errs.email = "El email no puede superar los 60 caracteres"
    } else if (!emailRegex.test(email)) {
      errs.email = "El email no es válido"
    }


    // Validaciones de Contraseña
    if (password.length < 8) {
      errs.password = "Mínimo 8 caracteres"
    }
    if (password !== confirm) {
      errs.confirm = "Las contraseñas no coinciden"
    }
    
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // ── ENVIAR REGISTRO ───────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    if (!validar()) return

    setLoading(true)
    try {
      const body = {
        full_name: fullName,
        email,
        password,
        role: "user",                       // siempre user al registrarse
        must_change_password: false,
        birth_date: birthDate || "2000-01-01",
        metadata: {
          sports: sport
            ? [{ name: sport, frequency_per_week: parseInt(frequency) }]
            : []
        }
      }

      const res  = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Error al registrar. Intenta de nuevo.")
        return
      }

      setSuccess("¡Cuenta creada con éxito! Redirigiendo al login...")
      setTimeout(() => navigate("/login"), 2000)

    } catch {
      setError("No se pudo conectar con el servidor.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={7} lg={6}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <h4 className="text-center mb-1 fw-bold">Crear cuenta</h4>
              <p className="text-center text-muted mb-4">Únete a la comunidad SportClub</p>

              {error   && <Alert variant="danger"  dismissible onClose={() => setError("")}>{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit} noValidate>

                {/* ── OBLIGATORIOS ── */}
                <Form.Group className="mb-3">
                  <Form.Label>Nombre completo <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Tu nombre completo"
                    maxLength={70}
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    isInvalid={!!errors.fullName}
                  />
                  <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Correo electrónico <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="tu@correo.com"
                    maxLength={60}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Contraseña <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Mínimo 8 caracteres"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        isInvalid={!!errors.password}
                      />
                      <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirmar contraseña <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Repite tu contraseña"
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                        isInvalid={!!errors.confirm}
                      />
                      <Form.Control.Feedback type="invalid">{errors.confirm}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* ── OPCIONALES ── */}
                <hr />
                <p className="text-muted small mb-3">Información adicional (opcional)</p>

                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Fecha de nacimiento</Form.Label>
                      <Form.Control
                        type="date"
                        value={birthDate}
                        onChange={e => setBirthDate(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Deporte de interés</Form.Label>
                      <Form.Select value={sport} onChange={e => setSport(e.target.value)}>
                        <option value="">Elige uno</option>
                        <option value="football">Fútbol</option>
                        <option value="crossfit">CrossFit</option>
                        <option value="yoga">Yoga</option>
                        <option value="spinning">Spinning</option>
                        <option value="boxing">Boxeo</option>
                        <option value="hiit">HIIT</option>
                        <option value="other">Otro</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label>Frecuencia semanal</Form.Label>
                  <Form.Select value={frequency} onChange={e => setFrequency(e.target.value)}>
                    {[1,2,3,4,5,6,7].map(n => (
                      <option key={n} value={n}>{n} día{n > 1 ? "s" : ""} por semana</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Button type="submit" variant="warning" className="w-100 fw-bold" disabled={loading}>
                  {loading
                    ? <><Spinner size="sm" animation="border" /> Creando cuenta...</>
                    : "Crear cuenta"
                  }
                </Button>
              </Form>

              <div className="text-center mt-3">
                <small className="text-muted">
                  ¿Ya tienes cuenta?{" "}
                  <Link to="/login" className="text-decoration-none">Iniciar sesión</Link>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Register
