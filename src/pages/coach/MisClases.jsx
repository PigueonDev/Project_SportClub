import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Table, Spinner, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import CoachSidebar from '../../components/CoachSidebar';
import { getMyClasses } from '../../services/coachService';

export default function MisClases() {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const response = await getMyClasses();
      const list = Array.isArray(response) ? response : (response.data || []);
      setClasses(list);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudieron cargar tus clases.',
        confirmButtonColor: '#22c55e'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="vh-100 p-0" style={{ backgroundColor: '#1a0f2a' }}>
      <Row className="g-0 h-100">
        <CoachSidebar active="clases" />

        <Col md={10} className="p-4 p-md-5 overflow-auto">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div className="text-white">
              <h2 className="fw-bold mb-0 text-uppercase">Mis Clases</h2>
              <p className="text-white-50 mb-0">Clases (deporte + sala) que tienes a tu cargo</p>
            </div>
            <Badge bg="success" className="px-3 py-2 rounded-pill text-white fw-bold">COACH</Badge>
          </div>

          <Card className="border-0 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="text-white fw-bold mb-0">📋 Clases Asignadas</h4>
                <Button variant="outline-light" onClick={fetchClasses} disabled={isLoading}>🔄 Refrescar</Button>
              </div>

              <Table borderless hover variant="dark" className="bg-transparent" responsive>
                <thead>
                  <tr className="text-white-50 text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                    <th>Deporte</th>
                    <th>Sala</th>
                    <th>Ubicación</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody className="align-middle">
                  {isLoading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-white-50">
                        <Spinner animation="border" size="sm" className="me-2" />
                        Cargando clases...
                      </td>
                    </tr>
                  ) : classes.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-white-50">No tienes clases asignadas actualmente.</td>
                    </tr>
                  ) : (
                    classes.map((c) => (
                      <tr key={c.id}>
                        <td className="text-white fw-bold">🏋️ {c.sport?.name || `Deporte #${c.sport_id}`}</td>
                        <td className="text-white-50">{c.room?.name || `Sala #${c.room_id}`}</td>
                        <td className="text-white-50">{c.room?.location || '—'}</td>
                        <td>
                          {c.status
                            ? <Badge bg="success">Activa</Badge>
                            : <Badge bg="secondary">Inactiva</Badge>}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
