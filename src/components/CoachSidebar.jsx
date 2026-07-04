import { Col, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getUser, logout } from '../services/authService';

const NAV_ITEMS = [
  { key: 'inicio', label: '🏠 Inicio', path: '/coach/dashboard' },
  { key: 'clases', label: '📋 Mis Clases', path: '/coach/mis-clases' },
  { key: 'horario', label: '🗓️ Mi Horario', path: '/coach/mi-horario' },
];

const getInitials = (name) => {
  if (!name) return "?";
  return name.split(" ").map(w => w[0] || "").join("").toUpperCase().slice(0, 2);
};

export default function CoachSidebar({ active }) {
  const navigate = useNavigate();
  const user = getUser();
  const userName = user?.full_name || user?.name || 'Coach';

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: "Saldrás de tu cuenta actual",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    });
    if (result.isConfirmed) {
      logout();
      navigate("/login");
    }
  };

  return (
    <Col md={2} className="d-flex flex-column p-3 shadow" style={{ backgroundColor: '#2E1A47' }}>
      <div className="mb-4 px-2 text-center">
        <img src="/logo.png" alt="SportClub Logo" style={{ height: '50px', width: 'auto' }} />
      </div>
      <div className="d-flex align-items-center gap-3 mb-4 px-2 pb-3 border-bottom border-secondary">
        <div className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold shadow-sm"
             style={{ width: '45px', height: '45px', background: 'linear-gradient(135deg, #3d2460, #F2B705)' }}>
          {getInitials(userName)}
        </div>
        <div className="text-white">
          <div className="fw-semibold lh-1" style={{ fontSize: '0.9rem' }}>{userName}</div>
          <small className="text-white-50" style={{ fontSize: '0.75rem' }}>Coach</small>
        </div>
      </div>
      <Nav className="flex-column mb-auto gap-1">
        {NAV_ITEMS.map(item => (
          <Button
            key={item.key}
            variant={active === item.key ? 'success' : 'link'}
            onClick={() => navigate(item.path)}
            className={active === item.key
              ? "text-start border-0 text-white fw-semibold mb-1"
              : "text-start text-white-50 text-decoration-none hover-white"}
            style={active === item.key ? { backgroundColor: 'rgba(34, 197, 94, 0.2)' } : undefined}
          >
            {item.label}
          </Button>
        ))}
      </Nav>
      <div className="mt-auto pt-3 border-top border-secondary d-flex flex-column gap-2">
        <Button variant="link" className="text-start text-warning text-decoration-none">✏️ Editar perfil</Button>
        <Button variant="link" className="text-start text-danger text-decoration-none" onClick={handleLogout}>↩ Cerrar sesión</Button>
      </div>
    </Col>
  );
}
