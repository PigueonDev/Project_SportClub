import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2'; // <-- Importamos SweetAlert2
import { getUser } from '../../services/authService';
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminDashboard() {
  const [currentUser, setCurrentUser] = useState({ name: 'Cargando...', initials: '?' });
  
  const [usersList, setUsersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'user', password: '', confirm: '' });

  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:3000/api/users";

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
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(API_URL, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.data || data.users || []);
      setUsersList(list);
    } catch (error) {
      console.error(error);
      // SweetAlert2 para Error
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor.',
        confirmButtonColor: '#F2B705'
      });
    } finally {
      setIsLoading(false);
    }
  };


  const openNewUserModal = () => {
    setIsEditing(false);
    setEditId(null);
    setForm({ name: '', email: '', role: 'user', password: '', confirm: '' });
    setShowModal(true);
  };

  const openEditUserModal = (userToEdit) => {
    setIsEditing(true);
    setEditId(userToEdit.id);
    setForm({ 
      name: userToEdit.full_name || userToEdit.name || '', 
      email: userToEdit.email, 
      role: userToEdit.role || 'user',
      password: '', confirm: '' 
    });
    setShowModal(true);
  };

  const handleSaveUser = async () => {
    // Validaciones con SweetAlert2
    if (!form.name || !form.email) {
      return Swal.fire('Atención', 'El nombre y el email son obligatorios', 'warning');
    }
    if (!isEditing && form.password !== form.confirm) {
      return Swal.fire('Atención', 'Las contraseñas no coinciden', 'warning');
    }
    if (!isEditing && form.password.length < 8) {
      return Swal.fire('Atención', 'La contraseña debe tener al menos 8 caracteres', 'warning');
    }

    try {
      const url = isEditing ? `${API_URL}/${editId}` : API_URL;
      const method = isEditing ? "PUT" : "POST";
      
      const body = isEditing
        ? { full_name: form.name, email: form.email, role: form.role }
        : { full_name: form.name, email: form.email, role: form.role, password: form.password, must_change_password: false };

      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setShowModal(false);
        // SweetAlert2 para Éxito
        Swal.fire({
          icon: 'success',
          title: isEditing ? '¡Actualizado!' : '¡Creado!',
          text: `El usuario ha sido ${isEditing ? 'actualizado' : 'creado'} con éxito.`,
          timer: 2000,
          showConfirmButton: false
        });
        fetchUsers();
      } else {
        const errorData = await res.json();
        // SweetAlert2 para Error del backend
        Swal.fire('Error', errorData.message || 'No se pudo guardar el usuario', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Problema de conexión al guardar.', 'error');
    }
  };

  // SweetAlert2 para Confirmar Eliminación
  const handleDeleteUser = async (id, name) => {
    const result = await Swal.fire({
      title: `¿Eliminar a ${name}?`,
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
        const res = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.ok) {
          // Mensaje de éxito tras eliminar
          Swal.fire('¡Eliminado!', 'El usuario ha sido eliminado.', 'success');
          fetchUsers();
        } else {
          const errorData = await res.json();
          Swal.fire('Error', errorData.message || 'No se pudo eliminar el usuario', 'error');
        }
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Problema de conexión al eliminar.', 'error');
      }
    }
  };

  const stats = {
    total: usersList.length,
    users: usersList.filter(u => u.role === 'user').length,
    coaches: usersList.filter(u => u.role === 'coach').length,
    admins: usersList.filter(u => u.role === 'admin').length,
  };

  return (
    <Container fluid className="vh-100 p-0" style={{ backgroundColor: '#1a0f2a' }}>
      <Row className="g-0 h-100">
        
        <AdminSidebar active="usuarios" />

        {/* MAIN CONTENT ADMIN */}
        <Col md={10} className="p-4 p-md-5 overflow-auto">
          
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div className="text-white">
              <h2 className="fw-bold mb-0 text-uppercase">Panel de Administración</h2>
              <p className="text-white-50 mb-0">Bienvenido, <strong className="text-white">{currentUser.name}</strong></p>
            </div>
            <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill fw-bold">ADMINISTRADOR</Badge>
          </div>

          <Row className="mb-4 g-3">
            <Col xs={6} md={3}><Card className="border-0 shadow-sm h-100" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}><Card.Body className="p-4"><h2 className="text-warning fw-bold mb-1">{stats.total}</h2><small className="text-white-50 text-uppercase fw-semibold">Usuarios totales</small></Card.Body></Card></Col>
            <Col xs={6} md={3}><Card className="border-0 shadow-sm h-100" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}><Card.Body className="p-4"><h2 className="text-warning fw-bold mb-1">{stats.users}</h2><small className="text-white-50 text-uppercase fw-semibold">Usuarios</small></Card.Body></Card></Col>
            <Col xs={6} md={3}><Card className="border-0 shadow-sm h-100" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}><Card.Body className="p-4"><h2 className="text-warning fw-bold mb-1">{stats.coaches}</h2><small className="text-white-50 text-uppercase fw-semibold">Coaches</small></Card.Body></Card></Col>
            <Col xs={6} md={3}><Card className="border-0 shadow-sm h-100" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}><Card.Body className="p-4"><h2 className="text-warning fw-bold mb-1">{stats.admins}</h2><small className="text-white-50 text-uppercase fw-semibold">Administradores</small></Card.Body></Card></Col>
          </Row>

          <Card className="border-0 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="text-white fw-bold mb-0">👥 Gestión de Usuarios</h4>
                  <small className="text-white-50">Administra los usuarios del sistema</small>
                </div>
                <Button variant="warning" className="fw-bold text-dark" onClick={openNewUserModal}>+ Nuevo Usuario</Button>
              </div>

              <Table borderless hover variant="dark" className="bg-transparent" responsive>
                <thead>
                  <tr className="text-white-50 text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                    <th>ID</th><th>Nombre Completo</th><th>Email</th><th>Rol</th><th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="align-middle">
                  {isLoading ? (
                    <tr><td colSpan="5" className="text-center py-4 text-white-50"><Spinner animation="border" size="sm" className="me-2" />Cargando usuarios...</td></tr>
                  ) : usersList.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-4 text-white-50">No hay usuarios registrados.</td></tr>
                  ) : (
                    usersList.map((u) => {
                      const nombre = u.full_name || u.name || "—";
                      const isCoach = u.role === 'coach';
                      const isAdmin = u.role === 'admin';
                      let badgeColor = "success";
                      if (isCoach) badgeColor = "primary";
                      if (isAdmin) badgeColor = "warning";

                      return (
                        <tr key={u.id}>
                          <td className="text-white-50">{u.id}</td>
                          <td className="text-white fw-bold">
                            <div className="d-flex align-items-center gap-2">
                              <div className="rounded-circle d-flex justify-content-center align-items-center text-white" 
                                   style={{ width: '30px', height: '30px', backgroundColor: `var(--bs-${badgeColor === 'warning' ? 'warning' : badgeColor})`, opacity: 0.8, fontSize: '0.75rem' }}>
                                {getInitials(nombre)}
                              </div>
                              {nombre}
                            </div>
                          </td>
                          <td className="text-white-50">{u.email}</td>
                          <td><Badge bg={badgeColor} text={isAdmin ? "dark" : "white"} className="rounded-pill">{u.role.toUpperCase()}</Badge></td>
                          <td>
                            <Button variant="outline-primary" size="sm" className="me-2 border-0" onClick={() => openEditUserModal(u)}>✏️</Button>
                            <Button variant="outline-danger" size="sm" className="border-0" onClick={() => handleDeleteUser(u.id, nombre)}>🗑️</Button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

        </Col>
      </Row>

      {/* MODAL CREAR / EDITAR USUARIO */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="bg-dark text-white border-secondary">
        <Modal.Header closeButton closeVariant="white" className="border-secondary">
          <Modal.Title className="fw-bold">{isEditing ? "Editar Usuario" : "Nuevo Usuario"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="text-white-50 fw-semibold">Nombre completo</Form.Label>
              <Form.Control type="text" placeholder="Ej: Juan Pérez" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="bg-dark text-white border-secondary" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-white-50 fw-semibold">Email</Form.Label>
              <Form.Control type="email" placeholder="juan@demo.cl" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="bg-dark text-white border-secondary" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-white-50 fw-semibold">Rol</Form.Label>
              <Form.Select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="bg-dark text-white border-secondary">
                <option value="user">Usuario</option>
                <option value="coach">Coach</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>

            {!isEditing && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white-50 fw-semibold">Contraseña</Form.Label>
                  <Form.Control type="password" placeholder="Mínimo 8 caracteres" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="bg-dark text-white border-secondary" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white-50 fw-semibold">Confirmar contraseña</Form.Label>
                  <Form.Control type="password" placeholder="Repite la contraseña" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} className="bg-dark text-white border-secondary" />
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-secondary">
          <Button variant="outline-light" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="warning" className="fw-bold text-dark" onClick={handleSaveUser}>💾 Guardar</Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}