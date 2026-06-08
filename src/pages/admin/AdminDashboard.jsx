import { useEffect, useState } from "react"
import { getToken } from "../../services/authService"
import {
  Alert, Badge, Button, Card, Col, Form,
  Modal, Row, Spinner, Table
} from "react-bootstrap"

const API = "http://localhost:3000"

// Badge de rol con color según la guía
function RoleBadge({ role }) {
  const colors = { admin: "danger", coach: "primary", user: "success" }
  return <Badge bg={colors[role] || "secondary"}>{role}</Badge>
}

// Formatear fecha dd/mm/yyyy
function fmtFecha(iso) {
  if (!iso) return "—"
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`
}

function AdminDashboard() {
  const [usuarios, setUsuarios]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando]   = useState(null)   // null = nuevo
  const [feedback, setFeedback]   = useState("")
  const [feedbackType, setFeedbackType] = useState("success")

  // Campos del formulario
  const [form, setForm] = useState({
    full_name: "", email: "", role: "user", password: "", confirm: ""
  })
  const [formErrors, setFormErrors] = useState({})

  const token = getToken()
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` }

  // ── CARGAR USUARIOS ──────────────────────────────────
  async function cargar() {
    setLoading(true)
    setError("")
    try {
      const res  = await fetch(`${API}/api/users`, { headers })
      const data = await res.json()
      const list = Array.isArray(data) ? data : (data.data || data.users || [])
      setUsuarios(list)
    } catch {
      setError("No se pudo conectar con el servidor.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargar() }, [])

  // ── ABRIR MODAL ──────────────────────────────────────
  function abrirNuevo() {
    setEditando(null)
    setForm({ full_name: "", email: "", role: "user", password: "", confirm: "" })
    setFormErrors({})
    setFeedback("")
    setShowModal(true)
  }

  function abrirEditar(u) {
    setEditando(u)
    setForm({ full_name: u.full_name || u.name || "", email: u.email, role: u.role, password: "", confirm: "" })
    setFormErrors({})
    setFeedback("")
    setShowModal(true)
  }

  function cerrarModal() {
    setShowModal(false)
    setEditando(null)
    setFormErrors({})
  }

  // ── VALIDAR FORMULARIO ───────────────────────────────
  function validar() {
    const errs = {}
    if (!form.full_name.trim()) errs.full_name = "El nombre es obligatorio"
    if (!form.email.trim())     errs.email     = "El email es obligatorio"
    if (!editando) {
      if (form.password.length < 8)       errs.password = "Mínimo 8 caracteres"
      if (form.password !== form.confirm) errs.confirm  = "Las contraseñas no coinciden"
    }
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  // ── GUARDAR (CREAR / EDITAR) ─────────────────────────
  async function guardar() {
    if (!validar()) return
    try {
      const url    = editando ? `${API}/api/users/${editando.id}` : `${API}/api/users`
      const method = editando ? "PUT" : "POST"
      const body   = editando
        ? { full_name: form.full_name, email: form.email, role: form.role }
        : { full_name: form.full_name, email: form.email, role: form.role,
            password: form.password, must_change_password: false,
            birth_date: "2000-01-01", metadata: { sports: [] } }

      const res  = await fetch(url, { method, headers, body: JSON.stringify(body) })
      const data = await res.json()

      if (!res.ok) {
        setFeedback(data.message || "Error al guardar.")
        setFeedbackType("danger")
        return
      }

      cerrarModal()
      mostrarFeedback(editando ? "Usuario actualizado ✓" : "Usuario creado ✓", "success")
      cargar()
    } catch {
      setFeedback("Error de conexión.")
      setFeedbackType("danger")
    }
  }

  // ── ELIMINAR ─────────────────────────────────────────
  async function eliminar(id, nombre) {
    if (!window.confirm(`¿Eliminar a "${nombre}"? Esta acción no se puede deshacer.`)) return
    try {
      const res = await fetch(`${API}/api/users/${id}`, { method: "DELETE", headers })
      if (!res.ok) {
        const d = await res.json()
        mostrarFeedback(d.message || "Error al eliminar.", "danger")
        return
      }
      mostrarFeedback("Usuario eliminado ✓", "success")
      cargar()
    } catch {
      mostrarFeedback("Error de conexión.", "danger")
    }
  }

  function mostrarFeedback(msg, type) {
    setFeedback(msg)
    setFeedbackType(type)
    setTimeout(() => setFeedback(""), 3500)
  }

  // ── STATS ─────────────────────────────────────────────
  const stats = {
    total:  usuarios.length,
    users:  usuarios.filter(u => u.role === "user").length,
    coaches:usuarios.filter(u => u.role === "coach").length,
    admins: usuarios.filter(u => u.role === "admin").length,
  }

  return (
    <div>
      <h4 className="mb-4">👥 Gestión de Usuarios</h4>
      <p className="text-muted mb-4">Administra los usuarios del sistema</p>

      {/* Feedback global */}
      {feedback && !showModal && (
        <Alert variant={feedbackType} dismissible onClose={() => setFeedback("")}>
          {feedback}
        </Alert>
      )}

      {/* Stats */}
      <Row className="mb-4 g-3">
        {[
          { label: "Total usuarios", value: stats.total,   color: "warning" },
          { label: "Usuarios",       value: stats.users,   color: "success" },
          { label: "Coaches",        value: stats.coaches, color: "primary" },
          { label: "Admins",         value: stats.admins,  color: "danger"  },
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

      {/* Tabla */}
      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span className="fw-bold">Lista de Usuarios</span>
          <Button variant="success" size="sm" onClick={abrirNuevo}>+ Nuevo Usuario</Button>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Cargando usuarios...</p>
            </div>
          ) : error ? (
            <Alert variant="danger" className="m-3">{error}</Alert>
          ) : usuarios.length === 0 ? (
            <p className="text-center text-muted py-4">No hay usuarios registrados.</p>
          ) : (
            <Table hover responsive className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Nombre Completo</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Fecha Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td className="text-muted">{u.id}</td>
                    <td><strong>{u.full_name || u.name}</strong></td>
                    <td className="text-muted">{u.email}</td>
                    <td><RoleBadge role={u.role} /></td>
                    <td className="text-muted">{fmtFecha(u.created_at)}</td>
                    <td>
                      <Button
                        variant="outline-primary" size="sm" className="me-2"
                        onClick={() => abrirEditar(u)}
                      >✏️</Button>
                      <Button
                        variant="outline-danger" size="sm"
                        onClick={() => eliminar(u.id, u.full_name || u.name)}
                      >🗑️</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* MODAL CREAR / EDITAR */}
      <Modal show={showModal} onHide={cerrarModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editando ? "Editar Usuario" : "Nuevo Usuario"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {feedback && (
            <Alert variant={feedbackType}>{feedback}</Alert>
          )}

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Juan Pérez"
                value={form.full_name}
                onChange={e => setForm({ ...form, full_name: e.target.value })}
                isInvalid={!!formErrors.full_name}
              />
              <Form.Control.Feedback type="invalid">{formErrors.full_name}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="juan@demo.cl"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                isInvalid={!!formErrors.email}
              />
              <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
              >
                <option value="user">Usuario</option>
                <option value="coach">Coach</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>

            {/* Contraseña solo al crear */}
            {!editando && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    isInvalid={!!formErrors.password}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.password}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Confirmar contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Repite la contraseña"
                    value={form.confirm}
                    onChange={e => setForm({ ...form, confirm: e.target.value })}
                    isInvalid={!!formErrors.confirm}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.confirm}</Form.Control.Feedback>
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>Cancelar</Button>
          <Button variant="warning" onClick={guardar}>💾 Guardar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default AdminDashboard
