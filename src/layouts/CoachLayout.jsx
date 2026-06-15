import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { logout, getUser } from "../services/authService";

function CoachLayout() {
    return (
        <div style={{ backgroundColor: '#1a0f2a', minHeight: '100vh' }}>
            <Outlet />
        </div>
    );
}

export default CoachLayout;
