import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, Form, Badge, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import AdminSidebar from '../../components/AdminSidebar';
import { getClassSchedules, createClassSchedule, updateClassSchedule, deleteClassSchedule } from '../../services/classSchedulesService';
import { getSportRooms } from '../../services/sportRoomsService';

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const emptyForm = { sport_room_id: '', day_of_week: '', start_time: '', end_time: '', status: true };

export default function GestionHorarios() {
  const [schedules, setSchedules] = useState([]);
  const [sportRooms, setSportRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const asList = (response) => Array.isArray(response) ? response : (response.data || []);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [schedulesRes, sportRoomsRes] = await Promise.all([
        getClassSchedules(),
        getSportRooms()
      ]);
      setSchedules(asList(schedulesRes));
      setSportRooms(asList(sportRoomsRes));
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudieron cargar los horarios.',
        confirmButtonColor: '#F2B705'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const describeAssignment = (sportRoomId, item) => {
    if (item?.sportRoom) {
      return `${item.sportRoom.sport?.name || 'Deporte'} · ${item.sportRoom.room?.name || 'Sala'}`;
    }
    const sr = sportRooms.find(sr => sr.id === sportRoomId);
    if (!sr) return '—';
    return `${sr.sport?.name || `Deporte #${sr.sport_id}`} · ${sr.room?.name || `Sala #${sr.room_id}`}`;
  };

  const openNewModal = () => {
    setIsEditing(false);
    setEditId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (schedule) => {
    setIsEditing(true);
    setEditId(schedule.id);
    setForm({
      sport_room_id: schedule.sport_room_id ?? '',
      day_of_week: schedule.day_of_week ?? '',
      start_time: schedule.start_time || '',
      end_time: schedule.end_time || '',
      status: schedule.status
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.sport_room_id || form.day_of_week === '' || !form.start_time || !form.end_time) {
      return Swal.fire('Atención', 'Todos los campos son obligatorios.', 'warning');
    }
    if (form.start_time >= form.end_time) {
      return Swal.fire('Atención', 'La hora de inicio debe ser anterior a la hora de término.', 'warning');
    }

    try {
      const payload = {
        sport_room_id: Number(form.sport_room_id),
        day_of_week: Number(form.day_of_week),
        start_time: form.start_time,
        end_time: form.end_time,
        status: form.status
      };

      if (isEditing) {
        await updateClassSchedule(editId, payload);
      } else {
        await createClassSchedule(payload);
      }

      setShowModal(false);
      Swal.fire({
        icon: 'success',
        title: isEditing ? '¡Actualizado!' : '¡Creado!',
        text: `El horario ha sido ${isEditing ? 'actualizado' : 'creado'} con éxito.`,
        timer: 2000,
        showConfirmButton: false
      });
      fetchAll();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo guardar el horario.', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar este horario?',
      text: "Esta acción no se puede deshacer. Las reservas asociadas podrían verse afectadas.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await deleteClassSchedule(id);
        Swal.fire('¡Eliminado!', 'El horario ha sido eliminado.', 'success');
        fetchAll();
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo eliminar el horario.', 'error');
      }
    }
  };

  return (
    <Container fluid className="vh-100 p-0" style={{ backgroundColor: '#1a0f2a' }}>
      <Row className="g-0 h-100">
        <AdminSidebar active="horarios" />

        <Col md={10} className="p-4 p-md-5 overflow-auto">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div className="text-white">
              <h2 className="fw-bold mb-0 text-uppercase">Gestión de Horarios</h2>
              <p className="text-white-50 mb-0">Define día y hora de cada clase</p>
            </div>
            <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill fw-bold">ADMINISTRADOR</Badge>
          </div>

          <Card className="border-0 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="text-white fw-bold mb-0">🗓️ Horarios Registrados</h4>
                  <small className="text-white-50">Basados en las asignaciones Deporte + Sala + Coach</small>
                </div>
                <div className="d-flex gap-2">
                  <Button variant="outline-light" onClick={fetchAll} disabled={isLoading}>🔄 Refrescar</Button>
                  <Button
                    variant="warning"
                    className="fw-bold text-dark"
                    onClick={openNewModal}
                    disabled={sportRooms.length === 0}
                    title={sportRooms.length === 0 ? 'Primero crea una asignación' : ''}
                  >
                    + Nuevo Horario
                  </Button>
                </div>
              </div>

              <Table borderless hover variant="dark" className="bg-transparent" responsive>
                <thead>
                  <tr className="text-white-50 text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                    <th>Asignación</th>
                    <th>Día</th>
                    <th>Inicio</th>
                    <th>Término</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="align-middle">
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-white-50">
                        <Spinner animation="border" size="sm" className="me-2" />
                        Cargando horarios...
                      </td>
                    </tr>
                  ) : schedules.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-white-50">No hay horarios registrados.</td>
                    </tr>
                  ) : (
                    schedules.map((s) => (
                      <tr key={s.id}>
                        <td className="text-white fw-bold">{describeAssignment(s.sport_room_id, s)}</td>
                        <td className="text-white-50">{DAYS[s.day_of_week] ?? s.day_of_week}</td>
                        <td className="text-white-50">{s.start_time}</td>
                        <td className="text-white-50">{s.end_time}</td>
                        <td>
                          {s.status
                            ? <Badge bg="success">Activo</Badge>
                            : <Badge bg="secondary">Inactivo</Badge>}
                        </td>
                        <td>
                          <Button variant="outline-primary" size="sm" className="me-2 border-0" onClick={() => openEditModal(s)}>✏️</Button>
                          <Button variant="outline-danger" size="sm" className="border-0" onClick={() => handleDelete(s.id)}>🗑️</Button>
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

      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="bg-dark text-white border-secondary">
        <Modal.Header closeButton closeVariant="white" className="border-secondary">
          <Modal.Title className="fw-bold">{isEditing ? "Editar Horario" : "Nuevo Horario"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="text-white-50 fw-semibold">Asignación (Deporte + Sala + Coach)</Form.Label>
              <Form.Select
                value={form.sport_room_id}
                onChange={e => setForm({ ...form, sport_room_id: e.target.value })}
                className="bg-dark text-white border-secondary"
              >
                <option value="">Seleccione una asignación</option>
                {sportRooms.map(sr => (
                  <option key={sr.id} value={sr.id}>
                    {(sr.sport?.name || `Deporte #${sr.sport_id}`)} · {(sr.room?.name || `Sala #${sr.room_id}`)} · {(sr.coach?.full_name || `Coach #${sr.coach_id}`)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-white-50 fw-semibold">Día de la semana</Form.Label>
              <Form.Select
                value={form.day_of_week}
                onChange={e => setForm({ ...form, day_of_week: e.target.value })}
                className="bg-dark text-white border-secondary"
              >
                <option value="">Seleccione un día</option>
                {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
              </Form.Select>
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white-50 fw-semibold">Hora de inicio</Form.Label>
                  <Form.Control
                    type="time"
                    value={form.start_time}
                    onChange={e => setForm({ ...form, start_time: e.target.value })}
                    className="bg-dark text-white border-secondary"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white-50 fw-semibold">Hora de término</Form.Label>
                  <Form.Control
                    type="time"
                    value={form.end_time}
                    onChange={e => setForm({ ...form, end_time: e.target.value })}
                    className="bg-dark text-white border-secondary"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="modal-schedule-status-switch"
                label="Horario activo"
                checked={form.status}
                onChange={e => setForm({ ...form, status: e.target.checked })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-secondary">
          <Button variant="outline-light" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="warning" className="fw-bold text-dark" onClick={handleSave}>💾 Guardar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
