import { getUser } from "../../services/authService"
import { Card, Row, Col, Badge, ListGroup } from "react-bootstrap"

function UserDashboard() {
  const user = getUser()

  return (
    <div>
      {/* Bienvenida */}
      <h4 className="mb-4">
        Bienvenido, <strong>{user?.full_name || user?.name}</strong> 👋
      </h4>

      {/* Stats */}
      <Row className="mb-4 g-3">
        {[
          { label: "Clases este mes", value: "12", color: "primary" },
          { label: "Reservas activas", value: "3",  color: "success" },
          { label: "Asistencia",       value: "87%", color: "warning" },
          { label: "Semanas seguidas", value: "6",  color: "info"    },
        ].map((s) => (
          <Col key={s.label} xs={6} md={3}>
            <Card className="text-center h-100 shadow-sm">
              <Card.Body>
                <h2 className={`text-${s.color} fw-bold`}>{s.value}</h2>
                <small className="text-muted">{s.label}</small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-3">
        {/* Mi Perfil */}
        <Col md={5}>
          <Card className="shadow-sm h-100">
            <Card.Header className="fw-bold">🙍 Mi Perfil</Card.Header>
            <Card.Body>
              <p className="mb-1"><strong>Nombre:</strong> {user?.full_name || user?.name}</p>
              <p className="mb-1"><strong>Email:</strong> {user?.email}</p>
              <p className="mb-1">
                <strong>Rol:</strong>{" "}
                <Badge bg="success">{user?.role}</Badge>
              </p>
            </Card.Body>
          </Card>
        </Col>

        {/* Mis Reservas */}
        <Col md={7}>
          <Card className="shadow-sm h-100">
            <Card.Header className="fw-bold">📅 Mis Reservas</Card.Header>
            <ListGroup variant="flush">
              {[
                { clase: "Clase de CrossFit", fecha: "Lunes 14 Abr · 18:00", estado: "Confirmada", color: "success" },
                { clase: "Spinning Cardio",   fecha: "Miércoles 16 Abr · 07:00", estado: "Confirmada", color: "success" },
                { clase: "HIIT Power",        fecha: "Viernes 18 Abr · 19:00", estado: "Pendiente",  color: "warning" },
              ].map((r) => (
                <ListGroup.Item key={r.clase} className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-semibold">{r.clase}</div>
                    <small className="text-muted">{r.fecha}</small>
                  </div>
                  <Badge bg={r.color}>{r.estado}</Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        {/* Clases disponibles */}
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="fw-bold">🏋️ Clases Disponibles</Card.Header>
            <ListGroup variant="flush">
              {[
                { nombre: "🏋️ CrossFit Matutino", horario: "Lun, Mié, Vie · 07:00–08:00", coach: "Roberto Silva" },
                { nombre: "🧘 Yoga Flow",          horario: "Mar, Jue · 08:30–09:30",      coach: "Ana López"     },
                { nombre: "🚴 Spinning Cardio",    horario: "Lun, Mié · 18:00–19:00",      coach: "Carlos Pinto"  },
                { nombre: "💥 HIIT Power",         horario: "Mar, Jue, Vie · 19:00–20:00", coach: "María Torres"  },
                { nombre: "🥊 Boxeo Funcional",    horario: "Sábado · 10:00–11:30",        coach: "Diego Morales" },
              ].map((c) => (
                <ListGroup.Item key={c.nombre} className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-semibold">{c.nombre}</div>
                    <small className="text-muted">{c.horario} · Coach: {c.coach}</small>
                  </div>
                  <Badge bg="primary" style={{ cursor: "pointer" }}>Reservar</Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default UserDashboard
