import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { logout, getUser } from "../services/authService";

function AdminLayout() {
    const navigate = useNavigate();
    const user = getUser();
    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand>SportClub Admin</Navbar.Brand>

                    <Nav className="me-auto">
                        <Link ClassName="nav-link" to="/admin/AdminDashboard">Dashboard</Link>
                    </Nav>

                    <span className="text-white me-3">
                        {user?.name}
                    </span>

                    <Button variant="outline-light" onClick={handleLogout}>
                        Cerrar Sesión
                    </Button>
                </Container>
            </Navbar>

            <Container className="mt-4">
                <Outlet />
            </Container>
        </>
    );
}

export default AdminLayout;
