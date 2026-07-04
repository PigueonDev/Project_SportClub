import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, ListGroup, Spinner, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserSidebar from '../../components/UserSidebar';
import { getMyReservations, cancelReservation } from '../../services/reservationsService';
import { formatSpanishDate } from '../../utils/dateFormatter';

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const statusBadge = (status) => {
  const normalized = (status || '').toLowerCase();
  if (normalized === 'cancelled' || normalized === 'cancelada') {
    return <Badge bg="secondary" className="rounded-pill px-3 py-1 fw-bold">CANCELADA</Badge>;
  }
  if (normalized === 'pending' || normalized === 'pendiente') {
    return <Badge bg="warning" text="dark" className="rounded-pill px-3 py-1 fw-bold">PENDIENTE</Badge>;
  }
  return <Badge bg="primary" className="text-white rounded-pill px-3 py-1 fw-bold">{(status || 'ACTIVA').toUpperCase()}</Badge>;
};

export default function MisReservas() {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const response = await getMyReservations();
      const list = Array.isArray(response) ? response : (response.data || []);
      setReservations(list);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudieron cargar tus reservas.',
        confirmButtonColor: '#3B82F6'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const describeClass = (reservation) => {
    const cs = reservation.classSchedule || reservation.class_schedule;
    const sportName = cs?.sportRoom?.sport?.name || cs?.sport?.name || 'Clase';
    const day = DAYS[cs?.day_of_week] || '';
    const time = cs ? `${cs.start_time || ''}–${cs.end_time || ''}` : '';
    return { sportName, day, time };
  };

  const canCancel = (status) => {
    const normalized = (status || '').toLowerCase();
    return normalized !== 'cancelled' && normalized !== 'cancelada';
  };

  const handleCancel = async (id, sportName) => {
    const result = await Swal.fire({
      title: `¿Cancelar reserva de ${sportName}?`,
      text: "Esta acción liberará tu cupo en la clase.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Volver'
    });

    if (!result.isConfirmed) return;

    setCancelingId(id);
    try {
      await cancelReservation(id);
      Swal.fire('¡Cancelada!', 'Tu reserva ha sido cancelada.', 'success');
      fetchReservations();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', error.message || 'No se pudo cancelar la reserva.', 'error');
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <Container fluid className="vh-100 p-0" style={{ backgroundColor: '#1a0f2a' }}>
      <Row className="g-0 h-100">
        <UserSidebar active="reservas" />

        <Col md={10} className="p-4 p-md-5 overflow-auto">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div className="text-white">
              <h2 className="fw-bold mb-0 text-uppercase">Mis Reservas</h2>
              <p className="text-white-50 mb-0">Revisa y gestiona tus reservas activas</p>
            </div>
            <Badge bg="primary" className="px-3 py-2 rounded-pill text-white fw-bold">USUARIO</Badge>
          </div>

          <Card className="border-0 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="text-white-50 text-uppercase fw-bold mb-0" style={{ borderLeft: '3px solid #3B82F6', paddingLeft: '8px' }}>
                  Reservas
                </h6>
                <Button variant="outline-light" size="sm" onClick={fetchReservations} disabled={isLoading}>🔄 Refrescar</Button>
              </div>

              {isLoading ? (
                <div className="text-center py-4 text-white-50">
                  <Spinner animation="border" size="sm" className="me-2" />
                  Cargando reservas...
                </div>
              ) : reservations.length === 0 ? (
                <div className="text-center py-4 text-white-50">Aún no tienes reservas.</div>
              ) : (
                <ListGroup variant="flush">
                  {reservations.map((r) => {
                    const { sportName, day, time } = describeClass(r);
                    return (
                      <ListGroup.Item key={r.id} className="bg-transparent px-0 py-3 border-secondary d-flex align-items-center gap-3 flex-wrap">
                        <div className="rounded-circle bg-primary" style={{ width: '8px', height: '8px' }}></div>
                        <div className="flex-grow-1">
                          <h6 className="mb-0 fw-bold text-white">🏋️ {sportName}</h6>
                          <small className="text-white-50">
                            {day} · {time}
                            {r.created_at && ` · Reservada el ${formatSpanishDate(r.created_at)}`}
                          </small>
                        </div>
                        {statusBadge(r.status)}
                        {canCancel(r.status) && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            disabled={cancelingId === r.id}
                            onClick={() => handleCancel(r.id, sportName)}
                          >
                            {cancelingId === r.id ? <Spinner animation="border" size="sm" /> : 'Cancelar'}
                          </Button>
                        )}
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
