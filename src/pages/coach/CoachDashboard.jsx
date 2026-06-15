import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Table, Button, Nav, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../../services/authService';

export default function CoachDashboard() {
  const navigate = useNavigate();
  
  // Estado para el Coach logueado de forma real
  const [coachUser, setCoachUser] = useState({ name: 'Cargando...', initials: '?' });
  
  // Estados para los alumnos provenientes de la base de datos
  const [studentsList, setStudentsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:3000/api/users";

  // Función para obtener las iniciales del nombre real
  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(w => w[0] || "").join("").toUpperCase().slice(0, 2);
  };

  useEffect(() => {
    // 1. Conectamos los datos del perfil del menú lateral con la sesión real
    const currentUser = getUser(); 
    if (currentUser) {
      const userName = currentUser.full_name || currentUser.name || 'Coach';
      setCoachUser({
        name: userName,
        initials: getInitials(userName)
      });
    }

    // 2. Traemos todos los alumnos de la base de datos
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(API_URL, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      
      const allUsers = Array.isArray(data) ? data : (data.data || data.users || []);
      
      // Filtramos en tiempo real para quedarnos SOLO con los alumnos (role === 'user')
      const studentsOnly = allUsers.filter(u => u.role === 'user');
      setStudentsList(studentsOnly);
    } catch (error) {
      console.error("Error al cargar los alumnos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Container fluid className="vh-100 p-0" style={{ backgroundColor: '#1a0f2a' }}>
      <Row className="g-0 h-100">
        
        {/* SIDEBAR COACH - CONECTADO A LA API */}
        <Col md={2} className="d-flex flex-column p-3 shadow" style={{ backgroundColor: '#2E1A47' }}>
          <div className="mb-4 px-2 text-center">
            <img src="/logo.png" alt="SportClub Logo" style={{ height: '50px', width: 'auto' }} />
          </div>

          <div className="d-flex align-items-center gap-3 mb-4 px-2 pb-3 border-bottom border-secondary">
            <div className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold shadow-sm" 
                 style={{ width: '45px', height: '45px', background: 'linear-gradient(135deg, #3d2460, #F2B705)' }}>
              {coachUser.initials}
            </div>
            <div className="text-white">
              {/* Nombre dinámico traído desde la API */}
              <div className="fw-semibold lh-1" style={{ fontSize: '0.9rem' }}>{coachUser.name}</div>
              <small className="text-white-50" style={{ fontSize: '0.75rem' }}>Coach</small>
            </div>
          </div>

          <Nav className="flex-column mb-auto gap-1">
            <Button variant="success" className="text-start border-0 text-white fw-semibold mb-1" style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)' }}>
              🏠 Inicio
            </Button>
            <Button variant="link" className="text-start text-white-50 text-decoration-none hover-white">👥 Mis Alumnos</Button>
            <Button variant="link" className="text-start text-white-50 text-decoration-none hover-white">📋 Clases</Button>
            <Button variant="link" className="text-start text-white-50 text-decoration-none hover-white">📊 Reportes</Button>
          </Nav>

          <div className="mt-auto pt-3 border-top border-secondary d-flex flex-column gap-2">
            <Button variant="link" className="text-start text-warning text-decoration-none">✏️ Editar perfil</Button>
            <Button variant="link" className="text-start text-danger text-decoration-none" onClick={handleLogout}>↩ Cerrar sesión</Button>
          </div>
        </Col>

        {/* MAIN CONTENT COACH */}
        <Col md={10} className="p-4 p-md-5 overflow-auto">
          
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div className="text-white">
              <h2 className="fw-bold mb-0 text-uppercase">Panel de Entrenador</h2>
              <p className="text-white-50 mb-0">Bienvenido, Coach <strong>{coachUser.name}</strong></p>
            </div>
            <Badge bg="success" className="px-3 py-2 rounded-pill text-white fw-bold">COACH</Badge>
          </div>

          {/* STATS - EL CONTADOR DE ALUMNOS AHORA ES REAL */}
          <Row className="mb-4 g-3">
            <Col xs={6} md={3}>
              <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                <Card.Body className="p-4">
                  {/* Total dinámico basado en la BD */}
                  <h2 className="text-success fw-bold mb-1">{studentsList.length}</h2>
                  <small className="text-white-50 text-uppercase fw-semibold" style={{ letterSpacing: '0.5px' }}>Alumnos activos</small>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} md={3}><Card className="border-0 shadow-sm h-100" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}><Card.Body className="p-4"><h2 className="text-success fw-bold mb-1">5</h2><small className="text-white-50 text-uppercase fw-semibold">Clases asignadas</small></Card.Body></Card></Col>
            <Col xs={6} md={3}><Card className="border-0 shadow-sm h-100" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}><Card.Body className="p-4"><h2 className="text-success fw-bold mb-1">38</h2><small className="text-white-50 text-uppercase fw-semibold">Horas este mes</small></Card.Body></Card></Col>
            <Col xs={6} md={3}><Card className="border-0 shadow-sm h-100" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}><Card.Body className="p-4"><h2 className="text-success fw-bold mb-1">96%</h2><small className="text-white-50 text-uppercase fw-semibold">Satisfacción</small></Card.Body></Card></Col>
          </Row>

          <Row className="g-4 mb-4">
            {/* TABLA DE ALUMNOS CONECTADA CON LA API */}
            <Col md={6}>
              <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                <Card.Body className="p-4">
                  <h6 className="text-white-50 text-uppercase fw-bold mb-4" style={{ borderLeft: '3px solid #22c55e', paddingLeft: '8px' }}>Mis Alumnos</h6>
                  
                  <Table borderless hover variant="dark" className="bg-transparent" size="sm" responsive>
                    <thead>
                      <tr className="text-white-50">
                        <th>Nombre</th><th>Correo</th><th>Rol</th><th></th>
                      </tr>
                    </thead>
                    <tbody className="align-middle">
                      {isLoading ? (
                        <tr>
                          <td colSpan="4" className="text-center py-3 text-white-50">
                            <Spinner animation="border" size="sm" className="me-2" />
                            Cargando alumnos...
                          </td>
                        </tr>
                      ) : studentsList.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center py-3 text-white-50">
                            No tienes alumnos registrados actualmente.
                          </td>
                        </tr>
                      ) : (
                        // Mapeo dinámico de los usuarios traídos del backend
                        studentsList.map((student) => {
                          const studentName = student.full_name || student.name || 'Alumno';
                          return (
                            <tr key={student.id}>
                              <td className="text-white fw-bold">
                                <div className="d-flex align-items-center gap-2">
                                  <div className="rounded-circle d-flex justify-content-center align-items-center text-white font-weight-bold" 
                                       style={{ width: '28px', height: '28px', backgroundColor: 'rgba(59, 130, 246, 0.25)', fontSize: '0.75rem' }}>
                                    {getInitials(studentName)}
                                  </div>
                                  {studentName}
                                </div>
                              </td>
                              <td className="text-white-50">{student.email}</td>
                              <td><Badge bg="primary" className="rounded-pill text-white">USUARIO</Badge></td>
                              <td><Button variant="outline-light" size="sm" className="border-0">Ver</Button></td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>

            {/* CLASES ASIGNADAS */}
            <Col md={6}>
              <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                <Card.Body className="p-4">
                  <h6 className="text-white-50 text-uppercase fw-bold mb-4" style={{ borderLeft: '3px solid #22c55e', paddingLeft: '8px' }}>Clases Asignadas</h6>
                  
                  <div className="d-flex justify-content-between align-items-center mb-3 p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                    <div>
                      <h6 className="text-white fw-bold mb-0">🏋️ CrossFit Matutino</h6>
                      <small className="text-white-50">Lun, Mié, Vie · 07:00–08:00</small>
                    </div>
                    <Badge bg="success" className="text-white p-2 rounded-3">Activa</Badge>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3 p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                    <div>
                      <h6 className="text-white fw-bold mb-0">💥 HIIT Avanzado</h6>
                      <small className="text-white-50">Mar, Jue · 19:00–20:00</small>
                    </div>
                    <Badge bg="success" className="text-white p-2 rounded-3">Activa</Badge>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                    <div>
                      <h6 className="text-white fw-bold mb-0">🥊 Funcional Total</h6>
                      <small className="text-white-50">Sábado · 09:00–10:30</small>
                    </div>
                    <Badge bg="warning" text="dark" className="p-2 rounded-3 fw-bold">Próxima</Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* HORARIO SEMANAL */}
          <Card className="border-0 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
            <Card.Body className="p-4">
              <h6 className="text-white-50 text-uppercase fw-bold mb-4" style={{ borderLeft: '3px solid #22c55e', paddingLeft: '8px' }}>Mi Horario Semanal</h6>
              <Table bordered variant="dark" className="text-center align-middle" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <thead>
                  <tr className="text-white-50">
                    <th className="bg-transparent border-0"></th>
                    <th>Lunes</th><th>Martes</th><th>Miércoles</th><th>Jueves</th><th>Viernes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-white-50 border-0">07:00</td>
                    <td className="bg-success bg-opacity-25 text-success fw-bold border-success">CrossFit<br/><small className="text-white-50">1h</small></td>
                    <td></td>
                    <td className="bg-success bg-opacity-25 text-success fw-bold border-success">CrossFit<br/><small className="text-white-50">1h</small></td>
                    <td></td>
                    <td className="bg-success bg-opacity-25 text-success fw-bold border-success">CrossFit<br/><small className="text-white-50">1h</small></td>
                  </tr>
                  <tr>
                    <td className="text-white-50 border-0">11:00</td>
                    <td></td><td></td><td></td><td></td><td></td>
                  </tr>
                  <tr>
                    <td className="text-white-50 border-0">19:00</td>
                    <td></td>
                    <td className="bg-success bg-opacity-25 text-success fw-bold border-success">HIIT<br/><small className="text-white-50">1h</small></td>
                    <td></td>
                    <td className="bg-success bg-opacity-25 text-success fw-bold border-success">HIIT<br/><small className="text-white-50">1h</small></td>
                    <td></td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>

        </Col>
      </Row>
    </Container>
  );
}