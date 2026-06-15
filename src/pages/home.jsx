import React from "react";
import { Link } from "react-router-dom";
import { Button, Col, Container, Row, Navbar, Nav, Card } from "react-bootstrap";

const clases = [
  { emoji: "🏋️", nombre: "CrossFit", desc: "Entrenamiento funcional de alta intensidad. Fuerza, resistencia y agilidad en cada sesión.", horario: "Lun · Mié · Vie  07:00–08:00", nivel: "Todos los niveles" },
  { emoji: "🧘", nombre: "Yoga Flow", desc: "Movimiento, respiración y equilibrio mental. Perfecto para recuperarte y conectar con tu cuerpo.", horario: "Mar · Jue  08:30–09:30", nivel: "Principiante" },
  { emoji: "🚴", nombre: "Spinning", desc: "Cardio intenso sobre bicicleta estática con música y motivación al máximo nivel.", horario: "Lun · Mié  18:00–19:00", nivel: "Intermedio" },
  { emoji: "💥", nombre: "HIIT Power", desc: "Intervalos de alta intensidad que queman grasa y construyen resistencia cardiovascular.", horario: "Mar · Jue · Vie  19:00–20:00", nivel: "Avanzado" },
  { emoji: "🥊", nombre: "Boxeo Funcional", desc: "Técnica de boxeo combinada con trabajo funcional. Coordinación, fuerza y mucha adrenalina.", horario: "Sábado  10:00–11:30", nivel: "Todos los niveles" },
  { emoji: "🔥", nombre: "Funcional Total", desc: "Trabajo con peso corporal y equipamiento para desarrollar fuerza y movilidad real.", horario: "Sábado  09:00–10:30", nivel: "Intermedio" },
];

const beneficios = [
  { emoji: "📅", titulo: "Reservas online", desc: "Reserva tu clase favorita en segundos desde cualquier dispositivo." },
  { emoji: "📊", titulo: "Seguimiento de progreso", desc: "Visualiza tu evolución semana a semana con métricas claras." },
  { emoji: "🎯", titulo: "Plan personalizado", desc: "Tu coach diseña un programa adaptado a tus objetivos y nivel." },
  { emoji: "🏆", titulo: "Comunidad activa", desc: "Retos, eventos y actividades grupales que te mantienen motivado." },
  { emoji: "⚡", titulo: "Horarios flexibles", desc: "Clases de mañana, tarde y noche. Nos adaptamos a tu vida." },
  { emoji: "🔐", titulo: "Acceso seguro", desc: "Tu perfil e historial protegidos en nuestra plataforma digital." },
];

const coaches = [
  { iniciales: "RS", nombre: "Roberto Silva", especialidad: "CrossFit · HIIT", color: "#2E1A47" },
  { iniciales: "AL", nombre: "Ana López", especialidad: "Yoga · Mindfulness", color: "#1d4060" },
  { iniciales: "CP", nombre: "Carlos Pinto", especialidad: "Spinning · Cardio", color: "#0f3320" },
  { iniciales: "MT", nombre: "María Torres", especialidad: "HIIT · Funcional", color: "#3d1040" },
];

const bg = "linear-gradient(135deg, #1a0f2a 0%, #2E1A47 60%, #3d2460 100%)";
const gold = "#F2B705";
const muted = "rgba(255,255,255,0.55)";

