import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, Form, Badge, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import AdminSidebar from '../../components/AdminSidebar';
import { getSportRooms, createSportRoom, updateSportRoom, deleteSportRoom } from '../../services/sportRoomsService';
import { getSports } from '../../services/sportsService';
import { getRooms } from '../../services/roomsService';
import { API_BASE_URL } from '../../config/api';

const API_USERS_URL = `${API_BASE_URL}/users`;
const emptyForm = { sport_id: '', room_id: '', coach_id: '', observation: '', status: true };

export default function GestionAsignaciones() {
  const [assignments, setAssignments] = useState([]);
  const [sports, setSports] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchAll();
  }, []);

  const asList = (response) => Array.isArray(response) ? response : (response.data || []);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const [assignmentsRes, sportsRes, roomsRes, usersRes] = await Promise.all([
        getSportRooms(),
        getSports(),
        getRooms(),
        fetch(API_USERS_URL, { headers: { "Authorization": `Bearer ${token}` } }).then(r => r.json())
      ]);

      setAssignments(asList(assignmentsRes));
      setSports(asList(sportsRes));
      setRooms(asList(roomsRes));
      const allUsers = asList(usersRes);
      setCoaches(allUsers.filter(u => u.role === 'coach'));
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudieron cargar las asignaciones.',
        confirmButtonColor: '#F2B705'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const findName = (list, id) => list.find(item => item.id === id)?.name
    || list.find(item => item.id === id)?.full_name
    || '—';

  const openNewModal = () => {
    setIsEditing(false);
    setEditId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (assignment) => {
    setIsEditing(true);
    setEditId(assignment.id);
    setForm({
      sport_id: assignment.sport_id ?? '',
      room_id: assignment.room_id ?? '',
      coach_id: assignment.coach_id ?? '',
      observation: assignment.observation || '',
      status: assignment.status
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.sport_id || !form.room_id || !form.coach_id) {
      return Swal.fire('Atención', 'Debe seleccionar deporte, sala y coach.', 'warning');
    }

    try {
      const payload = {
        sport_id: Number(form.sport_id),
        room_id: Number(form.room_id),
        coach_id: Number(form.coach_id),
        observation: form.observation,
        status: form.status
      };

      if (isEditing) {
        await updateSportRoom(editId, payload);
      } else {
        await createSportRoom(payload);
      }

      setShowModal(false);
      Swal.fire({
        icon: 'success',
        title: isEditing ? '¡Actualizada!' : '¡Creada!',
        text: `La asignación ha sido ${isEditing ? 'actualizada' : 'creada'} con éxito.`,
        timer: 2000,
        showConfirmButton: false
      });
      fetchAll();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo guardar la asignación.', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar esta asignación?',
      text: "Esta acción no se puede deshacer. Los horarios ligados a ella podrían dejar de funcionar.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await deleteSportRoom(id);
        Swal.fire('¡Eliminada!', 'La asignación ha sido eliminada.', 'success');
        fetchAll();
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo eliminar la asignación.', 'error');
      }
    }
  };

  return (
    <Container fluid className="vh-100 p-0" style={{ backgroundColor: '#1a0f2a' }}>
      <Row className="g-0 h-100">
        <AdminSidebar active="asignaciones" />

        <Col md={10} className="p-4 p-md-5 overflow-auto">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div className="text-white">
              <h2 className="fw-bold mb-0 text-uppercase">Gestión de Asignaciones</h2>
              <p className="text-white-50 mb-0">Asocia un deporte, una sala y un coach responsable</p>
            </div>
            <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill fw-bold">ADMINISTRADOR</Badge>
          </div>

          <Card className="border-0 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="text-white fw-bold mb-0">🔗 Asignaciones Registradas</h4>
                  <small className="text-white-50">Deporte + Sala + Coach</small>
                </div>
                <div className="d-flex gap-2">
                  <Button variant="outline-light" onClick={fetchAll} disabled={isLoading}>🔄 Refrescar</Button>
                  <Button variant="warning" className="fw-bold text-dark" onClick={openNewModal}>+ Nueva Asignación</Button>
                </div>
              </div>

              <Table borderless hover variant="dark" className="bg-transparent" responsive>
                <thead>
                  <tr className="text-white-50 text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                    <th>Deporte</th>
                    <th>Sala</th>
                    <th>Coach</th>
                    <th>Observación</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="align-middle">
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-white-50">
                        <Spinner animation="border" size="sm" className="me-2" />
                        Cargando asignaciones...
                      </td>
                    </tr>
                  ) : assignments.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-white-50">No hay asignaciones registradas.</td>
                    </tr>
                  ) : (
                    assignments.map((a) => (
                      <tr key={a.id}>
                        <td className="text-white fw-bold">{a.sport?.name || findName(sports, a.sport_id)}</td>
                        <td className="text-white-50">{a.room?.name || findName(rooms, a.room_id)}</td>
                        <td className="text-white-50">{a.coach?.full_name || findName(coaches, a.coach_id)}</td>
                        <td className="text-white-50">{a.observation || '—'}</td>
                        <td>
                          {a.status
                            ? <Badge bg="success">Activa</Badge>
                            : <Badge bg="secondary">Inactiva</Badge>}
                        </td>
                        <td>
                          <Button variant="outline-primary" size="sm" className="me-2 border-0" onClick={() => openEditModal(a)}>✏️</Button>
                          <Button variant="outline-danger" size="sm" className="border-0" onClick={() => handleDelete(a.id)}>🗑️</Button>
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
          <Modal.Title className="fw-bold">{isEditing ? "Editar Asignación" : "Nueva Asignación"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="text-white-50 fw-semibold">Deporte</Form.Label>
              <Form.Select
                value={form.sport_id}
                onChange={e => setForm({ ...form, sport_id: e.target.value })}
                className="bg-dark text-white border-secondary"
              >
                <option value="">Seleccione un deporte</option>
                {sports.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-white-50 fw-semibold">Sala</Form.Label>
              <Form.Select
                value={form.room_id}
                onChange={e => setForm({ ...form, room_id: e.target.value })}
                className="bg-dark text-white border-secondary"
              >
                <option value="">Seleccione una sala</option>
                {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-white-50 fw-semibold">Coach</Form.Label>
              <Form.Select
                value={form.coach_id}
                onChange={e => setForm({ ...form, coach_id: e.target.value })}
                className="bg-dark text-white border-secondary"
              >
                <option value="">Seleccione un coach</option>
                {coaches.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-white-50 fw-semibold">Observación (opcional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={form.observation}
                onChange={e => setForm({ ...form, observation: e.target.value })}
                className="bg-dark text-white border-secondary"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="modal-assignment-status-switch"
                label="Asignación activa"
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
