const API_URL = "https://portfolio-api-three-black.vercel.app/api/v1";

// 🔥 TU ITSOn ID
const itsonId = "251925";

document.addEventListener("DOMContentLoaded", cargarProyectos);

async function cargarProyectos() {
    const container = document.getElementById("projectsGrid");

    try {
        const res = await fetch(`${API_URL}/publicProjects/${itsonId}`);
        const data = await res.json();

        console.log("Proyectos obtenidos:", data);

        container.innerHTML = "";

        data.forEach(proyecto => {
            // → Usa la imagen REAL del proyecto si existe
            const urlImagen = proyecto.images && proyecto.images.length > 0
                ? proyecto.images[0]   // imagen guardada en backoffice
                : "https://imgs.search.brave.com/MRAvdrhQdD2RfhRBYlZmaYYf2xhGRE_PybpAmebue40/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvaGQvYmx1/ZS1zbW9reS1sZXR0/ZXItbi1maDlxa2Rt/d2gzOXl4cnN5Lmpw/Zw";

            // → Si tienes URL de proyecto en la API, úsala
            const urlProyecto = proyecto.url || "#";

            container.innerHTML += `
                <div class="project-card">
                    <img src="${urlImagen}"
                         class="project-image"
                         alt="Imagen del proyecto">

                    <h3>${proyecto.title}</h3>
                    <p>${proyecto.description}</p>

                    <a href="${urlProyecto}" target="_blank">
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
