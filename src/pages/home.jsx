import { Link } from "react-router-dom"
import { Button, Col, Container, Row } from "react-bootstrap"

// Datos de clases
const clases = [
  { emoji: "🏋️", nombre: "CrossFit",        desc: "Entrenamiento funcional de alta intensidad. Fuerza, resistencia y agilidad en cada sesión.", horario: "Lun · Mié · Vie  07:00–08:00", nivel: "Todos los niveles" },
  { emoji: "🧘", nombre: "Yoga Flow",        desc: "Movimiento, respiración y equilibrio mental. Perfecto para recuperarte y conectar con tu cuerpo.",   horario: "Mar · Jue  08:30–09:30",      nivel: "Principiante"    },
  { emoji: "🚴", nombre: "Spinning",         desc: "Cardio intenso sobre bicicleta estática con música y motivación al máximo nivel.",                    horario: "Lun · Mié  18:00–19:00",      nivel: "Intermedio"      },
  { emoji: "💥", nombre: "HIIT Power",       desc: "Intervalos de alta intensidad que queman grasa y construyen resistencia cardiovascular.",              horario: "Mar · Jue · Vie  19:00–20:00", nivel: "Avanzado"        },
  { emoji: "🥊", nombre: "Boxeo Funcional",  desc: "Técnica de boxeo combinada con trabajo funcional. Coordinación, fuerza y mucha adrenalina.",          horario: "Sábado  10:00–11:30",          nivel: "Todos los niveles"},
  { emoji: "🔥", nombre: "Funcional Total",  desc: "Trabajo con peso corporal y equipamiento para desarrollar fuerza y movilidad real.",                  horario: "Sábado  09:00–10:30",          nivel: "Intermedio"      },
]

const beneficios = [
  { emoji: "📅", titulo: "Reservas online",        desc: "Reserva tu clase favorita en segundos desde cualquier dispositivo."        },
  { emoji: "📊", titulo: "Seguimiento de progreso", desc: "Visualiza tu evolución semana a semana con métricas claras."              },
  { emoji: "🎯", titulo: "Plan personalizado",      desc: "Tu coach diseña un programa adaptado a tus objetivos y nivel."           },
  { emoji: "🏆", titulo: "Comunidad activa",        desc: "Retos, eventos y actividades grupales que te mantienen motivado."         },
  { emoji: "⚡", titulo: "Horarios flexibles",      desc: "Clases de mañana, tarde y noche. Nos adaptamos a tu vida."               },
  { emoji: "🔐", titulo: "Acceso seguro",           desc: "Tu perfil e historial protegidos en nuestra plataforma digital."          },
]

const coaches = [
  { iniciales: "RS", nombre: "Roberto Silva",  especialidad: "CrossFit · HIIT",    color: "#2E1A47" },
  { iniciales: "AL", nombre: "Ana López",      especialidad: "Yoga · Mindfulness", color: "#1d4060" },
  { iniciales: "CP", nombre: "Carlos Pinto",   especialidad: "Spinning · Cardio",  color: "#0f3320" },
  { iniciales: "MT", nombre: "María Torres",   especialidad: "HIIT · Funcional",   color: "#3d1040" },
]

// Estilos reutilizables
const bg    = "linear-gradient(135deg, #1a0f2a 0%, #2E1A47 60%, #3d2460 100%)"
const gold  = "#F2B705"
const muted = "rgba(255,255,255,0.55)"

