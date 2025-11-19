const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";

function msg(t) { alert(t); }

// LOGIN
async function loginUsuario() {
  const email = document.getElementById("loginEmail")?.value;
  const password = document.getElementById("loginPassword")?.value;
  if (!email || !password) return msg("Completa todos los campos");

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) return msg(data.message || "Credenciales incorrectas");

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.userPublicData));

    window.location.href = "home.html";
  } catch (err) {
    msg("Error al conectar con la API");
    console.error(err);
  }
}

// REGISTER
async function registrarUsuario() {
  const name = document.getElementById("registerName")?.value;
  const email = document.getElementById("registerEmail")?.value;
  const itsonId = document.getElementById("registerItsonId")?.value;
  const password = document.getElementById("registerPassword")?.value;

  if (!name || !email || !itsonId || !password) return msg("Completa todos los campos");
  if (itsonId.length !== 6) return msg("El ID ITSON debe tener 6 dígitos");

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, itsonId, password })
    });

    const data = await res.json();
    if (!res.ok) return msg(data.message || "Error en el registro");

    msg("Registro exitoso ✔");
    window.location.href = "logindex.html";
  } catch (err) {
    msg("Error al conectar con la API");
    console.error(err);
  }
}

// PROTECCIÓN HOME
function verificarHome() {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user) {
    alert("Datos de usuario incompletos. Inicia sesión nuevamente.");
    localStorage.clear();
    window.location.href = "logindex.html";
  }
}


// LOGOUT
function cerrarSesion() {
  localStorage.clear();
  window.location.href = "logindex.html";
}


// CRUD PROYECTOS
let editId = null;

// CARGAR PROYECTOS
async function loadProjects() {
  const projectList = document.getElementById("project-list");
  if (!projectList) return;

  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_BASE}/projects`, {
      headers: { "auth-token": token }
    });

    const data = await res.json();
    projectList.innerHTML = "";

    data.forEach(proj => {
      const card = document.createElement("div");
      card.classList.add("project-card");
      card.innerHTML = `
        <h3>${proj.title}</h3>
        <p>${proj.description}</p>
        <button class="btn-edit" onclick="openEdit('${proj._id}', '${proj.title}', '${proj.description}')">Editar</button>
        <button class="btn-delete" onclick="deleteProject('${proj._id}')">Eliminar</button>
      `;
      projectList.appendChild(card);
    });
  } catch (err) {
    console.error(err);
  }
}

// ABRIR MODAL NUEVO
const btnAddProject = document.getElementById("btnAddProject");
if (btnAddProject) {
  btnAddProject.addEventListener("click", () => {
    editId = null;
    document.getElementById("modal-title").innerText = "Nuevo Proyecto";
    document.getElementById("projName").value = "";
    document.getElementById("projDesc").value = "";
    document.getElementById("modal")?.classList.remove("hidden");
  });
}

// ABRIR MODAL EDITAR
function openEdit(id, title, desc) {
  editId = id;
  const modal = document.getElementById("modal");
  if (!modal) return;

  document.getElementById("modal-title").innerText = "Editar Proyecto";
  document.getElementById("projName").value = title;
  document.getElementById("projDesc").value = desc;
  modal.classList.remove("hidden");
}

// GUARDAR PROYECTO
const saveBtn = document.getElementById("saveProject");
if (saveBtn) {
  saveBtn.addEventListener("click", async () => {
    const token = localStorage.getItem("token");
    const body = {
      title: document.getElementById("projName").value,
      description: document.getElementById("projDesc").value
    };

    let url = `${API_BASE}/projects`;
    let method = "POST";
    if (editId) { url = `${API_BASE}/projects/${editId}`; method = "PUT"; }

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "auth-token": token },
        body: JSON.stringify(body)
      });
      document.getElementById("modal")?.classList.add("hidden");
      loadProjects();
    } catch (err) {
      console.error(err);
      msg("Error al guardar proyecto");
    }
  });
}

// ELIMINAR PROYECTO
async function deleteProject(id) {
  const token = localStorage.getItem("token");
  try {
    await fetch(`${API_BASE}/projects/${id}`, {
      method: "DELETE",
      headers: { "auth-token": token }
    });
    loadProjects();
  } catch (err) {
    console.error(err);
    msg("Error al eliminar proyecto");
  }
}

// CERRAR MODAL
const closeModalBtn = document.getElementById("closeModal");
if (closeModalBtn) {
  closeModalBtn.addEventListener("click", () => {
    document.getElementById("modal")?.classList.add("hidden");
  });
}

// LOGOUT
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) logoutBtn.addEventListener("click", cerrarSesion);


document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  if (path.includes("logindex")) {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) loginForm.onsubmit = e => { e.preventDefault(); loginUsuario(); };
  }
  if (path.includes("regis")) {
    const registerForm = document.getElementById("registerForm");
    if (registerForm) registerForm.onsubmit = e => { e.preventDefault(); registrarUsuario(); };
  }
  if (path.includes("home.html")) {
    verificarHome();
    loadProjects();
  }
});
