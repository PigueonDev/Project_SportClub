import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Table, Spinner, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import CoachSidebar from '../../components/CoachSidebar';
import { getMySchedules } from '../../services/coachService';

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function MiHorario() {
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setIsLoading(true);
    try {
      const response = await getMySchedules();
      const list = Array.isArray(response) ? response : (response.data || []);
      setSchedules(list);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo cargar tu horario.',
        confirmButtonColor: '#22c55e'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Agrupamos los bloques por día para la vista de tabla semanal
  const byDay = DAYS.map((_, dayIndex) => schedules
    .filter(s => s.day_of_week === dayIndex)
    .sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''))
  );

  return (
    <Container fluid className="vh-100 p-0" style={{ backgroundColor: '#1a0f2a' }}>
      <Row className="g-0 h-100">
        <CoachSidebar active="horario" />

        <Col md={10} className="p-4 p-md-5 overflow-auto">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div className="text-white">
              <h2 className="fw-bold mb-0 text-uppercase">Mi Horario</h2>
              <p className="text-white-50 mb-0">Planificación semanal de tus clases</p>
            </div>
            <Badge bg="success" className="px-3 py-2 rounded-pill text-white fw-bold">COACH</Badge>
          </div>

          <Card className="border-0 shadow-sm mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="text-white-50 text-uppercase fw-bold mb-0" style={{ borderLeft: '3px solid #22c55e', paddingLeft: '8px' }}>
                  Vista Semanal
                </h6>
                <Button variant="outline-light" size="sm" onClick={fetchSchedules} disabled={isLoading}>🔄 Refrescar</Button>
              </div>

              {isLoading ? (
                <div className="text-center py-4 text-white-50">
                  <Spinner animation="border" size="sm" className="me-2" />
                  Cargando horario...
                </div>
              ) : (
                <Table bordered variant="dark" className="text-center align-middle" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  <thead>
                    <tr className="text-white-50">
                      {DAYS.map(d => <th key={d}>{d}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {byDay.map((dayClasses, i) => (
                        <td key={i} className="p-2" style={{ verticalAlign: 'top', minWidth: '120px' }}>
                          {dayClasses.length === 0 ? (
                            <span className="text-white-25">—</span>
                          ) : (
                            dayClasses.map(s => (
                              <div key={s.id} className="bg-success bg-opacity-25 text-success fw-bold border border-success rounded p-2 mb-2">
                                {s.sportRoom?.sport?.name || 'Clase'}
                                <br />
                                <small className="text-white-50">{s.start_time}–{s.end_time}</small>
                              </div>
                            ))
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
            <Card.Body className="p-4">
              <h6 className="text-white-50 text-uppercase fw-bold mb-4" style={{ borderLeft: '3px solid #22c55e', paddingLeft: '8px' }}>
                Detalle de Bloques
              </h6>
              <Table borderless hover variant="dark" className="bg-transparent" responsive>
                <thead>
                  <tr className="text-white-50 text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                    <th>Día</th>
                    <th>Inicio</th>
                    <th>Término</th>
                    <th>Sala</th>
                  </tr>
                </thead>
                <tbody className="align-middle">
                  {schedules.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-white-50">No tienes horarios asignados.</td>
                    </tr>
                  ) : (
                    schedules.map(s => (
                      <tr key={s.id}>
                        <td className="text-white fw-bold">{DAYS[s.day_of_week] ?? s.day_of_week}</td>
                        <td className="text-white-50">{s.start_time}</td>
                        <td className="text-white-50">{s.end_time}</td>
                        <td className="text-white-50">{s.sportRoom?.room?.name || '—'}</td>
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
