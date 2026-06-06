<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>SportClub – Dashboard Usuario</title>
  <link rel="stylesheet" href="styles.css"/>
  <style>
    /* Avatar con foto en sidebar y tarjeta perfil */
    .sidebar-avatar {
      width:48px; height:48px; border-radius:50%;
      background:linear-gradient(135deg,var(--purple-light),var(--gold));
      display:grid; place-items:center;
      font-family:'Bebas Neue',sans-serif; font-size:1.1rem;
      border:2px solid rgba(242,183,5,0.3);
      overflow:hidden; flex-shrink:0;
    }
    .sidebar-avatar img {
      width:100%; height:100%; object-fit:cover; display:none;
    }
    .sidebar-avatar img.loaded { display:block; }
    .sidebar-user-info { padding:0 1.5rem 1.2rem; border-bottom:1px solid rgba(255,255,255,0.08); margin-bottom:1rem; display:flex; align-items:center; gap:0.8rem; }
    .sidebar-user-name { font-size:0.88rem; font-weight:600; }
    .sidebar-user-role { font-size:0.72rem; color:var(--text-muted); }

    .card-avatar {
      width:60px; height:60px; border-radius:50%;
      background:linear-gradient(135deg,var(--purple-light),var(--gold));
      display:grid; place-items:center;
      font-family:'Bebas Neue',sans-serif; font-size:1.4rem;
      border:2px solid rgba(242,183,5,0.25);
      overflow:hidden; flex-shrink:0;
    }
    .card-avatar img { width:100%; height:100%; object-fit:cover; display:none; }
    .card-avatar img.loaded { display:block; }
  </style>
