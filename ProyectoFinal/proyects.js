
// ELEMENTOS DEL DOM
// =====================================
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const projName = document.getElementById("projName");
const projDesc = document.getElementById("projDesc");
const saveBtn = document.getElementById("saveProject");
const closeBtn = document.getElementById("closeModal");
const btnAddProject = document.getElementById("btnAddProject");
const projectList = document.getElementById("project-list");
const logoutBtn = document.getElementById("logoutBtn");

const API_URL = "https://portfolio-api-three-black.vercel.app/api/v1";
let editingProjectId = null;




// =====================================
// LOGOUT
// =====================================
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "logindex.html";
});




// =====================================
// ABRIR MODAL PARA NUEVO PROYECTO
// =====================================
btnAddProject.addEventListener("click", () => {
    editingProjectId = null;

    modalTitle.textContent = "Nuevo Proyecto";
    saveBtn.textContent = "Guardar";

    projName.value = "";
    projDesc.value = "";

    modal.classList.remove("hidden");
});


// =====================================
// ABRIR MODAL PARA EDITAR PROYECTO
// =====================================
function openEditModal(project) {
    editingProjectId = project.id;

    modalTitle.textContent = "Editar Proyecto";
    saveBtn.textContent = "Actualizar";

    projName.value = project.name;
    projDesc.value = project.description;

    modal.classList.remove("hidden");
}


// =====================================
// CERRAR MODAL
// =====================================
closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
});


// =====================================
// GUARDAR / ACTUALIZAR PROYECTO
// =====================================
saveBtn.addEventListener("click", async () => {
    const name = projName.value.trim();
    const description = projDesc.value.trim();

    if (!name || !description) {
        alert("Completa todos los campos");
        return;
    }

    const data = { name, description };

    try {
        // Crear nuevo proyecto
        if (!editingProjectId) {
            await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
        }
        // Editar proyecto existente
        else {
            await fetch(`${API_URL}/${editingProjectId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
        }

        modal.classList.add("hidden");
        loadProjects();

    } catch (err) {
        console.error("Error guardando el proyecto:", err);
        alert("Error al guardar el proyecto.");
    }
});


// =====================================
// CARGAR PROYECTOS EN LA LISTA
// =====================================
async function loadProjects() {
    try {
        const res = await fetch(API_URL);
        const projects = await res.json();

        projectList.innerHTML = "";

        projects.forEach(project => {
            const card = document.createElement("div");
            card.className = "project-card";

            card.innerHTML = `
                <h3>${project.name}</h3>
                <p>${project.description}</p>

                <div class="project-actions">
                    <button class="btn-edit">Editar</button>
                    <button class="btn-delete">Eliminar</button>
                </div>
            `;

            // Editar
            card.querySelector(".btn-edit").addEventListener("click", () => {
                openEditModal(project);
            });

            // Eliminar
            card.querySelector(".btn-delete").addEventListener("click", () => {
                deleteProject(project.id);
            });

            projectList.appendChild(card);
        });

    } catch (err) {
        console.error("Error cargando proyectos:", err);
    }
}


// =====================================
// ELIMINAR PROYECTO
// =====================================
async function deleteProject(id) {
    if (!confirm("¿Seguro que deseas eliminar este proyecto?")) return;

    try {
        await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        loadProjects();

    } catch (err) {
        console.error("Error eliminando proyecto:", err);
    }
}



// =====================================
// INICIO
// =====================================
loadProjects();
