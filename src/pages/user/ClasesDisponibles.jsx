import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserSidebar from '../../components/UserSidebar';
import { getAvailableClasses } from '../../services/memberService';
import { createReservation } from '../../services/reservationsService';

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function ClasesDisponibles() {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reservingId, setReservingId] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const response = await getAvailableClasses();
      const list = Array.isArray(response) ? response : (response.data || []);
      setClasses(list);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudieron cargar las clases disponibles.',
        confirmButtonColor: '#3B82F6'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const describeSchedule = (item) => {
    if (item.day_of_week === undefined && !item.schedules) return 'Horario por confirmar';
    if (item.schedules && Array.isArray(item.schedules)) {
      return item.schedules
        .map(s => `${DAYS[s.day_of_week]?.slice(0, 3) || s.day_of_week} ${s.start_time}-${s.end_time}`)
        .join(' · ');
    }
    return `${DAYS[item.day_of_week] || ''} ${item.start_time || ''}-${item.end_time || ''}`;
  };

  const handleReserve = async (classScheduleId, sportName) => {
    const result = await Swal.fire({
      title: `¿Reservar ${sportName}?`,
      text: "Se creará tu reserva para este horario.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, reservar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    setReservingId(classScheduleId);
    try {
      await createReservation(classScheduleId);
      Swal.fire({
        icon: 'success',
        title: '¡Reserva creada!',
        text: 'Puedes revisarla en "Mis Reservas".',
        timer: 2200,
        showConfirmButton: false
      });
    } catch (error) {
      console.error(error);
      Swal.fire('No se pudo reservar', error.message || 'Intenta nuevamente más tarde.', 'error');
    } finally {
      setReservingId(null);
    }
  };

  const filteredClasses = classes.filter(c => {
    const sportName = (c.sport?.name || c.sportRoom?.sport?.name || '').toLowerCase();
    return sportName.includes(search.toLowerCase());
  });

  return (
    <Container fluid className="vh-100 p-0" style={{ backgroundColor: '#1a0f2a' }}>
      <Row className="g-0 h-100">
        <UserSidebar active="clases" />

        <Col md={10} className="p-4 p-md-5 overflow-auto">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div className="text-white">
              <h2 className="fw-bold mb-0 text-uppercase">Clases Disponibles</h2>
              <p className="text-white-50 mb-0">Explora el catálogo y reserva tu cupo</p>
            </div>
            <Badge bg="primary" className="px-3 py-2 rounded-pill text-white fw-bold">USUARIO</Badge>
          </div>

          <Card className="border-0 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h6 className="text-white-50 text-uppercase fw-bold mb-0" style={{ borderLeft: '3px solid #3B82F6', paddingLeft: '8px' }}>
                  Catálogo de Clases
                </h6>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    placeholder="Buscar por deporte..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="bg-dark text-white border-secondary"
                    style={{ maxWidth: '220px' }}
                  />
                  <Button variant="outline-light" onClick={fetchClasses} disabled={isLoading}>🔄</Button>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-4 text-white-50">
                  <Spinner animation="border" size="sm" className="me-2" />
                  Cargando clases...
                </div>
              ) : filteredClasses.length === 0 ? (
                <div className="text-center py-4 text-white-50">No hay clases disponibles por el momento.</div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {filteredClasses.map((item) => {
                    const sportName = item.sport?.name || item.sportRoom?.sport?.name || 'Clase';
                    const roomName = item.room?.name || item.sportRoom?.room?.name || '';
                    const coachName = item.coach?.full_name || item.sportRoom?.coach?.full_name || '';
                    return (
                      <div key={item.id} className="d-flex justify-content-between align-items-center p-3 rounded"
                           style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <div>
                          <h6 className="text-white fw-bold mb-1">🏋️ {sportName}</h6>
                          <small className="text-white-50">
                            {describeSchedule(item)}
                            {roomName && ` · Sala: ${roomName}`}
                            {coachName && ` · Coach: ${coachName}`}
                          </small>
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          className="fw-bold px-3 border-0"
                          disabled={reservingId === item.id}
                          onClick={() => handleReserve(item.id, sportName)}
                          style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#3B82F6' }}
                          onMouseEnter={(e) => { e.target.style.backgroundColor = '#3B82F6'; e.target.style.color = '#fff'; }}
                          onMouseLeave={(e) => { e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.2)'; e.target.style.color = '#3B82F6'; }}
                        >
                          {reservingId === item.id ? <Spinner animation="border" size="sm" /> : 'Reservar'}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