export default function Home() {
  return (
    <div style={{ backgroundColor: "#1a0f2a", color: "#fff", minHeight: "100vh" }}>
      
      {/* ── NAVBAR CON LOGO ─────────────────────────────────── */}
      <Navbar collapseOnSelect expand="md" variant="dark" sticky="top" 
              style={{ backgroundColor: "rgba(26, 15, 42, 0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0.8rem 0" }}>
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
            {/* LOGO SUPERIOR */}
            <img 
              src="/logo.png" 
              alt="SportClub Logo" 
              style={{ height: 42, width: "auto" }}
              onError={e => { e.target.replaceWith(Object.assign(document.createElement("span"), { textContent: "⚡ SPORTCLUB", style: "color:#F2B705;font-weight:900;font-size:1.4rem;letter-spacing:1px;" })) }} 
            />
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="responsive-navbar-nav" className="border-0 shadow-none" />
          
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mx-auto gap-lg-3">
              <Nav.Link href="#clases" className="text-uppercase fw-semibold px-3" style={{ fontSize: "0.8rem", letterSpacing: "1px", color: muted }}>Clases</Nav.Link>
              <Nav.Link href="#coaches" className="text-uppercase fw-semibold px-3" style={{ fontSize: "0.8rem", letterSpacing: "1px", color: muted }}>Coaches</Nav.Link>
              <Nav.Link href="#beneficios" className="text-uppercase fw-semibold px-3" style={{ fontSize: "0.8rem", letterSpacing: "1px", color: muted }}>Beneficios</Nav.Link>
            </Nav>
            
            <Nav className="gap-2 align-items-center mt-3 mt-md-0">
              <Nav.Link as={Link} to="/login" className="p-0">
                <Button variant="outline-light" className="fw-semibold px-4 py-2" style={{ border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", fontSize: "0.9rem" }}>
                  Iniciar sesión
                </Button>
              </Nav.Link>
              <Nav.Link as={Link} to="/register" className="p-0">
                <Button className="fw-bold text-dark px-4 py-2 border-0" style={{ backgroundColor: gold, borderRadius: "8px", fontSize: "0.9rem", letterSpacing: "0.5px" }}>
                  Únete ahora
                </Button>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ── HERO SECTION ───────────────────────────────────── */}
      <section style={{ background: bg, minHeight: "calc(100vh - 75px)", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(242,183,5,0.08) 0%, transparent 65%)", top: -150, right: "-5%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)", bottom: -100, left: "-5%", pointerEvents: "none" }} />

        <Container className="py-5" style={{ position: "relative", zIndex: 1 }}>
          <Row className="align-items-center">
            <Col md={8} lg={7}>
              
              <div className="d-inline-flex align-items-center gap-2 mb-4 px-3 py-1" style={{ border: `1px solid ${gold}40`, borderRadius: 30, background: `${gold}08` }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: gold, display: "inline-block", animation: "pulse 2s infinite" }} />
                <small style={{ color: gold, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", fontSize: "0.7rem" }}>
                  Gimnasio & Comunidad Fitness
                </small>
              </div>

              <h1 className="fw-bold text-white text-uppercase mb-3" style={{ fontSize: "clamp(2.8rem, 6.5vw, 5.2rem)", lineHeight: 0.95, letterSpacing: "-1px" }}>
                Tu mejor<br />versión<br />
                <span style={{ color: gold, textShadow: "0 0 40px rgba(242,183,5,0.15)" }}>comienza hoy.</span>
              </h1>

              <p className="mt-4 mb-5 text-white-50" style={{ fontSize: "1.05rem", lineHeight: 1.7, maxWidth: "520px" }}>
                En SportClub creemos que el deporte no solo transforma el cuerpo, sino también la mente y el estilo de vida. Disfruta de una experiencia de entrenamiento única con monitoreo digital completo.
              </p>

              <div className="d-flex gap-3 flex-wrap mb-5">
                <Button as={Link} to="/register" className="fw-bold text-dark px-4 py-3 border-0" style={{ backgroundColor: gold, borderRadius: 10, fontSize: "1rem", boxShadow: `0 4px 20px ${gold}20` }}>
                  Empieza gratis →
                </Button>
                <Button href="#clases" variant="outline-light" className="px-4 py-3" style={{ borderRadius: 10, borderColor: "rgba(255,255,255,0.18)", fontSize: "1rem" }}>
                  Ver disciplinas
                </Button>
              </div>

              {/* Estadísticas */}
              <div className="d-flex gap-5 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                {[["1200+", "Miembros"], ["40+", "Clases / sem"], ["15", "Coaches"]].map(([v, l]) => (
                  <div key={l}>
                    <div style={{ color: gold, fontSize: "2rem", fontWeight: 900, lineHeight: 1 }}>{v}</div>
                    <small className="text-white-50 text-uppercase fw-semibold tracking-wider" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>{l}</small>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── SECCIÓN CLASES ─────────────────────────────────── */}
      <section id="clases" style={{ background: "#130c20", padding: "6rem 0" }}>
        <Container>
          <div className="mb-5">
            <small className="fw-bold text-uppercase" style={{ color: gold, letterSpacing: "0.15em", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 20, height: 2, background: gold, display: "inline-block" }} /> Catálogo de disciplinas
            </small>
            <h2 className="fw-bold text-white text-uppercase mt-2" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
              Clases <span style={{ color: gold }}>Disponibles</span>
            </h2>
            <p className="text-white-50">Entrenamientos estructurados y adaptados para cumplir con tus objetivos específicos.</p>
          </div>

          <Row className="g-4">
            {clases.map((c, i) => (
              <Col key={c.nombre} md={6} lg={4}>
                <Card style={{
                  background: i === 0 ? "linear-gradient(135deg, #2E1A47, #3d2460)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${i === 0 ? "rgba(242,183,5,0.25)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 20, padding: "2rem", height: "100%",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
                className="h-100 hover-card border-glow"
                onMouseOver={e => { e.currentTarget.style.transform="translateY(-6px)"; e.currentTarget.style.borderColor=gold }}
                onMouseOut={e  => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.borderColor=i===0?"rgba(242,183,5,0.25)":"rgba(255,255,255,0.06)" }}
                >
                  <div style={{ fontSize: "2.2rem", marginBottom: "1.2rem" }}>{c.emoji}</div>
                  <h4 className="fw-bold text-white mb-2 text-uppercase" style={{ fontSize: '1.25rem', letterSpacing: '0.5px' }}>{c.nombre}</h4>
                  <p className="text-white-50 small mb-4" style={{ lineHeight: 1.65 }}>{c.desc}</p>
                  <div className="d-flex gap-2 mt-auto flex-wrap">
                    <span style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)", padding: "0.3rem 0.8rem", borderRadius: 20, fontSize: "0.68rem", fontWeight: 600 }}>
                      🕒 {c.horario}
                    </span>
                    <span style={{ background: `${gold}15`, color: gold, padding: "0.3rem 0.8rem", borderRadius: 20, fontSize: "0.68rem", fontWeight: 700 }}>
                      💪 {c.nivel}
                    </span>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── SECCIÓN COACHES ────────────────────────────────── */}
      <section id="coaches" style={{ background: "#1a0f2a", padding: "6rem 0" }}>
        <Container>
          <div className="text-center mb-5">
            <small className="fw-bold text-uppercase" style={{ color: gold, letterSpacing: "0.15em" }}>Staff técnico</small>
            <h2 className="fw-bold text-white text-uppercase mt-2" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
              Coaches <span style={{ color: gold }}>Expertos</span>
            </h2>
            <p className="text-white-50 mx-auto" style={{ maxWidth: '500px' }}>Profesionales de la salud y el rendimiento con certificaciones oficiales dedicados a tu progreso.</p>
          </div>

          <Row className="justify-content-center g-4">
            {coaches.map(c => (
              <Col key={c.nombre} xs={12} sm={6} md={3}>
                <div style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "2.5rem 1.5rem", textAlign: "center", transition: "all 0.2s" }}
                     onMouseOver={e => { e.currentTarget.style.transform="translateY(-5px)"; e.currentTarget.style.borderColor="rgba(242,183,5,0.3)" }}
                     onMouseOut={e  => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.06)" }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: `linear-gradient(135deg, ${c.color} 0%, ${gold} 100%)`, display: "grid", placeItems: "center", margin: "0 auto 1.2rem", fontWeight: 900, fontSize: "1.6rem", border: `2px solid rgba(242,183,5,0.3)`, boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                    {c.iniciales}
                  </div>
                  <h5 className="fw-bold text-white text-uppercase mb-1" style={{ fontSize: '1.1rem' }}>{c.nombre}</h5>
                  <small className="fw-bold text-uppercase tracking-wider" style={{ color: gold, fontSize: "0.7rem", letterSpacing: "0.5px" }}>{c.especialidad}</small>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── SECCIÓN BENEFICIOS ─────────────────────────────── */}
      <section id="beneficios" style={{ background: "#130c20", padding: "6rem 0" }}>
        <Container>
          <div className="text-center mb-5">
            <small className="fw-bold text-uppercase" style={{ color: gold, letterSpacing: "0.15em" }}>¿Por qué entrenar con nosotros?</small>
            <h2 className="fw-bold text-white text-uppercase mt-2" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
              Ventajas Digitales y <span style={{ color: gold }}>Físicas</span>
            </h2>
          </div>
          <Row className="g-4">
            {beneficios.map(b => (
              <Col key={b.titulo} md={6} lg={4}>
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 20, padding: "2.2rem 2rem", height: "100%", transition: "all 0.2s" }}
                     onMouseOver={e => e.currentTarget.style.borderColor="rgba(242,183,5,0.3)"}
                     onMouseOut={e  => e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"}>
                  <div style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>{b.emoji}</div>
                  <h5 className="fw-bold text-white text-uppercase mb-2" style={{ fontSize: '1rem', letterSpacing: '0.5px' }}>{b.titulo}</h5>
                  <p className="text-white-50 small margin-0" style={{ lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── CTA SELECTION FINAL ──────────────────────────────── */}
      <section style={{ background: "#1a0f2a", padding: "8rem 0", textAlign: "center", position: "relative" }}>
        <Container style={{ position: 'relative', zIndex: 1 }}>
          <small className="fw-bold text-uppercase" style={{ color: gold, letterSpacing: "0.2em" }}>Únete a la comunidad</small>
          <h2 className="fw-bold text-white text-uppercase mt-2 mb-4" style={{ fontSize: "clamp(2.2rem, 5vw, 4.2rem)", lineHeight: 1 }}>
            ¿Listo para tu <span style={{ color: gold }}>mejor versión?</span>
          </h2>
          <p className="text-white-50 mx-auto mb-5" style={{ maxWidth: "550px", fontSize: "1.05rem", lineHeight: 1.7 }}>
            Registra tu perfil en nuestra plataforma digital de forma gratuita, gestiona tus reservas de clases y realiza el seguimiento de tu progreso físico.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Button as={Link} to="/register" className="fw-bold text-dark px-4 py-3 border-0" style={{ backgroundColor: gold, borderRadius: 10, fontSize: "1rem" }}>
              Crear mi cuenta gratis →
            </Button>
            <Button as={Link} to="/login" variant="outline-light" className="px-4 py-3" style={{ borderRadius: 10, borderColor: "rgba(255,255,255,0.2)", fontSize: "1rem" }}>
              Ya tengo una cuenta
            </Button>
          </div>
        </Container>
      </section>

      {/* ── FOOTER CON LOGO ─────────────────────────────────── */}
      <footer style={{ background: "#0a0614", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "2.5rem 0" }}>
        <Container className="d-flex justify-content-between align-items-center flex-wrap gap-4">
          {/* LOGO INFERIOR */}
          <img 
            src="/logo.png" 
            alt="SportClub Logo" 
            style={{ height: 34, width: "auto" }}
            onError={e => { e.target.replaceWith(Object.assign(document.createElement("span"), { textContent: "⚡ SPORTCLUB", style: "color:#F2B705;font-weight:900;letter-spacing:0.5px" })) }} 
          />
          <div className="d-flex gap-4 flex-wrap">
            <a href="#clases" className="text-decoration-none small text-white-50 hover-white">Clases</a>
            <a href="#coaches" className="text-decoration-none small text-white-50 hover-white">Coaches</a>
            <a href="#beneficios" className="text-decoration-none small text-white-50 hover-white">Beneficios</a>
            <Link to="/login" className="text-decoration-none small text-white-50 hover-white">Acceder</Link>
          </div>
          <small className="text-white-50" style={{ fontSize: "0.8rem" }}>© 2026 SportClub. Desarrollado con React Bootstrap.</small>
        </Container>
      </footer>

      {/* Estilos CSS embebidos para animaciones */}
      <style>{`
        .hover-card:hover {
          box-shadow: 0 10px 30px rgba(242,183,5,0.08);
        }
        .hover-white:hover {
          color: #fff !important;
          transition: color 0.2s ease;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: .3; transform: scale(.8); }
        }
      `}</style>
    </div>
  );
}