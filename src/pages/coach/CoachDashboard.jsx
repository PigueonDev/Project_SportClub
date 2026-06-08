import { getUser } from "../../services/authService"
import { Badge, Card, Col, ListGroup, Row, Table } from "react-bootstrap"

function CoachDashboard() {
  const user = getUser()

  const alumnos = [
    { nombre: "Juan Martínez",  email: "juan.m@email.com",     nivel: "Intermedio"  },
    { nombre: "Valeria Soto",   email: "v.soto@email.com",     nivel: "Principiante"},
    { nombre: "Diego Reyes",    email: "d.reyes@email.com",    nivel: "Avanzado"    },
    { nombre: "Camila Fuentes", email: "c.fuentes@email.com",  nivel: "Principiante"},
    { nombre: "Andrés Mora",    email: "a.mora@email.com",     nivel: "Intermedio"  },
  ]

  const nivelColor = { Avanzado:"success", Intermedio:"primary", Principiante:"warning" }

  const clases = [
    { nombre: "🏋️ CrossFit Matutino", horario: "Lun, Mié, Vie · 07:00–08:00", estado: "Activa",  color: "success" },
    { nombre: "💥 HIIT Avanzado",      horario: "Mar, Jue · 19:00–20:00",      estado: "Activa",  color: "success" },
    { nombre: "🥊 Funcional Total",    horario: "Sábado · 09:00–10:30",        estado: "Próxima", color: "warning" },
  ]

  return (
    <div>
      <h4 className="mb-1">Panel de Entrenador</h4>
      <p className="text-muted mb-4">
        Bienvenido, Coach <strong>{user?.full_name || user?.name}</strong> 👋
      </p>

      {/* Stats */}
      <Row className="mb-4 g-3">
        {[
          { label: "Alumnos activos",  value: "24",  color: "success" },
          { label: "Clases asignadas", value: "5",   color: "primary" },
          { label: "Horas este mes",   value: "38",  color: "warning" },
          { label: "Satisfacción",     value: "96%", color: "info"    },
        ].map((s) => (
          <Col key={s.label} xs={6} md={3}>
            <Card className="text-center shadow-sm h-100">
              <Card.Body>
                <h2 className={`text-${s.color} fw-bold`}>{s.value}</h2>
                <small className="text-muted">{s.label}</small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-3">
        {/* Tabla alumnos */}
        <Col md={7}>
          <Card className="shadow-sm h-100">
            <Card.Header className="fw-bold">👥 Mis Alumnos</Card.Header>
            <Card.Body className="p-0">
              <Table hover responsive className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Nivel</th>
                  </tr>
                </thead>
                <tbody>
                  {alumnos.map((a) => (
                    <tr key={a.email}>
                      <td><strong>{a.nombre}</strong></td>
                      <td className="text-muted small">{a.email}</td>
                      <td>
                        <Badge bg={nivelColor[a.nivel] || "secondary"}>{a.nivel}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Clases asignadas */}
        <Col md={5}>
          <Card className="shadow-sm h-100">
            <Card.Header className="fw-bold">📋 Clases Asignadas</Card.Header>
            <ListGroup variant="flush">
              {clases.map((c) => (
                <ListGroup.Item key={c.nombre} className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-semibold small">{c.nombre}</div>
                    <small className="text-muted">{c.horario}</small>
                  </div>
                  <Badge bg={c.color}>{c.estado}</Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        {/* Horario semanal */}
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="fw-bold">🗓️ Mi Horario Semanal</Card.Header>
            <Card.Body className="p-0">
              <Table bordered responsive className="mb-0 text-center small">
                <thead className="table-light">
                  <tr>
                    <th>Horario</th>
                    <th>Lunes</th>
                    <th>Martes</th>
                    <th>Miércoles</th>
                    <th>Jueves</th>
                    <th>Viernes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="fw-semibold text-muted">07:00</td>
                    <td><Badge bg="warning" text="dark">CrossFit</Badge></td>
                    <td>—</td>
                    <td><Badge bg="warning" text="dark">CrossFit</Badge></td>
                    <td>—</td>
                    <td><Badge bg="warning" text="dark">CrossFit</Badge></td>
                  </tr>
                  <tr>
                    <td className="fw-semibold text-muted">19:00</td>
                    <td>—</td>
                    <td><Badge bg="success">HIIT</Badge></td>
                    <td>—</td>
                    <td><Badge bg="success">HIIT</Badge></td>
                    <td>—</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default CoachDashboard