export default function Home() {
  return (
    <div style={{ background: "#1a0f2a", color: "#fff", fontFamily: "sans-serif" }}>

      {/* ── NAVBAR ─────────────────────────────────── */}
      <nav style={{ background: "rgba(26,15,42,0.95)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Container className="d-flex align-items-center justify-content-between py-3">
          <img src="/logo.png" alt="SportClub" style={{ height: 40 }}
            onError={e => { e.target.replaceWith(Object.assign(document.createElement("span"), { textContent: "⚡ SportClub", style: "color:#F2B705;font-weight:900;font-size:1.3rem" })) }} />
          <div className="d-none d-md-flex gap-4">
            {["#clases","#coaches","#beneficios"].map(h => (
              <a key={h} href={h} style={{ color: muted, textDecoration: "none", fontSize: "0.9rem", transition: "color .2s" }}
                onMouseOver={e => e.target.style.color="#fff"}
                onMouseOut={e  => e.target.style.color=muted}>
                {h.replace("#","").charAt(0).toUpperCase()+h.slice(2)}
              </a>
            ))}
          </div>
          <div className="d-flex gap-2">
            <Link to="/login">
              <Button variant="outline-light" size="sm" style={{ borderColor: "rgba(255,255,255,0.2)", borderRadius: 8 }}>
                Iniciar sesión
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" style={{ background: gold, border: "none", color: "#1a0f2a", fontWeight: 700, borderRadius: 8 }}>
                Únete ahora
              </Button>
            </Link>
          </div>
        </Container>
      </nav>

      {/* ── HERO ───────────────────────────────────── */}
      <section style={{ background: bg, minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
        {/* Círculo decorativo */}
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(242,183,5,0.12) 0%, transparent 70%)", top: -100, right: "5%", pointerEvents: "none" }} />

        <Container className="py-5" style={{ position: "relative", zIndex: 1 }}>
          <Row className="align-items-center">
            <Col md={7} lg={6}>
              {/* Eyebrow */}
              <div className="d-inline-flex align-items-center gap-2 mb-4 px-3 py-1"
                style={{ border: `1px solid ${gold}55`, borderRadius: 30, background: `${gold}12` }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: gold, display: "inline-block", animation: "pulse 2s infinite" }} />
                <small style={{ color: gold, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontSize: "0.72rem" }}>
                  Bienvenido a SportClub
                </small>
              </div>

              <h1 style={{ fontSize: "clamp(3rem,7vw,5.5rem)", lineHeight: 0.95, fontWeight: 900, textTransform: "uppercase", marginBottom: "1.5rem" }}>
                Tu mejor<br />versión<br />
                <span style={{ color: gold }}>comienza hoy.</span>
              </h1>

              <p style={{ color: muted, fontSize: "1.05rem", lineHeight: 1.8, maxWidth: 480, marginBottom: "2.5rem" }}>
                En SportClub creemos que el deporte no solo transforma el cuerpo,
                sino también la mente y el estilo de vida. Somos una comunidad
                enfocada en el bienestar, el compromiso y la superación personal.
              </p>

              <div className="d-flex gap-3 flex-wrap">
                <Link to="/register">
                  <Button style={{ background: gold, border: "none", color: "#1a0f2a", fontWeight: 700, padding: "0.85rem 2rem", borderRadius: 10, fontSize: "1rem" }}>
                    Empieza gratis →
                  </Button>
                </Link>
                <a href="#clases">
                  <Button variant="outline-light" style={{ padding: "0.85rem 2rem", borderRadius: 10, borderColor: "rgba(255,255,255,0.2)", fontSize: "1rem" }}>
                    Ver clases
                  </Button>
                </a>
              </div>

              {/* Stats */}
              <div className="d-flex gap-4 mt-5 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                {[["1200+","Miembros activos"],["40+","Clases por semana"],["15","Coaches expertos"]].map(([v,l]) => (
                  <div key={l}>
                    <div style={{ color: gold, fontSize: "2.2rem", fontWeight: 900, lineHeight: 1 }}>{v}</div>
                    <small style={{ color: muted, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.72rem" }}>{l}</small>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── CLASES ─────────────────────────────────── */}
      <section id="clases" style={{ background: "#130c20", padding: "6rem 0" }}>
        <Container>
          <div className="mb-5">
            <small style={{ color: gold, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 24, height: 2, background: gold, display: "inline-block" }} /> Nuestras clases
            </small>
            <h2 style={{ fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 900, marginTop: 8 }}>
              Lo que <span style={{ color: gold }}>ofrecemos</span>
            </h2>
            <p style={{ color: muted }}>Disciplinas para todos los niveles, horarios flexibles y coaches especializados.</p>
          </div>

          <Row className="g-3">
            {clases.map((c, i) => (
              <Col key={c.nombre} md={6} lg={4}>
                <div style={{
                  background: i === 0 ? "linear-gradient(135deg,#2E1A47,#4a2d70)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${i===0 ? `${gold}40` : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 18, padding: "1.8rem", height: "100%",
                  transition: "transform .2s, border-color .2s", cursor: "default"
                }}
                  onMouseOver={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.borderColor=`${gold}50` }}
                  onMouseOut={e  => { e.currentTarget.style.transform="translateY(0)";  e.currentTarget.style.borderColor=i===0?`${gold}40`:"rgba(255,255,255,0.07)" }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{c.emoji}</div>
                  <h5 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>{c.nombre}</h5>
                  <p style={{ color: muted, fontSize: "0.88rem", lineHeight: 1.65, marginBottom: "1rem" }}>{c.desc}</p>
                  <div className="d-flex gap-2 flex-wrap">
                    <span style={{ background: "rgba(255,255,255,0.06)", color: muted, padding: "0.2rem 0.65rem", borderRadius: 20, fontSize: "0.7rem", fontWeight: 700 }}>
                      {c.horario}
                    </span>
                    <span style={{ background: `${gold}18`, color: gold, padding: "0.2rem 0.65rem", borderRadius: 20, fontSize: "0.7rem", fontWeight: 700 }}>
                      {c.nivel}
                    </span>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── COACHES ────────────────────────────────── */}
      <section id="coaches" style={{ background: "#1a0f2a", padding: "6rem 0" }}>
        <Container>
          <div className="text-center mb-5">
            <small style={{ color: gold, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Nuestro equipo</small>
            <h2 style={{ fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 900, marginTop: 8 }}>
              Coaches <span style={{ color: gold }}>especializados</span>
            </h2>
            <p style={{ color: muted }}>Profesionales apasionados, certificados y comprometidos con tu progreso.</p>
          </div>

          <Row className="justify-content-center g-3">
            {coaches.map(c => (
              <Col key={c.nombre} sm={6} md={3}>
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "2rem 1.5rem", textAlign: "center", transition: "transform .2s, border-color .2s" }}
                  onMouseOver={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.borderColor=`${gold}40` }}
                  onMouseOut={e  => { e.currentTarget.style.transform="translateY(0)";  e.currentTarget.style.borderColor="rgba(255,255,255,0.08)" }}>
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg,${c.color},${gold})`, display: "grid", placeItems: "center", margin: "0 auto 1rem", fontWeight: 900, fontSize: "1.5rem", border: `2px solid ${gold}40` }}>
                    {c.iniciales}
                  </div>
                  <h6 style={{ fontWeight: 700, marginBottom: 4 }}>{c.nombre}</h6>
                  <small style={{ color: gold, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.72rem" }}>{c.especialidad}</small>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── BENEFICIOS ─────────────────────────────── */}
      <section id="beneficios" style={{ background: "#130c20", padding: "6rem 0" }}>
        <Container>
          <div className="text-center mb-5">
            <small style={{ color: gold, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>¿Por qué elegirnos?</small>
            <h2 style={{ fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 900, marginTop: 8 }}>
              Beneficios de ser <span style={{ color: gold }}>parte</span>
            </h2>
          </div>
          <Row className="g-3">
            {beneficios.map(b => (
              <Col key={b.titulo} md={6} lg={4}>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "2rem", height: "100%", transition: "border-color .2s" }}
                  onMouseOver={e => e.currentTarget.style.borderColor=`${gold}40`}
                  onMouseOut={e  => e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>{b.emoji}</div>
                  <h6 style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.5rem" }}>{b.titulo}</h6>
                  <p style={{ color: muted, fontSize: "0.88rem", lineHeight: 1.65, margin: 0 }}>{b.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── CTA FINAL ──────────────────────────────── */}
      <section style={{ background: "#1a0f2a", padding: "7rem 0", textAlign: "center" }}>
        <Container>
          <small style={{ color: gold, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Únete hoy</small>
          <h2 style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)", fontWeight: 900, margin: "1rem 0" }}>
            ¿Listo para tu<br /><span style={{ color: gold }}>mejor versión?</span>
          </h2>
          <p style={{ color: muted, fontSize: "1rem", lineHeight: 1.8, marginBottom: "2.5rem" }}>
            Regístrate gratis, elige tus clases y empieza a transformar tu vida.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/register">
              <Button style={{ background: gold, border: "none", color: "#1a0f2a", fontWeight: 700, padding: "0.9rem 2.2rem", borderRadius: 10, fontSize: "1rem" }}>
                Crear mi cuenta gratis →
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline-light" style={{ padding: "0.9rem 2.2rem", borderRadius: 10, borderColor: "rgba(255,255,255,0.2)", fontSize: "1rem" }}>
                Ya tengo cuenta
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* ── FOOTER ─────────────────────────────────── */}
      <footer style={{ background: "#0a0614", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "2rem 0" }}>
        <Container className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <img src="/logo.png" alt="SportClub" style={{ height: 32 }}
            onError={e => { e.target.replaceWith(Object.assign(document.createElement("span"), { textContent: "⚡ SportClub", style: "color:#F2B705;font-weight:900" })) }} />
          <div className="d-flex gap-4">
            {[["#clases","Clases"],["#coaches","Coaches"],["#beneficios","Beneficios"]].map(([h,l]) => (
              <a key={h} href={h} style={{ color: muted, textDecoration: "none", fontSize: "0.85rem" }}>{l}</a>
            ))}
            <Link to="/login" style={{ color: muted, textDecoration: "none", fontSize: "0.85rem" }}>Acceder</Link>
          </div>
          <small style={{ color: muted, fontSize: "0.8rem" }}>© 2025 SportClub. Tu mejor versión comienza hoy.</small>
        </Container>
      </footer>

      <style>{`
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.4; transform:scale(.7); }
        }
      `}</style>
    </div>
  )
}
