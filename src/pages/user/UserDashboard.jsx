import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, ListGroup, Button, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../../services/authService';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Cargando...', email: '...', initials: '?' });

  useEffect(() => {
    // Conectamos los datos del usuario logueado desde la sesión real de la API
    const currentUser = getUser(); 
    const getInitials = (name) => {
      if (!name) return "?";
      return name.split(" ").map(w => w[0] || "").join("").toUpperCase().slice(0, 2);
    };

    if (currentUser) {
      const userName = currentUser.full_name || currentUser.name || 'Usuario Demo';
      const userEmail = currentUser.email || 'usuario@demo.cl';
      
      setUser({
        name: userName,
        email: userEmail,
        initials: getInitials(userName)
      });
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Container fluid className="vh-100 p-0" style={{ backgroundColor: '#1a0f2a' }}>
      <Row className="g-0 h-100">
        
        {/* SIDEBAR USER - TOTALMENTE DINÁMICO */}
        <Col md={2} className="d-flex flex-column p-3 shadow" style={{ backgroundColor: '#2E1A47' }}>
          <div className="mb-4 px-2 text-center">
            <img src="/logo.png" alt="SportClub Logo" style={{ height: '50px', width: 'auto' }} />
          </div>

          <div className="d-flex align-items-center gap-3 mb-4 px-2 pb-3 border-bottom border-secondary">
            <div className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold shadow-sm" 
                 style={{ width: '45px', height: '45px', background: 'linear-gradient(135deg, #3d2460, #F2B705)' }}>
              {user.initials}
            </div>
            <div className="text-white">
              {/* Nombre real e iniciales conectados directamente al menú */}
              <div className="fw-semibold lh-1" style={{ fontSize: '0.9rem' }}>{user.name}</div>
              <small className="text-white-50" style={{ fontSize: '0.75rem' }}>Usuario</small>
            </div>
          </div>

          <Nav className="flex-column mb-auto gap-1">
            <Button variant="primary" className="text-start border-0 text-white fw-semibold mb-1" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}>
              🏠 Inicio
            </Button>
            <Button variant="link" className="text-start text-white-50 text-decoration-none hover-white">📅 Reservas</Button>
            <Button variant="link" className="text-start text-white-50 text-decoration-none hover-white">🏃 Clases</Button>
            <Button variant="link" className="text-start text-white-50 text-decoration-none hover-white">📈 Mi Progreso</Button>
          </Nav>

          <div className="mt-auto pt-3 border-top border-secondary d-flex flex-column gap-2">
            <Button variant="link" className="text-start text-warning text-decoration-none" onClick={() => navigate("/user/perfil")}>
              ✏️ Editar perfil
            </Button>
            <Button variant="link" className="text-start text-danger text-decoration-none" onClick={handleLogout}>
              ↩ Cerrar sesión
            </Button>
          </div>
        </Col>

        {/* MAIN CONTENT */}
        <Col md={10} className="p-4 p-md-5 overflow-auto">
          
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div className="text-white">
              <h2 className="fw-bold mb-0 text-uppercase">Mi Panel</h2>
              <p className="text-white-50 mb-0">Bienvenido, <strong>{user.name}</strong></p>
            </div>
            <Badge bg="primary" className="px-3 py-2 rounded-pill text-white fw-bold">USUARIO</Badge>
          </div>

          {/* STATS */}
          <Row className="mb-4 g-3">
            {[ 
              { value: '12', label: 'Clases este mes' },
              { value: '3', label: 'Reservas activas' },
              { value: '87%', label: 'Asistencia' },
              { value: '6', label: 'Semanas seguidas' }
            ].map((stat, i) => (
              <Col xs={6} md={3} key={i}>
                <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                  <Card.Body className="p-4">
                    <h2 className="text-primary fw-bold mb-1">{stat.value}</h2>
                    <small className="text-white-50 text-uppercase fw-semibold" style={{ letterSpacing: '0.5px' }}>{stat.label}</small>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <Row className="g-4 mb-4">
            {/* CARD MI PERFIL */}
            <Col md={6}>
              <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                <Card.Body className="p-4 d-flex flex-column justify-content-between">
                  <div>
                    <h6 className="text-white-50 text-uppercase fw-bold mb-4" style={{ borderLeft: '3px solid #3B82F6', paddingLeft: '8px' }}>Mi Perfil</h6>
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle d-flex justify-content-center align-items-center text-white shadow-sm" 
                           style={{ width: '60px', height: '60px', fontSize: '1.4rem', background: 'linear-gradient(135deg, #3d2460, #F2B705)', fontWeight: 'bold' }}>
                        {user.initials}
                      </div>
                      <div>
                        <h5 className="mb-0 fw-bold text-white">{user.name}</h5>
                        <p className="text-white-50 mb-2" style={{ fontSize: '0.85rem' }}>{user.email}</p>
                        <div className="d-flex gap-2">
                          <Badge bg="warning" text="dark" className="rounded-pill px-2 py-1 text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>CrossFit</Badge>
                          <Badge bg="secondary" className="rounded-pill px-2 py-1 text-uppercase fw-bold text-white" style={{ fontSize: '0.7rem', backgroundColor: 'rgba(255,255,255,0.15)' }}>Intermedio</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                      <small className="text-white-50 text-uppercase d-block mb-1" style={{ fontSize: '0.75rem', fontWeight: '600' }}>Objetivo personal</small>
                      <p className="text-white mb-0" style={{ fontSize: '0.9rem' }}>Ganar masa muscular y mejorar resistencia</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <Button variant="link" className="p-0 text-primary text-decoration-none" style={{ fontSize: '0.85rem' }} onClick={() => navigate("/user/perfil")}>
                      ✏️ Editar perfil y foto →
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* CARD MIS RESERVAS */}
            <Col md={6}>
              <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                <Card.Body className="p-4">
                  <h6 className="text-white-50 text-uppercase fw-bold mb-4" style={{ borderLeft: '3px solid #3B82F6', paddingLeft: '8px' }}>Mis Reservas</h6>
                  
                  <ListGroup variant="flush">
                    <ListGroup.Item className="bg-transparent px-0 py-3 border-secondary d-flex align-items-center gap-3">
                      <div className="rounded-circle bg-primary" style={{ width: '8px', height: '8px' }}></div>
                      <div className="flex-grow-1">
                        <h6 className="mb-0 fw-bold text-white">Clase de CrossFit</h6>
                        <small className="text-white-50">Lunes 14 Abr · 18:00</small>
                      </div>
                      <Badge bg="primary" className="text-white rounded-pill px-3 py-1 fw-bold">CONFIRMADA</Badge>
                    </ListGroup.Item>
                    
                    <ListGroup.Item className="bg-transparent px-0 py-3 border-secondary d-flex align-items-center gap-3">
                      <div className="rounded-circle bg-primary" style={{ width: '8px', height: '8px' }}></div>
                      <div className="flex-grow-1">
                        <h6 className="mb-0 fw-bold text-white">Spinning Cardio</h6>
                        <small className="text-white-50">Miércoles 16 Abr · 07:00</small>
                      </div>
                      <Badge bg="primary" className="text-white rounded-pill px-3 py-1 fw-bold">CONFIRMADA</Badge>
                    </ListGroup.Item>

                    <ListGroup.Item className="bg-transparent px-0 py-3 border-0 d-flex align-items-center gap-3">
                      <div className="rounded-circle bg-warning" style={{ width: '8px', height: '8px' }}></div>
                      <div className="flex-grow-1">
                        <h6 className="mb-0 fw-bold text-white">HIIT Power</h6>
                        <small className="text-white-50">Viernes 18 Abr · 19:00</small>
                      </div>
                      {/* Corregido el contraste: texto oscuro sobre fondo amarillo */}
                      <Badge bg="warning" text="dark" className="rounded-pill px-3 py-1 fw-bold">PENDIENTE</Badge>
                    </ListGroup.Item>
                  </ListGroup>
                  
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* CLASES DISPONIBLES */}
          <Card className="border-0 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
            <Card.Body className="p-4">
              <h6 className="text-white-50 text-uppercase fw-bold mb-4" style={{ borderLeft: '3px solid #3B82F6', paddingLeft: '8px' }}>Clases Disponibles</h6>
              <div className="d-flex flex-column gap-2">
                {[
                  { name: '🏋️ CrossFit Matutino', time: 'Lun, Mié, Vie · 07:00–08:00 · Coach: Roberto Silva' },
                  { name: '🧘 Yoga Flow', time: 'Mar, Jue · 08:30–09:30 · Coach: Ana López' },
                  { name: '🚴 Spinning Cardio', time: 'Lun, Mié · 18:00–19:00 · Coach: Carlos Pinto' },
                  { name: '💥 HIIT Power', time: 'Mar, Jue, Vie · 19:00–20:00 · Coach: María Torres' },
                  { name: '🥊 Boxeo Funcional', time: 'Sábado · 10:00–11:30 · Coach: Diego Morales' }
                ].map((item, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center p-3 rounded" 
                       style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div>
                      <h6 className="text-white fw-bold mb-1">{item.name}</h6>
                      <small className="text-white-50">{item.time}</small>
                    </div>
                    <Button variant="primary" size="sm" className="fw-bold px-3 border-0" 
                            style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#3B82F6' }} 
                            onMouseEnter={(e) => { e.target.style.backgroundColor = '#3B82F6'; e.target.style.color = '#fff'; }}
                            onMouseLeave={(e) => { e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.2)'; e.target.style.color = '#3B82F6'; }}>
                      Reservar
                    </Button>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

        </Col>
      </Row>
    </Container>
  );
}