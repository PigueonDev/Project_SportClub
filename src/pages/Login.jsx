import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button, Container, Form, Spinner, Row, Col } from "react-bootstrap"
import Swal from "sweetalert2"
import { loginUser, saveSession } from "../services/authService"

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!email || !password) {
      return Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Por favor, completa ambos campos.',
        confirmButtonColor: '#F2B705',
        background: '#1a0f2a',
        color: '#fff'
      })
    }

    setLoading(true)

    try {
      const data = await loginUser({ email, password })
      saveSession(data.data.token, data.data.user)

      const role = data.data.user.role?.toLowerCase()

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      })
      Toast.fire({ icon: "success", title: "¡Ingreso exitoso!" })

      if (role === "admin") navigate("/admin/dashboard")
      else if (role === "coach") navigate("/coach/dashboard")
      else navigate("/user/dashboard")
      
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al ingresar',
        text: error.message || 'Credenciales incorrectas.',
        confirmButtonColor: '#F2B705',
        background: '#1a0f2a',
        color: '#fff'
      })
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    backgroundColor: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'white',
    padding: '0.85rem 1.1rem'
  }

  return (
    <Container fluid className="vh-100 p-0" style={{ backgroundColor: '#1a0f2a' }}>
      <Row className="g-0 h-100">
        
        {/* PANEL IZQUIERDO */}
        <Col xs={12} lg={5} className="d-flex flex-column justify-content-center px-4 px-md-5" style={{ position: 'relative', zIndex: 1 }}>
          <div className="w-100 mx-auto" style={{ maxWidth: '420px' }}>
            
            {/* LOGO AQUÍ */}
            <div className="mb-5">
              <Link to="/">
                <img src="/logo.png" alt="SportClub Logo" style={{ height: '50px', width: 'auto' }} />
              </Link>
            </div>

            <h1 className="text-white text-uppercase fw-bold mb-2" style={{ letterSpacing: '1px' }}>Bienvenido de nuevo</h1>
            <p className="text-white-50 mb-4">Ingresa tus credenciales para acceder a tu cuenta.</p>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="text-white-50 small text-uppercase fw-bold" style={{ letterSpacing: '1px' }}>Correo electrónico</Form.Label>
                <Form.Control type="email" placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} className="shadow-none text-white" />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="text-white-50 small text-uppercase fw-bold" style={{ letterSpacing: '1px' }}>Contraseña</Form.Label>
                <Form.Control type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} className="shadow-none text-white" />
              </Form.Group>

              <Button type="submit" className="w-100 fw-bold border-0 py-3 mb-4 text-dark" style={{ backgroundColor: '#F2B705', letterSpacing: '1px' }} disabled={loading}>
                {loading ? <><Spinner size="sm" animation="border" className="me-2" /> Ingresando...</> : "INICIAR SESIÓN"}
              </Button>
            </Form>

            <div className="d-flex justify-content-between align-items-center mb-5">
              <Link to="/recover" className="text-warning text-decoration-none small">¿Olvidaste tu contraseña?</Link>
              <span className="text-white-50">|</span>
              <Link to="/register" className="text-warning text-decoration-none small">Registrarse</Link>
            </div>

          </div>
        </Col>

        {/* PANEL DERECHO: VISUAL */}
        <Col lg={7} className="d-none d-lg-flex flex-column justify-content-center align-items-center position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2E1A47 0%, #3d2460 60%, #4a2d70 100%)' }}>
          <div className="text-center z-index-1" style={{ zIndex: 1 }}>
            <h1 className="text-white text-uppercase fw-bold" style={{ fontSize: '3.5rem', lineHeight: '1.1' }}>Tu mejor versión<br/><span style={{ color: '#F2B705' }}>comienza hoy.</span></h1>
            <p className="text-white-50 mt-4 mx-auto" style={{ maxWidth: '300px', fontSize: '1.1rem' }}>Somos una comunidad enfocada en el bienestar, el compromiso y la superación personal.</p>
            <div className="d-flex justify-content-center gap-5 mt-5">
              <div><div style={{ fontSize: '2.5rem', color: '#F2B705', fontWeight: 'bold' }}>1200+</div><div className="text-white-50 small">Miembros activos</div></div>
              <div><div style={{ fontSize: '2.5rem', color: '#F2B705', fontWeight: 'bold' }}>40+</div><div className="text-white-50 small">Clases semanales</div></div>
              <div><div style={{ fontSize: '2.5rem', color: '#F2B705', fontWeight: 'bold' }}>15</div><div className="text-white-50 small">Coaches expertos</div></div>
            </div>
          </div>
          <div className="position-absolute fw-bold" style={{ bottom: '-50px', right: '-20px', fontSize: '12rem', color: 'rgba(255,255,255,0.03)', lineHeight: '0.8', textAlign: 'right', pointerEvents: 'none' }}>SPORT<br/>CLUB</div>
        </Col>
      </Row>
    </Container>
  )
}