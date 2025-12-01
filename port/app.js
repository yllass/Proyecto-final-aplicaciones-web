const API_URL = "https://portfolio-api-three-black.vercel.app/api/v1";

const itsonId = "251925";

document.addEventListener("DOMContentLoaded", cargarProyectos);

async function cargarProyectos() {
    const container = document.getElementById("projectsGrid");

    try {
        const res = await fetch(`${API_URL}/publicProjects/${itsonId}`);
        const data = await res.json();

        console.log("Proyectos:", data);

        container.innerHTML = "";

        data.forEach(proyecto => {
            container.innerHTML += `
                <div class="project-card">
                    <img src="${proyecto.images?.[0] || ''}" 
                         class="project-image">

                    <h3>${proyecto.title}</h3>
                    <p>${proyecto.description}</p>

                    <a href="${'https://ivirtual.itson.edu.mx/mod/assign/view.php?id=1350150'}" target="_blank">
                        Ver Proyecto
                    </a>
                </div>
            `;
        });

    } catch (error) {
        console.error("Error cargando proyectos:", error);
        container.innerHTML = "<p>Error al cargar los proyectos.</p>";
    }
}
