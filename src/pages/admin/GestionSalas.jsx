import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, Form, Badge, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import AdminSidebar from '../../components/AdminSidebar';
import { getRooms, createRoom, updateRoom, deleteRoom } from '../../services/roomsService';

const emptyForm = { name: '', description: '', capacity: '', location: '', image_url: '', observation: '', status: true };

export default function GestionSalas() {
  const [roomsList, setRoomsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const response = await getRooms();
      const list = Array.isArray(response) ? response : (response.data || []);
      setRoomsList(list);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudieron cargar las salas.',
        confirmButtonColor: '#F2B705'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openNewRoomModal = () => {
    setIsEditing(false);
    setEditId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditRoomModal = (room) => {
    setIsEditing(true);
    setEditId(room.id);
    setForm({
      name: room.name || '',
      description: room.description || '',
      capacity: room.capacity ?? '',
      location: room.location || '',
      image_url: room.image_url || '',
      observation: room.observation || '',
      status: room.status
    });
    setShowModal(true);
  };

  const handleSaveRoom = async () => {
    if (!form.name.trim() || !form.location.trim() || !form.capacity) {
      return Swal.fire('Atención', 'El nombre, ubicación y capacidad son obligatorios.', 'warning');
    }
    if (isNaN(form.capacity) || Number(form.capacity) <= 0) {
      return Swal.fire('Atención', 'La capacidad debe ser un número mayor a 0.', 'warning');
    }

    try {
      const payload = {
        name: form.name,
        description: form.description,
        capacity: Number(form.capacity),
        location: form.location,
        image_url: form.image_url,
        observation: form.observation,
        status: form.status
      };

      if (isEditing) {
        await updateRoom(editId, payload);
      } else {
        await createRoom(payload);
      }

      setShowModal(false);
      Swal.fire({
        icon: 'success',
        title: isEditing ? '¡Actualizada!' : '¡Creada!',
        text: `La sala ha sido ${isEditing ? 'actualizada' : 'creada'} con éxito.`,
        timer: 2000,
        showConfirmButton: false
      });
      fetchRooms();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo guardar la sala.', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: `¿Eliminar la sala ${name}?`,
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await deleteRoom(id);
        Swal.fire('¡Eliminada!', 'La sala ha sido eliminada.', 'success');
        fetchRooms();
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo eliminar la sala.', 'error');
      }
    }
  };

  return (
    <Container fluid className="vh-100 p-0" style={{ backgroundColor: '#1a0f2a' }}>
      <Row className="g-0 h-100">
        <AdminSidebar active="salas" />

        <Col md={10} className="p-4 p-md-5 overflow-auto">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div className="text-white">
              <h2 className="fw-bold mb-0 text-uppercase">Gestión de Salas</h2>
              <p className="text-white-50 mb-0">Administra la infraestructura del club</p>
            </div>
            <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill fw-bold">ADMINISTRADOR</Badge>
          </div>

          <Card className="border-0 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="text-white fw-bold mb-0">🏢 Salas Registradas</h4>
                  <small className="text-white-50">Crea, edita o elimina salas del club</small>
                </div>
                <div className="d-flex gap-2">
                  <Button variant="outline-light" onClick={fetchRooms} disabled={isLoading}>🔄 Refrescar</Button>
                  <Button variant="warning" className="fw-bold text-dark" onClick={openNewRoomModal}>+ Nueva Sala</Button>
                </div>
              </div>

              <Table borderless hover variant="dark" className="bg-transparent" responsive>
                <thead>
                  <tr className="text-white-50 text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                    <th>Nombre</th>
                    <th>Ubicación</th>
                    <th>Capacidad</th>
                    <th>Descripción</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="align-middle">
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-white-50">
                        <Spinner animation="border" size="sm" className="me-2" />
                        Cargando salas...
                      </td>
                    </tr>
                  ) : roomsList.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-white-50">No hay salas registradas.</td>
                    </tr>
                  ) : (
                    roomsList.map((room) => (
                      <tr key={room.id}>
                        <td className="text-white fw-bold">{room.name}</td>
                        <td className="text-white-50">{room.location}</td>
                        <td className="text-white-50">{room.capacity} personas</td>
                        <td className="text-white-50" style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {room.description}
                        </td>
                        <td>
                          {room.status
                            ? <Badge bg="success">Activa</Badge>
                            : <Badge bg="secondary">Inactiva</Badge>}
                        </td>
                        <td>
                          <Button variant="outline-primary" size="sm" className="me-2 border-0" onClick={() => openEditRoomModal(room)}>✏️</Button>
                          <Button variant="outline-danger" size="sm" className="border-0" onClick={() => handleDelete(room.id, room.name)}>🗑️</Button>
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
          <Modal.Title className="fw-bold">{isEditing ? "Editar Sala" : "Nueva Sala"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="text-white-50 fw-semibold">Nombre de la Sala</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Sala Multiuso 1"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="bg-dark text-white border-secondary"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-white-50 fw-semibold">Ubicación</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Piso 1, Ala Norte"
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                className="bg-dark text-white border-secondary"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-white-50 fw-semibold">Capacidad (personas)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ej: 20"
                value={form.capacity}
                onChange={e => setForm({ ...form, capacity: e.target.value })}
                className="bg-dark text-white border-secondary"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-white-50 fw-semibold">Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Describa las características de la sala..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="bg-dark text-white border-secondary"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-white-50 fw-semibold">URL de Imagen (opcional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="https://..."
                value={form.image_url}
                onChange={e => setForm({ ...form, image_url: e.target.value })}
                className="bg-dark text-white border-secondary"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="modal-room-status-switch"
                label="Sala activa"
                checked={form.status}
                onChange={e => setForm({ ...form, status: e.target.checked })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-secondary">
          <Button variant="outline-light" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="warning" className="fw-bold text-dark" onClick={handleSaveRoom}>💾 Guardar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
