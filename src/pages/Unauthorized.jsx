import React from "react";
import { Link } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

function Unauthorized() {
    return (
        <Container fluid className="vh-100 d-flex flex-column justify-content-center align-items-center p-4" style={{ backgroundColor: '#1a0f2a' }}>
            <div className="text-center" style={{ maxWidth: '500px' }}>
                
                {/* Icono gigante de candado */}
                <div style={{ fontSize: '6rem', lineHeight: '1', marginBottom: '1rem', filter: 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.4))' }}>
                    🔒
                </div>
                
                {/* Título impactante */}
                <h1 className="text-white fw-bold text-uppercase mb-3" style={{ letterSpacing: '2px', fontSize: '2.5rem' }}>
                    Acceso Denegado
                </h1>
                
                {/* Mensaje sutil */}
                <p className="text-white-50 mb-5" style={{ fontSize: '1.1rem' }}>
                    Parece que te has perdido. No tienes los permisos necesarios para acceder a esta área de SportClub.
                </p>
                
                {/* Botón con el estilo dorado del proyecto */}
                <Link to="/login" className="text-decoration-none">
                    <Button 
                        variant="warning" 
                        size="lg" 
                        className="fw-bold text-dark px-5 py-3 border-0 shadow-sm"
                        style={{ backgroundColor: '#F2B705', letterSpacing: '1px', borderRadius: '10px' }}
                    >
                        ← VOLVER AL INICIO
                    </Button>
                </Link>

            </div>
        </Container>
    );
}

export default Unauthorized;