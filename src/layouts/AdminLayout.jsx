import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { logout, getUser } from "../services/authService";

function AdminLayout() {
    const navigate = useNavigate();
    const user = getUser(); // Rescatamos al usuario activo para saludarlo

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div style={{ backgroundColor: '#1a0f2a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            
            {/* Barra de Navegación del Administrador */}
            <Navbar variant="dark" expand="lg" className="px-3 py-3 shadow" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                <Container fluid>
                    <Navbar.Brand as={Link} to="/admin/dashboard" className="fw-bold">
                        ⚡ SportClub <span className="text-warning">Admin</span>
                    </Navbar.Brand>
                    
                    <Navbar.Toggle aria-controls="admin-navbar-nav" />
                    
                    <Navbar.Collapse id="admin-navbar-nav">
                        <Nav className="me-auto ms-lg-4 gap-2">
                            {/* Enlace al CRUD de Usuarios */}
                            <Nav.Link as={Link} to="/admin/dashboard" className="text-white-50">
                                👥 Gestión de Usuarios
                            </Nav.Link>
                            
                            {/* Enlace al nuevo CRUD de Deportes */}
                            <Nav.Link as={Link} to="/admin/deportes" className="text-white">
                                🏆 Deportes
                            </Nav.Link>
                        </Nav>
                        
                        <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
                            <span className="text-white-50 d-none d-lg-block">
                                ¡Hola, {user?.name || 'Administrador'}!
                            </span>
                            <Button variant="outline-danger" size="sm" onClick={handleLogout} className="fw-bold">
                                Cerrar Sesión
                            </Button>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Contenedor dinámico donde se cargan las vistas (Dashboard o Deportes) */}
            <main className="flex-grow-1">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;