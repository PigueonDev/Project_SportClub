import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, Form, Badge, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { getSports, deleteSport, changeSportStatus, createSport, updateSport } from '../../services/sportsService';
import { getUser } from '../../services/authService';
import { formatSpanishDate } from '../../utils/dateFormatter';
import AdminSidebar from '../../components/AdminSidebar';
                            
export default function GestionDeportes() {
  const [currentUser, setCurrentUser] = useState({ name: 'Cargando...', initials: '?' });
  const [sportsList, setSportsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para el Modal de Creación/Edición
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', objective: '', duration: '', status: true });

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(w => w[0] || "").join("").toUpperCase().slice(0, 2);
  };

  useEffect(() => {
    const activeUser = getUser(); 
    if (activeUser) {
      const userName = activeUser.full_name || activeUser.name || 'Admin';
      setCurrentUser({ name: userName, initials: getInitials(userName) });
    }
    fetchSports();
  }, []);

  const fetchSports = async () => {
    setIsLoading(true);
    try {
      const response = await getSports();
      // Adaptamos por si la API retorna un objeto con .data o directamente el arreglo
      const list = Array.isArray(response) ? response : (response.data || []);
      setSportsList(list); 
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudieron cargar los deportes.',
        confirmButtonColor: '#F2B705'
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    setSportsList(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));

    try {
      await changeSportStatus(id, newStatus);
    } catch (error) {
      setSportsList(prev => prev.map(s => s.id === id ? { ...s, status: currentStatus } : s));
      Swal.fire('Error', 'No se pudo actualizar el estado.', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: `¿Eliminar el deporte ${name}?`,
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
        await deleteSport(id);
        Swal.fire('¡Eliminado!', 'El deporte ha sido eliminado.', 'success');
        fetchSports(); 
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo eliminar el deporte.', 'error');
      }
    }
  };

  // --- LÓGICA DE CONTROL DEL MODAL ---
  const openNewSportModal = () => {
    setIsEditing(false);
    setEditId(null);
    setForm({ name: '', objective: '', duration: '', status: true });
    setShowModal(true);
  };

  const openEditSportModal = (sport) => {
    setIsEditing(true);
    setEditId(sport.id);
    setForm({
      name: sport.name || '',
      objective: sport.objective || '',
      duration: sport.duration || '',
      status: sport.status
    });
    setShowModal(true);
  };

  const handleSaveSport = async () => {
    // Validaciones obligatorias de la rúbrica
    if (!form.name.trim() || !form.objective.trim() || !form.duration) {
      return Swal.fire('Atención', 'El nombre, objetivo y duración son obligatorios.', 'warning');
    }

    if (isNaN(form.duration) || Number(form.duration) <= 0) {
      return Swal.fire('Atención', 'La duración debe ser un número mayor a 0.', 'warning');
    }

    try {
      const payload = {
        name: form.name,
        objective: form.objective,
        duration: Number(form.duration),
        status: form.status
      };

      if (isEditing) {
        await updateSport(editId, payload);
      } else {
        await createSport(payload);
      }

      setShowModal(false);
      Swal.fire({
        icon: 'success',
        title: isEditing ? '¡Actualizado!' : '¡Creado!',
        text: `El deporte ha sido ${isEditing ? 'actualizado' : 'creado'} con éxito.`,
        timer: 2000,
        showConfirmButton: false
      });
      fetchSports(); 
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo guardar el deporte.', 'error');
    }
  };

  return (
    <Container fluid className="vh-100 p-0" style={{ backgroundColor: '#1a0f2a' }}>
      <Row className="g-0 h-100">
        
        <AdminSidebar active="deportes" />

        {/* MAIN CONTENT DEPORTES */}
        <Col md={10} className="p-4 p-md-5 overflow-auto">
          
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div className="text-white">
              <h2 className="fw-bold mb-0 text-uppercase">Gestión de Deportes</h2>
              <p className="text-white-50 mb-0">Administra las disciplinas del club</p>
            </div>
            <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill fw-bold">ADMINISTRADOR</Badge>
          </div>

          <Card className="border-0 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="text-white fw-bold mb-0">🏆 Disciplinas Registradas</h4>
                  <small className="text-white-50">Crea, edita o desactiva deportes del catálogo</small>
                </div>
                <div className="d-flex gap-2">
                  <Button variant="outline-light" onClick={fetchSports} disabled={isLoading}>
                    🔄 Refrescar
                  </Button>
                  <Button variant="warning" className="fw-bold text-dark" onClick={openNewSportModal}>
                    + Nuevo Deporte
                  </Button>
                </div>
              </div>

              <Table borderless hover variant="dark" className="bg-transparent" responsive>
                <thead>
                  <tr className="text-white-50 text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                    <th>Nombre</th>
                    <th>Objetivo Principal</th>
                    <th>Duración</th>
                    <th>Fecha Creación</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="align-middle">
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-white-50">
                        <Spinner animation="border" size="sm" className="me-2" />
                        Cargando deportes...
                      </td>
                    </tr>
                  ) : sportsList.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-white-50">
                        No hay deportes registrados.
                      </td>
                    </tr>
                  ) : (
                    sportsList.map((sport) => (
                      <tr key={sport.id}>
                        <td className="text-white fw-bold">{sport.name}</td>
                        <td className="text-white-50" style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {sport.objective}
                        </td>
                        <td className="text-white-50">{sport.duration} min</td>
                        <td className="text-white-50">{sport.created_at ? formatSpanishDate(sport.created_at) : 'Sin fecha'}</td>
                        <td>
                          <Form.Check 
                            type="switch"
                            id={`switch-${sport.id}`}
                            checked={sport.status}
                            onChange={() => handleStatusChange(sport.id, sport.status)}
                            label={sport.status ? <Badge bg="success">Activo [ON]</Badge> : <Badge bg="secondary">Inactivo [OFF]</Badge>}
                          />
                        </td>
                        <td>
                          <Button variant="outline-primary" size="sm" className="me-2 border-0" onClick={() => openEditSportModal(sport)}>✏️</Button>
                          <Button variant="outline-danger" size="sm" className="border-0" onClick={() => handleDelete(sport.id, sport.name)}>🗑️</Button>
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

      {/* MODAL CREAR / EDITAR DEPORTE */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="bg-dark text-white border-secondary">
        <Modal.Header closeButton closeVariant="white" className="border-secondary">
          <Modal.Title className="fw-bold">{isEditing ? "Editar Deporte" : "Nuevo Deporte"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="text-white-50 fw-semibold">Nombre del Deporte</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ej: Yoga, Crossfit..." 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                className="bg-dark text-white border-secondary" 
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="text-white-50 fw-semibold">Objetivo Principal</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={2}
                placeholder="Describa la meta o enfoque de la disciplina..." 
                value={form.objective} 
                onChange={e => setForm({...form, objective: e.target.value})} 
                className="bg-dark text-white border-secondary" 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-white-50 fw-semibold">Duración (minutos)</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="Ej: 45, 60, 90" 
                value={form.duration} 
                onChange={e => setForm({...form, duration: e.target.value})} 
                className="bg-dark text-white border-secondary" 
              />
            </Form.Group>

            {!isEditing && (
              <Form.Group className="mb-3">
                <Form.Check 
                  type="switch"
                  id="modal-status-switch"
                  label="Habilitar deporte de forma inmediata"
                  checked={form.status}
                  onChange={e => setForm({...form, status: e.target.checked})}
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-secondary">
          <Button variant="outline-light" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="warning" className="fw-bold text-dark" onClick={handleSaveSport}>💾 Guardar</Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}