</head>
<body class="dash-body user-theme">

  <!-- SIDEBAR -->
  <aside class="dash-sidebar">
    <div class="sidebar-logo">
      <a href="index.html"><img src="logo.png" alt="SportClub" style="height:40px;width:auto;"/></a>
    </div>

    <!-- Mini perfil en sidebar -->
    <div class="sidebar-user-info">
      <div class="sidebar-avatar">
        <img id="sidebar-avatar-img" src="" alt=""/>
        <span id="sidebar-avatar-init">?</span>
      </div>
      <div>
        <div class="sidebar-user-name" id="sidebar-name">...</div>
        <div class="sidebar-user-role">Usuario</div>
      </div>
    </div>

    <nav class="sidebar-nav">
      <a class="nav-item active"><span class="icon">🏠</span><span>Inicio</span></a>
      <a class="nav-item" href="#"><span class="icon">📅</span><span>Reservas</span></a>
      <a class="nav-item" href="#"><span class="icon">🏃</span><span>Clases</span></a>
      <a class="nav-item" href="#"><span class="icon">📈</span><span>Mi Progreso</span></a>
      <a class="nav-item" href="perfil.html"><span class="icon">🙍</span><span>Perfil</span></a>
    </nav>

    <div class="sidebar-bottom">
      <button class="btn-edit-profile" onclick="window.location.href='perfil.html'">
        <span class="icon">✏️</span><span>Editar perfil</span>
      </button>
      <button class="btn-logout" onclick="cerrarSesion()">
        <span class="icon">↩</span><span>Cerrar sesión</span>
      </button>
    </div>
  </aside>

  <!-- MAIN -->
  <main class="dash-main">

    <div class="dash-header">
      <div class="dash-header-left">
        <h1>Mi Panel</h1>
        <p>Bienvenido, <strong id="user-name">...</strong></p>
      </div>
      <span class="role-badge">Usuario</span>
    </div>

    <!-- Stats -->
    <div class="stat-cards">
      <div class="stat-card"><div class="stat-value">12</div><div class="stat-label">Clases este mes</div></div>
      <div class="stat-card"><div class="stat-value">3</div><div class="stat-label">Reservas activas</div></div>
      <div class="stat-card"><div class="stat-value">87%</div><div class="stat-label">Asistencia</div></div>
      <div class="stat-card"><div class="stat-value">6</div><div class="stat-label">Semanas seguidas</div></div>
    </div>

    <div class="grid-2" style="margin-bottom:1.2rem;">

      <!-- Perfil con foto -->
      <div class="card">
        <div class="card-title">Mi Perfil</div>
        <div class="profile-block">
          <div class="card-avatar">
            <img id="card-avatar-img" src="" alt=""/>
            <span id="card-avatar-init">?</span>
          </div>
          <div>
            <div class="profile-name" id="user-name-card">...</div>
            <div class="profile-email" id="user-email">...</div>
            <div class="profile-meta">
              <span class="tag">CrossFit</span>
              <span class="tag">Intermedio</span>
            </div>
          </div>
        </div>
        <div style="margin-top:1.2rem;padding-top:1rem;border-top:1px solid rgba(255,255,255,0.07);">
          <div style="font-size:0.82rem;color:var(--text-muted);margin-bottom:0.4rem;">Objetivo personal</div>
          <div style="font-size:0.9rem;">Ganar masa muscular y mejorar resistencia</div>
        </div>
        <div style="margin-top:1rem;">
          <a href="perfil.html" style="font-size:0.82rem;color:var(--user-accent);text-decoration:none;">
            ✏️ Editar perfil y foto →
          </a>
        </div>
      </div>

      <!-- Reservas -->
      <div class="card">
        <div class="card-title">Mis Reservas</div>
        <div class="reservation-item">
          <div class="res-dot"></div>
          <div><div class="res-name">Clase de CrossFit</div><div class="res-date">Lunes 14 Abr · 18:00</div></div>
          <div class="res-status">Confirmada</div>
        </div>
        <div class="reservation-item">
          <div class="res-dot"></div>
          <div><div class="res-name">Spinning Cardio</div><div class="res-date">Miércoles 16 Abr · 07:00</div></div>
          <div class="res-status">Confirmada</div>
        </div>
        <div class="reservation-item">
          <div class="res-dot" style="background:var(--gold);"></div>
          <div><div class="res-name">HIIT Power</div><div class="res-date">Viernes 18 Abr · 19:00</div></div>
          <div class="res-status" style="background:rgba(242,183,5,0.15);color:var(--gold);">Pendiente</div>
        </div>
      </div>
    </div>

    <!-- Clases disponibles -->
    <div class="card">
      <div class="card-title">Clases Disponibles</div>
      <div class="class-list">
        <div class="class-item">
          <div class="class-info"><div class="class-name">🏋️ CrossFit Matutino</div><div class="class-time">Lun, Mié, Vie · 07:00–08:00 · Coach: Roberto Silva</div></div>
          <button class="btn-reserve">Reservar</button>
        </div>
        <div class="class-item">
          <div class="class-info"><div class="class-name">🧘 Yoga Flow</div><div class="class-time">Mar, Jue · 08:30–09:30 · Coach: Ana López</div></div>
          <button class="btn-reserve">Reservar</button>
        </div>
        <div class="class-item">
          <div class="class-info"><div class="class-name">🚴 Spinning Cardio</div><div class="class-time">Lun, Mié · 18:00–19:00 · Coach: Carlos Pinto</div></div>
          <button class="btn-reserve">Reservar</button>
        </div>
        <div class="class-item">
          <div class="class-info"><div class="class-name">💥 HIIT Power</div><div class="class-time">Mar, Jue, Vie · 19:00–20:00 · Coach: María Torres</div></div>
          <button class="btn-reserve">Reservar</button>
        </div>
        <div class="class-item">
          <div class="class-info"><div class="class-name">🥊 Boxeo Funcional</div><div class="class-time">Sábado · 10:00–11:30 · Coach: Diego Morales</div></div>
          <button class="btn-reserve">Reservar</button>
        </div>
      </div>
    </div>

  </main>

  <script src="js/users.js"></script>
  <script src="js/dashboard.js"></script>
  <script>
    // Iniciales
    function iniciales(nombre) {
      if (!nombre) return "?";
      return nombre.split(" ").map(w=>w[0]||"").join("").toUpperCase().slice(0,2);
    }

    // Cargar avatar desde localStorage / API
    function cargarAvatar() {
      const u      = JSON.parse(localStorage.getItem("user")) || {};
      const nombre = u.full_name || u.name || "";
      const avatar = u.metadata?.avatar || "";
      const init   = iniciales(nombre);

      // Sidebar
      document.getElementById("sidebar-name").textContent       = nombre;
      document.getElementById("sidebar-avatar-init").textContent= init;
      if (avatar) {
        const img = document.getElementById("sidebar-avatar-img");
        img.src = avatar;
        img.onload = () => img.classList.add("loaded");
      }

      // Tarjeta perfil
      document.getElementById("user-name-card").textContent = nombre;
      document.getElementById("user-email").textContent     = u.email || "";
      document.getElementById("card-avatar-init").textContent = init;
      if (avatar) {
        const img2 = document.getElementById("card-avatar-img");
        img2.src = avatar;
        img2.onload = () => img2.classList.add("loaded");
      }
    }

    cargarAvatar();
  </script>
  <script src="js/auth.js"></script>
</body>
</html>
